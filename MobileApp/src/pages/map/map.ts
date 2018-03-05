import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import Leaflet from 'leaflet';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams, HttpClient } from '@angular/common/http/';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(private app:App, public nav: NavController, private auth: AuthService) {
  }

  ionViewDidEnter() {
    this.loadmap();
  }

  ionViewCanLeave() {
    document.getElementById("map1").outerHTML = "";
  }

  logout() {
    this.auth.logout().subscribe(data => {
      if(data)
        this.app.getRootNav().setRoot(LoginPage);
    });
  }

  loadmap() {
    this.map = Leaflet.map("map", {attributionControl: false}).fitWorld();
    var mymap = this.map;
    Leaflet.control.scale({imperial: false}).addTo(this.map);
    Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 18,
    }).addTo(this.map);

    var IconGreen = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_green.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    var IconRed = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_red.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    var IconGrey = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_grey.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    var IconPurple = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_purple.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    var IconBlue = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_blue.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

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


    this.auth.request("generic/getInfo.php", {id : 1, map : 1}).subscribe(data => {
      console.log(data);
      let markerGroup = Leaflet.featureGroup();
        // let marker: any = Leaflet.marker([e.latitude, e.longitude], {icon:IconGreen}).bindPopup(customPopup,{closeButton:false})
        let id  = 0
        for (let e of data.self) {
          var customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: (id++===0)?IconGreen:IconGrey}).bindPopup(customPopup,{closeButton:false})
          markerGroup.addLayer(marker);
        }
        for (let e of data.others) {
          var customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: (e.alert==="1")?IconRed:IconBlue}).bindPopup(customPopup,{closeButton:false})
          markerGroup.addLayer(marker);
        }
        for (let e of data.beacons) {
          var customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: IconPurple}).bindPopup(customPopup,{closeButton:false})
          markerGroup.addLayer(marker);
        }
        /*for (let e of data.matt) {if(Number(e.floor) != floor) continue;
          var customPopup2 = "<strong>"+e.name+"</strong><br>"+e.locationX+" - "+e.locationY
          let marker: any = Leaflet.marker([Number(e.locationY), Number(e.locationX)]/*{lat: e.latitude, lon: e.longitude}*//*, {icon:this.IconGreen}).bindPopup(customPopup2,{closeButton:false})
          markerGroup.addLayer(marker);
        }*/
        this.map.addLayer(markerGroup);
        //this.map.setView([Number("45.1840290"), Number("5.747582")], 14)
        //this.map.setView([Number("45.182279"), Number("5.747395")], 13)
        //console.log(data);
        //this.nav.setRoot('MenuPage');
        if(data.self[0] != undefined) {
          this.auth.request("map/get.php", {map : data.self[0].map}).subscribe(data => {
            this.map.setView([Number(data.map.centerLatitude), Number(data.map.centerLongitude)], data.map.zoom)
          });
        }
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
