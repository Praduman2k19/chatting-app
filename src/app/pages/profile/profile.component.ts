import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileId:any
  profile:any={}
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public service: CommonService, public authService: AuthService, private sharedService: SharedService, public renderer: Renderer2, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.profile =this.data
    console.log(this.profile);
    // this.getUserById();
    
  }

  // getUserById() {
  //   this.service.getUserById(this.profileId).subscribe(res => {
  //     console.log(res);
  //     this.profile = res.data()
  //     console.log("login profile---", this.profile);
  //   })
  // }

}
