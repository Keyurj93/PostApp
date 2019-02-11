import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import {mimeType} from "./mime-type.validator.ts";

@Component({
    selector:"app-posts",
    templateUrl:"./post-create.component.html",
    styleUrls:["./post-create.component.scss"]
})
export class PostComponent implements OnInit{
    enteredTitle: any = "";
    enteredContent:any="";
    private mode = "create";
    private id:string;
    public post:Post;
    form:FormGroup;
    imagePreview:any;
    @Output() postCreated = new EventEmitter<Post>();

    constructor(public postService:PostsService,public route:ActivatedRoute){
       
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            title:new FormControl(null,
            {validators:[Validators.required,Validators.minLength(3)]}),
            content:new FormControl(null,
            {validators:[Validators.required]}),
            image:new FormControl(null,
            {validators:[Validators.required],asyncValidators:[mimeType]})
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            console.log("router ",paramMap);
            if(paramMap.has('id')){
                this.mode = "edit";
                this.id = paramMap.get("id");
                this.postService.getPost(this.id).subscribe((post)=>{
                    this.post = {id:post._id,
                        title:post.title,
                        content:post.content,
                        showPanel:post.showPanel,
                        imagePath:post.imagePath,
                        creator:post.creator
                    };
                    this.form.setValue({
                        title:this.post.title,
                        content:this.post.content,
                        image:this.post.imagePath
                    })
                    console.log("Form ","post ",this.post,"form",this.form);
                })
                
            }else {
                this.mode = "create";
                this.id = null;
            }
        });
        
    }

    onSavePost(){
        console.log("UPdate method");
        if(this.form.invalid){
            console.log("Form invalid")
            return;
        }
        if(this.mode=="create"){
            console.log("create method");
            this.postService.onSavePost(this.form.value.title,this.form.value.content,this.form.value.image);
        }else {
            console.log("Update ",this.post.id);
            this.postService.updatePost(this.form.value.title,this.form.value.content,this.form.value.image,this.post.id);
        }
        this.form.reset();
    }

    onImagePicked(event:Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
            // console.log("Image ",this.imagePreview);
        }
        reader.readAsDataURL(file);
    }
}
