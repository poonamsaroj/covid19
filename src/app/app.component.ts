import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModel, ConfirmedDataModel } from './data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  confirmedData: Observable<any>;
  deathsData: Observable<any>;
  recoveredData: Observable<any>;
  // data: Observable<DataModel>;
  // data: Observable<DataModel>;

  constructor(private https: HttpClient) {
    // API call for India confirmed cases
    let confirmedData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/confirmed/country/india',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com', 'x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling death cases
    let deathsData = this.https.get<DataModel>('https://covid1910.p.rapidapi.com/data/death/country/india',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling recovered cases
    let recoveredData = this.https.get<DataModel>('https://covid1910.p.rapidapi.com/data/recovered/country/india',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Subscribing to all the observable values
    confirmedData.subscribe(updatedValue => {
      this.confirmedData = updatedValue[0]['confirmed']
    });

    deathsData.subscribe(updatedValue => {
      this.deathsData = updatedValue[0]['death']
    });

    recoveredData.subscribe(updatedValue => {
      this.recoveredData = updatedValue[0]['recovered']
    });

  }
  

}
