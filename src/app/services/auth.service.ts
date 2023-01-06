import { Injectable } from "@angular/core";
import { Auth, getAuth, GoogleAuthProvider, OAuthCredential, signInWithPopup, User, UserCredential } from "firebase/auth";
import { GoalRule } from "../interfaces/GoalRule";
import { TaskRule } from "../interfaces/TaskRule";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private _dataService: DataService) { }

    private provider!: GoogleAuthProvider;
    private auth!: Auth;
    private authToken!: string;
    public user!: User;

    public setProvider(auth: Auth): void {
        this.auth = auth;
        this.provider = new GoogleAuthProvider();
    }

    /**
     * Attempts to sign user in via Google Popup
     * @param {Auth} auth Firebase Auth Service
     * @param {GoogleAuthProvider} provider Google Auth Provider
     * @returns {Promise<boolean>} Promise of True if successful, false otherwise
     */
    public async signinPopup(auth: Auth, provider: GoogleAuthProvider): Promise<boolean> {
        try {
            const result: UserCredential = await signInWithPopup(auth, provider);
            const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
            if (credential == null) {
                return false;
            } else {
                this.authToken = credential.accessToken ? credential.accessToken : "";
                this.user = result.user;
                await this._dataService.initData(this.user.uid);
                // await this._dataService.setCompletedGoals(this.user.uid, 'test', true);
                // await this._dataService.getTaskRules(this.user.uid);
                // await this._dataService.getGoalRules(this.user.uid);
                // console.log(this._dataService.getDisplayTasks(new Date()));
                return true;
            }
        } catch (error) {
            console.log("Login Error");
            return false;
        }
    }

    /**
     * Top level wrapper for Signin
     * @returns {Promise<boolean>} True if signin was sucecssful, false otherwise
     */
    public async signin(): Promise<boolean> {
        return this.signinPopup(this.auth, this.provider);
    }

    /**
     * Checks if user has been authenticated for Auth Guard. Actually checks if there is a user UID.
     * @returns {boolean} True if uid exists, false otherwise
     */
    public isAuthenticated(): boolean {
        return this.user ? (this.user.uid ? true : false) : false;
    }
}