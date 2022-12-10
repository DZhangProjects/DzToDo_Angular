import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'td-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.styles.scss'],
})
export class NavbarComponent {
    constructor(
        private _authService: AuthService
    ) { }

    dock: boolean = false;

    /**
     * Toggles the signin dialogue box
     */
    public toggleDock(): void {
        this.dock = !this.dock;
    }

    public async signin(): Promise<void> {
        console.log("Init Signin");
        await this._authService.signin();
    }
}