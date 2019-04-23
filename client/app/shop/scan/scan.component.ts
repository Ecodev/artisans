import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { ScanService } from './scan.service';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.component.html',
    styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit, OnDestroy {

    @ViewChild('video') videoRef: ElementRef;

    constructor(public router: Router,
                private route: ActivatedRoute,
                private alertService: NaturalAlertService,
                @Inject(MAT_DIALOG_DATA) data: any,
                private dialogRef: MatDialogRef<any>,
                private scanService: ScanService) {
    }

    ngOnInit() {

        this.scanService.getStream().subscribe(stream => {
            this.videoRef.nativeElement.srcObject = stream;
            this.videoRef.nativeElement.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
            this.videoRef.nativeElement.play();
        });

        this.scanService.scan().subscribe(result => {
            const parsedCode = result.toLowerCase().replace('https://chez-emmy.ch/product/', '');
            this.router.navigate(['/product', parsedCode]);
            this.dialogRef.close();

        }, (err) => {
            console.error('Camera inutilisable.', err.name, err.code, err.message);
            const message = 'La caméra est indisponible, essaye de rechercher ton article au travers de sa référence';
            this.alertService.error(message, 5000);
            this.router.navigateByUrl('/');
            this.dialogRef.close();
        });
    }

    ngOnDestroy() {

    }

}
