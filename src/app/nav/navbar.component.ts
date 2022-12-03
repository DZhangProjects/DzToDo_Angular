import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'td-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.styles.scss'],
})
export class NavbarComponent {
    constructor(
    ) { }

    signin: boolean = false;

    /**
     * Toggles the signin dialogue box
     */
    public toggleSignin(): void {
        this.signin = !this.signin;
    }
}