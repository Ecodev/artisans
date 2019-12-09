import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-particle-switch',
    templateUrl: './particle-switch.component.html',
    styleUrls: ['./particle-switch.component.scss'],
})
export class ParticleSwitchComponent implements OnInit, AfterViewInit {

    @ContentChild(TemplateRef, {static: true}) template: TemplateRef<any>;
    @ViewChild('wrapper', {static: true}) wrapper: ElementRef<any>;
    @ViewChild('element1', {static: false}) element1: ElementRef<any>;
    @ViewChild('element2', {static: false}) element2: ElementRef<any>;

    public _data1;
    public _data2;
    public showData1;
    public showData2;
    public invertAnimation;
    public duration = 500;
    public firstDisplay = true;

    public settings1 = {
        pOscillationCoefficient: 80,
        pDirection: 'right',
        pColor: '#0e7ecb',
        pParticlesAmountCoefficient: 1,
        pDuration: this.duration,
        pSpeed: 0.5,
    };

    public settings2 = {
        pOscillationCoefficient: 100,
        pDirection: 'left',
        pColor: '#ef6031',
        pParticlesAmountCoefficient: 1,
        pDuration: this.duration,
        pSpeed: 0.5,
    };

    @Input() set data(value: any) {

        if (!this.showData1) {
            this._data1 = value;
            this.showData2 = false;
            if (this.firstDisplay) {
                this.showData1 = true;
            } else {
                setTimeout(() => this.showData1 = true, this.duration - 100);
            }
            this.invertAnimation = false;

        } else {
            this._data2 = value;
            this.showData1 = false;
            setTimeout(() => this.showData2 = true, this.duration - 100);
            this.invertAnimation = true;
        }

        const tmpSettings = this.settings1;
        this.settings1 = this.settings2;
        this.settings2 = tmpSettings;

        this.updateSize();
        this.firstDisplay = false;
    }

    constructor(private rootElement: ElementRef) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.updateSize();
    }

    public updateSize() {
        const root = this.rootElement.nativeElement;

        const element = this.element2 || this.element1 || this.wrapper;
        const child = element.nativeElement.children[0];
        root.style.height = child.offsetHeight + 'px';
        root.style.width = child.offsetWidth + 'px';
    }

}
