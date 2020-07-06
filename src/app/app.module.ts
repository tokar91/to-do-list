import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRippleModule, MatCheckboxModule, MatInputModule}
  from '@angular/material';
import {MatButtonModule} from '@angular/material/button'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { TaskGroupComponent } from './task-group/task-group.component';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
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
    ToDoListComponent,
    TaskGroupComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatRippleModule, MatCheckboxModule, MatInputModule,
    MatButtonModule,MatSelectModule,MatFormFieldModule,
    DragDropModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
