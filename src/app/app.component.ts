import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import  { Task } from './task';
import { TaskObj } from './task-obj';
import { TasksService } from './tasks.service';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import  { map, take, filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  cols: number;
  customCols: boolean;
  active: {
    oncoming: boolean,
    pending: boolean,
    completed: boolean
  };
  groupToHide: 'oncoming'|'completed' = 'oncoming';
  
  editedNewTask: any; // class Task doesnt fit
  originalNewTask: any; // class Task doesnt fit

  dataToOpen: { mode: 'read'|'write', fromList: boolean, 
                originalTask: TaskObj, editedTask?: TaskObj }

  params: {[key:string]:any} = {};
  resizeTimeout: any;

  constructor(public tasksService: TasksService,
              public route: ActivatedRoute,
              public router: Router
              ){}

  ngOnInit(){
    //  this.tasksService.loglog(); to naprawilo błąd not a function..

    let cols:any = +window.localStorage.getItem('cols');
    if(cols){
      this.applyLayout(cols);
      this.customCols = true;
    }
    else this.applyLayout();



  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(
      (params) => {
 
        console.log(params.keys);
      }
    )

    this.router.events.pipe( 
      filter(event => event instanceof ActivationEnd && 
              event.snapshot.children.length === 0) )
    .subscribe((event: ActivationEnd) => { console.log(event.snapshot.data); });
    

  }

  applyLayout(cols?: number): void {

    if(!cols&&this.customCols) return;
    if(cols){
      if(cols > 0){ 
        this.cols= cols;
        this.customCols = true;
        window.localStorage.setItem('cols', cols.toString());
      }else{
        this.customCols = false;
        window.localStorage.removeItem('cols');
      }
    }
    if(!cols||cols<0){
      let width = window.innerWidth;
      if(width<500) this.cols = 1;
      if(width>=500&&width<850) this.cols = 2;
      if(width>=850) this.cols = 3;
    }
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
  }

  @HostListener('window:resize',['$event']) onResize($event):void {
    window.clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(()=>this.applyLayout(), 500)
  } 
  

  showGroup(group: string):void{
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
    if(!this.editedNewTask){
      let date = new Date();
      let numb = date.getTime();
      let diff = -date.getTimezoneOffset()*60000;
      let datestr = new Date(numb+diff).toISOString().slice(0,16);
      this.originalNewTask = {
        id: new Date().getTime().toString(),
        data: {name: '',
               status: 'do zrobienia',
               desc: '',
               date: datestr,
               prior: 'średni'}
      };
      this.editedNewTask = 
            {id  : this.originalNewTask.id,
             data: Object.assign({}, this.originalNewTask.data)};
    }
    this.dataToOpen = {mode: 'write', 
                       fromList: false,
                       originalTask: this.originalNewTask,
                       editedTask: this.editedNewTask};
  } 

  deleteEditedRef():void{
    this.editedNewTask = undefined;
  }
  


}
