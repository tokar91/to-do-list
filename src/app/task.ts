export class Task {
    name: string;
    status: string = 'do zrobienia';
    desc: string = ''; // hold empty string instead of undefined for database
    date: string = ''; 
    prior: string = 'średni';

    constructor (name:string, status?:string, desc?:string,
                 date?:string, prior?:string){
        this.name = name;
        if(status) this.status = status;
        if(typeof desc === 'string' && desc.trim()) this.desc = desc;
        if(date) this.date = date;
        if(prior) this.prior = prior;
    }
}
