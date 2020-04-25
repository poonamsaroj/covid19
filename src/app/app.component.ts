import { Component, OnInit, AfterViewInit, Output, ViewChild, Input, ElementRef, NgZone , EventEmitter} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModel, ConfirmedDataModel } from './data.model';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('charRef', {static: true}) charRef: ElementRef;
  chartType: string = 'XYChart';
  chartData: any[];
  categoryAxis : am4charts.CategoryAxis;
  columnSeriesOne: am4charts.ColumnSeries;
  columnSeriesTwo: am4charts.ColumnSeries;
  valueAxis: am4charts.ValueAxis;
  graphs: am4charts.Series[] = [];  
  private chart: am4charts.Chart;
  input: string;

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // private chart: am4charts.XYChart;
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
      updatedValue['countries_stat'].shift();
      this.dataSource = new MatTableDataSource<any>(updatedValue['countries_stat']);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngAfterViewInit() {

    // runOutsideAngualr is zone method
    let chartdata = am4core.create("chartdiv", am4charts.PieChart);

    // Add data
    chartdata.data = [{
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
    let pieSeries = chartdata.series.push(new am4charts.PieSeries());
    // let lineSeries = chart1.series.push(new am4charts.LineSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";

    let chart = am4core.create("chartdiv1", am4charts.XYChart);

    chart.data = [{
     "country": "USA",
     "visits": 2025
    }, {
     "country": "China",
     "visits": 1882
    }, {
     "country": "Japan",
     "visits": 1809
    }, {
     "country": "Germany",
     "visits": 1322
    }, {
     "country": "UK",
     "visits": 1122
    }, {
     "country": "France",
     "visits": 1114
    }, {
     "country": "India",
     "visits": 984
    }, {
     "country": "Spain",
     "visits": 711
    }, {
     "country": "Netherlands",
     "visits": 665
    }, {
     "country": "Russia",
     "visits": 580
    }, {
     "country": "South Korea",
     "visits": 443
    }, {
     "country": "Canada",
     "visits": 441
    }];
    
    chart.padding(40, 40, 40, 40);
    
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    //valueAxis.rangeChangeEasing = am4core.ease.linear;
    //valueAxis.rangeChangeDuration = 1500;
    
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "visits";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    //series.interpolationDuration = 1500;
    //series.interpolationEasing = am4core.ease.linear;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
    
    chart.zoomOutButton.disabled = true;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
     return chart.colors.getIndex(target.dataItem.index);
    });
    
    setInterval(function () {
     am4core.array.each(chart.data, function (item) {
       item.visits += Math.round(Math.random() * 200 - 100);
       item.visits = Math.abs(item.visits);
     })
     chart.invalidateRawData();
    }, 2000)
    
    categoryAxis.sortBySeries = series;
    
  }

  ngOnInit(): void { }

  selectedCountry(countryName){
    this.CountryName = countryName.toUpperCase();
  // API call for India confirmed cases
    let confirmedData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/confirmed/country/' + countryName,
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714','Access-Control-Allow-Origin': '*'} });

    // Calling death cases
    let deathsData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/death/country/' + countryName,
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714','Access-Control-Allow-Origin': '*'} });

    // Calling recovered cases
    let recoveredData = this.https.get<any>('https://covid1910.p.rapidapi.com/data/recovered/country/' + countryName,
    { headers: {'x-rapidapi-host':'covid1910.p.rapidapi.com','x-rapidapi-key':'acfeacb8e5mshaaed9863eea2255p1f8330jsn99bae8f26714','Access-Control-Allow-Origin': '*'} });

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
