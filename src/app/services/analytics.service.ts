import { Injectable } from "@angular/core";
import { Analytics, logEvent } from "firebase/analytics";

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    constructor() { }

    private analytics!: Analytics;

    public setAnalytics(analytics: Analytics): void {
        this.analytics = analytics;
    }

    /**
     * Logs and event to Google Analytics
     * @param {string} eventName An event to log
     */
    public log(eventName: string, eventParams?: any): void {
        logEvent(this.analytics, eventName, eventParams);
    }
}