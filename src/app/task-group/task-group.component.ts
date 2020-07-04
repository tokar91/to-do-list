import { Component, OnInit, Input, Output, EventEmitter} 
  from '@angular/core';
import { Task } from '../task';
import { TaskObj } from '../task-obj';
import { TasksService } from '../tasks.service';


@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {

  _group: string;
  @Input() set group(group:string){
      if(!this._group){
        switch(group){
          case 'oncoming' : this.tasksService.oncoming$
                            .subscribe(val=>this.tasks=val);break;
          case 'pending'  : this.tasksService.pending$
                            .subscribe(val=>this.tasks=val);break;
          case 'completed': this.tasksService.completed$
                            .subscribe(val=>this.tasks=val);
        };
        this._group = group;
      }
  }
  @Input params: {orderBy:string, dir: string, amount: number};

  tasks: TaskObj[];
  editedTasks: {[key:string]:TaskObj} = {};
  dataToOpen: {mode: 'read'|'write', fromList: boolean, 
         originalTask: TaskObj, editedTask?: TaskObj}
   
  noPrevPage: boolean = true;
  noNextPage: boolean = false;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksService.noPrevPage$.subscribe(
      group => {if(!group.indexOf(this._group)) 
                this.noPrevPage = Boolean(+group.slice(-1));}
    )
    this.tasksService.noNextPage$.subscribe(
      group => {if(!group.indexOf(this._group)) 
                this.noNextPage = Boolean(+group.slice(-1));}
    )
    this.tasksService.getTasks(this._group,'date','asc',5);
  }

  openTask(task: TaskObj):void {
    if(task.id in this.editedTasks){
      this.dataToOpen = {
        mode: 'write',
        fromList: true,
        originalTask: task,
        editedTask: this.editedTasks[task.id]
      };
    }
    else this.dataToOpen = {mode: 'read',
                            fromList: true,
                            originalTask: task}
  }

  saveEditedRef(editedTaskRef: TaskObj):void {
     this.editedTasks[editedTaskRef.id] = editedTaskRef;
  }
  deleteEditedRef(id: string){
     delete this.editedTasks[id];
  }

  next():void {
    if(this.noNextPage) return;
    this.noPrevPage = false;
    
    let tasksLen = this.tasks.length;
    let lastVal = 
     'date'==='date'?this.tasks[tasksLen-1].data.date:
                     this.tasks[tasksLen-1].sortPrior;

    this.tasksService.getTasks(this._group,'date','asc',
      5, 'next', lastVal);
  }


  prev():void{
    if(this.noPrevPage) return;
    this.noNextPage = false;

    let firstVal = 
    'date'==='date'?this.tasks[0].data.date:this.tasks[0].sortPrior;
  
      this.tasks[0]['date'==='date'?`data.${'date'}`:'sortPrior']  // WPROWADZIC
    this.tasksService.getTasks(this._group,'date','asc',
    5, 'prev', firstVal);
  }

}
