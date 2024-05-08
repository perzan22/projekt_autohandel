import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token!: string;
    private userID!: string;
    private isAuth: boolean = false;
    private nickname: string = ''
    private authStatusListener = new Subject<{ isAuth: boolean }>;
    private errorMess: string = ''
    private email: string = ''
    private profileID: string = ''

    constructor(private http: HttpClient, private router: Router, private cookies: CookieService) {}

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userID;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuth;
    }

    getNickname() {
        return this.nickname;
    }

    getError() {
        return this.errorMess
    }

    getEmail() {
        return this.email
    }

    getProfileID() {
        return this.profileID
    }

    createUser(email: string, password: string, nickname: string) {
        const authData: AuthData = { email: email, password: password, nickname: nickname, profileID: '' };
        this.http.post<{ token: string, userID: string, nickname: string, email: string }>('http://localhost:3000/api/users/signup', authData).subscribe({
            next: response => {
                this.isAuth = true;
                this.userID = response.userID;
                this.nickname = response.nickname;
                this.email = response.email
                this.authStatusListener.next({ isAuth: true });
                this.setCookies();
                this.router.navigate(['/profile/create']);
            },
            error: error => {
                this.errorMess = error.error.message;
                console.log(this.errorMess)
            }
        })
    }

    login(email: string, password: string) {
        const authData = { email: email, password: password }
        this.http.post<{ token: string, userID: string, nickname: string, email: string, profileID: string }>('http://localhost:3000/api/users/login', authData).subscribe({
            next: response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    this.isAuth = true;
                    this.userID = response.userID;
                    this.nickname = response.nickname;
                    this.authStatusListener.next({ isAuth: true });
                    this.email = response.email
                    this.profileID = response.profileID
                    this.setCookies();
                    this.router.navigate(['/']);
                }
            }
        })
    }

    logout() {
        this.authStatusListener.next({ isAuth: false });
        this.isAuth = false;
        this.token = '';
        this.userID = '';
        this.nickname = '';
        this.email = '';
        this.profileID = '';
        this.clearCookies();
    }

    private setCookies() {
        this.cookies.set('SESSION_TOKEN', this.token, 1, '/');
        this.cookies.set('USER_ID', this.userID, 1, '/');
        this.cookies.set('USER_NICKNAME', this.nickname, 1, '/');
        this.cookies.set('USER_EMAIL', this.email, 1, '/');
        this.cookies.set('PROFILE_ID', this.profileID, 1, '/');

    }

    private clearCookies() {
        this.cookies.deleteAll('/');
        this.cookies.deleteAll('/offer');
        this.cookies.deleteAll('/edit');

    }

    private getCookiesData() {
        const token = this.cookies.get('SESSION_TOKEN');
        const userID = this.cookies.get('USER_ID');
        const nickname = this.cookies.get('USER_NICKNAME');
        const email = this.cookies.get('USER_EMAIL');
        const profileID = this.cookies.get('PROFILE_ID');


        if(!token) {
            return;
        }

        return {
            token: token,
            userID: userID,
            nickname: nickname,
            email: email,
            profileID: profileID
        }
    }

    autoAuth() {
        const authInfo = this.getCookiesData();
        if (!authInfo) {
            return;
        }

        this.token = authInfo.token;
        this.userID = authInfo.userID;
        this.nickname = authInfo.nickname;
        this.email = authInfo.email;
        this.profileID = authInfo.profileID;
        this.isAuth = true;
        this.authStatusListener.next({ isAuth: true });
    }


}