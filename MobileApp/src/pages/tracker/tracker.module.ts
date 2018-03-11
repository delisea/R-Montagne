import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackerPage } from './tracker';

@NgModule({
  declarations: [
    TrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackerPage),
  ],
})
export class AccountPageModule {}
