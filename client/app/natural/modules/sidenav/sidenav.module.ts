import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavContainerComponent } from './components/sidenav-container/sidenav-container.component';
import { SidenavContentComponent } from './components/sidenav-content/sidenav-content.component';

@NgModule({
    declarations: [
        SidenavComponent,
        SidenavContainerComponent,
        SidenavContentComponent,
    ],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
    ],
    exports: [
        SidenavComponent,
        SidenavContainerComponent,
        SidenavContentComponent,
    ],

})
export class SidenavModule {
}
