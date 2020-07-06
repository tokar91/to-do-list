import { Component, OnInit, HostListener } from '@angular/core';
import { TaskObj } from '../task-obj';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})

export class ToDoListComponent implements OnInit {
  
  cols: number;
  customCols: boolean;
  displayedCols: number = -1;
  amount: number;
  active: {
    oncoming: boolean,
    pending: boolean,
    completed: boolean
  };
  groupToHide: 'oncoming'|'completed' = 'oncoming';
  
  editedNewTask: any; 
  originalNewTask: any;

  dataToOpen: { mode: 'read'|'write', fromList: boolean, 
                originalTask: TaskObj, editedTask?: TaskObj }

  params: {[key:string]:any};
  pathArr: string[];
  secureUrl: boolean = false;

  resizeTimeout: any;

  constructor(public tasksService: TasksService,
              public route: ActivatedRoute,
              public router: Router
              ){}

  ngOnInit(){
    let cols:any = +window.localStorage.getItem('cols');
    if(cols){
      this.applyLayout(cols);
      this.customCols = true;
    }
    else this.applyLayout();

    this.route.paramMap.subscribe(
      (params) => {
        this.pathArr = [params.get('orderBy'),params.get('dir'),params
        .get('amount')];
        let orderByArr: string[] = this.pathArr[0].split('&');
        let dirArr: string[] = this.pathArr[1].split('&');
        let amount: number = +this.pathArr[2];
        
        if(this.secureUrl||orderByArr.every(orderBy=>orderBy==='date'||
          orderBy==='prior')&& dirArr.every(dir=>dir==='asc'||dir==='desc')&&
          amount>4&&amount<26){
           this.secureUrl = false;
           this.amount = amount;
           this.params = {orderByArr, dirArr, amount};
        }else{
          this.router.navigate(['/']);
        }
      }
    )
  }

  applyLayout(cols?: number): void {
    if(!cols&&this.customCols) return;
    if(cols){
      this.displayedCols = cols;
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
      if(width<750) this.cols = 1;
      if(width>=750&&width<1200) this.cols = 2;
      if(width>=1200) this.cols = 3;
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
   //   let numb = date.getTime();
   //   let diff = -date.getTimezoneOffset()*60000;
   //   let datestr = new Date(numb+diff).toISOString().slice(0,16);
    /*  below is result, which looks better, because of rounded hour  */
     let m: number = date.getMonth()+1;
     let d: number = date.getDate();
     let datestr = 
       [date.getFullYear(), m>9?m:'0'+m,d>9?d:'0'+d].join('-')+'T12:00';

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
  
  changeAmount(amount:string):void {
    this.router.navigate([`/${this.pathArr[0]}/${this.pathArr[1]}/${amount}`])
  }

}

