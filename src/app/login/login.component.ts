import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signupForm:FormGroup= new FormGroup({});;
  loginForm:FormGroup= new FormGroup({});;
  isLogin=false;
  haveAnAccount=true;
  constructor(private formBuilder: FormBuilder, private authService:AuthService, private service:CommonService, public router : Router) { 
    let auth_token=localStorage.getItem('auth_token')
    if(auth_token==null)
    this.isLogin=false
    else
    {
      this.isLogin=true;
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.createSignupForm()
    this.createLoginForm();
  }

  dontHaveAccount(){
    this.haveAnAccount=!this.haveAnAccount
  }

  // signup---------------------
  public createSignupForm(){
    this.signupForm= this.formBuilder.group({
      name: ['',[Validators.required, Validators.minLength(5)]],
      email : ['',[Validators.required, Validators.email]],
      phone: ['',[Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      password: ['', [Validators.required,Validators.minLength(8)]]
    })
  }

  signup(data:any)  {
    console.log(data);
    this.authService.signup(data.email,data.password,data.phone,data.name).then((user:any)=>{

      console.log(user);
      let userData={
        name:data?.name,
        email:data?.email,
        phone:data?.phone,
        photoURL:"",
        interests:"",
        bio:"",
        id:user?.uid,
        online:true,
        createdAt:new Date(),
        updatedAt: new Date()
      }
      // firebase.firestore()?.collection("users")?.doc(user?.uid)?.set({
      this.service.createUser(userData,user?.uid).then(res=>{
        this.router.navigate(['/'])
      }).catch(err=>{
        console.log(err);
        
      })
    }).catch(err=>{
      console.log(err);  
    })
  }



  // login -------------------
  
  
  public createLoginForm(){
    this.loginForm= this.formBuilder.group({
      email : ['',[Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]]
    })
  }
  login(data:any)
  {
    console.log(data);
    this.authService.login(data?.email,data?.password).then(res=>{
      // this.matDialog.close();
      this.isLogin=true;
      this.router.navigate(['/']);
    }).catch(err=>{
      console.log(err);  
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("ondestroy");
    
  }
}
