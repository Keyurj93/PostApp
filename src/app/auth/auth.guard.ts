import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

// guard to stop logged out users from creating and editing posts
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService,private router:Router){

    }

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean|Observable<boolean>|Promise<boolean>{
       const isAuth = this.authService.getIsAuthenticated(); 
       if(!isAuth){
        this.router.navigate(['/login']);
       }
       return true;
    }
}