import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav } from 'ionic-angular';
import { MapPage } from '../map/map';
import { AccountPage } from '../account/account';
import { App } from 'ionic-angular';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
  pageComponent: any;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  // Basic root for our content view
  rootPage = MapPage;

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    { title: 'Map', pageName: 'MapPage', tabComponent: 'MapPage', index: 0, icon: 'map-custom', pageComponent: MapPage },
    { title: 'Account', pageName: 'AccountPage', tabComponent: 'AccountPage', index: 1, icon: 'contact-custom', pageComponent: AccountPage }
  ];

  constructor(private app:App, public navCtrl: NavController) { }

  openPage(page: PageInterface) {
    let params = {};

    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
    } else {
      // Tabs are not active, so reset the root page
      // In this case: moving to or from SpecialPage
      //this.nav.setRoot(page.pageName, params);
      this.app.getRootNav().setRoot(page.pageComponent);
    }
  }

  isActive(page: PageInterface) {
    // Again the Tabs Navigation
    let childNav = this.nav.getActiveChildNav();

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    // Fallback needed when there is no active childnav (tabs not active)
    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary';
    }
    return;
  }

}

/*
const tabsNav = this.app.getNavByIdOrName('myTabsNav') as Tabs;
tabsNav.select(1);

---

<ion-tabs name="myTabsNav">
...
</ion-tabs>
*/
