import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

   currentChatUserId:BehaviorSubject<string>= new BehaviorSubject<string>('');
   createdBy:BehaviorSubject<string>= new BehaviorSubject<string>('');
   currentChatUserName:BehaviorSubject<string>= new BehaviorSubject<string>('');
   currentChatUserOnlineStatus:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
}
