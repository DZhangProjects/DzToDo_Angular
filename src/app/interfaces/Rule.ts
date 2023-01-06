import { v4 } from "uuid";

export class Rule {

    id: string;
    init: Date;
    until: Date | undefined;                                // When this Rule expires
    repeat: "day" | "week" | "month" | "year" | "never";    // Frequency at which a Task/Goal occurs
    on: number;                                             // Day of Week / Day of Month / Day of Year to repeat Task or start Goal
    title: string;                                          // Name of Task/Goal to display
    desc: string;                                           // Long description of Task/Goal to display when expanded
    priority: number;                                       // Level of priority of Task/Goal (Has Due Date / Sometime Today / Sometime Soon / Sometime in the Future)

    constructor(repeat: "day" | "week" | "month" | "year" | "never", on: number, title: string, desc: string, priority: number, init?: Date, until?: Date, id?: string) {
        // this.active = true;
        this.id = id ? id : v4();
        this.init = init ? init : new Date();
        this.until = until;
        this.repeat = repeat;
        this.on = on;
        this.title = title;
        this.desc = desc;
        this.priority = priority;
    }

    /**
     * Checks if the rule is expired
     * @param {Date} date Optional parameter to check if the rule is expired at a certain date 
     * @returns {boolean} True if expired, false otherwise
     */
    public isExpired(date?: Date): boolean {
        return this.until ? (date ? (date > this.until) : (new Date() > this.until)) : false;
    }


    /**
     * Checks date to see if it is the start of a Goal interval
     * @param {Date} date Date to check
     * @returns {boolean} True if it is the start of a Goal interval
     */
    private isStart(date: Date): boolean {
        switch (this.repeat) {
            case "day":
                return true;
                break;
            case "week":
                if (date.getDay() == this.on) {
                    return true;
                }
                break;
            case "month":
                if (date.getDate() == this.on) {
                    return true;
                }
                break;
            case "year":
                if (date.getDOY() == this.on) {
                    return true;
                }
                break;
            case "never":
                if (date == this.init) {
                    return true;
                }
                break;
        }
        return false;
    }


    /**
     * Gets the last start date for a Goal interval
     * @param {Date} date Date to get last start interval of 
     * @returns 
     */
    public lastStart(date: Date): Date | undefined {
        const checkDate: Date = new Date(date.getTime());
        while (!this.isStart(checkDate)) {
            checkDate.setDate(checkDate.getDate() - 1)
            if (checkDate < this.init) { return undefined; }
        }
        return checkDate;
    }


    /**
     * Sets the rule to terminate today
     */
    public terminateRule(): void {
        this.until = new Date();
    }


    /**
     * Modifies the Task/Goal Title
     * @param {string} newTitle New title to set Task/Goal to
     */
    public editTitle(newTitle: string): void {
        this.title = newTitle;
    }


    /**
     * Modifies the Task/Goal Description
     * @param {string} newDesc New Description to set Task/Goal to
     */
    public editDescription(newDesc: string): void {
        this.desc = newDesc;
    }


    /**
     * Modifies the Task/Goal Description
     * @param {number} newPrio New Description to set Task/Goal to
     */
    public setPriority(newPrio: number): void {
        this.priority = newPrio;
    }
}