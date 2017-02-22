import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animation';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: {'[@moveIn]': ''}

})
export class MembersComponent implements OnInit {

  name: any;
  state: string = '';
  delay: any = 150;        // delay after keystroke before updating
  preview: any=null;     // filled in by Init below
  buffer: any= null;      // filled in by Init below
  timeout: any= null;     // store setTimout id
  mjRunning: any= false;  // true when MathJax is processing
  mjPending: any= false;  // true when a typeset has been queued
  oldText: any= null;     // used to check if an update is needed

  constructor(public af: AngularFire,private router: Router) {
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
      }
    });
   }

  ngOnInit() {
  }

  logout() {
     this.af.auth.logout();
     console.log('logged out');
     this.router.navigateByUrl('/login');
  }

}
