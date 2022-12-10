import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import "../app/interfaces/Date";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';
import { NavbarComponent } from './nav/navbar.component';

import { AnalyticsService } from './services/analytics.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    AnalyticsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
