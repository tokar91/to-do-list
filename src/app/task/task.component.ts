import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  
  mode: 'read'|'write';
  initialMode: 'read'|'write';
  task: {[key:string]:string};// type of class Task doesnt fit yet 
   // - default object for new task possible
  copy: {[key:string]:string};
  @Input() set data (data:{[key:string]:any}){
    this.mode = data.mode;
    this.initialMode = data.mode;
    this.task = data.task;
    this.copy = data.copy;
  }
  @Output() close: EventEmitter<any> = new EventEmitter();
  //@Output() copy: EventEmitter<Task> = new EventEmitter();
  //@Output() edited: EventEmitter<{[key:string]:any}> = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
  }
  
  closeWin(){
    //if(this.initialMode==='read') this.edited.emit(this.task)
    this.close.emit();
  }
  
  edit():void{
   // this.task = <any>Object.assign({},this.task);
   // this.copy.emit(<any>this.initialTask);
    this.mode = 'write';
  }
  delete():void{
    // POTRZEBUJE ID DOKUMENTU
   // console.log('nothing...');
  }

  cancel():void{
   // if(this.initialMode==='read'){
   //   this.copy.emit(undefined);
   //   this.edited.emit(undefined);
   // }
    for(let prop in this.task){
      this.task[prop] = this.copy[prop];
    }
    
  }
  save():void{
    this.mode = 'read';
    // POTRZEBUJE ID DOKUMENTU W FIREBASE PRZY EDYCJI LUB NOWY TWORZE
   // console.log('mode=read');
  }









}
