import { v4 } from 'uuid';

class Task {

    id: string;         // Unique ID for the Task
    title: string;      // Name of Task to display
    desc: string;       // Long description of Task to display when expanded
    due: Date;          // Date/Time when Task is due (optional)
    priority: number;   // Level of priority of task (Has Due Date / Sometime Today / Sometime Soon / Sometime in the Future)
    complete: boolean;  // Whether or not a Task is completed

    constructor(title: string, desc: string, priority: number, complete: boolean, due?: Date) {
        this.id = v4();                     // UUID
        this.title = title;
        this.desc = desc;
        this.due = due ? due : new Date();
        this.priority = priority;
        this.complete = complete;
    }

    /**
     * Toggles whether a Task is complete or not
     * 
     * @params None
     * @return {void} None
     */
    public toggleComplete(): void {
        this.complete = !this.complete;
    }
}