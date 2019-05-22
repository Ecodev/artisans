import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { QrService } from '../services/qr.service';

@Component({
    selector: 'app-scan',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnDestroy {

    @ViewChild('video') videoRef: ElementRef;

    constructor(public router: Router,
                private route: ActivatedRoute,
                private alertService: NaturalAlertService,
                @Inject(MAT_DIALOG_DATA) data: any,
                private dialogRef: MatDialogRef<any>,
                private qrService: QrService) {
    }

    ngOnInit() {
        this.qrService.getStream().subscribe(stream => {
            this.videoRef.nativeElement.srcObject = stream;
            this.videoRef.nativeElement.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.videoRef.nativeElement.play();
        });

        // In case we arrive here by url refresh that avoids to start camera from click on home.component.ts
        // Won't cause double scanning
        this.qrService.start();
    }

    ngOnDestroy() {

    }

}
