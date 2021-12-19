import { Component, OnInit } from '@angular/core';
import { DataConnectorService } from '../services/data-connector.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public heroList:{Id:number, Nom:string, Photo:string}[] = [];
  public searchHeroList:{Id:number, Nom:string, Photo:string}[] = [];
    private serviceData: DataConnectorService;
    public loading: {} = {};

  private _searchPattern:string='';
  get searchPattern():string{ return this._searchPattern; }
  set searchPattern(value:string){
      this._searchPattern = value;
      if (value === '') {
          this.serviceData.getAllResume().then(data => {
              for (var i: number = 0; i < data.length; i++) {
                  if (data[i].Photo.search('data:image') != 0) { data[i].Photo = 'assets/images/' + data[i].Photo; }
              }
              this.searchHeroList = data;
              this.initListLoaderStatus();
          });
      }
      else {
          this.serviceData.searchHero(value).then(data => {
              for (var i: number = 0; i < data.length; i++) {
                  if (data[i].Photo.search('data:image') != 0) { data[i].Photo = 'assets/images/' + data[i].Photo; }
              }
              this.searchHeroList = data;
              this.initListLoaderStatus();
          });
      }
  }

  constructor(serviceData:DataConnectorService) {
    this.serviceData=serviceData;
      serviceData.getAllResume().then(data => {
          for (var i: number = 0; i < data.length; i++) {
              if (data[i].Photo.search('data:image') != 0) { data[i].Photo = 'assets/images/' + data[i].Photo; }
          }
          this.heroList = this.searchHeroList = data;
          this.initListLoaderStatus();
      });
    }

    private initListLoaderStatus() {
        for (var i = 0; i < this.searchHeroList.length; i++) {
            if (this.loading["_" + this.searchHeroList[i].Id] === undefined) { this.loading["_" + this.searchHeroList[i].Id] = true; }
        }
    }

  ngOnInit() {
  }

}
