import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Task } from 'src/app/interfaces/Task';
import { Goal } from 'src/app/interfaces/Goal';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'td-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.styles.scss'],
})
export class HomeComponent implements OnInit {
    constructor(
        private _dataService: DataService,
        private _authService: AuthService
    ) { }

    currentDay: Date = new Date();
    currentDayTasks: Task[] = [];
    currentDayGoals: Goal[] = [];
    weekGoals: Goal[][] = [];
    daysOfWeek: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    ngOnInit(): void {
        this.initForDay(new Date());
        console.log(this.weekGoals);
    }

    public initForDay(date: Date): void {
        this.currentDay = date;
        this.currentDayTasks = this._dataService.getDisplayTasks(date);
        this.currentDayGoals = this._dataService.getDisplayGoals(date);
        this.weekGoals = this._dataService.getWeekGoals(date);
    }

    public async toggleGoalComplete(goal: Goal): Promise<void> {
        if (!goal.complete) {
            goal.complete = true;
            await this._dataService.setCompletedGoals(this._authService.user.uid, goal.id, true);
        } else {
            goal.complete = false;
            await this._dataService.setCompletedGoals(this._authService.user.uid, goal.id, false);
        }
    }

}