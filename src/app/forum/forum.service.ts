import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostService {

    constructor(private http: HttpClient, private router: Router) {}


    addPost(title: string, content: string) {
        const postData = { tytul: title, tresc: content }

        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/forum/', postData).subscribe({
            next: post => {
                console.log('Created: ' + post.post)
                this.router.navigate(['/forum'])
            }
        })
    }
}