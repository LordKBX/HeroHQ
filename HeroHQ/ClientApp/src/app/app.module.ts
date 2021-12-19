
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeroComponent } from './hero/hero.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { NewheroComponent } from './newhero/newhero.component';

import { DataConnectorService } from './services/data-connector.service';

@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        HomeComponent,
        HeroComponent,
        SearchComponent,
        NewheroComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            { path: 'home', component: HomeComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'index', redirectTo: 'home', pathMatch: 'full' },
            { path: 'search', component: SearchComponent },
            { path: 'hero/:id', component: HeroComponent },
            { path: 'newhero', component: NewheroComponent },
            { path: '**', component: ErrorComponent }
        ])
    ],
    providers: [DataConnectorService],
    bootstrap: [AppComponent],

})
export class AppModule {
}
