import { Component, ViewChild } from '@angular/core';
import { ToastController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapPage } from '../pages/map/map';
import { MapAdminPage } from '../pages/mapAdmin/mapAdmin';
import { AccountPage } from '../pages/account/account';
import { TrackerPage } from '../pages/tracker/tracker';
import { Events, AlertController  } from 'ionic-angular';
import { AuthService } from '../providers/auth-service/auth-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'LoginPage';
  logged:boolean = false;
  rootPageName: string = "";
  currentparam: number = 0;

  pages: Array<{title: string, icon: string, component: any, param: number, showed : boolean}>;

  constructor(private alertCtrl: AlertController, private auth: AuthService, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private toastCtrl: ToastController) {
    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'Account', icon: 'contact-custom', component: AccountPage , param: 0, showed : true},
      //{ title: 'MapAdmin', icon: 'contact-custom', component: MapAdminPage , param: 1},
      { title: 'Trackers', icon: 'location-custom', component: TrackerPage , param: 2, showed : false}
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      events.subscribe('log:change', (state) => {
        this.logged = state;
        if(this.logged) {
          this.auth.request("watch/read.php", {}).then(async data => {
            console.log(data);
            for(var m of data.maps) {
              this.pages.push({ title: (((await this.auth.getUserInfo()).logInfos.admin)?"Admin: ":"")+/*'Map: '+*/m.name, icon: 'map-custom', component: ((await this.auth.getUserInfo()).logInfos.admin)?MapAdminPage:MapPage, param: m.idMap, showed : true });
            }
            if(this.pages[2]!==undefined){
              this.rootPageName = this.pages[2].title;
              this.openPage(this.pages[2]);
            }
            else{
              this.rootPageName = this.pages[0].title;
              this.openPage(this.pages[0]);
            }
            //this.openMap(1,1);
            this.auth.getUserInfo().then(u => {
              this.pages[1].showed = u.logInfos.admin;
            });
          });
        }
        else {
          this.pages = [
            { title: 'Account', icon: 'contact-custom', component: AccountPage , param: 0, showed : true},
            //{ title: 'MapAdmin', icon: 'contact-custom', component: MapAdminPage , param: 1},
            { title: 'Trackers', icon: 'location-custom', component: TrackerPage , param: 2, showed : false}
          ];
          this.rootPageName = "";
          this.nav.setRoot('LoginPage', {});
        }
      });
      events.subscribe('alert:pop', (map, target) => {
        this.rootPageName = this.pages[2].title;
        this.openMap(map, target);
      });
      events.subscribe('menu:refresh', () => {
        this.refreshMenu();
      });
      events.subscribe('page:change',(page) => {
        this.rootPageName = this.pages[page].title;
        this.openPage(this.pages[page]);
      });
    });
  }

  isMapAdmin(){
    return this.rootPageName.match(/^Admin/);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //console.log("move" + page.param);
    this.rootPageName = page.title;
    this.currentparam = page.param;
    this.nav.setRoot(page.component, {
      param: page.param
    });
  }

  openMap(map, target) {
    this.rootPageName = this.pages[2].title;
    this.currentparam = map;
    this.nav.setRoot(this.pages[2].component, {
      param: map,
      add: target
    });
  }

  refreshMenu(){
     this.pages = [
      { title: 'Account', icon: 'contact-custom', component: AccountPage , param: 0, showed : true},
      //{ title: 'MapAdmin', icon: 'contact-custom', component: MapAdminPage , param: 1},
      { title: 'Trackers', icon: 'location-custom', component: TrackerPage , param: 2, showed : false}
    ];
    this.auth.request("watch/read.php", {}).then(async data => {
      console.log(data);
      for(var m of data.maps) {
        this.pages.push({ title: (((await this.auth.getUserInfo()).logInfos.admin)?"Admin: ":"")+/*'Map: '+*/m.name, icon: 'map-custom', component: ((await this.auth.getUserInfo()).logInfos.admin)?MapAdminPage:MapPage, param: m.idMap, showed : true });
      }
      this.auth.getUserInfo().then(u => {
        this.pages[1].showed = u.logInfos.admin;
      });
    });
  }

   logout() {
    this.auth.logout();
  }

  modifyTitle() {
  let alert = this.alertCtrl.create({
    title: 'Rename',
    inputs: [
      {
        name: 'Name',
        placeholder: this.rootPageName.substring(7),
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
        handler: data => {
          //this.events.publish('Map:Rename', data.Name);
          this.auth.request("map/update.php",{map: this.currentparam, name: data.Name}).then(dd => {
            if(dd.success) {
              this.rootPageName = "Admin: " + data.Name;
              this.refreshMenu();
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

  showToast(mes) {
    const toast = this.toastCtrl.create({
      message: mes,
      cssClass: 'toastaccount',
      position: 'bottom',
      duration: 5000
    });
    toast.present();
  }
}
