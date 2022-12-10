import { v4 } from 'uuid';

export class Initiative {

    id: string;         // Unique ID for the Task/Goal
    init: Date;         // The date of initialization of TaskRule/GoalRule
    title: string;      // Name of Task/Goal to display
    desc: string;       // Long description of Task/Goal to display when expanded
    date: Date;         // Date when Task/Goal is due (optional)
    priority: number;   // Level of priority of Task/Goal (Has Due Date / Sometime Today / Sometime Soon / Sometime in the Future)
    complete: boolean;  // Whether or not a Task/Goal is completed

    constructor(init: Date, title: string, desc: string, priority: number, complete: boolean, date?: Date, id?: string) {
        this.id = id ? id : v4();                     // UUID
        this.init = init;
        this.title = title;
        this.desc = desc;
        this.date = date ? date : new Date();
        this.priority = priority;
        this.complete = complete;
    }

    /**
     * Toggles whether a Task/Goal is complete or not
     * 
     * @params None
     * @return {void} None
     */
    public toggleComplete(): void {
        this.complete = !this.complete;
    }

    /**
     * Renames the title of the Task/Goal
     * 
     * @param {string} newName The title to change to 
     * @returns {boolean} True if completed, false otherwise
     */
    public renameEvent(newName: string): boolean {
        try {
            this.title = newName;
            return true;
        } catch (e) {
            return false;
        }
    }


    /**
     * Compares Task/Goal to another Task/Goal and returns the Task/Goal with higher priority.
     * If priority is the same, returns the one initialized first.
     * @param otherTask 
     * @returns 
     */
    public compare(otherTask: Initiative): Initiative {
        if (this.priority == otherTask.priority) {
            return this.init < otherTask.init ? this : otherTask;
        }
        return this.priority > otherTask.priority ? this : otherTask;
    }
}