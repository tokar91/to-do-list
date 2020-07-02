import { Component, OnInit, Input} from '@angular/core';
import { Task } from '../task';


@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {

  @Input() tasks: Task[];

  constructor() { }

  ngOnInit() {
  }



}
