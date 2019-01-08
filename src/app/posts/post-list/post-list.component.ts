import { Component, Input, OnInit,OnDestroy} from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs/Subscription';

@Component({
selector:"app-post-list",
templateUrl:"./post-list.component.html",
styleUrls:["./post-list.component.scss"]
})
export class PostListComponent implements OnInit, OnDestroy{
    postsData:Array<Post>;
    private postsSubscription:Subscription;
    constructor(public postService:PostsService){

    }
    ngOnInit(): void {
        this.postsData=this.postService.getPosts();
        this.postsSubscription =  this.postService.getPostUpdateListener().subscribe((posts:Post[])=>{
            this.postsData = posts;
        })
    }
    toggleAccordian(post:Post) {
        if (post.showPanel) {
            post.showPanel = false;
        } else post.showPanel = true;
    }
    ngOnDestroy(){
        this.postsSubscription.unsubscribe();
    }
}