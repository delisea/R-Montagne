import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, NavParams, IonicPage, AlertController } from 'ionic-angular';
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


  constructor(private alertCtrl: AlertController, private auth: AuthService, public navParams: NavParams, private events: Events, private toastCtrl: ToastController) {
    //    console.log(navParams.get('param'));
    this.mapId = navParams.get('param');
    /*events.subscribe('Map:Rename', (name) => {
      this.auth.request("map/update.php",{map: 1, latitude: 1, longitude: 1});
    });*/
  }

  ionViewWillLeave() {
    this.events.unsubscribe('Admin:BorderMove');
    this.events.unsubscribe('Admin:BorderStopMove');
    this.events.unsubscribe('BeaconMap:SetMove');
    this.events.unsubscribe('BeaconMap:UnSetMove');
    this.events.unsubscribe('Admin:BorderDrag');
    this.events.unsubscribe("Beacon:add");
    this.events.unsubscribe("Point:add");
  }
  ionViewDidEnter() {
    this.events.subscribe('Admin:BorderMove', (latlon) => {this.SetBorderMove(latlon)});
    this.events.subscribe('Admin:BorderStopMove', (latlon) => {this.UnSetBorderMove(latlon)});
    this.events.subscribe('BeaconMap:SetMove', (latlon, idb) => {this.SetBeaconMove(latlon, idb)});
    this.events.subscribe('BeaconMap:UnSetMove', (latlon, idb) => {this.UnSetBeaconMove(latlon, idb)});
    this.events.subscribe('Admin:BorderDrag', (latlon) => {this.DragBorder(latlon)});
    this.events.subscribe("Beacon:add", () => this.addBeacon());
    this.events.subscribe("Point:add", () => this.addPoint());
    this.initmap();
    this.loadmap();
    var alrt = this.events;
    var customControl  = Leaflet.Control.extend({

      options: {
        position: 'topleft' 
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },

      onAdd: function (map) {
        var container = Leaflet.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';     
        container.text = "Add Beacon";
        container.style.text = "test";
        container.style.fontSize = "2rem";
        container.style.color = "grey";
        container.style.fontFamily = "'Oswald', sans-serif";
        container.style.textAlign = "center";
        //container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
        container.style.backgroundSize = "30px 30px";
        container.style.width = '120px';
        container.style.height = '30px';

        container.onclick = function(){
          alrt.publish("Beacon:add");
        }

        return container;
      },

    });
    var customControl2  = Leaflet.Control.extend({

      options: {
        position: 'topleft' 
        //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
      },

      onAdd: function (map) {
        var container = Leaflet.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';     
        container.text = "Add Point";
        container.style.text = "test";
        container.style.fontSize = "2rem";
        container.style.color = "grey";
        container.style.fontFamily = "'Oswald', sans-serif";
        container.style.textAlign = "center";
        //container.style.backgroundImage = "url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
        container.style.backgroundSize = "30px 30px";
        container.style.width = '120px';
        container.style.height = '30px';

        container.onclick = function(){
          alrt.publish("Point:add");
        }

        return container;
      },

    });
    this.map.addControl(new customControl());
    this.map.addControl(new customControl2());
  }

    addPoint() {
    let alert = this.alertCtrl.create({
    title: 'Confirm point addition',
    message: 'Do you want to add a point?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirm',
        handler: () => {
          this.PolygonPoints.push([this.map.getBounds().getCenter().lat, this.map.getBounds().getCenter().lng]);
          this.auth.request("MapPolygon/update.php",{map: this.mapId, points: JSON.stringify(this.PolygonPoints)}).then(dd => {
              if(dd.success) {
                this.map.removeLayer(this.PolygonImage)
                this.PolygonImage = Leaflet.featureGroup();
                var polygon = Leaflet.polygon(this.PolygonPoints, {color: '#b200ff88', fillColor: '#00000000'}).addTo(this.PolygonImage);
                this.map.addLayer(this.PolygonImage);


                this.map.removeLayer(this.markerPol);
                 var popupBeacon = document.createElement('button');
                popupBeacon.innerHTML = 'Tap to Move';
                let evt = this.events
                let x = [this.map.getBounds().getCenter().lat, this.map.getBounds().getCenter().lng]
                popupBeacon.onclick = function () {
                  evt.publish('Admin:BorderMove', x);}
                let marker = Leaflet.marker(this.map.getBounds().getCenter(), {icon: this.IconWhite}).bindPopup(popupBeacon,{closeButton:true});
                this.PolygonMarker.push(marker);
                this.markerPol.addLayer(marker);
                this.map.addLayer(this.markerPol);

                this.showToast("Done!");
              }
              else {
                this.showToast(dd.message);
              }
            });
        }
      }
    ]
  });
  alert.present();
  }



  addBeacon() {
    let alert = this.alertCtrl.create({
      title: 'Add Beacon',
      inputs: [
      {
        name: 'License',
        placeholder: "Beacon license code",
      }
      ],
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirm',
          handler: data => {//console.log(this.map.getBounds().getCenter(), this.mapId);
            //this.events.publish('Map:Rename', data.Name);
            this.auth.request("BeaconLicense/update.php",{map: this.mapId, latitude: this.map.getBounds().getCenter().lat, longitude: this.map.getBounds().getCenter().lng, license: data.License}).then(dd => {
              if(dd.success) {
                this.showToast("Done!");
                var popupBeacon = document.createElement('button');
                popupBeacon.innerHTML = 'Tap to Move';
                //customPopup = "<strong>Beacon</strong><br>"+e.latitude+" - "+e.longitude
                let evt = this.events;
                let marker = Leaflet.marker(this.map.getBounds().getCenter(), {icon: this.IconPurple}).bindPopup(popupBeacon,{closeButton:true})
                popupBeacon.onclick = function () {
                  evt.publish("BeaconMap:SetMove", marker);
                }
                this.map.removeLayer(this.markerBeacon);
                this.markerBeacon.addLayer(marker);
                this.map.addLayer(this.markerBeacon);
              }
              else {
                this.showToast(dd.message);
              }
            });
          }
        }
        ]
      });
    alert.present();
  }

  showToast(mes) {
    const toast = this.toastCtrl.create({
      message: mes,
      cssClass: 'toastaccount',
      position: 'bottom',
      duration: 5000
    });
    toast.present();
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
      case "Alerts":
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
          customPopup = "<strong>"+e.date+"</strong><br>"+e.latitude+" - "+e.longitude;
          let marker: any = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: this.IconRed}).bindPopup(customPopup,{closeButton:false})
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
          let evt = this.events;
          let showToast = this.showToast;
          let mapId = this.mapId;
          let idb = e.id;
          let marker = Leaflet.marker([Number(e.latitude), Number(e.longitude)]/*{lat: e.latitude, lon: e.longitude}*/, /*{icon:(Number(e.id)==2)?this.IconRed:this.IconBlue}*/{icon: this.IconPurple}).bindPopup(popupBeacon,{closeButton:true})
          popupBeacon.onclick = function () {
            evt.publish("BeaconMap:SetMove", marker, idb);
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
            if(i>0)
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

    popSetMove(marker: any, layer: any, popupMoving: any, icon: any, popSetMove: any, popUnSetMove: any, aut: any, showToast: any, mapId: any) {
      layer.removeLayer(marker);
      var popupBeacon = document.createElement('button');
      popupBeacon.innerHTML = 'Tap to Stop';
      popupBeacon.onclick = function () {
        popUnSetMove(marker, layer, popupBeacon, icon, popSetMove, popUnSetMove, aut, showToast, mapId);
      }
      marker = Leaflet.marker(marker.getLatLng(), {draggable: true, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
      layer.addLayer(marker);
    };

    popUnSetMove(marker: any, layer: any, popupMoving: any, icon: any, popSetMove: any, popUnSetMove: any, aut: any, showToast: any, mapId: any) {
      layer.removeLayer(marker);
      var popupBeacon = document.createElement('button');
      popupBeacon.innerHTML = 'Tap to Move';
      popupBeacon.onclick = function () {
        popSetMove(marker, layer, popupBeacon, icon, popSetMove, popUnSetMove, aut, showToast, mapId);
      }
      marker = Leaflet.marker(marker.getLatLng(), {draggable: false, icon: icon}).bindPopup(popupBeacon,{closeButton:true})
      layer.addLayer(marker);
      aut.request("map/update.php",{map: mapId, latitude: marker.getLatLng().lat, longitude: marker.getLatLng().lng}).then(dd => {
        if(dd.success) {
          showToast(dd.message);
        }
        else {
          showToast(dd.message);
        }
      });
    };


    UnSetBeaconMove(marker: any, idb: any) {console.log("unset")
      let evt = this.events;
      this.markerBeacon.removeLayer(marker);
      var popupBeacon = document.createElement('button');
      popupBeacon.innerHTML = 'Tap to Move';
      marker = Leaflet.marker(marker.getLatLng(), {draggable: false, icon: this.IconPurple}).bindPopup(popupBeacon,{closeButton:true})
      popupBeacon.onclick = function () {
        evt.publish("BeaconMap:SetMove", marker, idb);
      }
      this.markerBeacon.addLayer(marker);
      this.auth.request("beacon/update.php",{map: this.mapId, latitude: marker.getLatLng().lat, longitude: marker.getLatLng().lng, id: idb}).then(dd => {
        if(dd.success) {
          this.showToast(dd.message);
        }
        else {
          this.showToast(dd.message);
        }
      });
    };

    SetBeaconMove(marker: any, idb: any) {console.log("set")
      let evt = this.events;
      this.markerBeacon.removeLayer(marker);
      var popupBeacon = document.createElement('button');
      popupBeacon.innerHTML = 'Tap to Stop';
      marker = Leaflet.marker(marker.getLatLng(), {draggable: true, icon: this.IconPurple}).bindPopup(popupBeacon,{closeButton:true})
      popupBeacon.onclick = function () {
        evt.publish("BeaconMap:UnSetMove", marker, idb);
      }
      this.markerBeacon.addLayer(marker);
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
      this.PolygonPoints[index] = [this.PolygonMarker[index].getLatLng().lat,this.PolygonMarker[index].getLatLng().lng];
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
      this.auth.request("MapPolygon/update.php",{map: this.mapId, points: JSON.stringify(this.PolygonPoints)}).then(dd => {
        if(dd.success) {
          this.showToast(dd.message);
        }
        else {
          this.showToast(dd.message);
        }
      });
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
