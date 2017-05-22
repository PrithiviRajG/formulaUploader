import { Component, OnInit,ElementRef,Input } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animation';

import { AngularFireDatabase,FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import {Tier1} from'../transferObjects/tier1TO';
import {Tier2} from'../transferObjects/tier2TO';
import {Tier3} from'../transferObjects/tier3TO';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: {'[@moveIn]': ''}

})
export class MembersComponent  {

    selectedTier: string='Single Tier';

  tiers= [
    'Single Tier',
    'Two Tier',
    'Three Tier'
  ];

  tier1 : Tier1;
  tier2 : Tier2;
  tier3 : Tier3;

  name: any;
  state: string = '';
  delay: any = 150;        // delay after keystroke before updating
  preview: any=null;     // filled in by Init below
  buffer: any= null;      // filled in by Init below
  timeout: any= null;     // store setTimout id
  mjRunning: any= false;  // true when MathJax is processing
  mjPending: any= false;  // true when a typeset has been queued
  oldText: any= null;     // used to check if an update is needed
  formula : any;

   items: FirebaseListObservable<any>;
   objectItems : FirebaseObjectObservable<any>;
   firebaseFormula : any;
   
   //@Input('MathJax') MathJaxInput: string;

  constructor(public af: AngularFire,private router: Router,
  private db: AngularFireDatabase,private el: ElementRef) {
    this.tier1=new Tier1();
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth; 
        this.items=this.db.list('/algebra');
      }
  })

  this.items.subscribe((data)=>{
    if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
  })  
  
    }
    
  

  

   saveFormula(){
     const formulas = this.db.list('/algebra');
     formulas.push({ basic : this.formula });
   }

   saveTierLevel(){
     console.log(this.tier1);
     const itemObservable = this.db.object('/object');
itemObservable.set(this.tier1);
   }

   /*
   Get the preview and buffer DIV's
   */
  ngAfterContentInit() {
    this.preview = document.getElementById("MathPreview");
    this.buffer = document.getElementById("MathBuffer");
     
  }

/*  Switch the buffer and preview, and display the right one.
   (We use visibility:hidden rather than display:none since
   the results of running MathJax are more accurate that way.)
 */
 SwapBuffers(){
   let buffer = this.preview;
   let preview = this.buffer;
    this.buffer = buffer;
    this.preview = preview;
    buffer.style.visibility = "hidden"; buffer.style.position = "absolute";
    preview.style.position = ""; preview.style.visibility = "";
 }

 /*
    This gets called when a key is pressed in the textarea.
    We check if there is already a pending update and clear it if so.
    Then set up an update to occur after a small delay (so if more keys
      are pressed, the update won't occur until after there has been
      a pause in the typing).
    The callback function is set up below, after the Preview object is set up.
  */
  Update(){
    console.log("update");
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(this.CreatePreview(),this.delay);
  }

  /*
    Indicate that MathJax is no longer running,
    and swap the buffers to show the results.
  */
  PreviewDone() {
    this.mjRunning = this.mjPending = false;
    this.SwapBuffers();
  }

  //
//  Cache a callback to the CreatePreview action
//
callback(){
  let callback = eval('MathJax.Callback(["CreatePreview",this])');
  callback.autoReset = true;  // make sure it can run more than once
}



  /*
    Creates the preview and runs MathJax on it.
    If MathJax is already trying to render the code, return
    If the text hasn't changed, return
    Otherwise, indicate that MathJax is running, and start the
      typesetting.  After it is done, call PreviewDone.
  */
  CreatePreview(){
    this.timeout = null;
   if (this.mjPending){
      return;
    }
   let text = this.formula;
   if (text === this.oldText){
     return;
   }
   if (this.mjRunning) {
     this.mjPending = true;
     eval('MathJax.Hub.Queue(["CreatePreview",this])');
   } else {
     this.buffer.innerHTML = this.oldText = text;
     this.mjRunning = true;
     eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.buffer],["PreviewDone",this])');
   }
  }

  logout() {
     this.af.auth.logout();
     console.log('logged out');
     this.router.navigateByUrl('/login');
  }

}
