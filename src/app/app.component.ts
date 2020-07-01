import { Component, OnInit } from '@angular/core';
import  { Task } from './task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  cols = 3;
  
  constructor(){}

  ngOnInit(){
  //  let taskInst: Task = new Task('Powiesić pranie', '', '  ', '01-07-2020');
  //  console.log(taskInst);
  }



}
