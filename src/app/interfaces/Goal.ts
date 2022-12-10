import { Initiative } from './Initiative';

export class Goal extends Initiative {
    constructor(init: Date, title: string, desc: string, priority: number, complete: boolean, date?: Date, id?: string) {
        super(init, title, desc, priority, complete, date, id);
    };
}