import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-code-input',
    templateUrl: './code-input.component.html',
    styleUrls: ['./code-input.component.scss'],
})
export class CodeInputComponent implements OnInit {

    public code;

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    public goToBookable(code: string) {
        this.router.navigate(['/booking', code]);
    }
}
