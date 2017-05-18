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

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {MdButtonModule, MdCheckboxModule,
  MdToolbarModule,MdCardModule,MdGridListModule,
  MdSelectModule,MdChipsModule,MdSlideToggleModule,
  MdInputModule,MdProgressBarModule} from '@angular/material';

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
    MaterialModule,
    BrowserAnimationsModule,MdButtonModule, MdCheckboxModule,
  MdToolbarModule,MdCardModule,MdGridListModule,
  MdSelectModule,MdChipsModule,MdSlideToggleModule,
  MdInputModule,MdProgressBarModule
  ],
  providers: [AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
