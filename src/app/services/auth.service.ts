import { Injectable } from "@angular/core";
import { Auth, getAuth, GoogleAuthProvider, OAuthCredential, signInWithPopup, User, UserCredential } from "firebase/auth";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() { }

    private provider!: GoogleAuthProvider;
    private auth!: Auth;
    private authToken!: string;
    private user!: User;

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
                console.log("Login Successful: ", this.user.email);
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
}