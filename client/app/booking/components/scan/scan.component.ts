import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import jsQR from 'jsqr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit, OnDestroy {

    @ViewChild('video') videoRef: ElementRef;
    @ViewChild('image') imageRef: ElementRef;
    @ViewChild('canvas') canvasRef: ElementRef;

    private context;

    constructor(public router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.context = this.canvasRef.nativeElement.getContext('2d');
        this.startScan();
    }

    ngOnDestroy() {
        this.videoRef.nativeElement.srcObject.getTracks().forEach(track => {
            track.stop();
        });
    }

    public startScan() {
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(async (stream: MediaStream) => {
            this.videoRef.nativeElement.srcObject = stream;
            this.videoRef.nativeElement.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.videoRef.nativeElement.play();
            requestAnimationFrame(this.tick.bind(this));
        });
    }

    tick(): void {
        if (this.videoRef.nativeElement.readyState === this.videoRef.nativeElement.HAVE_ENOUGH_DATA) {
            this.canvasRef.nativeElement.height = this.videoRef.nativeElement.videoHeight;
            this.canvasRef.nativeElement.width = this.videoRef.nativeElement.videoWidth;

            this.context.drawImage(this.videoRef.nativeElement,
                0,
                0,
                this.canvasRef.nativeElement.width,
                this.canvasRef.nativeElement.height);

            const imgData = this.context.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height, );

            if (code && code.data) {
                const parsedCode = code.data.toLowerCase().replace('https://ichtus.club/booking/', '');
                this.router.navigate(['..', parsedCode], {relativeTo: this.route});
            } else {
                requestAnimationFrame(this.tick.bind(this));
            }

        } else {
            requestAnimationFrame(this.tick.bind(this));
        }
    }

}
