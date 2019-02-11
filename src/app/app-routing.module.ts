import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostComponent } from "./posts/post-create/post-create.component";
import { AuthGuard } from "./auth/auth.guard";

import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

const routes:Routes=[
  {path:'', component: PostListComponent},
  {path:'create', component: PostComponent,canActivate:[AuthGuard]},
  {path:'edit/:id', component: PostComponent,canActivate:[AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent}
]

@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule{}