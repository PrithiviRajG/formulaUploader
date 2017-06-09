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
    'Add First Tier',
    'Add Second Tier',
    'Add Third Tier',
    'Add Formula'
  ];

  tier1 : Tier1;
  tier2 : Tier2;
  tier3 : Tier3;

  selectedTier1Key : any;
  selectedTier2Key : any;
  selectedTier3Key : any;

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
   formulaRef :FirebaseListObservable<any>;
   formulaRefSnapshot :FirebaseListObservable<any>;
   notesRef :FirebaseListObservable<any>;
   notesRefSnapshot :FirebaseListObservable<any>;
   tier0RefSnapShot :FirebaseListObservable<any>;
   tier1RefSnapShot :FirebaseListObservable<any>;
   tier2RefSnapShot :FirebaseListObservable<any>;

   
   
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
      
      console.log(this.selectedTier1Key);
      if(this.selectedTier1Key!=null && this.selectedTier1Key!='' && this.selectedTier1Key!=undefined){
        const tier1Ref =  this.db.list('/contents/'+this.selectedTier1Key);
            tier1Ref.push({ tier2Title : this.tier2.title });
      }
    }

    TierOptionChange(){
      console.log("hello");
      this.selectedTier1Key='';
      this.selectedTier2Key='';
      this.selectedTier3Key='';
      
    }

    onTier1Change(){
      console.log("working");
      this.tier1RefSnapShot=this.db.list('/contents/'+this.selectedTier1Key, { preserveSnapshot: true });
      if(document.getElementById("MathPreview")!=null && document.getElementById("MathPreview")!=undefined){
        this.formula='';
        document.getElementById("MathBuffer").innerHTML='';

      this.formulaRefSnapshot=this.db.list('/formula/'+this.selectedTier1Key, { preserveSnapshot: true });
      this.formulaRefSnapshot.subscribe((data)=>{
         if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
      })

       this.notesRefSnapshot=this.db.list('/notes/'+this.selectedTier1Key, { preserveSnapshot: true });
      this.notesRefSnapshot.subscribe((data)=>{
         if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
      })

      }
    }

    onTier2Change(){
      this.tier2RefSnapShot=this.db.list('/contents/'+this.selectedTier1Key+'/'+this.selectedTier2Key, { preserveSnapshot: true });
      if(document.getElementById("MathPreview")!=null && document.getElementById("MathPreview")!=undefined){
        this.formula='';
        document.getElementById("MathBuffer").innerHTML='';

      this.formulaRefSnapshot=this.db.list('/formula/'+this.selectedTier1Key+'/'+this.selectedTier2Key, { preserveSnapshot: true });
       this.formulaRefSnapshot.subscribe((data)=>{
         if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
      });

           this.notesRefSnapshot=this.db.list('/notes/'+this.selectedTier1Key+'/'+this.selectedTier2Key, { preserveSnapshot: true });
       this.notesRefSnapshot.subscribe((data)=>{
         if(data!=null){
      let mathjax=document.getElementsByClassName('mathjax');
       eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
    }
      });

      }
    }

    addTier3(){
       if(this.selectedTier2Key!=null && this.selectedTier2Key!='' && this.selectedTier2Key!=undefined){
        const tier1Ref =  this.db.list('/contents/'+this.selectedTier1Key+'/'+this.selectedTier2Key);
            tier1Ref.push({ tier3Title : this.tier3.title });
      }
    }
    
  

  

   saveFormula(){
     
     if(this.selectedTier1Key!='' && this.selectedTier2Key!='' && this.selectedTier3Key!='' ){
     this.formulaRef = this.db.list('/formula/'+this.selectedTier1Key+'/'+this.selectedTier2Key+'/'+this.selectedTier3Key);
     this.formulaRef.push({ basic : this.formula,
      tier1Key : this.selectedTier1Key,
      tier2key : this.selectedTier2Key,
      tier3key : this.selectedTier3Key });
     }

     else  if(this.selectedTier1Key!='' && this.selectedTier2Key!=''){
        this.formulaRef = this.db.list('/formula/'+this.selectedTier1Key+'/'+this.selectedTier2Key);
        this.formulaRef.push({ basic : this.formula,
          tier1Key : this.selectedTier1Key,
          tier2key : this.selectedTier2Key });
        }

         else  if(this.selectedTier1Key!=''){
        this.formulaRef = this.db.list('/formula/'+this.selectedTier1Key);
        this.formulaRef.push({ basic : this.formula,
          tier1Key : this.selectedTier1Key });
        }
     
   }

   saveNotes(){
     if(this.selectedTier1Key!='' && this.selectedTier2Key!='' && this.selectedTier3Key!='' ){
     this.notesRef = this.db.list('/notes/'+this.selectedTier1Key+'/'+this.selectedTier2Key+'/'+this.selectedTier3Key);
     this.notesRef.push({ note : this.formula,
      tier1Key : this.selectedTier1Key,
      tier2key : this.selectedTier2Key,
      tier3key : this.selectedTier3Key });
     }

     else  if(this.selectedTier1Key!='' && this.selectedTier2Key!=''){
        this.notesRef = this.db.list('/notes/'+this.selectedTier1Key+'/'+this.selectedTier2Key);
        this.notesRef.push({ note : this.formula,
          tier1Key : this.selectedTier1Key,
          tier2key : this.selectedTier2Key });
        }

         else  if(this.selectedTier1Key!=''){
        this.notesRef = this.db.list('/formula/'+this.selectedTier1Key);
        this.notesRef.push({ note : this.formula,
          tier1Key : this.selectedTier1Key });
        }
     
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
    this.preview = document.getElementById("MathPreview");
    this.buffer = document.getElementById("MathBuffer");
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
