import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ListOfUsersComponent } from 'src/app/pages/list-of-users/list-of-users.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/services/shared.service';
// import { observable, Subject, combineLatest } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  myContacts:any=[];
  id:any
  currentChatUserId="";
  constructor(public dialog : MatDialog,public service:CommonService, public authService: AuthService, private sharedService:SharedService, public renderer: Renderer2,private firestore: AngularFirestore) {
    this.id=localStorage.getItem('auth_token')
    this.sharedService.currentChatUserId.subscribe(res=>{this.currentChatUserId=res})

  }

  ngOnInit(): void {
    this.getUserById()
    this.getMyContact()
    this.service.userOnline(this.id,true).then(res=>{
      console.log("user online");
    })
    // this.myContacts=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
  }
  user:any=[];
  getUserById(){
    this.service.getUserById(this.id).subscribe(res=>{
      console.log(res);
      this.user=res.data()
      console.log("login user---",this.user);
    })
  }
  currentChat:any
  getMyContact(){
    let tempContacts:any=[];
    this.service.getMyContacts(this.id).subscribe(res=>{
      tempContacts = res.map(item => {
        return {
          id : item.payload.doc.id,
          ...item.payload.doc.data()
        }
      })
      console.log("my temp Contacts list...", tempContacts);

      let length = tempContacts?.length
      this.myContacts=[];
      tempContacts.forEach((item: any) => {
        this.service.getUserById(item?.id).subscribe(res=>{
          // console.log(res.data());
          let temp:any=res.data()

          temp['createdBy']=item?.createdBy;
          temp['createdAt']=item?.createdAt;
          temp['updatedAt'] = item?.updatedAt;
          temp['lastMessage'] = item?.lastMessage;
          temp['lastSenderId'] = item?.lastSenderId;
          temp['lastMessageAt'] = item?.lastMessageAt;

          this.myContacts.push(temp);
          console.log(this.myContacts);

          if(length==this.myContacts.length)
          this.filteredContact = this.myContacts
        })
        // console.log("myContact list-------------",this.myContacts);
      });
      console.log("myContact list-------------",this.myContacts);
      // tempContacts.forEach((studentID: any) => this.myContacts.push(this.firestore.collection('users').doc(studentID?.id).get()));
      // console.log("myContact list-------------",this.myContacts);

      if(this.myContacts?.length>0){
        this.currentChat=this.myContacts[0];
        this.sharedService.currentChatUserId.next(this.myContacts[0]?.id)
        this.sharedService.createdBy.next(this.myContacts[0]?.createdBy)
        this.sharedService.currentChatUserName.next(this.myContacts[0]?.name)
        this.sharedService.currentChatUserOnlineStatus.next(this.myContacts[0]?.online)
      }

    })
  }

  filteredContact:any=[]
  searchByName:string=''
  filterContact(){
    this.filteredContact = this.myContacts;
    if (this.searchByName!=''){
      this.filteredContact=this.filteredContact.filter((item: any) => {
        console.log(this.searchByName, item?.name);
        return (
          (item?.name?.toLowerCase().includes(this.searchByName?.toLowerCase()) || item?.phone?.toLowerCase().includes(this.searchByName?.toLowerCase()))
        );
      })
    }
    console.log(this.filteredContact);
  }

  setCurrentChat(chat:any){
    console.log(chat);
    this.sharedService.currentChatUserId.next(chat?.id);
    this.sharedService.createdBy.next(chat?.createdBy?chat?.createdBy:"")
    this.sharedService.currentChatUserName.next(chat?.name)
    this.sharedService?.currentChatUserOnlineStatus.next(chat?.online)
  }

  searching=true
  onFocusCountry(){
    this.searching=false
  }
	onBlurCountry(){
    this.searching=true
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.onResize("event?: any")

  }




  sidebarSize:any;
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    let sidebarwidth=document.getElementById("sidebar")?.clientWidth
    console.log(sidebarwidth);
    let screenWidth = window.innerWidth;
    console.log(screenWidth);

    if(screenWidth<=1200){
      this.sidebarSize={
        left:'0%',
        height: "100%",
        width: sidebarwidth?.toString()+'px',
      }
    }
    else{
       this.sidebarSize={
        left:'2%',
        height: "94%",
        width: sidebarwidth?.toString()+'px',
      }
    }
    console.log(this.sidebarSize);

  }
  openListOfUsersDialog(data:any) {
    const dialogRef = this.dialog.open(ListOfUsersComponent, {
      width: this.sidebarSize?.width,
      height: this.sidebarSize?.height,
      position: {
        left: this.sidebarSize?.left,

      },
      data:data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openProfileDialog(data: any){
    const dialogRef = this.dialog.open(ProfileComponent, {
      width: this.sidebarSize?.width,
      height: this.sidebarSize?.height,
      position: {
        left: this.sidebarSize?.left,

      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



}



