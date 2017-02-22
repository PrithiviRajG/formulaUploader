import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';

import { AuthguardService } from './authguard.service';
import { routes } from './app.routes';

export const firebaseConfig = {
    apiKey: "AIzaSyCf0rNwruACEzEisgmQhGP-I1xKaTPqopQ",
    authDomain: "forumulaeuploader.firebaseapp.com",
    databaseURL: "https://forumulaeuploader.firebaseio.com",
    storageBucket: "forumulaeuploader.appspot.com",
    messagingSenderId: "1051031133079"
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routes,
    MaterialModule
  ],
  providers: [AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
