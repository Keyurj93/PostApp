import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class PostsService {
    private posts: Post[] = [];   
    private postsUpdated = new Subject<Post[]>();
    getPosts():Array<Post>{
        // returning copy of an array since arrays are objects in JS
        return [...this.posts];
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string, content:string){
        console.log("add post ",title,content);
        const post:Post ={
            title: title,
            content:content,
            showPanel:false
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}