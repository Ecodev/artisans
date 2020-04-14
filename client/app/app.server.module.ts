import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ssrCompatibleStorageProvider } from './shared/utils';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        FlexLayoutServerModule,
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {
}
