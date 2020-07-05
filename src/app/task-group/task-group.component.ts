import { Component, OnInit, Input, Output, EventEmitter} 
  from '@angular/core';
import { Task } from '../task';
import { TaskObj } from '../task-obj';
import { TasksService } from '../tasks.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {

  _group: string;
  _groupIndex: number;
  @Input() set group(group:string){
      if(!this._group){
        switch(group){
          case 'oncoming' : this.tasksService.oncoming$
                            .subscribe(val=>this.tasks=val);
                            this._groupIndex = 0;
                            break;
          case 'pending'  : this.tasksService.pending$
                            .subscribe(val=>this.tasks=val);
                            this._groupIndex = 1;
                            break;
          case 'completed': this.tasksService.completed$
                            .subscribe(val=>this.tasks=val);
                            this._groupIndex = 2;
        };
        this._group = group;
      }
  }
  savedParams: {orderByArr: string[], dirArr: string[], amount:number}
  @Input() set params(params: {orderByArr: string[], dirArr: string[], amount:number}){
    let i = this._groupIndex;
    if(params){
      if(!this.savedParams||this.savedParams.orderByArr[i]!==params.orderByArr[i]||
          this.savedParams.dirArr[i]!==params.dirArr[i]||this.savedParams.amount!==params.amount){
        this.savedParams = params;
        this.tasksService.getTasks(this._group, params.orderByArr[i], params.dirArr[i], params.amount);
        if(params.orderByArr[i]==='date'){
          this.switchDir = params.dirArr[i]==='asc'?'dateAsc':'dateDesc';
        }else{
          this.switchDir = params.dirArr[i]==='asc'?'priorAsc':'priorDesc';
        }
        console.log(this._group+' just got tasks!'+ params.orderByArr[i], params.dirArr[i], params.amount);
      }
    }
  }

  tasks: TaskObj[];
  editedTasks: {[key:string]:TaskObj} = {};
  dataToOpen: {mode: 'read'|'write', fromList: boolean, 
         originalTask: TaskObj, editedTask?: TaskObj}
   
  noPrevPage: boolean;
  noNextPage: boolean;
  
  switchDir: 'dateAsc'|'dateDesc'|'priorAsc'|'priorDesc';


  constructor(private tasksService: TasksService,
              private router: Router) { }

  ngOnInit() {
    this.tasksService.noPrevPage$.subscribe(
      group => {if(!group.indexOf(this._group)) 
                this.noPrevPage = Boolean(+group.slice(-1));}
    )
    this.tasksService.noNextPage$.subscribe(
      group => {if(!group.indexOf(this._group)) 
                this.noNextPage = Boolean(+group.slice(-1));}
    )
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

  prevNext(side: 'prev'|'next'):void {
    if(side==='next'&&this.noNextPage) return;
    if(side==='prev'&&this.noPrevPage) return;
    let i: number = this._groupIndex;
    this.tasksService.getTasks(this._group, this.savedParams.orderByArr[i],
       this.savedParams.dirArr[i], this.savedParams.amount, side);
  }


  sort(orderBy:string){
    let dir: string;
    if(orderBy==='date'){
      dir = this.switchDir==='dateAsc'? 'desc':'asc';
    }else{
      dir = this.switchDir==='priorAsc'? 'desc':'asc';
    }
    let i: number = this._groupIndex;
    let orderByArr: string[] = this.savedParams.orderByArr.slice();
    let dirArr: string[] = this.savedParams.dirArr.slice();
    let amount: number = this.savedParams.amount;
    orderByArr[i] = orderBy;
    dirArr[i] = dir;
    let path: string = `/${orderByArr.join('&')}/${dirArr.join('&')}/${amount}`;
    this.router.navigate([path]);
  }

}
