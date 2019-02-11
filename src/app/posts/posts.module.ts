import { NgModule } from "@angular/core";
import { PostListComponent } from "./post-list/post-list.component";
import { PostComponent } from "./post-create/post-create.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
    declarations:[
        PostListComponent,
        PostComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        AppRoutingModule
    ]
})
export class PostsModule{

}