
export interface TaskObj {
    id:string,
    sortPrior?: number,
    data: {
        name: string,
        status: string,
        desc: string,
        date: string,
        prior: string
    }
}
