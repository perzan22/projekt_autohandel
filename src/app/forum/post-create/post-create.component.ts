import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../forum.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.sass'
})
export class PostCreateComponent {

  postForm!: NgForm

  constructor(private postService: PostService) {}

  onSave(postForm: NgForm) {


    if(postForm.invalid) {
      return
    }

    this.postService.addPost(postForm.value.title, postForm.value.content)
  }
}
