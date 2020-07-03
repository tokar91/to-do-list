import { Injectable } from '@angular/core';
import { Task } from './Task';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  oncomingIn: Subject<{id:string, data: Task}[]> = new Subject();
  pendingIn: Subject<{id:string, data: Task}[]> = new Subject();
  completedIn: Subject<{id:string, data: Task}[]> = new Subject();
  oncoming$: Observable<{id:string, data: Task}[]> = 
    this.oncomingIn.asObservable();
  pending$: Observable<{id:string, data: Task}[]> = 
    this.pendingIn.asObservable();
  completed$: Observable<{id:string, data: Task}[]> = 
    this.completedIn.asObservable();
  
  params: {oncoming:string, pending:string, completed:string} = 
    {oncoming:'', pending:'', completed: ''};

  constructor() { }

  //loglog(){
  //  console.log('Log Log...');  to naprawilo błąd not a function..
  //}

  getTasks(group: string, orderBy?: string, 
    dir?: string, page?: number, 
    amount?: number): void {

    if(orderBy&&dir&&page&&amount)
      this.params[group] = {orderBy, dir, page, amount};
    else if(!this.params[group]) return;

    new Promise((resolve, reject)=>{
      resolve([
        { id: 'id111',
          data: { name: 'Isc spac',
                  status: group,
                  desc: 'Umyc zeby i ubrac pizame',
                  date: '2:00',
                  prior: 'niski' }
        },
        { id: 'id222',
          data: { name: 'robic projekt',
                  status: group,
                  desc: 'kodzic i kodzic',
                  date: '05-07-2020',
                  prior: 'wysoki' }
        },
        { id: 'id333',
        data: { name: 'zgadnij co',
                status: group,
                desc: 'kodzic i kodzic',
                date: 'data i godzina',
                prior: 'średni' }
        }
      ])
    }).then((res:any) => {
              switch(group){
                case 'oncoming' : this.oncomingIn.next(res); break;
                case 'pending'  : this.pendingIn.next(res); break;
                case 'completed': this.completedIn.next(res);
              }
    })
  }

}
