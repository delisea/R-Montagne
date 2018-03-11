import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapAdminPage } from './mapAdmin';

@NgModule({
  declarations: [
    MapAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(MapAdminPage),
  ],
})
export class MapAdminPageModule {}
