import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Literal } from '../../types';
import { UploadService } from './services/upload.service';
import { takeUntil } from 'rxjs/operators';
import { AbstractController } from '../AbstractController';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { Observable, of, Subject } from 'rxjs';

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
    providers: [UploadService],
})
export class FileComponent extends AbstractController implements OnInit, OnChanges {

    @HostBinding('style.height.px') @Input() height = 250;

    @Input() action: 'upload' | 'download' | null = null;

    @Input() service;
    @Input() modelContext: Literal = {};
    @Input() model; // todo : when __typename included in queries : FileType;

    @Output() modelChange = new EventEmitter();

    public imagePreview: SafeStyle | null;
    public filePreview: string | null;

    constructor(private uploadService: UploadService, private sanitizer: DomSanitizer) {
        super();
    }

    ngOnInit() {
        this.uploadService.filesChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(files => {
            // subscription required to activate hover overlay. Upload function is called from fileChanged in template that
            // works for both : drag-n-drop and click select
        });

        this.updateImage();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.model && changes.model.previousValue !== changes.model.currentValue) {
            this.updateImage();
        }
    }

    public upload(file) {

        const model = Object.assign(this.modelContext, {file: file});
        this.model = model;
        this.updateImage();

        if (this.service) {
            this.service.create(model).subscribe((result) => {
                this.model = result;
                this.modelChange.emit(result);
            });
        } else {
            this.modelChange.emit(model);
        }
    }

    private updateImage() {

        this.imagePreview = null;
        this.filePreview = null;

        if (this.model && this.model.__typename === 'Image' && this.model.id) {
            // Model image with id, use specific API to render image by size
            const loc = window.location;
            const height = (this.height ? '/' + this.height : '');

            // create image url without port to stay compatible with dev mode
            const image = loc.protocol + '//' + loc.hostname + '/image/' + this.model.id + height;
            this.imagePreview = this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');

        } else if (this.model && this.model.__typename === 'AccountingDocument') {
            this.filePreview = this.model.mime.split('/')[1];

        } else if (this.model && this.model.src) {
            // external url
            this.imagePreview = this.sanitizer.bypassSecurityTrustStyle('url(' + this.model.src + ')');

        } else if (this.model && this.model.file && this.model.file.type.includes('image/') && !this.model.__typename) {
            // Model from upload (before saving)
            this.getBase64(this.model.file).subscribe(result => {
                this.imagePreview = this.sanitizer.bypassSecurityTrustStyle('url(data:image;base64,' + result + ')');
            });

        } else if (this.model && this.model.file) {
            this.filePreview = this.model.file.type.split('/')[1];

        }

    }

    private getBase64(file): Observable<any> {

        if (!file) {
            return of(null);
        }

        const subject = new Subject();

        const reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            subject.next(btoa(ev.target.result));
            subject.complete();
        });
        reader.readAsBinaryString(file);

        return subject.asObservable();
    }

    public getDownloadLink(): null | string {

        if (this.action !== 'download') {
            return null;
        }

        if (this.model && this.model.__typename === 'AccountingDocument') {
            return '/accounting-document/' + this.model.id;
        } else if (this.model && this.model.__typename === 'Image') {
            return '/image/' + this.model.id;
        }

        return null;
    }

}
