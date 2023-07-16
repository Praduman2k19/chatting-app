import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(private service: CommonService, private sharedService: SharedService, public dialog: MatDialog, public authService: AuthService, public renderer: Renderer2, private firestore: AngularFirestore) {
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

    let tempMessage = this.message
    this.message = ""
    console.log("send messages ",this.id, this.currentChatUserId,this.createdBy);
    console.log(this.id==this.createdBy);

    let currentChatId=this.id==this.createdBy? this.id+'_'+this.currentChatUserId : this.currentChatUserId+'_'+this.id;
    console.log(currentChatId);

    this.service.sendMessage(currentChatId , messageObj).then(res=>{
      console.log("message sent ...");
      this.message=""
    })
    let LastMessageObj = {
      lastMessage: tempMessage,
      lastSenderId: this.currentChatUserId,
      lastMessageAt: new Date(),
    }
    this.service.updateLastMessage(this.currentChatUserId, LastMessageObj).then(res=>{
      console.log("last message updated ...", LastMessageObj);

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
      this.filteredMessageList = this.messageList
      console.log('messageList----',this.messageList);
    })
  }

  filteredMessageList: any = []
  searchByMessage: string = ''
  filterMessageList() {
    this.filteredMessageList = this.messageList;
    if (this.searchByMessage != '') {
      this.filteredMessageList = this.filteredMessageList.filter((chat: any) => {
        // console.log(this.searchByMessage, chat?.message);
        return (chat?.message?.toLowerCase().includes(this.searchByMessage?.toLowerCase()));
      })
    }
    console.log(this.filteredMessageList);
  }
  searching = true
  onFocus() {
    this.searching = false
    this.searchByMessage = ''
    this.filterMessageList();
  }
  onBlur() {
    this.searching = true
    this.searchByMessage = ''
    this.filterMessageList();
  }

  sidebarSize: any;
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    let sidebarwidth = document.getElementById("header")?.clientWidth||0
    console.log(sidebarwidth);
    let screenWidth = window.innerWidth;
    console.log(screenWidth);

    if (screenWidth <= 1200) {
      this.sidebarSize = {
        right: '0%',
        height: "100%",
        width: (screenWidth - sidebarwidth)?.toString() + 'px',
      }
    }
    else {
      this.sidebarSize = {
        right: '2%',
        height: "94%",
        width: (((screenWidth*96)/100)-sidebarwidth)?.toString() + 'px',
      }
    }
    console.log(this.sidebarSize);

  }

  openProfileDialog(data: any) {
    this.onResize('')
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: this.sidebarSize?.width,
      height: this.sidebarSize?.height,
      position: {
        right: this.sidebarSize?.right,
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  filteredCurrentChat=[{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{right:true},{},{right:true}]


}
