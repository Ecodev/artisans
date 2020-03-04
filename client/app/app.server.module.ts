import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { MemoryStorage, SESSION_STORAGE } from './shared/classes/memory-storage';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        FlexLayoutServerModule,
    ],
    providers: [
        {
            // Use memory storage instead of sessionStorage because it is not available in node
            provide: SESSION_STORAGE,
            useValue: new MemoryStorage(),
        },
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {
}
