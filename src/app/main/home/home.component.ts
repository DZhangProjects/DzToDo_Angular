import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Task } from 'src/app/interfaces/Task';
import { Goal } from 'src/app/interfaces/Goal';
import { AuthService } from 'src/app/services/auth.service';
import { TaskRule } from 'src/app/interfaces/TaskRule';

@Component({
    selector: 'td-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.styles.scss'],
})
export class HomeComponent implements OnInit {
    constructor(
        private _dataService: DataService,
        private _authService: AuthService,
        private _router: Router,
    ) { }

    currentDay: Date = new Date();
    currentDayTasks: Task[] = [];
    currentDayGoals: Goal[] = [];
    weekGoals: Goal[][] = [];
    daysOfWeek: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    editTask: Task | undefined;
    editTaskName: string = '';

    ngOnInit(): void {
        this.initForDay(new Date());
    }

    public initForDay(date: Date): void {
        const startDate: Date = date.copy().toStart();
        this.currentDay = startDate;
        this.currentDayTasks = this._dataService.getDisplayTasks(startDate);
        // console.log(this.currentDayTasks);
        this.currentDayGoals = this._dataService.getDisplayGoals(startDate);
        this.weekGoals = this._dataService.getWeekGoals(startDate);
    }

    public isEdit(task: Task): boolean {
        return task.id == this.editTask?.id;
    }

    public setEdit(task: Task | undefined): void {
        this.editTaskName = '';
        this.editTask = task;
    }

    public getCurrentDayClass(date: Date): string {
        return (date.toMDY() == this.currentDay.toMDY()) ? "bgPurpleStatic home-weekDayTitle clickable" : "home-weekDayTitle clickable bgPurple";
    }

    public getGoalClass(goal: Goal): string {
        if (goal.id == "None") {
            return "home-noGoal noselect";
        } else {
            return "home-weekDayTask clickable noselect";
        }
    }

    public async toggleGoalComplete(goal: Goal): Promise<void> {
        if (!goal.complete) {
            goal.complete = true;
            await this._dataService.setCompletedGoals(this._authService.user.uid, goal.id, true).then(async () => {
                await this._dataService.initData(this._authService.user.uid).then(() => {
                    this.initForDay(this.currentDay);
                });
            });
        } else {
            goal.complete = false;
            await this._dataService.setCompletedGoals(this._authService.user.uid, goal.id, false).then(async () => {
                await this._dataService.initData(this._authService.user.uid).then(() => {
                    this.initForDay(this.currentDay);
                });
            });
        }
    }

    public async overrideTask(task: Task, newTitle: string): Promise<void> {
        const newRule: TaskRule = new TaskRule("never", 1, task.date.getHours(), newTitle, 'Overridden Task', task.priority + 1, task.date);
        console.log(task.date.getHours());
        await this._dataService.setTaskRule(this._authService.user.uid, newRule).then(async () => {
            await this._dataService.initData(this._authService.user.uid).then(() => {
                this.initForDay(this.currentDay);
            });
        });
    }

    public toRules(): void {
        this._router.navigate(['/rules', 'true']);
    }

}