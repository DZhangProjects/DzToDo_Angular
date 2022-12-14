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
        private _authService: AuthService,
        private _router: Router
    ) { }

    dock: boolean = false;

    /**
     * Toggles the signin dialogue box
     */
    public toggleDock(): void {
        this.dock = !this.dock;
    }

    public async signin(): Promise<void> {
        await this._authService.signin();
    }

    public toSchedule(): void {
        this._router.navigate(['']);
    }

    public toRules(): void {
        this._router.navigate(['rules']);
    }
}