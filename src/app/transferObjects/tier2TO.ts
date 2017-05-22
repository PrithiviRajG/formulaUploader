import {Tier3} from './tier3TO';
export class Tier2{
    title : String;
    description : String;
    tier3 : Tier3;
    formula : String;

    constructor(){
        this.tier3=new Tier3();
    }
}