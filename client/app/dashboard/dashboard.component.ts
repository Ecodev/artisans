import { Component, OnInit } from '@angular/core';
import { UserService } from '../admin/user/services/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    // @ViewChild('video') videoRef: ElementRef;
    // @ViewChild('image') imageRef: ElementRef;
    // @ViewChild('canvas') canvasRef: ElementRef;

    public title = 'my-ichtus';

    public initialized: boolean;

    constructor(public userService: UserService) {
    }

    public ngOnInit(): void {
    }

    // public smyle() {
    //     const mediaConstraints: MediaStreamConstraints = {video: true};
    //     navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
    //         this.videoRef.nativeElement.srcObject = stream;
    //     });
    // }
    //
    // public capture() {
    //     this.canvasRef.nativeElement.width = this.videoRef.nativeElement.videoWidth;
    //     this.canvasRef.nativeElement.height = this.videoRef.nativeElement.videoHeight;
    //     this.canvasRef.nativeElement.getContext('2d').drawImage(this.videoRef.nativeElement, 0, 0);
    //     this.imageRef.nativeElement.src = this.canvasRef.nativeElement.toDataURL('image/webp');
    // }
}
