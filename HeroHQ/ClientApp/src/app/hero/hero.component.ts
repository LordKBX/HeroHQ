import {Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ErrorComponent } from '../error/error.component';

import { DataConnectorService } from '../services/data-connector.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  public heroId = 0;
    public heroData = { Id: 0, Nom: "", Photo: "" };
    public errorId = 404;
    public loading = true;

  constructor(private route: ActivatedRoute, private serviceData:DataConnectorService) {
    this.heroId = this.route.snapshot.params["id"];
    console.log("Hero id: "+this.heroId);
    try{
      console.log(serviceData.getHero(this.heroId));
        serviceData.getHero(this.heroId).then(data => {
            if (data.Photo.search('data:image') != 0) { data.Photo = 'assets/images/' + data.Photo; }
            this.heroData = data
        });
    }
    catch(error){
      console.error(error);
    }
    console.log(this.heroData);

    if(this.heroData === null){
      this.heroId = 0;
      this.errorId = 404;
    }
   }

  ngOnInit() {
  }

}
