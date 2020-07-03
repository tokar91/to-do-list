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
  
  newTask: {[key:string]: string};
  newTaskCopy: {[key:string]: string};
  taskToEdit: {[key:string]: string};
  taskCopy: {[key:string]: string};
  //openedTask: {[key:string]: string};
  data: {[key:string]: any};

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
  
  addTask():void {
    if(!this.newTask||!this.newTaskCopy){
      let date = new Date();
      let numb = date.getTime();
      let diff = -date.getTimezoneOffset()*60000;
      let datestr = new Date(numb+diff).toISOString().slice(0,16);
      this.newTask = {
        name: '',
        status: 'do zrobienia',
        desc: '',
        date: datestr,
        prior: 'średni'
      };
      this.newTaskCopy = Object.assign({}, this.newTask);
    }
    this.data = {mode: 'write', 
                 task: this.newTask,
                 copy: this.newTaskCopy};
  } 
  
  openTask(obj:{group:string,index:number}):void {
   // console.log(obj);
    let group = obj.group;
    let index = obj.index;
    let openedTask: Task = this[group][index]; //lepiej originalTask
    if(this.taskCopy&&this.taskToEdit&&  //tymczasowe porownywanie
       this.taskCopy.name===openedTask.name&&
       this.taskCopy.status===openedTask.status&&
       this.taskCopy.desc===openedTask.desc&&
       this.taskCopy.date===openedTask.date&&
       this.taskCopy.prior===openedTask.prior)
      this.data = {mode: 'write', 
                   task: this.taskToEdit,
                   copy: this.taskCopy};
    else{
      this.taskToEdit = Object.assign({},this[group][index]);
      this.taskCopy = Object.assign({},this[group][index]);
      // this.taskCopy resetuje edycję w task component
      // i tymczasowo rozpoznaje edytowany task na liscie
      // pozniej lepiej zamienic na originalTask
      this.data = {mode: 'read', 
                   task: this.taskToEdit,
                   copy: this.taskCopy};
    }

  }

}
