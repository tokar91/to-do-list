import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskGroupComponent } from './task-group/task-group.component';
import { TaskComponent } from './task/task.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';


var firebaseConfig = {
  apiKey: "AIzaSyDxtod-XBIDJGvq5ldUbZVKfTFMvoU-hPY",
  authDomain: "to-do-list-4aa04.firebaseapp.com",
  databaseURL: "https://to-do-list-4aa04.firebaseio.com",
  projectId: "to-do-list-4aa04",
  storageBucket: "to-do-list-4aa04.appspot.com",
  messagingSenderId: "648717695842",
  appId: "1:648717695842:web:46059643da313c40b74a3b"
};

@NgModule({
  declarations: [
    AppComponent,
    TaskGroupComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
