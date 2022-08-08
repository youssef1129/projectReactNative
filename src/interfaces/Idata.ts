export interface Idata{
    barCode:string | number;
    articleName:string;
    price:string|number;
    qte?:number|string;
    time?:number|string;
    isChanged?:boolean|false;
    dept?:string|null;
    group?:string|null;
}