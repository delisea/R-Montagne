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
var MapPage = /** @class */ (function () {
    function MapPage(navCtrl, auth) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.username = '';
        //let info = this.auth.getUserInfo();
        this.username = 'JF';
    }
    MapPage.prototype.ionViewDidEnter = function () {
        this.loadmap();
    };
    MapPage.prototype.loadmap = function () {
        var _this = this;
        this.map = Leaflet.map("map", { attributionControl: false }).fitWorld();
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
        this.map.locate({
            setView: true,
            maxZoom: 16
        }).on('locationfound', function (e) {
            var customPopup = "<strong>" + _this.username + "</strong><br>" + e.latitude.toFixed(5) + " - " + e.longitude.toFixed(5);
            var markerGroup = Leaflet.featureGroup();
            var marker = Leaflet.marker([e.latitude, e.longitude], { icon: IconGreen }).bindPopup(customPopup, { closeButton: false });
            markerGroup.addLayer(marker);
            _this.map.addLayer(markerGroup);
        }).on('locationerror', function (err) {
            alert(err.message);
        });
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
        __metadata("design:paramtypes", [NavController, AuthService])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map