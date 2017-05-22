import {Tier2} from './tier2TO';
export class Tier1{
    title : String;
    description : String;
    tier2 : Tier2;
    formula : String;

    constructor(){
        this.tier2  =new Tier2()
    }
}