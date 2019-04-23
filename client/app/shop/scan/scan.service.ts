import { Injectable } from '@angular/core';
import jsQR from 'jsqr';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScanService {

    private stream: MediaStream | null;

    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    private scanObservable: Subject<string> = new Subject<string>();
    private streamObservable: ReplaySubject<MediaStream> = new ReplaySubject<MediaStream>(1);

    constructor() {
    }

    public getStream(): Observable<MediaStream> {
        return this.streamObservable;
    }

    public start() {

        if (this.stream) {
            return;
        }

        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}}).then(async (stream: MediaStream) => {
            this.streamObservable.next(stream);
            this.stream = stream;
            this.video.srcObject = stream;
            this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.video.play();
            requestAnimationFrame(this.decode.bind(this));

        }).catch((err) => {
            this.scanObservable.error(err);
        });
    }

    public scan(): Observable<string> {

        if (!this.stream) {
            this.start();
        }

        return this.scanObservable.asObservable();
    }

    public stop() {

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.scanObservable.complete();
    }

    private decode(): void {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.height = this.video.videoHeight;
            this.canvas.width = this.video.videoWidth;

            if (!this.context) {
                requestAnimationFrame(this.decode.bind(this));
                return;
            }

            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height);

            if (code && code.data) {
                this.scanObservable.next(code.data);

            } else {
                requestAnimationFrame(this.decode.bind(this));
            }

        } else {
            requestAnimationFrame(this.decode.bind(this));
        }
    }

}
