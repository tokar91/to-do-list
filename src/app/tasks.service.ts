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
  
  params: {oncoming:any, pending:any, completed: any} = 
      {oncoming: undefined, pending: undefined, completed: undefined};
  
  statusToGroup = {
    'do zrobienia' : 'oncoming',
    'w toku'    : 'pending',
    'gotowe'    : 'completed'
  }

  firstValues:any = {};
  lastValues: any = {};

  constructor(private afs: AngularFirestore) { }

  //loglog(){
  //  console.log('Log Log...');  to naprawilo błąd not a function..
  //}

  getTasks(group: string, orderBy?: string, dir?: any, amount?: number, 
   action?: 'prev'|'next'|'update'): void {
    if(orderBy&&dir&&amount){
      orderBy = orderBy ==='date'?'sortDate':'sortPrior';
      this.params[group] = {orderBy, dir, amount};
    }
    else if(!this.params[group]) return;
    else {
      let params = this.params[group];
      orderBy = params.orderBy;
      dir = params.dir;
      amount = params.amount;
    }  
    let sortedQuery =
      this.afs.firestore.collection(group).orderBy(orderBy, dir);

    if(action){
      let firstValue = this.firstValues[group];
      if(action ==='next'){
        sortedQuery = 
          sortedQuery.startAfter(this.lastValues[group]).limit(amount+1);
      }
      else if(action ==='prev'){
        sortedQuery = 
          sortedQuery.endBefore(firstValue).limitToLast(amount+1);
    // get one additional doc to check if further previous page exists
      }
      else if(action ==='update'){
        if(firstValue)
         sortedQuery = sortedQuery.startAt(firstValue).limit(amount+1);
        else sortedQuery = sortedQuery.limit(amount+1);
      }
    }else{
    //  if(firstValue) sortedQuery = sortedQuery.startAt(firstValue); TYLKO NA UPDATE, ZEBY SORTOWANIE DZIALALO
      sortedQuery = sortedQuery.limit(amount+1);
    }

    sortedQuery.get().then(
      (snapshot) => {
        let taskObjArr:any;
        if(snapshot.empty){
          console.log('There are no documents');
          taskObjArr = [];
          this.noPrevPageIn.next(group+'1');
          this.noNextPageIn.next(group+'1');
          this.sendData(group, taskObjArr);
          return;
        }
        taskObjArr = snapshot.docs.map(doc=>doc.data());
        if(action){
          if(action === 'prev'){
            if(snapshot.size < amount){
              console.log(snapshot.size, orderBy, dir, amount, action);
              this.getTasks(group);
              console.log('Found less than demanded amount and refreshed');
              return;
            } 
            if(snapshot.size === amount+1){ 
              taskObjArr = taskObjArr.slice(1);
              this.noPrevPageIn.next(group+'0');
            }else{
              this.noPrevPageIn.next(group+'1');
            }
            this.noNextPageIn.next(group+'0');
          }
          else {
            if(snapshot.size === amount+1){ 
              taskObjArr = taskObjArr.slice(0,amount);
              this.noNextPageIn.next(group+'0')
            }else{
              this.noNextPageIn.next(group+'1');
            } 
            if(action === 'next') this.noPrevPageIn.next(group+'0');
          }
        }
        else {
          if(snapshot.size === amount+1){ 
            taskObjArr = taskObjArr.slice(0,amount);
            this.noPrevPageIn.next(group+'1');
            this.noNextPageIn.next(group+'0');
          }else{
            this.noPrevPageIn.next(group+'1');
            this.noNextPageIn.next(group+'1');
          }
        }
        if(taskObjArr.length){
          this.firstValues[group] = taskObjArr[0][orderBy];
          this.lastValues[group] = taskObjArr[taskObjArr.length-1][orderBy]
        }
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
      case 'wysoki' : taskObj.sortPrior = +('3'+taskObj.id.slice(-4));
                      break;
      case 'średni' : taskObj.sortPrior = +('2'+taskObj.id.slice(-4)); 
                      break;
      default  : taskObj.sortPrior = +('1'+taskObj.id.slice(-4));
    }
    // to prevent overlook any task on sort result add postfix of 4 random digits
    taskObj.sortDate = taskObj.data.date? 
                      taskObj.data.date+taskObj.id.slice(-4):
                      Math.random().toFixed(10);
    this.afs.collection(group).doc(taskObj.id).set(taskObj)
    .then(()=>{this.getTasks(group)});
  }

  deleteTask(status: string, id: string):void {
    let group: string = this.statusToGroup[status];
    this.afs.collection(group).doc(id).delete()
    .then(()=>{this.getTasks(group,undefined,undefined,undefined,'update')});
  }

  transferTask(group: string, taskObj: TaskObj):void {
    let oldStatus: string = taskObj.data.status;
    switch(group){
      case 'oncoming'  : taskObj.data.status = 'do zrobienia'; break;
      case 'pending'  : taskObj.data.status = 'w toku'; break;
      default : taskObj.data.status = 'gotowe';
    }
    this.afs.collection(group).doc(taskObj.id).set(taskObj)
    .then(()=>{this.getTasks(group)});
    this.deleteTask(oldStatus, taskObj.id);
  }

}
