import { TaskObj } from './task-obj';

export interface DataToOpen {
  mode: 'read'|'write', 
  fromList: boolean, 
  originalTask: TaskObj, 
  editedTask?: TaskObj
}