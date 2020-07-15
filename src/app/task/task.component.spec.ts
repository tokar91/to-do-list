import { async, ComponentFixture, TestBed, fakeAsync, tick } 
  from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskComponent } from './task.component';
import { TasksService } from '../tasks.service';
import { TaskObj } from '../task-obj';
import { DataToOpen } from '../data-to-open';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { MatCheckboxModule, MatInputModule, MatInput} from '@angular/material';
import { MatButtonModule } from '@angular/material/button'; 

describe('TaskComponent', () => {
   
  let fixture: ComponentFixture<TestHostCompoent>;
  let hostInst: TestHostCompoent;
  let hostElem: HTMLElement;
  let tasksServiceSpy: jasmine.SpyObj<TasksService>;
 

  @Component({
    template: `  <app-task [data]='dataToOpen'
                  (close)='dataToOpen=undefined' 
                  (saveEditedRef)='saveEditedRef($event)'
                  (deleteEditedRef)='deleteEditedRef($event)'>
                 </app-task>`,
    styles: [`app-task {position: relative}`]
  })
  class TestHostCompoent {
    dataToOpen: DataToOpen;
    editedRef: TaskObj;
    saveEditedRef(data: TaskObj){
      this.editedRef = data;
    }
    idToDelete: string;
    deleteEditedRef(id: string){
      this.idToDelete = id;
    }
  }

  function setDataToOpen(mode: 'read'|'write', fromList: boolean){
    let dataToOpen: DataToOpen = {
      mode, fromList, originalTask: {
        id: '1', data: {
          name: '', status: 'do zrobienia', 
          desc: '', date: '2020-07-14T12:00', prior: 'średni'
        }
      }
    }
    if(mode==='write' && fromList){
      hostInst.dataToOpen.originalTask.data =  {
          name: 'Mock name', status: 'do zrobienia', 
          desc: 'Mock desc', date: '2020-07-14T12:00', prior: 'średni'
      }
      hostInst.dataToOpen.editedTask = {
        id: '1', data: {
          name: 'Mock edit...', status: 'do zrobienia', 
          desc: 'Mock edit...', date: '2020-07-14T12:00', prior: 'średni'
        }
      }
    }  
    if(mode==='read')
      hostInst.dataToOpen.originalTask.data = {
          name: 'Mock name', status: 'do zrobienia', 
          desc: 'Mock desc', date: '2020-07-14T12:00', prior: 'średni'
      }
    hostInst.dataToOpen = dataToOpen;   
  }
  

  beforeEach(()=>{
    const spy = jasmine.createSpyObj('TasksService', ['setTask', 'deleteTask']);
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, MatFormFieldModule,
       MatButtonModule, MatInputModule , MatSelectModule, MatCheckboxModule],
      declarations: [TestHostCompoent, TaskComponent],
      providers: [{ provide: TasksService, useValue: spy}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    fixture = TestBed.createComponent(TestHostCompoent);
    hostInst = fixture.debugElement.componentInstance;
    hostElem = fixture.debugElement.nativeElement;
    tasksServiceSpy = TestBed.get(TasksService);
  })

// const setTaskSpy: jasmine.Spy = tasksServiceSpy.setTask;
// const deleteTaskSpy: jasmine.Spy = tasksServiceSpy.deleteTask;
  
  
  it('should create an component instance', () => {
    expect(hostInst).toBeTruthy();
  });

  it('should emit a (close) event when clicked a "close" button', ()=>{
    setDataToOpen('write', false);
    expect(hostInst.dataToOpen).toBeDefined('host\'s dataToOpen was just assigned');
    const closeBtnEl = hostElem.querySelector('button.close') as HTMLButtonElement;
    closeBtnEl.click();
    expect(hostInst.dataToOpen).toBeUndefined('component\'s closeBtn was clicked,\
     so (close) event should be emitted and set dataToOpen to undefined')
  })

  it('should use a setTask method of TasksServis to add a new task', 
    fakeAsync(() => {
    setDataToOpen('write', false);
    fixture.detectChanges();
    expect(hostInst.dataToOpen).toBeDefined('host\'s dataToOpen was just assigned');
  /*  const setTaskSpy: jasmine.Spy = tasksServiceSpy.setTask;
    const saveBtn: HTMLButtonElement = hostElem.querySelector('button.save');
    const nameInput: HTMLInputElement = 
      fixture.debugElement.query(By.css('input#name')).nativeElement;
    nameInput.value = 'Some name';
    nameInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
       saveBtn.click();
       tick();
       fixture.detectChanges();
       expect(hostInst.dataToOpen).toBeUndefined('host\'s dataToOpen should be \
       erased and the component should closed after saving')
    })  */
    //expect(setTaskSpy.calls.count()).toEqual(1, 'setTask() of TasksService \
   // should be invoked one time per click a save button');
    

  }))

});
