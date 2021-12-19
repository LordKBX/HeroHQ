import { Component } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { DataConnectorService } from './services/data-connector.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    subscription: Subscription;
    pageTitle = 'OverWatch';
    HeroTotal = 0;
    menuMobileDisplay = false;

    constructor(private serviceData: DataConnectorService) {
        serviceData.count().then(cpt => this.HeroTotal = cpt);
    }

    ngOnInit() {
    }
}
