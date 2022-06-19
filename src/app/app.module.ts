import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { ChatAreaComponent } from './home/chat-area/chat-area.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';


import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';


// import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { initializeApp } from "firebase/app";
import { ListOfUsersComponent } from './pages/list-of-users/list-of-users.component';
// import { getAnalytics } from "firebase/analytics";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    ChatAreaComponent,
    LoginComponent,
    ListOfUsersComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
