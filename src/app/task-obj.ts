
export interface TaskObj {
    id:string,
    sortPrior?: number,
    sortDate?: string,
    data: {
        name: string,
        status: string,
        desc: string,
        date: string,
        prior: string
    }
}
