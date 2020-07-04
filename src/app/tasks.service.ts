import { Injectable } from '@angular/core';
import { Task } from './Task';
import { TaskObj } from './task-obj';
import { Subject, Observable } from 'rxjs';
import { AngularFirestore, QuerySnapshot } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  oncomingIn: Subject<TaskObj[]> = new Subject();
  pendingIn: Subject<TaskObj[]> = new Subject();
  completedIn: Subject<TaskObj[]> = new Subject();
  oncoming$: Observable<TaskObj[]> = 
    this.oncomingIn.asObservable();
  pending$: Observable<TaskObj[]> = 
    this.pendingIn.asObservable();
  completed$: Observable<TaskObj[]> = 
    this.completedIn.asObservable();
  
  noPrevPageIn: Subject<string> = new Subject();
  noPrevPage$: Observable<string> = this.noPrevPageIn.asObservable();
  noNextPageIn: Subject<string> = new Subject();
  noNextPage$: Observable<string> = this.noNextPageIn.asObservable();

  params: {oncoming:string, pending:string, completed:string} = 
    {oncoming:'', pending:'', completed: ''};
  
  statusToGroup = {
    'do zrobienia' : 'oncoming',
    'w toku'    : 'pending',
    'gotowe'    : 'completed'
  }

  constructor(private afs: AngularFirestore) { }

  //loglog(){
  //  console.log('Log Log...');  to naprawilo błąd not a function..
  //}

  getTasks(group: string, orderBy?: string, dir?: any, amount?: number, 
           prevNext?: 'prev'|'next', prevNextValue?: string|number): void {

    if(orderBy&&dir&&amount)
      this.params[group] = {orderBy, dir, amount};
    else if(!this.params[group]) return;
    else {
      let params = this.params[group];
      orderBy = params.orderBy;
      dir = params.dir;
      amount = params.amount;
    }  
    let sortedQuery =
      this.afs.firestore.collection(group)
      .orderBy(orderBy==='date'?`data.${orderBy}`:'sortPrior', dir);

    if(prevNext){
      if(prevNext==='next'){
        sortedQuery = sortedQuery.startAfter(prevNextValue).limit(amount+1);
      }
      if(prevNext==='prev'){
        sortedQuery = 
          sortedQuery.endBefore(prevNextValue).limitToLast(amount+1);
    // get one additional doc to check if further previous page exists
      }
    }
    else sortedQuery = sortedQuery.limit(amount+1);

    sortedQuery.get().then(
      (snapshot) => {
        let taskObjArr:any;
        if(snapshot.empty){
          console.log('There are no documents');
          taskObjArr = [];
          this.sendData(group, taskObjArr);
          return;
        }
        
        if(prevNext === 'prev'){
          if(snapshot.size < amount){
            this.getTasks(group);
            console.log('Found less than demanded amount and refreshed');
            return;
          } 
          if(snapshot.size === amount+1){ 
            taskObjArr = snapshot.docs.slice(1);
            this.noPrevPageIn.next(group+'0')
          }else{
            this.noPrevPageIn.next(group+'1');
          }
          this.noNextPageIn.next(group+'0');
        }
        else if(prevNext === 'next'){
          if(snapshot.size === amount+1){ 
            taskObjArr = snapshot.docs.slice(0,amount);
            this.noNextPageIn.next(group+'0')
          }else{
            this.noNextPageIn.next(group+'1');
          } 
          this.noPrevPageIn.next(group+'0');
        }
        else {
          if(snapshot.size === amount+1){ 
            taskObjArr = snapshot.docs.slice(0,amount);
            this.noPrevPageIn.next(group+'1');
            this.noNextPageIn.next(group+'0');
          }else{
            this.noPrevPageIn.next(group+'1');
            this.noNextPageIn.next(group+'1');
          }
        }
        if(!taskObjArr) taskObjArr = snapshot.docs;
        taskObjArr = taskObjArr.map(doc=>doc.data());
        this.sendData(group, taskObjArr);
    })
  }

  private sendData(group: string, taskObjArr:any){
    switch(group){
      case 'oncoming' : this.oncomingIn.next(taskObjArr); break;
      case 'pending'  : this.pendingIn.next(taskObjArr); break;
      case 'completed': this.completedIn.next(taskObjArr);
    } 
  }

  setTask(status: string, taskObj: TaskObj):void {
    let group: string = this.statusToGroup[status];
    // duplicate the same value to ease sorting by date
    //taskObj.date = +taskObj.id;
    // second prior property allows firebase sorting properly (by priority)
    switch(taskObj.data.prior){
      case 'wysoki' : taskObj.sortPrior = +('3'+taskObj.id); break;
      case 'średni' : taskObj.sortPrior = +('2'+taskObj.id); break;
      default  : taskObj.sortPrior = +('1'+taskObj.id);
    }
    this.afs.collection(group).doc(taskObj.id).set(taskObj)
    .then(()=>{this.getTasks(group)});
  }

  deleteTask(status: string, id: string):void {
    let group: string = this.statusToGroup[status];
    this.afs.collection(group).doc(id).delete()
    .then(()=>{this.getTasks(group)});
  }

}
