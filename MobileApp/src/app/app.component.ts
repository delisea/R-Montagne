import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapPage } from '../pages/map/map';
import { AccountPage } from '../pages/account/account';
import { Events } from 'ionic-angular';
import { AuthService } from '../providers/auth-service/auth-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'LoginPage';
  logged:boolean = false;
  rootPageName: string = "";

  pages: Array<{title: string, icon: string, component: any, param: number}>;

  constructor(private auth: AuthService, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Account', icon: 'contact-custom', component: AccountPage , param: 0}
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      events.subscribe('log:change', (state) => {
        this.logged = state;
        if(this.logged) {
          this.auth.request("watch/read.php", {}).subscribe(data => {
            //console.log(data);
            for(var m of data.maps) {
              this.pages.push({ title: /*'Map: '+*/m.name, icon: 'map-custom', component: MapPage, param: m.idMap });
            }
            this.rootPageName = this.pages[1].title;
            this.openPage(this.pages[1]);
          });
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //console.log("move" + page.param);
    this.rootPageName = page.title;
    this.nav.setRoot(page.component, {
      param: page.param
    });
  }

   logout() {
    this.auth.logout();
  }
}
