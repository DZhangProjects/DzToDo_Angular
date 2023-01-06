import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'td-gsn',
    templateUrl: './withGoogle.component.html',
    styleUrls: ['./withGoogle.styles.scss'],
})
export class SignInWithGoogleComponent {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) { }

    isError: boolean = false;
    errorMsg: string = "";


    public async signin(): Promise<void> {
        console.log("Init Signin");
        const signedIn: boolean = await this._authService.signin();
        if (signedIn) {
            this._router.navigate(['']);
        } else {
            this.isError = true;
            this.errorMsg = "Something went wrong.";
        }
    }
}
