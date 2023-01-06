import { Injectable } from "@angular/core";
import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, child, get, set, DataSnapshot } from "firebase/database";
import { getFirestore, getDocs, collection, CollectionReference, QuerySnapshot, DocumentData, Firestore, addDoc, setDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Goal } from "../interfaces/Goal";
import { Task } from "../interfaces/Task";
import { GoalRule } from "../interfaces/GoalRule";
import { TaskRule } from "../interfaces/TaskRule";
import { v4 } from "uuid";


@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor() { }

    firebaseApp!: FirebaseApp;
    firestore!: Firestore;
    uid!: string;
    databaseURL: string = "https://dztodo-default-rtdb.firebaseio.com/";

    goalRules: GoalRule[] = [];
    taskRules: TaskRule[] = [];

    completedGoals: string[] = [];


    /**
     * Sets the firebase app after initializing in app.component.ts on startup
     * so this service can utilize it to modify data
     * @param {FirebaseApp} firebaseApp Firebase app
     */
    public setFirebaseApp(firebaseApp: FirebaseApp): void {
        this.firebaseApp = firebaseApp;
    }

    public setFirestore(): void {
        this.firestore = getFirestore(this.firebaseApp);
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
        const goalRules: GoalRule[] = [];
        const data = await this.getData("/users/" + user + "/goalRules/");
        if (data) {
            for (const key of Object.keys(data)) {
                const goalRule: any = data[key];
                goalRules.push(new GoalRule(goalRule.repeat, goalRule.on, goalRule.title, goalRule.desc, goalRule.priority, new Date(goalRule.init), goalRule.until == "undefined" ? undefined : goalRule.until, goalRule.forDays, goalRule.id));
            }
        }
        this.goalRules = goalRules;
    }

    /**
     * Gets TaskRules from realtime database and stores them as a TaskRule object
     */
    public async getTaskRules(user: string): Promise<void> {
        const taskRules: TaskRule[] = [];
        const data = await this.getData("/users/" + user + "/taskRules/");
        if (data) {
            for (const key of Object.keys(data)) {
                const taskRule: any = data[key];
                taskRules.push(new TaskRule(taskRule.repeat, taskRule.on, taskRule.at, taskRule.title, taskRule.desc, taskRule.priority, new Date(taskRule.init), taskRule.until == "undefined" ? undefined : taskRule.until, taskRule.id));
            }
        }
        this.taskRules = taskRules;
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
        await set(ref(db, "users/" + user + "/goalRules/" + newGoalRule.id), newGoalRule.getFirebaseGoalRule());
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
     * Creates a new Goal Rule in the realtime database
     * @param {string} user User firebase id
     * @param {GoalRule} newGoalRule new Goal Rule object to add to database
     */
    public async deleteGoalRule(user: string, newGoalRule: GoalRule): Promise<void> {
        const db = getDatabase(this.firebaseApp, this.databaseURL);
        await set(ref(db, "users/" + user + "/goalRules/" + newGoalRule.id), null);
    }

    /**
     * Creates a new Task Rule in the realtime database
     * @param {string} user User firebase id
     * @param {TaskRule} newTaskRule new Task Rule object to add to database
     */
    public async deleteTaskRule(user: string, newTaskRule: TaskRule): Promise<void> {
        const db = getDatabase(this.firebaseApp, this.databaseURL);
        await set(ref(db, "users/" + user + "/taskRules/" + newTaskRule.id), null);
    }

    /**
     * Creates a Firestore document for a user with the completedGoals field if it does not already exist
     * @param {string} user User firebase id
     */
    public async initCompletedGoals(user: string): Promise<void> {
        const docRef = doc(this.firestore, 'users', user);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(doc(this.firestore, "users", user), {
                completedGoals: [],
            });
        }

    }

    /**
     * Updates a user's Firestore list of completed goals to either add or remove a goal id
     * @param {string} user User firebase id
     * @param {string} goalId Id of the goal to complete/uncomplete
     * @param {boolean} complete Optional parameter. If true or undefined, adds goal id to completed list, removes otherwise
     */
    public async setCompletedGoals(user: string, goalId: string, complete?: boolean): Promise<void> {
        try {
            const docRef = doc(this.firestore, 'users', user);
            await updateDoc(docRef, {
                completedGoals: complete == false ? arrayRemove(goalId) : arrayUnion(goalId),
            })
        } catch (e) {
            console.error("Error updating completed goals: ", e);
        }
    }

    /**
     * Gets all completed goal ids from a user's firebase
     * @param {string} user User firebase id
     */
    public async getCompletedGoals(user: string): Promise<void> {
        const docRef = doc(this.firestore, 'users', user);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            this.completedGoals = docSnap.data()['completedGoals'];
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    // /**
    //  * Creates a new Goal Rule in the realtime database
    //  * @param {string} user User firebase id
    //  * @param {GoalRule} newGoalRule new Goal Rule object to add to database
    //  */
    // public async updateGoalRule(user: string, newGoalRule: GoalRule): Promise<void> {
    //     const db = getDatabase(this.firebaseApp, this.databaseURL);
    //     await set(ref(db, "users/" + user + "goalRules/" + newGoalRule.id), newGoalRule.getFirebaseGoalRule());
    // }

    // /**
    //  * Creates a new Task Rule in the realtime database
    //  * @param {string} user User firebase id
    //  * @param {TaskRule} newTaskRule new Task Rule object to add to database
    //  */
    // public async updateTaskRule(user: string, newTaskRule: TaskRule): Promise<void> {
    //     const db = getDatabase(this.firebaseApp, this.databaseURL);
    //     await set(ref(db, "users/" + user + "/taskRules/" + newTaskRule.id), newTaskRule.getFirebaseTaskRule());
    // }


    /**
     * Executes all Goal Rules for a given date and returns array of Goals
     * @param {Date} date Date to get Goals 
     * @returns {Goal[]} Array of Goals
     */
    private getGoals(date: Date): Goal[] {
        const goals: Goal[] = [];
        for (const goalRule of this.goalRules) {
            const goal: Goal | undefined = goalRule.getGoal(date);
            if (goal) {
                if (this.completedGoals.includes(goal.id)) { goal.complete = true; };
                goals.push(goal);
            };
        }
        if (goals.length < 1) { goals.push(new Goal(date, "Nothing scheduled", "", 0, false, date, 'None')) };
        return goals;
    }

    public getDisplayGoals = this.getGoals;


    /**
     * Gets the goals for an entire week, divided into an array per day
     * @param {Date} date any day in the target week (starting sunday) 
     * @returns {Goal[][]} An array of Goal arrays
     */
    public getWeekGoals(date: Date): Goal[][] {
        const weekGoals: Goal[][] = [[], [], [], [], [], [], []];
        const day: Date = date.getSunday();
        for (let i = 0; i < weekGoals.length; i++) {
            weekGoals[i] = this.getGoals(day.copy());
            day.toTomorrow();
        }
        return weekGoals;
    }


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
    private getEmptyTask(date: Date, hour: number): Task {
        const newDate: Date = date.copy();
        newDate.setHours(hour);
        return new Task(date, "", "", -1, false, newDate.copy(), v4() + 'PLACEHOLDER');
    }


    /**
     * Returns a blank placeholder Task array to initialize a day's schedule
     * @param {Date} date Date to create placeholder array for (assumes valid hours) 
     * @returns {Task} Placeholder Task array
     */
    private getEmptyTaskArray(date: Date): Task[] {
        const tasks: Task[] = [];
        for (let i = 0; i < 24; i++) {
            tasks.push(this.getEmptyTask(date, i));
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
            if (displayGoals[hour].id.slice(-11) == 'PLACEHOLDER') {
                displayGoals[hour] = task;
            } else {
                displayGoals[hour] = displayGoals[hour].compare(task);
            }
        }
        return displayGoals;
    }

    /**
     * Initializes the data fields that are referenced in other components
     * @param {string} user User firebase id
     */
    public async initData(user: string): Promise<void> {
        await this.initCompletedGoals(user);
        await this.getRules(user);
        await this.getCompletedGoals(user);
    }
}