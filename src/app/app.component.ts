import { Component, OnInit, AfterViewInit, Output, ViewChild, Input, ElementRef, NgZone , EventEmitter} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";

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

  displayedColumns: string[] = ['country_name', 'cases', 'deaths', 'region', 'total_recovered', 'new_deaths', 'new_cases', 'serious_critical', 'active_cases'];
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

    //Pie chart
    let PieChart = am4core.create("chartdiv", am4charts.PieChart);

    PieChart.data = [{
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
    
    let pieChartSeries = PieChart.series.push(new am4charts.PieSeries());
    pieChartSeries.dataFields.value = "litres";
    pieChartSeries.dataFields.category = "country";


    // Line Chart
    let LineChart = am4core.create("chartdiv1", am4charts.XYChart);

    LineChart.data = [{
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
    
    LineChart.padding(40, 40, 40, 40);    
    let categoryAxis = LineChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    
    let valueAxis = LineChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = 1500;
    
    let series = LineChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "visits";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.interpolationDuration = 1500;
    series.interpolationEasing = am4core.ease.linear;
    let labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
    
    LineChart.zoomOutButton.disabled = true;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
     return LineChart.colors.getIndex(target.dataItem.index);
    });
    
    setInterval(function () {
     am4core.array.each(LineChart.data, function (item) {
       item.visits += Math.round(Math.random() * 200 - 100);
       item.visits = Math.abs(item.visits);
     })
     LineChart.invalidateRawData();
    }, 2000)
    
    categoryAxis.sortBySeries = series;
    


  // MAP chart
  let MapChart = am4core.create("mapChart", am4maps.MapChart);

  try {
    MapChart.geodata = am4geodata_worldHigh;
  }
  catch (e) {
    LineChart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
  }

  MapChart.projection = new am4maps.projections.Mercator();

  // zoomout on background click
  MapChart.chartContainer.background.events.on("hit", function () { zoomOut() });

  let colorSet = new am4core.ColorSet();
  let morphedPolygon;

  // map polygon series (countries)
  let polygonSeries = MapChart.series.push(new am4maps.MapPolygonSeries());
  polygonSeries.useGeodata = true;
  // specify which countries to include
  polygonSeries.include = ["IT", "CH", "FR", "DE", "GB", "ES", "PT", "IE", "NL", "LU", "BE", "AT", "DK"]

  // country area look and behavior
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.strokeOpacity = 1;
  polygonTemplate.stroke = am4core.color("#ffffff");
  polygonTemplate.fillOpacity = 0.5;
  polygonTemplate.tooltipText = "{name}";

  // desaturate filter for countries
  let desaturateFilter = new am4core.DesaturateFilter();
  desaturateFilter.saturation = 0.25;
  polygonTemplate.filters.push(desaturateFilter);

  // take a color from color set
  polygonTemplate.adapter.add("fill", function (fill, target) {
      return colorSet.getIndex(target.dataItem.index + 1);
  })

  // set fillOpacity to 1 when hovered
  let hoverState = polygonTemplate.states.create("hover");
  hoverState.properties.fillOpacity = 1;

  // what to do when country is clicked
  polygonTemplate.events.on("hit", function (event) {
      event.target.zIndex = 1000000;
      selectPolygon(event.target);
  })

    // Pie chart
    let MapPieChart = MapChart.seriesContainer.createChild(am4charts.PieChart);
    // Set width/heigh of a pie chart for easier positioning only
    MapPieChart.width = 100;
    MapPieChart.height = 100;
    MapPieChart.hidden = true; // can't use visible = false!

    // because defauls are 50, and it's not good with small countries
    MapPieChart.chartContainer.minHeight = 1;
    MapPieChart.chartContainer.minWidth = 1;

    let MapPieSeries = MapPieChart.series.push(new am4charts.PieSeries());
    MapPieSeries.dataFields.value = "value";
    MapPieSeries.dataFields.category = "category";
    MapPieSeries.data = [{ value: 100, category: "First" }, { value: 20, category: "Second" }, { value: 10, category: "Third" }];

    let dropShadowFilter = new am4core.DropShadowFilter();
    dropShadowFilter.blur = 4;
    MapPieSeries.filters.push(dropShadowFilter);

    let sliceTemplate = MapPieSeries.slices.template;
    sliceTemplate.fillOpacity = 1;
    sliceTemplate.strokeOpacity = 0;

    let activeState = sliceTemplate.states.getKey("active");
    activeState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    let sliceHoverState = sliceTemplate.states.getKey("hover");
    sliceHoverState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    // we don't need default pie chart animation, so change defaults
    let hiddenState = MapPieSeries.hiddenState;
    hiddenState.properties.startAngle = MapPieSeries.startAngle;
    hiddenState.properties.endAngle = MapPieSeries.endAngle;
    hiddenState.properties.opacity = 0;
    hiddenState.properties.visible = false;

    // series labels
    let labelTemplate = MapPieSeries.labels.template;
    labelTemplate.nonScaling = true;
    labelTemplate.fill = am4core.color("#FFFFFF");
    labelTemplate.fontSize = 10;
    labelTemplate.background = new am4core.RoundedRectangle();
    labelTemplate.background.fillOpacity = 0.9;
    labelTemplate.padding(4, 9, 4, 9);
    labelTemplate.background.fill = am4core.color("#7678a0");

    // we need pie series to hide faster to avoid strange pause after country is clicked
    MapPieSeries.hiddenState.transitionDuration = 200;

    // country label
    let countryLabel = MapChart.chartContainer.createChild(am4core.Label);
    countryLabel.text = "Select a country";
    countryLabel.fill = am4core.color("#7678a0");
    countryLabel.fontSize = 40;

    countryLabel.hiddenState.properties.dy = 1000;
    countryLabel.defaultState.properties.dy = 0;
    countryLabel.valign = "middle";
    countryLabel.align = "right";
    countryLabel.paddingRight = 50;
    countryLabel.hide(0);
    countryLabel.show();

    // select polygon
    function selectPolygon(polygon) {
        if (morphedPolygon != polygon) {
            let animation = MapPieSeries.hide();
            if (animation) {
                animation.events.on("animationended", function () {
                    morphToCircle(polygon);
                })
            }
            else {
                morphToCircle(polygon);
            }
        }
    }

    // fade out all countries except selected
    function fadeOut(exceptPolygon) {
        for (var i = 0; i < polygonSeries.mapPolygons.length; i++) {
            let polygon = polygonSeries.mapPolygons.getIndex(i);
            if (polygon != exceptPolygon) {
                polygon.defaultState.properties.fillOpacity = 0.5;
                polygon.animate([{ property: "fillOpacity", to: 0.5 }, { property: "strokeOpacity", to: 1 }], polygon.polygon.morpher.morphDuration);
            }
        }
    }

    function zoomOut() {
        if (morphedPolygon) {
          MapPieSeries.hide();
            morphBack();
            fadeOut(0);
            countryLabel.hide();
            morphedPolygon = undefined;
        }
    }

    function morphBack() {
        if (morphedPolygon) {
            morphedPolygon.polygon.morpher.morphBack();
            let dsf = morphedPolygon.filters.getIndex(0);
            dsf.animate({ property: "saturation", to: 0.25 }, morphedPolygon.polygon.morpher.morphDuration);
        }
    }

    function morphToCircle(polygon) {


        let animationDuration = polygon.polygon.morpher.morphDuration;
        // if there is a country already morphed to circle, morph it back
        morphBack();
        // morph polygon to circle
        polygon.toFront();
        polygon.polygon.morpher.morphToSingle = true;
        let morphAnimation = polygon.polygon.morpher.morphToCircle();

        polygon.strokeOpacity = 0; // hide stroke for lines not to cross countries

        polygon.defaultState.properties.fillOpacity = 1;
        polygon.animate({ property: "fillOpacity", to: 1 }, animationDuration);

        // animate desaturate filter
        let filter = polygon.filters.getIndex(0);
        filter.animate({ property: "saturation", to: 1 }, animationDuration);

        // save currently morphed polygon
        morphedPolygon = polygon;

        // fade out all other
        fadeOut(polygon);

        // hide country label
        countryLabel.hide();

        if (morphAnimation) {
            morphAnimation.events.on("animationended", function () {
                zoomToCountry(polygon);
            })
        }
        else {
            zoomToCountry(polygon);
        }
    }

    function zoomToCountry(polygon) {
        let zoomAnimation = MapChart.zoomToMapObject(polygon, 2.2, true);
        if (zoomAnimation) {
            zoomAnimation.events.on("animationended", function () {
                showPieChart(polygon);
            })
        }
        else {
            showPieChart(polygon);
        }
    }

    function showPieChart(polygon) {
        polygon.polygon.measure();
        let radius = polygon.polygon.measuredWidth / 2 * polygon.globalScale / MapChart.seriesContainer.scale;
        MapPieChart.width = radius * 2;
        MapPieChart.height = radius * 2;
        MapPieChart.radius = radius;

        let centerPoint = am4core.utils.spritePointToSvg(polygon.polygon.centerPoint, polygon.polygon);
        centerPoint = am4core.utils.svgPointToSprite(centerPoint, MapChart.seriesContainer);

        MapPieChart.x = centerPoint.x - radius;
        MapPieChart.y = centerPoint.y - radius;

        let fill = polygon.fill;
        let desaturated = fill.saturate(0.3);

        for (var i = 0; i < MapPieSeries.dataItems.length; i++) {
            let dataItem = MapPieSeries.dataItems.getIndex(i);
            dataItem.value = Math.round(Math.random() * 100);
            dataItem.slice.fill = am4core.color(am4core.colors.interpolate(
                fill.rgb,
                am4core.color("#ffffff").rgb,
                0.2 * i
            ));

            dataItem.label.background.fill = desaturated;
            dataItem.tick.stroke = fill;
        }

        MapPieSeries.show();
        MapPieChart.show();

        countryLabel.text = "{name}";
        countryLabel.dataItem = polygon.dataItem;
        countryLabel.fill = desaturated;
        countryLabel.show();
    }


        // WorldMap
          // Create map instance
    let WorldMapchart = am4core.create("WorldChartdiv", am4maps.MapChart);

    let title = WorldMapchart.titles.create();
    title.text = "[bold font-size: 20]Population of the World in 2011[/]\nsource: Gapminder";
    title.textAlign = "middle";

    let mapData = [
      { "id":"AF", "name":"Afghanistan", "value":32358260, "color": WorldMapchart.colors.getIndex(0) },
      { "id":"AL", "name":"Albania", "value":3215988, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"DZ", "name":"Algeria", "value":35980193, "color":WorldMapchart.colors.getIndex(2) },
      { "id":"AO", "name":"Angola", "value":19618432, "color":WorldMapchart.colors.getIndex(2) },
      { "id":"AR", "name":"Argentina", "value":40764561, "color":WorldMapchart.colors.getIndex(3) },
      { "id":"AM", "name":"Armenia", "value":3100236, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"AU", "name":"Australia", "value":22605732, "color":"#8aabb0" },
      { "id":"AT", "name":"Austria", "value":8413429, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"AZ", "name":"Azerbaijan", "value":9306023, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"BH", "name":"Bahrain", "value":1323535, "color": WorldMapchart.colors.getIndex(0) },
      { "id":"BD", "name":"Bangladesh", "value":150493658, "color": WorldMapchart.colors.getIndex(0) },
      { "id":"BY", "name":"Belarus", "value":9559441, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"BE", "name":"Belgium", "value":10754056, "color":WorldMapchart.colors.getIndex(1) },
      { "id":"BJ", "name":"Benin", "value":9099922, "color":WorldMapchart.colors.getIndex(2) },
      { "id":"BT", "name":"Bhutan", "value":738267, "color": WorldMapchart.colors.getIndex(0) },
      { "id":"BO", "name":"Bolivia", "value":10088108, "color":WorldMapchart.colors.getIndex(3) },
      { "id":"EG", "name":"Egypt", "value":82536770, "color":WorldMapchart.colors.getIndex(2) },
    ];

    // Set map definition
    WorldMapchart.geodata = am4geodata_worldLow;

    // Set projection
    WorldMapchart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonWorldMapSeries = WorldMapchart.series.push(new am4maps.MapPolygonSeries());
    polygonWorldMapSeries.exclude = ["AQ"];
    polygonWorldMapSeries.useGeodata = true;
    polygonWorldMapSeries.nonScalingStroke = true;
    polygonWorldMapSeries.strokeWidth = 0.5;
    polygonWorldMapSeries.calculateVisualCenter = true;

    let imageSeries = WorldMapchart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = mapData;
    imageSeries.dataFields.value = "value";

    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true

    let circle = imageTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.propertyFields.fill = "color";
    circle.tooltipText = "{name}: [bold]{value}[/]";


    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })

    imageTemplate.adapter.add("latitude", function(latitude, target) {
      let polygon = polygonWorldMapSeries.getPolygonById(target.dataItem.dataContext['id']);
      if(polygon){
        return polygon.visualLatitude;
      }
      return latitude;
    })

    imageTemplate.adapter.add("longitude", function(longitude, target) {
      let polygon = polygonWorldMapSeries.getPolygonById(target.dataItem.dataContext['id']);
      if(polygon){
        return polygon.visualLongitude;
      }
      return longitude;
    })

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
