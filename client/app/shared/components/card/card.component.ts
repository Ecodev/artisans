import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

    @Input() illustrationHeight = 200;

    private image =
'https://images.unsplash.com/photo-1500917832468-298fa6292e2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=80';

    public illustration;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {

        this.illustration = this.sanitizer.bypassSecurityTrustStyle('url(' + this.image + ')');
    }

}
