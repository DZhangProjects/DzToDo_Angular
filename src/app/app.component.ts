import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from "../environments/environment";
import { AnalyticsService } from './services/analytics.service';
import { AuthService } from './services/auth.service';
import { getAuth } from 'firebase/auth';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private _analyticsService: AnalyticsService,
    private _authService: AuthService,
    private _dataService: DataService
  ) { }

  title = 'DzToDo';

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    this._dataService.setFirebaseApp(app);
    this._dataService.setFirestore();
    this._analyticsService.setAnalytics(getAnalytics(app));
    // this._databaseService.getRealtimeRankings().then(() => {
    // this._dataService.realtimeToRanking();
    // });
    this._authService.setProvider(getAuth(app));
    // this._dataService.setGoalRule(this._authService.user.uid)
    console.log('Connected DZ');
  }

}
