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

  selectedTier1Title : any;

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

   contentsRef: FirebaseListObservable<any>;
   contentsRefSnapShot: FirebaseListObservable<any>;
   tier1Ref :FirebaseListObservable<any>;
   
   objectItems : FirebaseObjectObservable<any>;
   firebaseFormula : any;
   
   //@Input('MathJax') MathJaxInput: string;

  constructor(public af: AngularFire,private router: Router,
  private db: AngularFireDatabase,private el: ElementRef) {
    this.tier1=new Tier1();
    this.tier2=new Tier2();
    this.tier3=new Tier3();
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth; 
        this.contentsRef=this.db.list('/contents');
        this.contentsRefSnapShot=this.db.list('/contents', { preserveSnapshot: true });
      }
  })

  this.contentsRef.subscribe((data)=>{
    if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
  })  
  
    }

    addTier1(){
      const formulas = this.db.list('/contents');
     formulas.push({ tier1Title : this.tier1.title });
    }

    addTier2(){
      let tier1TitleKey : any;
      this.contentsRefSnapShot.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          console.log("key"+snapshot.key);
          console.log("value - title"+snapshot.val().tier1Title);
          if(this.selectedTier1Title===snapshot.val().tier1Title){
            tier1TitleKey=snapshot.key;
          }  
        });
      });

      if(tier1TitleKey!=null && tier1TitleKey!='' && tier1TitleKey!=undefined){
        const tier1Ref =  this.db.list('/contents/'+tier1TitleKey);
            tier1Ref.push({ tier2Title : this.tier2.title });
      }
    }
    
  

  

   saveFormula(){
     const formulas = this.db.list('/algebra');
     formulas.push({ basic : this.formula });
   }

   saveTierLevel(){
     console.log(this.tier1);
     const tier1 = this.db.list('/'+this.tier1.title);
     const tier2DB =this.db.list('/'+this.tier1.title,{
  query: {
    orderByChild: 'size',
    equalTo: this.tier1.title,
    orderByKey: true,
  }
     });
     const tier3=null;
     if(this.tier1.tier2!=undefined && this.tier1.tier2!=null && this.tier1.tier2.title!=null){
       tier1.push(this.tier1.tier2.title);
       
     }
     if(this.tier1.tier2!=undefined && this.tier1.tier2!=null
     && this.tier1.tier2.tier3!=undefined && this.tier1.tier2.tier3!=null && this.tier1.tier2.tier3.title!=null){
       tier2DB.push(this.tier1.tier2.tier3.title);
     }
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
