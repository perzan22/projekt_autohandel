import { Component, OnInit } from '@angular/core';
import { PostService } from '../forum.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.sass'
})
export class PostListComponent implements OnInit{

  postsSubs!: Subscription
  posts: Post[] = []

  constructor(private postService: PostService) {}


  ngOnInit(): void {
    
    this.postService.getPosts()
    this.postsSubs = this.postService.getPostsStatusListener().subscribe({
      next: posts => {
        this.posts = posts.posts
        console.log(this.posts)
      }
    })
  }


  onSubmit(commentForm: NgForm, postID: string) {
    if (commentForm.invalid) {
      return
    }

    this.postService.addComment(commentForm.value.comment, postID)

  }

}
