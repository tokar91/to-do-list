import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  
  mode: 'read'|'write' = 'read';
  task: {[key:string]:any} = {}// type of class Task doesnt fit yet 
   // - default object for new task possible
  @Input() set data (data:{[key:string]:any}){
    this.mode = data.mode;
    this.task = data.task;
  }
  @Output() close: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  
  edit():void{
    this.mode = 'write';
  }

  delete():void{

  }

  cancel():void{
    this.close.emit();
  }

  save():void{

  }



}
