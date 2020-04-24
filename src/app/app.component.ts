import { Component, NgZone, ViewChild } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModel, ConfirmedDataModel } from './data.model';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private chart: am4charts.XYChart;
  confirmedData: Observable<any>;
  deathsData: Observable<any>;
  recoveredData: Observable<any>;
  tableData: Observable<any>;
  CountryName = 'India';
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = ['country_name', 'cases', 'deaths', 'region', 'total_recovered', 'new_deaths', 'new_cases', 'serious_critical', 'active_cases', 'total_cases_per_1m_population'];
  dataSource;

  constructor(private https: HttpClient, private zone: NgZone) {

    // API call for India confirmed cases
    let confirmedData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/confirmed/country/us',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling death cases
    let deathsData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/death/country/us',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling recovered cases
    let recoveredData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/recovered/country/us',
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Get all the data in table
    let tableData = this.https.get<any>('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php',
    { headers: {'x-rapidapi-host':'coronavirus-monitor.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

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

    tableData.subscribe(updatedValue => {
      this.dataSource = updatedValue['countries_stat'];
      console.log(this.dataSource);
    });

  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // runOutsideAngualr is zone method
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    let chart1 = am4core.create("chartdiv1", am4charts.XYChart);

    // Add data
    chart.data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    }];

    chart1.data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    }];
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    let lineSeries = chart1.series.push(new am4charts.LineSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";

    lineSeries.dataFields.valueY = "litres";
    lineSeries.dataFields.categoryX = "country";
  }

  ngOnInit(): void { }


  selectedCountry(countryName){
    this.CountryName = countryName.toUpperCase();
  // API call for India confirmed cases
    let confirmedData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/confirmed/country/' + countryName,
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling death cases
    let deathsData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/death/country/' + countryName,
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714'} });

    // Calling recovered cases
    let recoveredData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/recovered/country/' + countryName,
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
  
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
