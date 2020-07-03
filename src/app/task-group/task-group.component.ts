import { Component, OnInit, Input, Output, EventEmitter} 
  from '@angular/core';
import { Task } from '../task';


@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {

  @Input() group: string;
  @Input() tasks: Task[];
  //   this.group = tasks&&tasks[0]? this.tasks[0].status:undefined;
  @Output() 
   open: EventEmitter<{group:string,index:number}> = new EventEmitter()
 
  constructor() { }

  ngOnInit() {
  
  }

  openTask(index: number): void {
    //console.log('Before emit ',{group: this.group, index})
    this.open.emit({group: this.group, index});
  }

}
