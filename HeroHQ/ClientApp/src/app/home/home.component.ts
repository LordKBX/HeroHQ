import { Component } from '@angular/core';
import { DataConnectorService } from '../services/data-connector.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public pageTitle = 'Home';
    public heros: { Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }[] = [];
    public loading: {} = {};

  constructor(serviceData:DataConnectorService){
      serviceData.getRandom(4).then(data => {
          for (var i: number = 0; i < data.length; i++) {
              if (data[i].Photo.search('data:image') != 0) { data[i].Photo = 'assets/images/' + data[i].Photo; }
          }
          this.heros = data;
          for (var i = 0; i < this.heros.length; i++) {
              if (this.loading["_" + this.heros[i].Id] === undefined) { this.loading["_" +this.heros[i].Id] = true; }
          }
      });
    }
}
