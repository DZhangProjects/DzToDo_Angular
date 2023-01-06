import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import "../app/interfaces/Date";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignInWithGoogleComponent } from './login/withGoogle/withGoogle.component';
import { HomeComponent } from './main/home/home.component';
import { RulesComponent } from './main/rules/rules.component';
import { NavbarComponent } from './nav/navbar.component';

import { AnalyticsService } from './services/analytics.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/authGuard.service';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    SignInWithGoogleComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    AnalyticsService,
    AuthService,
    DataService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
