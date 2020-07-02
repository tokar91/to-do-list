import { Injectable } from '@angular/core';
import { Task } from './Task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor() { }

  //loglog(){
  //  console.log('Log Log...');  to naprawilo błąd not a function..
  //}

  getTasks(status: string, orderBy: string, 
           dir: string, page: number, amount: number): Promise<Task[]> {
    return new Promise((resolve, reject)=>{
      resolve([
        {
          name: 'Isc spac',
          status: status,
          desc: 'Umyc zeby i ubrac pizame',
          date: '2:00',
          prior: 'niski'
        },
        {
          name: 'robic projekt',
          status: status,
          desc: 'kodzic i kodzic',
          date: '05-07-2020',
          prior: 'wysoki'
        },
        {
          name: 'name name',
          status: 'status status',
          desc: 'blah blah opis',
          date: 'data i godzina',
          prior: 'priorytet'
        }
      ])
    })
  }

}
