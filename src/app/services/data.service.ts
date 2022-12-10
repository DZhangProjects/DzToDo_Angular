import { Injectable } from "@angular/core";
import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, child, get, set, DataSnapshot } from "firebase/database";
import { Goal } from "../interfaces/Goal";
import { Task } from "../interfaces/Task";
import { GoalRule } from "../interfaces/GoalRule";
import { TaskRule } from "../interfaces/TaskRule";


@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor() { }

    firebaseApp!: FirebaseApp;
    uid!: string;
    databaseURL: string = "https://dztodo-default-rtdb.firebaseio.com/";

    goalRules: GoalRule[] = [];
    taskRules: TaskRule[] = [];


    /**
     * Sets the firebase app after initializing in app.component.ts on startup
     * so this service can utilize it to modify data
     * @param {FirebaseApp} firebaseApp Firebase app
     */
    public setFirebaseApp(firebaseApp: FirebaseApp): void {
        this.firebaseApp = firebaseApp;
    }

    /**
     * Gets data from Firebase Realtime database
     * @param {string} path The path to get data from
     */
    public async getData(path: string): Promise<any> {
        const dbRef = ref(getDatabase(this.firebaseApp, this.databaseURL));
        const snapshot: DataSnapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }

    /**
     * Gets Goal Rules from realtime database and stores them as a GoalRule object
     */
    public async getGoalRules(user: string): Promise<void> {
        const data = await this.getData("/users/" + user + "/goalRules/");
        if (data) {
            for (const key of Object.keys(data)) {
                const goalRule: any = data[key];
                this.goalRules.push(new GoalRule(goalRule.repeat, goalRule.on, goalRule.title, goalRule.desc, goalRule.priority, new Date(goalRule.init), goalRule.until == "undefined" ? undefined : goalRule.until, goalRule.forDays));
            }
        }
    }

    /**
     * Gets TaskRules from realtime database and stores them as a TaskRule object
     */
    public async getTaskRules(user: string): Promise<void> {
        const data = await this.getData("/users/" + user + "/taskRules/");
        if (data) {
            for (const key of Object.keys(data)) {
                const taskRule: any = data[key];
                this.taskRules.push(new TaskRule(taskRule.repeat, taskRule.on, taskRule.at, taskRule.title, taskRule.desc, taskRule.priority, new Date(taskRule.init), taskRule.until == "undefined" ? undefined : taskRule.until));
            }
        }
    }


    /**
     * Gets Rules from database
     * @param {string} user User uid 
     */
    public async getRules(user: string): Promise<void> {
        await this.getGoalRules(user);
        await this.getTaskRules(user);
    }

    /**
     * Creates a new Goal Rule in the realtime database
     * @param {string} user User firebase id
     * @param {GoalRule} newGoalRule new Goal Rule object to add to database
     */
    public async setGoalRule(user: string, newGoalRule: GoalRule): Promise<void> {
        const db = getDatabase(this.firebaseApp, this.databaseURL);
        await set(ref(db, "users/" + user + "goalRules/" + newGoalRule.id), newGoalRule.getFirebaseGoalRule());
    }

    /**
     * Creates a new Task Rule in the realtime database
     * @param {string} user User firebase id
     * @param {TaskRule} newTaskRule new Task Rule object to add to database
     */
    public async setTaskRule(user: string, newTaskRule: TaskRule): Promise<void> {
        const db = getDatabase(this.firebaseApp, this.databaseURL);
        await set(ref(db, "users/" + user + "/taskRules/" + newTaskRule.id), newTaskRule.getFirebaseTaskRule());
    }


    /**
     * Executes all Goal Rules for a given date and returns array of Goals
     * @param {Date} date Date to get Goals 
     * @returns {Goal[]} Array of Goals
     */
    private getGoals(date: Date): Goal[] {
        const goals: Goal[] = [];
        for (const goalRule of this.goalRules) {
            const goal: Goal | undefined = goalRule.getGoal(date);
            if (goal) { goals.push(goal) };
        }
        return goals;
    }

    public getDisplayGoals = this.getGoals;


    /**
     * Executes all Task Rules for a given date and returns array of Tasks
     * @param {Date} date Date to get Tasks 
     * @returns {Task[]} Array of Tasks
     */
    private getTasks(date: Date): Task[] {
        const tasks: Task[] = [];
        for (const taskRule of this.taskRules) {
            const task: Task | undefined = taskRule.getTask(date);
            if (task) { tasks.push(task) };
        }
        return tasks;
    }


    /**
     * Returns a blank placeholder Task for hours with no Task
     * @param {Date} date Date to create placeholder for (assumes valid hours) 
     * @returns {Task} Placeholder Task
     */
    private getEmptyTask(date: Date): Task {
        return new Task(date, "", "", -1, false, date, "0");
    }


    /**
     * Returns a blank placeholder Task array to initialize a day's schedule
     * @param {Date} date Date to create placeholder array for (assumes valid hours) 
     * @returns {Task} Placeholder Task array
     */
    private getEmptyTaskArray(date: Date): Task[] {
        const tasks: Task[] = [];
        for (let i = 0; i < 24; i++) {
            tasks.push(this.getEmptyTask(date));
        }
        return tasks;
    }


    /**
     * Gets an array of Tasks to display (unscheduled hours have a placeholder Task)
     * @param {Date} date Date to get display Task array
     * @returns {Task[]} Task array of length 24, 1 for each hour of the day
     */
    public getDisplayTasks(date: Date): Task[] {
        const displayGoals: Task[] = this.getEmptyTaskArray(date);
        for (const task of this.getTasks(date)) {
            const hour: number = task.date.getHours();
            if (displayGoals[hour].id == "0") {
                displayGoals[hour] = task;
            } else {
                displayGoals[hour] = displayGoals[hour].compare(task);
            }
        }
        return displayGoals;
    }
}