import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from "../environments/environment";
import { AnalyticsService } from './services/analytics.service';
import { AuthService } from './services/auth.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private _analyticsService: AnalyticsService,
    private _authService: AuthService
  ) { }

  title = 'DzToDo';

  ngOnInit(): void {
    const app = initializeApp(environment.firebaseConfig);
    // this._databaseService.setFirebaseApp(app);
    this._analyticsService.setAnalytics(getAnalytics(app));
    // this._databaseService.getRealtimeRankings().then(() => {
    // this._dataService.realtimeToRanking();
    // });
    this._authService.setProvider(getAuth(app));
    console.log('Connected DZ');
  }

}
