import { Component, OnInit } from '@angular/core';
import  { Task } from './task';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  cols: number = 3;
  activeStatus: 'oncoming'|'pending'|'completed' = 'oncoming';
  col1: Task[];
  col2: Task[];
  col3: Task[];

  constructor(public tasksService: TasksService){}

  ngOnInit(){
    //  this.tasksService.loglog(); to naprawilo błąd not a function..
      this.tasksService.getTasks('completed', 'orderBy', 'dir', 1, 1)
      .then(tasks=>this.disposeGroup('completed', tasks))
  }


  disposeGroup(status: string, tasks: Task[]): void {
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

}
