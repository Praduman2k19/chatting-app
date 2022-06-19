import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  currentChatUserId="";
  createdBy=""
  currentChatUserName="";
  currentChatUserOnlineStatus=false;
  id:any;
  constructor(private service:CommonService,private sharedService:SharedService) { 
    this.id=localStorage.getItem('auth_token')
    this.sharedService.currentChatUserName.subscribe(res=>{this.currentChatUserName=res})
    this.sharedService.currentChatUserOnlineStatus.subscribe(res=>{this.currentChatUserOnlineStatus=res})
    this.sharedService.currentChatUserId.subscribe(res=>{
      console.log(res);
      this.messageList=[]
      this.currentChatUserId=res;
      if(this.currentChatUserId!=""){
        this.getCurrentChatUser()
      }
      
    this.sharedService.createdBy.subscribe(res=>{
      this.createdBy=res;
      if(this.currentChatUserId!="" && this.createdBy!=""){
        this.getmessages();
      }
    })
      
      
    })
  }

  ngOnInit(): void {  
  }
  
  currentChatUser:any;
  getCurrentChatUser(){
    this.service.getUserById(this.currentChatUserId).subscribe(res=>{
      this.currentChatUser=res.data()
      console.log("currentChatUser---",this.currentChatUser);
    })
  }
  message:string=""
  sendMessage(event:any){
    console.log("message : ",this.message);
    
    if(this.message=="")
    return;
    if(this.messageList.length==0){
      let contactObj={
        createdBy: this.id,
        createdAt:new Date(),
        updatedAt: new Date()
      }
      this.sharedService.createdBy.next(this.id);
      this.service.addUserToMyContact(this.id,this.currentChatUserId, contactObj).then(res=>{
        console.log("user added to my contact ");        
      })
    }
    let messageObj={
      message:this.message,
      senderId:this.id,
      createdAt:new Date(),
      updatedAt: new Date()
    }
    
    console.log("send messages ",this.id, this.currentChatUserId,this.createdBy);
    console.log(this.id==this.createdBy);
    
    let currentChatId=this.id==this.createdBy? this.id+'_'+this.currentChatUserId : this.currentChatUserId+'_'+this.id;
    console.log(currentChatId);
    this.service.sendMessage(currentChatId , messageObj).then(res=>{
      console.log("message sent ...");  
      this.message=""
    })
    
  }
  messageList:any=[];
  getmessages(){
    console.log("get messages ",this.id, this.currentChatUserId);
    let currentChatId=this.id==this.createdBy? this.id+'_'+this.currentChatUserId : this.currentChatUserId+'_'+this.id;
    console.log(currentChatId);
    this.service.getMessages(currentChatId).subscribe(res=>{
      this.messageList = res.map(item => {
        return {
          id : item.payload.doc.id,
          ...item.payload.doc.data()
        }
      })
      console.log('messageList----',this.messageList);
    })
  }




  filteredCurrentChat=[{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{right:true}]

  
}
