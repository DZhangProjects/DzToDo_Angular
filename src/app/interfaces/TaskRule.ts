import { v4 } from "uuid";
import { Task } from "./Task";
import { Rule } from "./Rule";

export class TaskRule extends Rule {

    at: number;

    constructor(repeat: "day" | "week" | "month" | "year" | "never", on: number, at: number, title: string, desc: string, priority: number, init?: Date, until?: Date) {
        super(repeat, on, title, desc, priority, init, until);
        this.at = at;
    }


    /**
     * Checks if there is a Task created by this rule on given date and returns it
     * @param {Date} date Date to check if rule applies
     * @returns {Task | void} Task if applies to date, undefined otherwise
     */
    public getTask(date: Date): Task | undefined {

        if (this.isExpired(date) || date < this.init) { return; }

        const id: string = this.id + "-" + String(date.getFullYear()) + String(date.getMonth()) + String(date.getDate());
        const init: Date = this.init;
        const title: string = this.title;
        const desc: string = this.desc;
        const priority: number = this.priority;
        const complete: boolean = false;
        switch (this.repeat) {
            case "day":
                date.setHours(this.at);
                break
            case "week":
                if (date.getDay() == this.on) {
                    date.setHours(this.at);
                }
                break;
            case "month":
                if (date.getDate() == this.on) {
                    date.setHours(this.at);
                }
                break;
            case "year":
                if (date.getDOY() == this.on) {
                    date.setHours(this.at);
                }
                break;
            default:
                return;
        }
        return new Task(init, title, desc, priority, complete, date, id);
    }


    public getFirebaseTaskRule(): any {
        return {
            id: this.id,
            init: this.init.getTime(),
            until: this.until ? this.until : "undefined",
            repeat: this.repeat,
            on: this.on,
            at: this.at,
            title: this.title,
            desc: this.desc,
            priority: this.priority
        }
    }

}