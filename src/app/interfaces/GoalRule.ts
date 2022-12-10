import { v4 } from "uuid";
import { Goal } from "./Goal";
import { Rule } from "./Rule";

export class GoalRule extends Rule {

    forDays: number;

    constructor(repeat: "day" | "week" | "month" | "year" | "never", on: number, title: string, desc: string, priority: number, init?: Date, until?: Date, forDays?: number) {
        super(repeat, on, title, desc, priority, init, until);
        this.forDays = forDays ? forDays : 1;
    }


    /**
     * Checks if date is within a Goal interval
     * @param {Date} date Date to check 
     * @returns {boolean} True if date is within an Goal interval, false otherwise
     */
    private isWithinInterval(date: Date): boolean {
        const start: Date | undefined = this.lastStart(date);
        if (!start) {
            return false;
        } else {
            const end: Date = new Date(new Date(start.getTime()).setDate(start.getDate() + this.forDays));
            return (date >= start) && (date < end);
        }
    }


    /**
     * Checks if there is a Goal created by this rule on given date and returns it
     * @param {Date} date Date to check if rule applies
     * @returns {Goal | void} Goal if applies to date, undefined otherwise
     */
    public getGoal(date: Date): Goal | undefined {

        if (this.isExpired(date) || date < this.init || !this.isWithinInterval(date)) { return; }

        const id: string = this.id + "-" + String(date.getFullYear()) + String(date.getMonth()) + String(date.getDate());
        const init: Date = this.init;
        const title: string = this.title;
        const desc: string = this.desc;
        const priority: number = this.priority;
        const complete: boolean = false;

        return new Goal(init, title, desc, priority, complete, date, id);
    }


    public getFirebaseGoalRule(): any {
        return {
            id: this.id,
            init: this.init.getTime(),
            until: this.until ? this.until : "undefined",
            repeat: this.repeat,
            on: this.on,
            forDays: this.forDays,
            title: this.title,
            desc: this.desc,
            priority: this.priority
        }
    }

}