import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/auth';
import 'firebase/firestore'
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  id:any;
  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private dialog : MatDialog,
    private firestore: AngularFirestore,)
    { 
      this.id=localStorage.getItem("auth_token");
    }

  createUser(userData:any,id:string){
    console.log(userData);
    return this.firestore.collection('users').doc(id).set(userData,{merge:true})
  }
  updateUserById(id:string, obj:any){
    return this.firestore.collection('users').doc(id).set(obj,{merge:true})
  }
  getUsers(){
    return this.firestore.collection('users',ref => ref.where('id' ,'!=' , this.id)).snapshotChanges(); //.orderBy("name", "asc")
  }
  getUserById(id:string){
    return this.firestore.collection('users').doc(id).get();
  }

  addUserToMyContact(id:string,userId:string, obj:any){
    return this.firestore.collection('users').doc(id).collection('contacts').doc(userId).set(obj).then(res=>{
      return this.firestore.collection('users').doc(userId).collection('contacts').doc(id).set(obj);
    })
  }
  getMyContacts(id:string){
    return this.firestore.collection('users').doc(id).collection('contacts').snapshotChanges();
  }
  getMyContactById(contactId:string){
    return this.firestore.collection('users').doc(this.id).collection('contacts').doc(contactId).get();
  }

  sendMessage(chatId:string, messageObj:any){
    return this.firestore.collection('chats').doc(chatId).collection('messages').add(messageObj)
  }
  getMessages(chatId:string){
    return this.firestore.collection('chats').doc(chatId).collection('messages', ref => ref.orderBy("createdAt","asc")).snapshotChanges();
  }
  
  userOnline(id:string,status:boolean){
    return this.firestore.collection('users').doc(id).set({online:status},{merge:true});
  }

}
function orderBy(arg0: string, arg1: string): any {
  throw new Error('Function not implemented.');
}

