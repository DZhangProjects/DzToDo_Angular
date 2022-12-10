import { v4 } from 'uuid';

export class Task {

    id: string;         // Unique ID for the Task
    title: string;      // Name of Task to display
    desc: string;       // Long description of Task to display when expanded
    date: Date;         // Date when Task is due (optional)
    priority: number;   // Level of priority of task (Has Due Date / Sometime Today / Sometime Soon / Sometime in the Future)
    complete: boolean;  // Whether or not a Task is completed

    constructor(title: string, desc: string, priority: number, complete: boolean, date?: Date, id?: string) {
        this.id = id ? id : v4();                     // UUID
        this.title = title;
        this.desc = desc;
        this.date = date ? date : new Date();
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

    /**
     * Renames the title of the task
     * 
     * @param {string} newName The title to change to 
     * @returns {boolean} True if completed, false otherwise
     */
    public renameTask(newName: string): boolean {
        try {
            this.title = newName;
            return true;
        } catch (e) {
            return false;
        }
    }
}