var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import Leaflet from 'leaflet';
import { AuthService } from '../../providers/auth-service/auth-service';
import { App } from 'ionic-angular';
var MapPage = /** @class */ (function () {
    function MapPage(app, nav, auth) {
        this.app = app;
        this.nav = nav;
        this.auth = auth;
        this.selectedFilter = "All";
    }
    MapPage.prototype.ionViewDidEnter = function () {
        this.loadmap();
    };
    MapPage.prototype.ionViewCanLeave = function () {
        //document.getElementById("map1").outerHTML = "";
    };
    MapPage.prototype.logout = function () {
        this.auth.logout();
    };
    MapPage.prototype.onFilterChanged = function (segmentButton) {
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
    };
    MapPage.prototype.loadmap = function () {
        var _this = this;
        this.map = Leaflet.map("map", { attributionControl: false }).fitWorld();
        var mymap = this.map;
        Leaflet.control.scale({ imperial: false }).addTo(this.map);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 0,
            maxZoom: 18,
        }).addTo(this.map);
        var IconGreen = Leaflet.icon({
            iconUrl: "../../assets/imgs/pointer_green.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        var IconRed = Leaflet.icon({
            iconUrl: "../../assets/imgs/pointer_red.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        var IconGrey = Leaflet.icon({
            iconUrl: "../../assets/imgs/pointer_grey.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        var IconPurple = Leaflet.icon({
            iconUrl: "../../assets/imgs/pointer_purple.png",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        var IconBlue = Leaflet.icon({
            iconUrl: "../../assets/imgs/pointer_blue.png",
            iconSize: [30, 30],
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
        this.auth.request("generic/getInfo.php", { map: 1 }).subscribe(function (data) {
            console.log(data);
            //let markerGroup = Leaflet.featureGroup();
            _this.markerBeacon = Leaflet.featureGroup();
            _this.markerCurrent = Leaflet.featureGroup();
            _this.markerHisto = Leaflet.featureGroup();
            _this.markerMe = Leaflet.featureGroup();
            // let marker: any = Leaflet.marker([e.latitude, e.longitude], {icon:IconGreen}).bindPopup(customPopup,{closeButton:false})
            var id = 0;
            for (var _i = 0, _a = data.self; _i < _a.length; _i++) {
                var e = _a[_i];
                var customPopup = "<strong>" + e.date + "</strong><br>" + e.latitude + " - " + e.longitude;
                var marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)] /*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/ { icon: (id++ === 0) ? IconGreen : IconGrey }).bindPopup(customPopup, { closeButton: false });
                if (id == 1)
                    _this.markerMe.addLayer(marker);
                else
                    _this.markerHisto.addLayer(marker);
            }
            for (var _b = 0, _c = data.others; _b < _c.length; _b++) {
                var e = _c[_b];
                var customPopup = "<strong>" + e.date + "</strong><br>" + e.latitude + " - " + e.longitude;
                var marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)] /*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/ { icon: (e.alert === "1") ? IconRed : IconBlue }).bindPopup(customPopup, { closeButton: false });
                _this.markerCurrent.addLayer(marker);
            }
            for (var _d = 0, _e = data.beacons; _d < _e.length; _d++) {
                var e = _e[_d];
                var customPopup = "<strong>" + e.date + "</strong><br>" + e.latitude + " - " + e.longitude;
                var marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)] /*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/ { icon: IconPurple }).bindPopup(customPopup, { closeButton: false });
                _this.markerBeacon.addLayer(marker);
            }
            /*for (let e of data.matt) {if(Number(e.floor) != floor) continue;
              var customPopup2 = "<strong>"+e.name+"</strong><br>"+e.locationX+" - "+e.locationY
              let marker: any = Leaflet.marker([Number(e.locationY), Number(e.locationX)]/*{lat: e.latitude, lon: e.longitude}*/ /*, {icon:this.IconGreen}).bindPopup(customPopup2,{closeButton:false})
            markerGroup.addLayer(marker);
          }*/
            _this.map.addLayer(_this.markerBeacon);
            _this.map.addLayer(_this.markerCurrent);
            _this.map.addLayer(_this.markerHisto);
            _this.map.addLayer(_this.markerMe);
            //this.map.setView([Number("45.1840290"), Number("5.747582")], 14)
            //this.map.setView([Number("45.182279"), Number("5.747395")], 13)
            //console.log(data);
            //this.nav.setRoot('MenuPage');
            if (data.self[0] != undefined) {
                _this.auth.request("map/get.php", { map: data.self[0].map }).subscribe(function (data) {
                    _this.map.setView([Number(data.map.centerLatitude), Number(data.map.centerLongitude)], data.map.zoom);
                });
            }
        }, function (error) {
            console.log(error);
        });
        var popup = Leaflet.popup();
        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString() + " ")
                .openOn(mymap);
            console.log(e);
        }
        this.map.on('click', onMapClick);
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], MapPage.prototype, "mapContainer", void 0);
    MapPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-map',
            templateUrl: 'map.html'
        }),
        __metadata("design:paramtypes", [App, NavController, AuthService])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map