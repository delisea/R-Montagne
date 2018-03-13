import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';
import Leaflet from 'leaflet';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'mapAdmin.html'
})
export class MapAdminPage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  mapId: number;
  selectedFilter: string = "All";
  markerBeacon;
  markerCurrent;
  markerHisto;
  markerMe;
  markerPol;

  IconGreen: any;
  IconRed: any;
  IconGrey: any;
  IconPurple: any;
  IconBlue: any;
  IconWhite: any;

  PolygonPoints = [];
  PolygonImage = undefined;
  PolygonMarker = [];


  constructor(private auth: AuthService, public navParams: NavParams, private events: Events) {
    //    console.log(navParams.get('param'));
    this.mapId = navParams.get('param');
    events.subscribe('Admin:BorderMove', (latlon) => {this.SetBorderMove(latlon)});
    events.subscribe('Admin:BorderStopMove', (latlon) => {this.UnSetBorderMove(latlon)});
    events.subscribe('Admin:BorderDrag', (latlon) => {this.DragBorder(latlon)});
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
      iconUrl: "../../assets/imgs/pointer_green.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconRed = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_red.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconGrey = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_grey.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconPurple = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_purple.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconBlue = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_blue.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });

    this.IconWhite = Leaflet.icon({
      iconUrl: "../../assets/imgs/pointer_orange.png",
      iconSize: [30, 30], // size of the icon
      iconAnchor: [15, 30]
    });
  }


  alert(p) {
    console.log(p);
  }

  polygon: any;

  loadmap() {
    var mymap = this.map;

//     mymap.on('click',
//   function mapClickListen(e) {
//     var pos = e.latlng;
//     console.log('map click event');
//     var marker = Leaflet.marker(
//       pos, {
//         draggable: true
//       }
//     );
//     marker.on('drag', function(e) {
//       console.log('marker drag event');
//     });
//     marker.on('dragstart', function(e) {
//       console.log('marker dragstart event');
//       mymap.off('click', mapClickListen);
//     });
//     marker.on('dragend', function(e) {
//       console.log('marker dragend event');
//       setTimeout(function() {
//         mymap.on('click', mapClickListen);
//       }, 10);
//     });
//     marker.addTo(mymap);
//   }
// );

/*mymap.on('click',
  function mapClickListen(e) {
    var pos = e.latlng;
    console.log('map click event');
    var marker = Leaflet.marker(
      pos, {
        draggable: true
      }
    );
    marker.on('drag', function(e) {
      console.log('marker drag event');
    });
    marker.on('dragstart', function(e) {
      console.log('marker dragstart event');
      mymap.off('click', mapClickListen);
    });
    marker.on('dragend', function(e) {
      console.log('marker dragend event');
      setTimeout(function() {
        mymap.on('click', mapClickListen);
      }, 10);
    });
    marker.addTo(mymap);
  }
  );*/

  this.auth.request("generic/getInfo.php", {map : this.mapId}).then(data => {
    console.log(data);
        //let markerGroup = Leaflet.featureGroup();
        this.markerBeacon = Leaflet.featureGroup();
        this.markerCurrent = Leaflet.featureGroup();
        this.markerHisto = Leaflet.featureGroup();
        this.markerMe = Leaflet.featureGroup();
        this.markerPol = Leaflet.featureGroup();
        // let marker: any = Leaflet.marker([e.latitude, e.longitude], {icon:IconGreen}).bindPopup(customPopup,{closeButton:false})
        let id  = 0
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
        }
        for (let e of data.beacons) {
          var popupBeacon = document.createElement('button');
          popupBeacon.innerHTML = 'Tap to Move';
          //customPopup = "<strong>Beacon</strong><br>"+e.latitude+" - "+e.longitude
          let tl = this.markerBeacon;
          let ti = this.IconPurple;
          let f1 = this.popSetMove;
          let f2 = this.popUnSetMove;
          let marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: this.IconPurple}).bindPopup(popupBeacon,{closeButton:true})
          popupBeacon.onclick = function () {
            f1(marker, tl, popupBeacon, ti, f1, f2);
            //console.log(marker.customprop)
            //console.log(42);
            //return false;
             //var pos = e.latlng;
             /*var marker = Leaflet.marker(
               [e.latitude, e.longitude]/*pos*//*, {
                 draggable: true
               }
               );*/
             /*console.log(marker);
             console.log(marker.options);
          marker.options.draggable = false;
             console.log(marker.options);
          marker.options.draggable = false;
          console.log(marker);*/
             //mymap.removeLayer(marker);
             //tl.removeLayer(marker);
             //marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)], {draggable: true, icon: ti}).bindPopup(popupBeacon,{closeButton:true})
             //tl.addLayer(marker);
           };
          //marker.options.draggable = false;
          // marker.options.draggable = true;
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
        this.auth.request("map/get.php", {map : this.mapId/*data.self[0].map*/}).then(data => {
          var i = 0;
          this.PolygonImage = Leaflet.featureGroup();
          for(var point of data.map.polygon) {
            this.PolygonPoints.push([point.longitude, point.latitude]);
            customPopup = document.createElement('button');
            customPopup.innerHTML = 'Tap to Move';
            this.PolygonMarker[i] = Leaflet.marker([point.longitude, point.latitude], {icon: this.IconWhite}).bindPopup(customPopup,{closeButton:false})

            let tl = this.markerPol;
            let ti = this.IconWhite;
            let f1 = this.PpopSetMove;
            let f2 = this.PpopUnSetMove;
            let evt = this.events;
            let pollayer = this.PolygonImage
            let pp = this.PolygonMarker[i]
            let x = [point.longitude, point.latitude]
            customPopup.onclick = function () {
              evt.publish('Admin:BorderMove', x);
              //f1(pp, tl, customPopup, pollayer, i, ti, f1, f2);
            }
            this.markerPol.addLayer(this.PolygonMarker[i]);
            i = i + 1;
          }

          var polygon = Leaflet.polygon(this.PolygonPoints, {color: '#b200ff88', fillColor: '#00000000'}).addTo(this.PolygonImage);
          this.map.addLayer(this.PolygonImage);
          this.map.addLayer(this.markerPol);
            // zoom the map to the polygon
            this.map.fitBounds(polygon.getBounds());
            //this.map.setView([Number(data.map.centerLatitude), Number(data.map.centerLongitude)], data.map.zoom)
          });
        //}
      },
      error => {
        console.log(error);
      });

      /*var popup = Leaflet.popup();

      function onMapClick(e) {
          popup
              .setLatLng(e.latlng)
              .setContent("You clicked the map at " + e.latlng.toString() + " ")
              .openOn(mymap);
              console.log(e)
            }*/

      //this.map.on('click', onMapClick);
    }

  popSetMove(marker: any, layer: any, popupMoving: any, icon: any, popSetMove: any, popUnSetMove: any) {
    layer.removeLayer(marker);
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Stop';
    popupBeacon.onclick = function () {
      popUnSetMove(marker, layer, popupBeacon, icon, popSetMove, popUnSetMove);
    }
    marker = Leaflet.marker(marker.getLatLng(), {draggable: true, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
    layer.addLayer(marker);
  };

  popUnSetMove(marker: any, layer: any, popupMoving: any, icon: any, popSetMove: any, popUnSetMove: any) {
    layer.removeLayer(marker);
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Move';
    popupBeacon.onclick = function () {
      popSetMove(marker, layer, popupBeacon, icon, popSetMove, popUnSetMove);
    }
    marker = Leaflet.marker(marker.getLatLng(), {draggable: false, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
    layer.addLayer(marker);
  };


  PpopSetMove(marker: any, layer: any, popupMoving: any, polygon: any, order: any, icon: any, popSetMove: any, popUnSetMove: any) {
    layer.removeLayer(marker);
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Stop';
    popupBeacon.onclick = function () {
      popUnSetMove(marker, layer, popupBeacon, polygon, order, icon, popSetMove, popUnSetMove);
    }
    marker = Leaflet.marker(marker.getLatLng(), {draggable: true, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
    layer.addLayer(marker);
  };

  PpopUnSetMove(marker: any, layer: any, popupMoving: any, polygon: any, order: any, icon: any, popSetMove: any, popUnSetMove: any) {
    layer.removeLayer(marker);
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Move';
    popupBeacon.onclick = function () {
      popSetMove(marker, layer, popupBeacon, polygon, order, icon, popSetMove, popUnSetMove);
    }
    marker = Leaflet.marker(marker.getLatLng(), {draggable: false, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
    layer.addLayer(marker);
  };



  DragBorder(lonlat: any) {
    var index = this.PolygonPoints.findIndex(d => d[0] === lonlat[0] && d[1] === lonlat[1])
    this.map.removeLayer(this.PolygonImage)
    let tempPol = Object.assign([], this.PolygonPoints);
    tempPol[index] = this.PolygonMarker[index].getLatLng()
    this.PolygonImage = Leaflet.featureGroup();
    var polygon = Leaflet.polygon(tempPol, {color: '#b200ff88', fillColor: '#00000000'}).addTo(this.PolygonImage);
    this.map.addLayer(this.PolygonImage);
  }

  UnSetBorderMove(lonlat: any) {
    var index = this.PolygonPoints.findIndex(d => d[0] === lonlat[0] && d[1] === lonlat[1])
    this.map.removeLayer(this.PolygonImage)
    this.markerPol.removeLayer(this.PolygonMarker[index]);
    this.PolygonPoints[index] = this.PolygonMarker[index].getLatLng()
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Move';
    let evt = this.events
    let ll = this.PolygonMarker[index].getLatLng()
    popupBeacon.onclick = function () {
      evt.publish('Admin:BorderMove', ll);
    }
    this.PolygonImage = Leaflet.featureGroup();
    var polygon = Leaflet.polygon(this.PolygonPoints, {color: '#b200ff88', fillColor: '#00000000'}).addTo(this.PolygonImage);
    this.map.addLayer(this.PolygonImage);
    this.PolygonMarker[index] = Leaflet.marker(this.PolygonMarker[index].getLatLng(), {draggable: false, icon: this.IconWhite}).bindPopup(popupBeacon,{closeButton:true})
    this.markerPol.addLayer(this.PolygonMarker[index]);
  }

  SetBorderMove(lonlat: any) {
    var index = this.PolygonPoints.findIndex(d => d[0] === lonlat[0] && d[1] === lonlat[1])
    this.markerPol.removeLayer(this.PolygonMarker[index]);
    var popupBeacon = document.createElement('button');
    popupBeacon.innerHTML = 'Tap to Stop';
    let evt = this.events
    popupBeacon.onclick = function () {
      evt.publish('Admin:BorderStopMove', lonlat);
    }
    this.PolygonMarker[index] = Leaflet.marker(this.PolygonMarker[index].getLatLng(), {draggable: true, icon: this.IconWhite}).bindPopup(popupBeacon,{closeButton:true})
    this.PolygonMarker[index].on('drag', function(e) {
        evt.publish('Admin:BorderDrag', lonlat);
     });
    this.markerPol.addLayer(this.PolygonMarker[index]);
  }
}
