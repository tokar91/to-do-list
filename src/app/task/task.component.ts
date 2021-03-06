import { Component, Input, Output, EventEmitter} from '@angular/core';
import { TaskObj } from '../task-obj';
import { DataToOpen } from '../data-to-open';
import { TasksService } from '../tasks.service';
import { trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  animations: [
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: 0}), animate(600)])
    ])
  ]
})
export class TaskComponent {
  
  dateOff: boolean = true;

  mode: 'read'|'write';
  fromList: boolean;
  originalTask: TaskObj;
  //editedTask: TaskObj;
  task: TaskObj;
  @Input() set data (data: DataToOpen){
      this.mode = data.mode;
      this.fromList = data.fromList;
      if(this.fromList) this.dateOff = false;
      if(data.editedTask){
        this.originalTask = data.originalTask;
        this.task = data.editedTask;
      }
      else this.task = data.originalTask;
  }
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() saveEditedRef: EventEmitter<TaskObj> = 
              new EventEmitter();
  @Output() deleteEditedRef: EventEmitter<string|null> = new EventEmitter();

  
  constructor(private tasksService: TasksService) { }

  closeWin(){
    this.close.emit();
  }
  
  edit():void{
    this.originalTask = this.task;
    if(!this.task.data.date) this.dateOff = true;
    this.task = {id: this.task.id, 
                 data: {...this.task.data}};
    this.saveEditedRef.emit(this.task);
    this.mode = 'write';
  }

  delete():void{
    this.tasksService.deleteTask(this.task.data.status, this.task.id);
    this.close.emit();
  }

  cancel():void{
    if(this.fromList&&this.originalTask.data.date) this.dateOff = false;
    if(this.fromList&&!this.originalTask.data.date||
       !this.fromList) this.dateOff = true;
    for(let prop in this.task.data){
      this.task.data[prop] = this.originalTask.data[prop];
      
    }
    
  }
  save():void{
    if(this.dateOff) this.task.data.date = '';
    if(!this.task.data.name.trim()) return;
    this.tasksService.setTask(this.task.data.status, this.task);
    if(this.fromList&&
       this.task.data.status!==this.originalTask.data.status){
      this.tasksService.deleteTask(this.originalTask.data.status, 
        this.task.id);
    }
    this.deleteEditedRef.emit(this.fromList?this.task.id:null);
    this.close.emit();
  }









}
