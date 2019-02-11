import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
selector:"app-header",
templateUrl:"./header.component.html",
styleUrls:["./header.component.scss"]
})
export class HeaderComponent implements OnInit,OnDestroy{
    private userIsAuthenticated=false;
    private authListenerSubs:Subscription;

    constructor(private authService:AuthService){

    }

    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }

    ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.authListenerSubs = this.authService
        .getAuthStateListener()
        .subscribe(isAuthenticated=>{
            this.userIsAuthenticated = isAuthenticated;
        });
    }
    onLogout(){
        this.authService.logout();
    }
    
}