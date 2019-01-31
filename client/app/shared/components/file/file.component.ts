import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Literal } from '../../types';
import { UploadService } from './services/upload.service';
import { takeUntil } from 'rxjs/operators';
import { AbstractController } from '../AbstractController';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

// export interface AppUrlFileType {
//     src: string;
// }
//
// type FileType =
//     BookableQuery['bookable']['image'] |
//     ExpenseClaimQuery['expenseClaim']['accountingDocuments'][0] |
//     AppUrlFileType;

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
})
export class FileComponent extends AbstractController implements OnInit {

    @HostBinding('style.height.px') @Input() height = 250;
    @Input() service;
    @Input() modelContext: Literal = {};
    @Input() readonly = false;
    @Input() file; // todo : when __typename included in queries : FileType;

    @Output() change = new EventEmitter();

    public image: SafeStyle | null;

    constructor(private uploadService: UploadService, private sanitizer: DomSanitizer) {
        super();
    }

    ngOnInit() {

        this.uploadService.filesChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(files => {
            if (files.length) {
                this.upload(files[0]);
                files.length = 0;
            }
        });

        this.updateImage();
    }

    public upload(file) {
        const model = Object.assign(this.modelContext, {file: file});

        this.service.create(model).subscribe((result) => {
            this.file = result;
            this.updateImage();
            this.change.emit(result);
        });
    }

    private updateImage() {

        if (this.file && this.file.__typename === 'Image' && this.file.id) {
            const loc = window.location;
            const height = (this.height ? '/' + this.height : '');

            // create image url without port to stay compatible with dev mode
            const image = loc.protocol + '//' + loc.hostname + '/image/' + this.file.id + height;
            this.image = this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');

        } else if (this.file && this.file.src) {
            this.image = this.sanitizer.bypassSecurityTrustStyle('url(' + this.file.src + ')');

        } else {
            this.image = null;
        }

    }

}
