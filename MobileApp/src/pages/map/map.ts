import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import Leaflet from 'leaflet';
import { AuthService } from '../../providers/auth-service/auth-service';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  mapId: number;
  target;
  selectedFilter: string = "All";
  markerBeacon;
  markerCurrent;
  markerHisto;
  markerMe;

IconGreen: any;
IconRed: any;
IconGrey: any;
IconPurple: any;
IconBlue: any;


  constructor(public nav: NavController, private auth: AuthService, public navParams: NavParams) {
    //    console.log(navParams.get('param'));
    this.mapId = navParams.get('param');
    this.target = navParams.get('add');
  }

  ionViewDidEnter() {
    this.initmap();
    this.loadmap();
  }

  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";
  }

  logout() {
    this.auth.logout();
  }

  onFilterChanged(segmentButton) {
    switch (segmentButton.value) {
      case "All":
        this.map.addLayer(this.markerCurrent);
        this.map.addLayer(this.markerHisto);
        break;
      case "Me":
        this.map.removeLayer(this.markerCurrent);
        this.map.addLayer(this.markerHisto);
        break;
      case "Current":
        this.map.addLayer(this.markerCurrent);
        this.map.removeLayer(this.markerHisto);
        break;
      default:
        throw new Error("Unexpected segment value");
    }
  }

  initmap() {
    this.map = Leaflet.map("map", {attributionControl: false}).fitWorld();
    Leaflet.control.scale({imperial: false}).addTo(this.map);
    Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 18,
    }).addTo(this.map);

    this.IconGreen = Leaflet.icon({
      iconUrl: "assets/imgs/pointer_green.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconRed = Leaflet.icon({
      iconUrl: "assets/imgs/pointer_red.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconGrey = Leaflet.icon({
      iconUrl: "assets/imgs/pointer_grey.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconPurple = Leaflet.icon({
      iconUrl: "assets/imgs/pointer_purple.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconBlue = Leaflet.icon({
      iconUrl: "assets/imgs/pointer_blue.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });
  }

  loadmap() {
    var mymap = this.map;
    /*this.map.locate({
      setView: true,
      maxZoom: 16
    }).on('locationfound', (e) => {
      var customPopup = "<strong>"+"username"+"</strong><br>"+e.latitude.toFixed(5)+" - "+e.longitude.toFixed(5)
      let markerGroup = Leaflet.featureGroup();
      let marker: any = Leaflet.marker([e.latitude, e.longitude], {icon:IconGreen}).bindPopup(customPopup,{closeButton:false})
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
        alert(err.message);
    })*/


    this.auth.request("generic/getInfo.php", {map : this.mapId}).subscribe(data => {
      console.log(data);
        //let markerGroup = Leaflet.featureGroup();
        this.markerBeacon = Leaflet.featureGroup();
        this.markerCurrent = Leaflet.featureGroup();
        this.markerHisto = Leaflet.featureGroup();
        this.markerMe = Leaflet.featureGroup();
        // let marker: any = Leaflet.marker([e.latitude, e.longitude], {icon:IconGreen}).bindPopup(customPopup,{closeButton:false})
        let id  = 0
        let targetTrack = undefined;
        var customPopup;
        for (let e of data.self) {
          customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: (id++===0)?this.IconGreen:this.IconGrey}).bindPopup(customPopup,{closeButton:false})
          if(id == 1)
            this.markerMe.addLayer(marker);
          else
            this.markerHisto.addLayer(marker);
        }
        for (let e of data.others) {
          customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: (e.alert==="1")?this.IconRed:this.IconBlue}).bindPopup(customPopup,{closeButton:false})
          this.markerCurrent.addLayer(marker);
          if(this.target == e.idTracker)
            targetTrack = marker;
        }
        for (let e of data.beacons) {
          customPopup = "<strong>Beacon</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: this.IconPurple}).bindPopup(customPopup,{closeButton:false})
          this.markerBeacon.addLayer(marker);
        }
        /*for (let e of data.matt) {if(Number(e.floor) != floor) continue;
          var customPopup2 = "<strong>"+e.name+"</strong><br>"+e.locationX+" - "+e.locationY
          let marker: any = Leaflet.marker([Number(e.locationY), Number(e.locationX)]/*{lat: e.latitude, lon: e.longitude}*//*, {icon:this.IconGreen}).bindPopup(customPopup2,{closeButton:false})
          markerGroup.addLayer(marker);
        }*/
        this.map.addLayer(this.markerBeacon);
        this.map.addLayer(this.markerCurrent);
        this.map.addLayer(this.markerHisto);
        this.map.addLayer(this.markerMe);
        //this.map.setView([Number("45.1840290"), Number("5.747582")], 14)
        //this.map.setView([Number("45.182279"), Number("5.747395")], 13)
        //console.log(data);
        //this.nav.setRoot('MenuPage');
        //if(data.self[0] != undefined) {
          this.auth.request("map/get.php", {map : this.mapId/*data.self[0].map*/}).subscribe(data => {
            var mapPolygon = [];
            for(var point of data.map.polygon)
              mapPolygon.push([point.longitude, point.latitude]);
            var polygon = Leaflet.polygon(mapPolygon, {color: '#b200ff88', fillColor: '#00000000'}).addTo(this.map);
            // zoom the map to the polygon
            this.map.fitBounds(polygon.getBounds());
            if(targetTrack) {
              this.map.flyTo(targetTrack.getLatLng(), this.map.getZoom() + 2)
            }
            //this.map.setView([Number(data.map.centerLatitude), Number(data.map.centerLongitude)], data.map.zoom)
          });
        //}
      },
      error => {
        console.log(error);
      });

      var popup = Leaflet.popup();

      function onMapClick(e) {
          popup
              .setLatLng(e.latlng)
              .setContent("You clicked the map at " + e.latlng.toString() + " ")
              .openOn(mymap);
              console.log(e)
      }

      this.map.on('click', onMapClick);
  }

}
