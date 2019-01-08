import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";

@Component({
    selector:"app-posts",
    templateUrl:"./post-create.component.html",
    styleUrls:["./post-create.component.scss"]
})
export class PostComponent{
    enteredTitle: any = "";
    enteredContent:any="";
    @Output() postCreated = new EventEmitter<Post>();

    constructor(public postService:PostsService){
    }
    addPost(form:NgForm){
        if(form.invalid){
            return;
        }
        this.postService.addPost(form.value.title,form.value.content);
    }
}