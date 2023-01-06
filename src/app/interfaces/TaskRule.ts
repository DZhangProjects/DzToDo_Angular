import { v4 } from "uuid";
import { Task } from "./Task";
import { Rule } from "./Rule";

export class TaskRule extends Rule {

    at: number;

    constructor(repeat: "day" | "week" | "month" | "year" | "never", on: number, at: number, title: string, desc: string, priority: number, init?: Date, until?: Date, id?: string) {
        super(repeat, on, title, desc, priority, init, until, id);
        this.at = at;
    }


    /**
     * Checks if there is a Task created by this rule on given date and returns it
     * @param {Date} date Date to check if rule applies
     * @returns {Task | void} Task if applies to date, undefined otherwise
     */
    public getTask(date: Date): Task | undefined {
        const newDate: Date = date.copy();

        if (this.isExpired(newDate) || newDate < this.init.toStart()) { return; }

        const id: string = this.id + "-" + String(newDate.getFullYear()) + String(newDate.getMonth()) + String(newDate.getDate());
        const init: Date = this.init;
        const title: string = this.title;
        const desc: string = this.desc;
        const priority: number = this.priority;
        const complete: boolean = false;
        switch (this.repeat) {
            case "day":
                newDate.setHours(this.at);
                break
            case "week":
                if (newDate.getDay() == this.on) {
                    newDate.setHours(this.at);
                } else {
                    return;
                }
                break;
            case "month":
                if (newDate.getDate() == this.on) {
                    newDate.setHours(this.at);
                } else {
                    return;
                }
                break;
            case "year":
                if (newDate.getDOY() == this.on) {
                    newDate.setHours(this.at);
                } else {
                    return;
                }
                break;
            case "never":
                if (newDate.toMDY() == this.init.toMDY()) {
                    newDate.setHours(this.at);
                } else {
                    return;
                }
                break;
            default:
                return;
        }
        return new Task(init, title, desc, priority, complete, newDate, id);
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