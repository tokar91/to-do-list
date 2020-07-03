import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  
  mode: 'read'|'write';
  fromList: boolean;
  originalTask: {id: string, data: Task};
  editedTask: {id: string, data: Task};
  task: {id: string, data: Task};
  @Input() set data (data:{mode: 'read'|'write', fromList: boolean, 
    originalTask: {id: string, data: Task}, 
    editedTask?: {id: string, data: Task}}){
      this.mode = data.mode;
      this.fromList = data.fromList;
      if(data.editedTask){
        this.originalTask = data.originalTask;
        this.task = data.editedTask;
      }
      else this.task = data.originalTask;
  }
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() saveEditedRef: EventEmitter<{id: string, data: Task}> = 
              new EventEmitter();
  @Output() deleteEditedRef: EventEmitter<string|null> = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
  }
  
  closeWin(){
    this.close.emit();
  }
  
  edit():void{
    this.originalTask = this.task;
    this.task = {id: this.task.id, 
                 data: Object.assign({}, this.task.data)};
    this.saveEditedRef.emit(this.task);
    this.mode = 'write';
  }

  delete():void{
    this.close.emit();
    // po prostu usunac i odswiezyc tabele getTasks..

  }

  cancel():void{
    for(let prop in this.task.data){
      this.task.data[prop] = this.originalTask.data[prop];
    }
    
  }
  save():void{
    
    if(this.fromList){
      
       //firebase update 
    }else {
     
    // firebase add

    }

    this.deleteEditedRef.emit(this.fromList?this.task.id:null);
    this.close.emit();
  }









}
