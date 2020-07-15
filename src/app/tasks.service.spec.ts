import { fakeAsync, tick } from '@angular/core/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  
  let service: TasksService;
  const afsStub: any = {};
  
  const afsStubMethods: string[] = ['collection', 'doc','orderBy',
   'startAt', 'startAfter', 'endBefore','limitToLast', 'limit'];
  for(let method of afsStubMethods){
    afsStub[method] = ()=>afsStub;
  }
  afsStub.firestore = afsStub;
  
  const docs: any[] = [
       {data(){return {}}}, {data(){return {}}}, {data(){return {}}},
       {data(){return {}}}, {data(){return {}}}, {data(){return {}}}
  ]
  const fakeSnapshotOfTasks: any = {
     empty: false,
     get size(){return fakeSnapshotOfTasks.docs.length},
     docs: docs
  }
  afsStub.get = () => Promise.resolve(fakeSnapshotOfTasks);
  service = new TasksService(afsStub);

  let noPrevPage: 'oncoming0'|'oncoming1'|string;
  let noNextPage: 'oncoming0'|'oncoming1'|string;
  service.noPrevPage$.subscribe(val => {noPrevPage = val});
  service.noNextPage$.subscribe(val => {noNextPage = val});  
  
  it('should create TasksService instance', () => {
    expect(service).toBeTruthy();
  });

  it('should recognize first page and last page when database\
    returns demanded amount of records including 1 spare',
   fakeAsync(() => {
    fakeSnapshotOfTasks.docs = docs;

    service.getTasks('oncoming', 'sortDate', 'desc', 5);
    tick();
    expect(noPrevPage).toBe('oncoming1', 'getTasks without prev/next/update \
     always should return first records of database, therefore there is \
     no previous page');
    expect(noNextPage).toBe('oncoming0', 'getTasks without prev/next/update. \
    database returned 1 more record, so there is at least one next page');

    service.getTasks('oncoming', 'sortDate', 'desc', 5, 'prev');
    tick();
    expect(noPrevPage).toBe('oncoming0', 'database have spare records, so \
    this one isn\'t a first page');
    expect(noNextPage).toBe('oncoming0', 'it just returned from a next page,\
     so next page exists');

    service.getTasks('oncoming', 'sortDate', 'desc', 5, 'next');
    tick();
    expect(noPrevPage).toBe('oncoming0', 'it just jumped to the next page, \
    so there must be a previous page');
    expect(noNextPage).toBe('oncoming0', 'database have spare records, so \
    this one isn\'t a last page');

    service.getTasks('oncoming', 'sortDate', 'desc', 5, 'update');
    tick();
    expect(noNextPage).toBe('oncoming0', 'database have spare records, so \
    this one isn\'t a last page');

  }));

  it('should recognize first page and last page when database\
     returns demanded amount of records without one spare, or less, but no 0',
   fakeAsync(() => {
    // FIRST LOOP scenario: 
    // database returns demanded amount of records (no spare)
    // SECOND LOOP scenario: 
    // database returns less than demanded amount of records, but not 0
    for (let i of [5,4]){
      fakeSnapshotOfTasks.docs = docs.slice(0, i);

      service.getTasks('oncoming', 'sortDate', 'desc', 5);
      tick();
      expect(noPrevPage).toBe('oncoming1', 'getTasks without prev/next/update \
      always should return first records of database, therefore there is \
      no previous page');
      expect(noNextPage).toBe('oncoming1', 'getTasks without prev/next/update. \
      database didn\'t returned 1 more record, so there is no next page');

      service.getTasks('oncoming', 'sortDate', 'desc', 5, 'prev');
      tick();
      expect(noPrevPage).toBe('oncoming1', 'database have not spare records, so \
      this one is a first page');
      if(i === 5)
        expect(noNextPage).toBe('oncoming0', 'it just returned from a next page,\
        so next page exists');
      else 
        expect(noNextPage).toBe('oncoming1', 'after returning from a next page\
        it got less records than demanded, so it invoked getTasks(groupName)\
        again to get first records, but it still returned less amount than demanded');

      service.getTasks('oncoming', 'sortDate', 'desc', 5, 'next');
      tick();
      expect(noPrevPage).toBe('oncoming0', 'it just jumped to the next page, \
      so there must be a previous page');
      expect(noNextPage).toBe('oncoming1', 'database have not spare records, so \
      this one is a last page');

      service.getTasks('oncoming', 'sortDate', 'desc', 5, 'update');
      tick();
      expect(noNextPage).toBe('oncoming1', 'database have not spare records, so \
      this one is a last page');
    }
  }));

  it('should recognize first page and last page when database\
    returns 0 records',
   fakeAsync(() => {
    fakeSnapshotOfTasks.docs = [];
    afsStub.empty = true;
    
    service.getTasks('oncoming', 'sortDate', 'desc', 5);
    tick();
    expect(noPrevPage).toBe('oncoming1', 'getTasks without prev/next/update \
    always should return first records of database, therefore there is \
    no previous page');
    expect(noNextPage).toBe('oncoming1', 'getTasks without prev/next/update. \
    Database returned 0 record, so there is no next page');
  }));

});
