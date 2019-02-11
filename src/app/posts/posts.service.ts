import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";
import {environment} from '../../environments/environment';

const POST_BACKEND_URL = environment.apiUrl+'/posts/';

@Injectable()
export class PostsService {
    private posts: Post[] = [];   
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

    constructor(private http:HttpClient,private router:Router){
        
    }

    getPosts(postsPerPage:number,currentPage:number){
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;  
        this.http.get<{message:string,posts:any,maxPosts:number}>(POST_BACKEND_URL+queryParams)
        // pipe is used to convert incompatible _id from server to id of clients defined interface
        .pipe(map((postsData)=>{
            return {
                posts: postsData.posts.map(post=>{
                return {
                    title:post.title,
                    content:post.content,
                    id:post._id,
                    imagePath:post.imagePath,
                    creator:post.creator
                }
            }),
                maxCount:postsData.maxPosts
                }
        }))
        .subscribe((transformedPostsData)=>{
            // console.log("data ",postsData);
            this.posts = transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxCount});
        })
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    onSavePost(title:string, content:string,image:string){
        console.log("add post ",title,content);
        const postData = new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);
        this.http.post<{message:string,post:Post}>(POST_BACKEND_URL,postData)
        .subscribe((responseData)=>{
            this.router.navigate(["/"]);
        }) 
    }
    deletePost(id:string){
        return this.http.delete(POST_BACKEND_URL+id);
    }
    getPost(id:string){
       return  this.http.get<{_id:string,title:string,content:string,imagePath:string,showPanel:boolean,creator:string}>(POST_BACKEND_URL+id); 
    }

    updatePost(title:string,content:string,image:File|string,id?:string){
        console.log("Update params ",title,content,image,id);
        let postData:Post|FormData;
        if(typeof(image)==="object"){
            postData = new FormData();
            postData.append("id",id);
            postData.append("title",title);
            postData.append("content",content);
            postData.append("image",image,title);
        }else{
             postData={
                id:id,
                title:title,
                content:content,
                showPanel:false,
                imagePath:image,
                creator:null
            }
        }
        console.log("Final ",postData);
        this.http.put(POST_BACKEND_URL+id,postData)
        .subscribe((result:Post)=>{
            this.router.navigate(["/"]);
        })
    }

   
}