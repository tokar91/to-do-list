import { Component, OnInit } from '@angular/core';
import  { Task } from './task';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  cols: number = 2;
  active: {
    oncoming: boolean,
    pending: boolean,
    completed: boolean
  };
  groupToHide: 'oncoming'|'completed' = 'oncoming';
  oncoming: Task[];
  pending: Task[];
  completed: Task[];

  constructor(public tasksService: TasksService){}

  ngOnInit(){
    //  this.tasksService.loglog(); to naprawilo błąd not a function..

    switch (this.cols){
      case 1 : this.active = {
          oncoming: true,
          pending: false,
          completed: false
        };
        break;
      case 2 : this.active = {
          oncoming: true,
          pending: true,
          completed: false
        };
        break;
      default : this.active = {
        oncoming: true,
        pending: true,
        completed: true
      };
    }

    this.tasksService.getTasks('oncoming', 'orderBy', 'dir', 1, 1)
    .then(tasks=>this.oncoming = tasks);

    this.tasksService.getTasks('pending', 'orderBy', 'dir', 1, 1)
    .then(tasks=>this.pending= tasks);

    this.tasksService.getTasks('completed', 'orderBy', 'dir', 1, 1)
    .then(tasks=>this.completed = tasks);
  }

  showGroup(group: string){
    if(this.cols===3) return;
    if(!this.active[group])
      switch(group){
        case 'oncoming': 
          if(this.cols===1)
            this.active = {oncoming: true, pending: false, completed: false};
          else
            this.active = {oncoming: true, pending: false, completed: true};
          break;
        case 'pending':
          if(this.cols===1)
            this.active = {oncoming: false, pending: true, completed: false};
          else if(this.groupToHide==='oncoming'){
            this.active = {oncoming: false, pending: true, completed: true};
            this.groupToHide = 'completed';
          }else if(this.groupToHide==='completed'){
            this.active = {oncoming: true, pending: true, completed: false};
            this.groupToHide = 'oncoming';
          }
          break;
        case 'completed': 
          if(this.cols===1)
            this.active = {oncoming: false, pending: false, completed: true};
          else
            this.active = {oncoming: true, pending: false, completed: true};
      }
  }

  /* disposeGroup(status: string, tasks: Task[]): void {
    switch(status){
      case 'oncoming':  this.col1 = tasks; 
                        break;
      case 'pending' :  if(this.cols===1) {this.col1 = tasks;
                          console.log('Przypisano tasks do col1');
                        }
                        else this.col2 = tasks;
                        break;
      case 'completed': if(this.cols===1) this.col1 = tasks;
                        else if(this.cols===2) this.col2 = tasks;
                        else this.col3 = tasks;
    }
  }
  */
}
