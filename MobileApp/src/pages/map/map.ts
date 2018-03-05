import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Leaflet } from 'leaflet';
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

    var IconGrey = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_grey.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.map.locate({
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
    })
  }

}
