import { Component, OnInit, Input, Output, EventEmitter} 
  from '@angular/core';
import { Task } from '../task';
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
                            .subscribe(val=>this.tasks=val); 
                            console.log('oncoming resp');break;
          case 'pending'  : this.tasksService.pending$
                            .subscribe(val=>this.tasks=val); 
                            console.log('pending resp');break;
          case 'completed': this.tasksService.completed$
                            .subscribe(val=>this.tasks=val);
                            console.log('completed resp');
        };
        this._group = group;
      }
  }

  tasks: {id: string, data: Task}[];
  editedTasks: {[key:string]:{id: string, data: Task}} = {};
  dataToOpen: {mode: 'read'|'write', fromList: boolean, 
         originalTask: {id: string, data: Task}, 
         editedTask?: {id: string, data: Task}}
  
  @Output() 
   open: EventEmitter<{group:string,index:number}> = new EventEmitter()


  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksService.getTasks(this._group,'date','desc',3,3)
  }


  openTask(task: {id: string, data: Task}):void {
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

  saveEditedRef(editedTaskRef: {id: string, data: Task}):void {
     this.editedTasks[editedTaskRef.id] = editedTaskRef;
  }
  deleteEditedRef(id: string){
     delete this.editedTasks[id];
  }

}
