import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import jsQR from 'jsqr';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';

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

    constructor(public router: Router, private route: ActivatedRoute, private alertService: NaturalAlertService) {
    }

    ngOnInit() {
        this.context = this.canvasRef.nativeElement.getContext('2d');
        this.startScan();
    }

    ngOnDestroy() {

        if (this.videoRef.nativeElement.srcObject) {
            this.videoRef.nativeElement.srcObject.getTracks().forEach(track => {
                track.stop();
            });
        }
    }

    public startScan() {
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(async (stream: MediaStream) => {
            this.videoRef.nativeElement.srcObject = stream;
            this.videoRef.nativeElement.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.videoRef.nativeElement.play();
            requestAnimationFrame(this.tick.bind(this));
        }).catch((err) => {
            console.error('Camera inutilisable.', err.name, err.code, err.message);
            const message = 'La caméra est indisponible, essaye de taper le code de ton matériel';
            this.alertService.error(message, 7000);
            setTimeout(() => {
                this.router.navigateByUrl('/booking/by-code');
            }, 1000);
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
            const code = jsQR(imgData.data, imgData.width, imgData.height);

            if (code && code.data) {
                const parsedCode = code.data.toLowerCase().replace('https://emmy.club/booking/', '');
                this.router.navigate(['..', parsedCode], {relativeTo: this.route});
            } else {
                requestAnimationFrame(this.tick.bind(this));
            }

        } else {
            requestAnimationFrame(this.tick.bind(this));
        }
    }

}
