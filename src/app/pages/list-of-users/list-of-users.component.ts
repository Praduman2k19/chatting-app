import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.scss']
})
export class ListOfUsersComponent implements OnInit {
  allUsers:any=[]
  currentChatUserId:string=""
  constructor(public dialog : MatDialog,public service:CommonService, public authService: AuthService, public sharedService:SharedService) { 
    
    this.sharedService.currentChatUserId.subscribe(res=>{this.currentChatUserId=res})
    this.getAllUsers()
    // this.allUsers=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},]
  }

  ngOnInit(): void {
  }

  currentChat:any
  getAllUsers(){
    this.service.getUsers().subscribe(res=>{
      console.log(res);
      this.allUsers = res.map((item:any) => {
        return {
          id : item.payload.doc.id,
          ...item.payload.doc.data()
        }        
      })
      // response.forEach( item => {
      //   this.allUsers?.push({
      //     id: item.id,
      //     ...item.data(),
      //   });        
      // });   
      console.log("allUsers-------------",this.allUsers);
    })
  }
  
  setCurrentChat(chat:any){
    console.log(chat);
    this.sharedService.currentChatUserId.next(chat?.id);
    this.sharedService.createdBy.next(chat?.createdBy?chat?.createdBy:"")
    this.sharedService.currentChatUserName.next(chat?.name)
    this.sharedService?.currentChatUserOnlineStatus.next(chat?.online) 
    this.dialog.closeAll();
  }
  searchByName:string="";
  searching=true
  onFocusCountry(){
    this.searching=false
  }
	onBlurCountry(){
    this.searching=true
  }
}
