import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, ExtraOptions } from "@angular/router";

import { AppComponent } from './app.component';


const routes:Routes = [
  {path: 'cojest/:orderBy/:dir/:amount', component: AppComponent},

  {path: '**', redirectTo: 'cojest/date&date&date/desc&desc&desc/5', pathMatch: 'full'}
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
