import { Injectable, Inject } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HTTP_INTERCEPTORS, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DataConnectorService {
    private _jsonURL = 'assets/BDD_Hero.json';

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

    }

    private randomInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    public count(): Promise<number> {
        return this.http.get(this.baseUrl + 'database/allResume', { responseType: 'text' })
            .toPromise()
            .then(response => {
                console.log('JSON.parse(response)', JSON.parse(response));
                return (JSON.parse(response) as { Id: number, Nom: string, Photo: string }[]).length;
            })
            .catch(this.handleError);

        return this.http.get(this._jsonURL, { responseType: 'text' })
            .toPromise()
            .then(response => {
                console.log('JSON.parse(response).length', JSON.parse(response).length);
                return JSON.parse(response).length;
            })
            .catch(this.handleError);
    }

    public getAll(): Promise<{ Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }[]> {
        return this.http.get(this.baseUrl + 'database/all', { responseType: 'text' })
            .toPromise()
            .then(response => {
                console.log('JSON.parse(response)', JSON.parse(response));
                return JSON.parse(response) as { Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }[];
            })
            .catch(this.handleError);
    }

    public getAllResume(): Promise<{ Id: number, Nom: string, Photo: string }[]> {
        return this.http.get(this.baseUrl + 'database/allResume', { responseType: 'text' })
            .toPromise()
            .then(response => {
                console.log('JSON.parse(response)', JSON.parse(response));
                return JSON.parse(response) as { Id: number, Nom: string, Photo: string }[];
            })
            .catch(this.handleError);
    }

    public getRandom(nombre: number): Promise<{ Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }[]> {
        return this.http.get(this.baseUrl + 'database/random/' + nombre, { responseType: 'text' })
            .toPromise()
            .then(response => {
                console.log('JSON.parse(response)', JSON.parse(response));
                return JSON.parse(response) as { Id: number, Nom: string, Photo: string }[];
            })
            .catch(this.handleError);
    }

    public getHero(id: number): Promise<{ Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }> {
        return this.http.get(this.baseUrl + 'database/hero/' + id, { responseType: 'text' })
            .toPromise()
            .then(response => {
                var myHero: { Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string } = JSON.parse(response);
                console.log('myHero', myHero);
                return myHero as { Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string };
            })
            .catch(this.handleError);
    }

    public register(data: {}): Promise<number> {
        return this.http.post<number>(this.baseUrl + 'database/register', data)
            .toPromise()
            .then(response => {
                console.log("send response", (response > 0) ? "true" : "false");
                return response;
            })
            .catch(this.handleError);
    }

    public searchHero(pattern: string): Promise<{ Id: number, Nom: string, Photo: string }[]> {
        return this.http.get(this.baseUrl + 'database/search/' + pattern, { responseType: 'text' })
            .toPromise()
            .then(response => {
                var herosList = JSON.parse(response) as { Id: number, Nom: string, Age: number, Pouvoir: string, Citation: string, Photo: string }[];

                var list: { Id: number, Nom: string, Photo: string }[] = [];
                pattern = pattern.toLowerCase()

                if (herosList.length > 0) for (var i: number = 0; i < herosList.length; i++) {
                    if (herosList[i].Nom.toLowerCase().search(pattern) != -1) {
                        list.push({ Id: herosList[i].Id, Nom: herosList[i].Nom, Photo: herosList[i].Photo });
                    }
                }
                return list;
            })
            .catch(this.handleError);
    }

}
