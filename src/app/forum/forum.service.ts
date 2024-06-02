import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Router } from "@angular/router";
import { Subject, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostService {

    posts: Post[] = []
    postsStatusListener = new Subject<{ posts: Post[] }>

    constructor(private http: HttpClient, private router: Router) {}

    getPostsStatusListener() {
        return this.postsStatusListener.asObservable()
    }

    addPost(title: string, content: string) {
        const postData = { tytul: title, tresc: content }

        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/forum/', postData).subscribe({
            next: post => {
                console.log('Created: ' + post.post)
                this.router.navigate(['/forum'])
            }
        })
    }

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/forum')
        .pipe(map(postsData => {
            return {
                posts: postsData.posts.map((post: { _id: string; tytul: string, tresc: string, autor: string, data_publikacji: Date, ocena: number, avatar: string, komentarze: Comment[] }) => {
                    return {
                        id: post._id,
                        tytul: post.tytul,
                        tresc: post.tresc,
                        autor: post.autor,
                        data_publikacji: post.data_publikacji,
                        ocena: post.ocena,
                        avatar: post.avatar,
                        komentarze: post.komentarze
                    }
                })
            }
        }))
        .subscribe({
            next: (fetchedPosts) => {
                this.posts = fetchedPosts.posts;
                this.postsStatusListener.next({ posts: [...this.posts] });
            }
        })
    }

    addComment(tresc: string, postID: string) {
        const commentData = { tresc: tresc, postID: postID }
        this.http.post<{ message: string, comment: Comment }>('http://localhost:3000/api/forum/comment', commentData).subscribe({
            next: comment => {
                console.log(comment)
            }
        })
    }
}