import { Component } from '@angular/core';
import { NavController, IonicPage, ToastController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-tracker',
  templateUrl: 'tracker.html',
})
export class TrackerPage {
  createSuccess = false;
  credentials: any;
  nbdays: any;
  isMo = false;
  trackers;
  activation = { licenses : null, map : null, days : null };
  maps = { idMap: [], name: [] };
  m;
  freeTrackers = 0;

  constructor(private nav: NavController, private auth: AuthService, public events: Events,  private toastCtrl: ToastController) {
    this.auth.request("watch/read.php", {}).then(data => {
      if(data !== null) {
        this.maps = data.maps;
      }
    });

    this.auth.request('tracker/read.php', {}).then(data => {
      if(data !== null){
        this.trackers = data.trackers;
        for(let t of this.trackers){
          if(t.ended)
            this.freeTrackers += 1;
        }
      }
    });
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

  addLicenses(){
    this.isMo = true;
  }

  cancelActivation(){
    this.isMo = false;
    this.activation = { licenses : null, map : null, days : null };
  }

  addActivation(){
    this.isMo = false;
    if(this.activation.days>0){
      this.auth.request('licenseTemp/post.php', {licenses: this.activation.licenses, map: this.activation.map, days: this.activation.days}).then(data => {
        if(data.success){
          this.showToast(this.activation.licenses+' Trackers Activated');
          this.freeTrackers = this.freeTrackers - this.activation.licenses;
          this.activation = { licenses : null, map : null, days : null };
          this.events.publish('page:change', 2);
        }
        else{
          this.showToast(data.error);
          this.activation = { licenses : null, map : null, days : null };
        }
      });
    }
    else{
      this.showToast('Number of days must be positive');
      this.activation.days = null;
    }
  }
}
