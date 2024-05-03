import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token!: string;
    private userID!: string;
    private isAuth: boolean = false;
    private authStatusListener = new Subject<{ isAuth: boolean }>;

    constructor(private http: HttpClient, private router: Router) {}

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

    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, userID: string, name: string, surname: string }>('http://localhost:3000/api/users/signup', authData).subscribe({
            next: response => {
                this.isAuth = true;
                this.userID = response.userID;
                this.authStatusListener.next({ isAuth: true });
                this.router.navigate(['/']);
            }
        })
    }

    login(email: string, password: string) {
        const authData = { email: email, password: password }
        this.http.post<{ token: string, userID: string, name: string, surname: string }>('http://localhost:3000/api/users/login', authData).subscribe({
            next: response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    this.isAuth = true;
                    this.userID = response.userID;
                    this.authStatusListener.next({ isAuth: true });
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
    }

}