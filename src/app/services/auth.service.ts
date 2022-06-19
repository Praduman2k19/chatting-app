import { Injectable, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import 'firebase/auth';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(  private fireAuth: AngularFireAuth, private router :Router, private service:CommonService) { }

  signup(email: string, password: string, phone: string, name: string) {
    return new Promise((resolve,reject)=>{
    firebase.auth().createUserWithEmailAndPassword(email,password).then((res)=>{
      console.log(res)
      res.user?.updateProfile({
        displayName: name,
      }) .then(()=>{
        resolve(res.user);
        console.log(res.user);
        var id=res?.user?.uid?res?.user?.uid:"";
        localStorage.setItem('auth_token', id)
      })
    },err=>{
     reject(err);
     console.log(err)
    })
    })
  }


  // login 
  login(email : string, password : string){
    return new Promise((resolve,reject)=>{
      firebase.auth().signInWithEmailAndPassword(email,password).then(res=>{
        console.log(res?.user?.uid);
        var id=res?.user?.uid?res?.user?.uid:"";
        localStorage.setItem('auth_token', id)
        // this.userError=null
        // this.message="You have been logged in successfully."
        // this.toastrService.success("You have been logged in successfully.")
        // this.router.navigateByUrl('blogs');
        resolve(res.user)
        this.service.userOnline(id,true).then(res=>{
          console.log("user online");          
        })
      },err=>{
        reject(err)
        console.log(err);
        // this.message="";
        // this.userError=err;
        // if(err?.message=="There is no user record corresponding to this identifier. The user may have been deleted.")
        //   this.toastrService.warning("This email id is is not registered.")
        // else if(err?.message=="The password is invalid or the user does not have a password.")
        //   this.toastrService.error("Your password is wrong.")
        // else if(err?.message=="Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.")
        //   this.toastrService.warning("Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.")
        // else
        // this.toastrService.error(err?.message)
      })
    })
  }


  // logout---------------
  
  signOut() {
    this.fireAuth.auth.signOut().then(res =>{
      return this.fireAuth.auth.signOut().then(() => {
        let id=localStorage.getItem('auth_token')
        if(id!=null)
        this.service.userOnline(id,false).then(res=>{
          console.log("user offline");
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']) 
        })
      });
    })
  }
}