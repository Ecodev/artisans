import { Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { SidenavService } from '../../sidenav.service';

@Component({
    selector: 'app-sidenav-container',
    templateUrl: './sidenav-container.component.html',
    styleUrls: ['./sidenav-container.component.scss'],
    providers: [SidenavService],
})
export class SidenavContainerComponent implements OnInit, OnDestroy {

    @Input() name: string;
    @ViewChild(MatSidenavContainer) private menuContainer: MatSidenavContainer;
    @ViewChild(MatSidenav) private menuSidenav: MatSidenav;
    @HostBinding('attr.no-scroll') @Input() private noScroll: boolean;

    constructor(public sidenavService: SidenavService) {
    }

    ngOnInit() {
        this.sidenavService.init(this.name, this.menuContainer, this.menuSidenav, this);
    }

    ngOnDestroy() {
        this.sidenavService.destroy(this.name);
    }

    public toggle() {
        this.sidenavService.toggle();
    }

}
