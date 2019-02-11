import { Component, Input, OnInit,OnDestroy} from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs/Subscription';
import { PageEvent } from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
selector:"app-post-list",
templateUrl:"./post-list.component.html",
styleUrls:["./post-list.component.scss"]
})
export class PostListComponent implements OnInit, OnDestroy{
    postsData:Array<Post>;
    totalPosts:number;
    postsPerPage=10;
    currentPage=1;
    pageSizeOptions=[1,2,5,10];
    userId:string;
    private userIsAuthenticated=false;
    private postsSubscription:Subscription;
    private authStatusSubs:Subscription;


    constructor(public postService:PostsService,private authService:AuthService){
        this.postsData=[];
    }
    ngOnInit(): void {
        this.postService.getPosts(this.postsPerPage,this.currentPage);
        this.userId=this.authService.getUserId();
        this.postsSubscription =  this.postService
        .getPostUpdateListener()
        .subscribe((postsData:{posts:Post[],postCount:number})=>{
            this.postsData = postsData.posts;
            this.totalPosts = postsData.postCount;
        });

       this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.authStatusSubs = this.authService
        .getAuthStateListener()
        .subscribe(isAuthenticated=>{
            this.userIsAuthenticated=isAuthenticated;
            this.userId=this.authService.getUserId();
        })
    }
    toggleAccordian(post:Post) {
        if (post.showPanel) {
            post.showPanel = false;
        } else post.showPanel = true;
    }
    ngOnDestroy(){
        this.postsSubscription.unsubscribe();
        this.authStatusSubs.unsubscribe();
    }
    onDelete(id:string){
        this.postService.deletePost(id).subscribe(()=>{
            this.postService.getPosts(this.postsPerPage,this.currentPage);
        });
    }
    onPageChanged(pageData:PageEvent){
        this.currentPage = pageData.pageIndex+1;
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage,this.currentPage);
    }
}