import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dialog : MatDialog, public authService:AuthService,  private service : CommonService, private router: Router) { 
    
  }

  ngOnInit(): void {
    let auth_token=localStorage.getItem('auth_token')
    if(auth_token==null){
      console.log(auth_token);
      this.router.navigate(['/login']);
      // this.service.openLoginDialog("")
    }
    else{
      console.log("login...............");
      
    }  
  }


  

}
