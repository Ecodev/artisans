import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NaturalAbstractController } from '@ecodev/natural';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UploadService } from './services/upload.service';
import { Product_product_image, Purchases_purchases_items_product_file } from '../../generated-types';

type FileModel = Purchases_purchases_items_product_file
    | Product_product_image;

export function getDownloadLink(model: FileModel | null): null | string {

    const hostname = window.location.protocol + '//' + window.location.hostname;

    if (model && model.__typename === 'File') {
        return hostname + '/file/' + model.id;
    } else if (model && model.__typename === 'Image') {
        return hostname + '/image/' + model.id;
    }

    return null;
}

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
    providers: [UploadService],
})
export class FileComponent extends NaturalAbstractController implements OnInit, OnChanges {

    @HostBinding('style.height.px') @Input() height = 250;

    @Input() action: 'upload' | 'download' | null = null;

    /**
     * Comma separated list of accepted mimetypes
     */
    @Input() accept = 'image/bmp,image/gif,image/jpeg,image/pjpeg,image/png,image/svg+xml,image/svg,image/webp';

    @Input() service;
    @Input() model; // todo : when __typename included in queries : FileType;

    @Output() modelChange = new EventEmitter<{ file: File }>();

    public imagePreview: SafeStyle | null;
    public filePreview: string | null;

    constructor(private uploadService: UploadService, private sanitizer: DomSanitizer) {
        super();
    }

    public ngOnInit(): void {
        this.uploadService.filesChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe((files: File[]) => {
            // subscription required to activate hover overlay. Upload function is called from fileChanged in template that
            // works for both : drag-n-drop and click select
        });

        this.updateImage();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.model && changes.model.previousValue !== changes.model.currentValue) {
            this.updateImage();
        }
    }

    public upload(file: File) {

        this.model = {file: file};
        this.updateImage();

        if (this.service) {
            this.service.create(this.model).subscribe((result) => {
                this.model = result;
                this.modelChange.emit(result);
            });
        } else {
            this.modelChange.emit(this.model);
        }
    }

    public getDownloadLink(): null | string {

        if (this.action !== 'download') {
            return null;
        }

        return getDownloadLink(this.model);
    }

    private updateImage() {

        this.imagePreview = null;
        this.filePreview = null;
        if (!this.model) {
            return;
        }

        if (this.model.file && this.model.file.type.includes('image/')) {
            // Model from upload (before saving)
            this.getBase64(this.model.file).subscribe(result => {
                const content = 'url(data:' + this.model.file.type + ';base64,' + result + ')';
                this.imagePreview = this.sanitizer.bypassSecurityTrustStyle(content);
            });

        } else if (this.model.file) {
            this.filePreview = this.model.file.type.split('/')[1];

        } else if (this.model.__typename === 'Image' && this.model.id) {
            // Model image with id, use specific API to render image by size
            const loc = window.location;
            const height = (this.height ? '/' + this.height : '');

            // create image url without port to stay compatible with dev mode
            const image = loc.protocol + '//' + loc.hostname + '/image/' + this.model.id + height;
            this.imagePreview = this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');

        } else if (this.model.__typename === 'File') {
            this.filePreview = this.model.mime.split('/')[1];

        } else if (this.model.src) {
            // external url
            this.imagePreview = this.sanitizer.bypassSecurityTrustStyle('url(' + this.model.src + ')');
        }
    }

    private getBase64(file: File | null): Observable<string> {

        if (!file) {
            return of('');
        }

        const subject = new Subject<string>();

        const reader = new FileReader();
        reader.addEventListener('load', (ev: any) => {
            subject.next(btoa(ev.target.result));
            subject.complete();
        });
        reader.readAsBinaryString(file);

        return subject.asObservable();
    }

}
