import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GoalRule } from 'src/app/interfaces/GoalRule';
import { TaskRule } from 'src/app/interfaces/TaskRule';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import '../../interfaces/Number';

@Component({
    selector: 'td-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.styles.scss'],
})
export class RulesComponent implements OnInit {
    constructor(
        private _dataService: DataService,
        private _authService: AuthService
    ) { }

    taskRules: TaskRule[] = [];
    goalRules: GoalRule[] = [];

    activeRule: TaskRule | GoalRule | undefined;                                                            // Whether there is an active rule to display
    activeTaskRule!: TaskRule;
    activeGoalRule!: GoalRule;

    formType: "task" | "goal" | undefined;                                                                  // Whether the form type should be for Task or Goal
    newEdit: "new" | "edit" | undefined;                                                                    // Whether the form is to edit an existing or to create a new Task/Goal

    formTitle: string = '';
    formDesc: string = '';
    formRepeat: "day" | "week" | "month" | "year" | "never" = "week";
    formOn: number = 1;
    formPriority: number = 1;
    formUntil: Date | undefined;
    formForDays: number = 1;

    formTypeClass: string = "rule-detailsFrame";

    weekList: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayList: string[] = [];
    onValue: string = '';

    hourList: string[] = [];
    atValue: string = '';

    untilValue: string = '';

    ngOnInit(): void {
        this.initRules();
        this.initDayList();
        this.initHourList();
    }

    public toFormType(type: "task" | "goal" | undefined, newEdit?: "new" | "edit"): void {
        this.formType = type;
        this.newEdit = newEdit;
        switch (type) {
            case "task":
                this.formTypeClass = "rule-detailsFrame bgBlueStatic";
                break;
            case "goal":
                this.formTypeClass = "rule-detailsFrame bgOrangeStatic";
                break;
            default:
                this.formTypeClass = "rule-detailsFrame bgBlueStatic";
        }
    }

    public initRules(): void {
        this.taskRules = this._dataService.taskRules;
        this.goalRules = this._dataService.goalRules;
    }

    public initDayList(): void {
        const nums: string[] = [];
        for (let i = 0; i < 31; i++) {
            nums.push((i + 1).toOrdinal());
        }
        this.dayList = nums;
    }

    public initHourList(): void {
        const hours: string[] = [];
        for (let i = 0; i < 24; i++) {
            hours.push(String(i) + ':00');
        }
        this.hourList = hours;
    }

    public setRuleFromId(id: string): void {
        if (this.formType == 'goal') {
            for (const goal of this.goalRules) {
                if (goal.id == id) {
                    this.setActiveRule(goal);
                }
            }
        } else if (this.formType == 'task') {
            for (const task of this.taskRules) {
                if (task.id == id) {
                    this.setActiveRule(task);
                }
            }
        }
    }

    public setActiveRule(rule: GoalRule | TaskRule | undefined): void {
        this.activeRule = rule;

        if (rule != undefined) {
            this.formTitle = rule.title;
            this.formDesc = rule.desc;
            this.formRepeat = rule.repeat;
            this.formOn = rule.on;
            this.formPriority = rule.priority;
            this.formUntil = rule.until;
            this.untilValue = rule.until ? rule.until.toMDY() : '';


            switch (rule.repeat) {
                case "day":
                    this.onValue = '';
                    break;
                case "week":
                    this.onValue = this.weekList[rule.on];
                    break;
                case "month":
                    this.onValue = this.dayList[rule.on];
                    break;
                case "year":
                    const onDate = new Date()
                    onDate.setDate(new Date('1/1/2023').getDate() + rule.on);
                    this.onValue = onDate.toMDY();
                    break;
                case "never":
                    this.onValue = new Date().toMDY();;
                    break;
            }
        }

        if (rule instanceof GoalRule) {
            this.toFormType('goal');
            this.activeGoalRule = rule;
            this.formForDays = rule.forDays;
        } else if (rule instanceof TaskRule) {
            this.toFormType('task');
            this.activeTaskRule = rule;
            this.atValue = this.hourList[rule.at];
        }
    }

    public getSubtitle(initiative: GoalRule | TaskRule): string {
        return initiative.repeat == 'never' ? 'Never Repeats' : ('Every ' + initiative.repeat + (initiative.repeat == 'day' ? '' : initiative.repeat == 'week' ? ' on ' + this.weekList[initiative.on] : ' on the ' + initiative.on.toOrdinal()));
    }

    public setFormPriority(n: number): void {
        this.formPriority = n;
    }

    public setFormVars(): void {
        switch (this.formRepeat) {
            case "day":
                this.formOn = 1;
                break;
            case "week":
                this.formOn = this.weekList.indexOf(this.onValue);
                break;
            case "month":
                this.formOn = this.dayList.indexOf(this.onValue);
                break;
            case "year":
                this.formOn = new Date(this.onValue).getDOY();
                break;
            case "never":
                this.formOn = new Date().getDate();
                break;
        }

        if (this.untilValue) {
            this.formUntil = new Date(this.untilValue);
        }
    }

    public isError(): boolean {
        return false;
    }

    public generateTaskRule(): TaskRule {
        this.setFormVars();
        return new TaskRule(this.formRepeat, this.formOn, this.hourList.indexOf(this.atValue), this.formTitle, this.formDesc, this.formPriority, new Date(), this.formUntil, this.activeRule ? this.activeTaskRule.id : undefined);
    }

    public generateGoalRule(): GoalRule {
        this.setFormVars();
        return new GoalRule(this.formRepeat, this.formOn, this.formTitle, this.formDesc, this.formPriority, new Date(), this.formUntil, this.formForDays, this.activeRule ? this.activeGoalRule.id : undefined);
    }

    public async submit(): Promise<void> {
        if (!this.isError()) {
            switch (this.formType) {
                case "goal":
                    const goalRule: GoalRule = this.generateGoalRule();
                    await this._dataService.setGoalRule(this._authService.user.uid, goalRule).then(async () => {
                        await this._dataService.initData(this._authService.user.uid).then(() => {
                            this.initRules();
                            this.newEdit = undefined;
                            this.setRuleFromId(this.activeRule ? this.activeRule.id : goalRule.id);
                        });
                    });
                    break;
                case "task":
                    const taskRule: TaskRule = this.generateTaskRule();
                    await this._dataService.setTaskRule(this._authService.user.uid, taskRule).then(async () => {
                        await this._dataService.initData(this._authService.user.uid).then(() => {
                            this.initRules();
                            this.newEdit = undefined;
                            this.setRuleFromId(this.activeRule ? this.activeRule.id : taskRule.id);
                        });
                    });
            }
        }
    }
}