import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";

import { ToDoListComponent } from './to-do-list/to-do-list.component';



const routes:Routes = [
  {path: ':orderBy/:dir/:amount', component: ToDoListComponent},

  {path: '**', redirectTo: '/date&date&date/desc&desc&desc/5', pathMatch: 'full'}
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
