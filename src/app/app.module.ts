import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura'; // add thi
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

const MyTheme = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                primary: { color: '#1DD65A' },
            },
            dark: {
                primary: { color: '#1DD65A' },
            },
        },
    },
});

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, FeaturesModule, SharedModule, CoreModule],
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        provideHttpClient(withFetch()),
        providePrimeNG({
            // add this
            theme: {
                // add this
                preset: MyTheme, // add this
                options: {
                    darkModeSelector: false,
                },
            }, // add this
        }), // add this
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
