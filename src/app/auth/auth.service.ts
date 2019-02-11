import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import {environment} from '../../environments/environment';

const USER_BACKEND_URL = environment.apiUrl+'/user/'

@Injectable()
export class AuthService{
    private token:string;
    private authStateListener = new Subject<boolean>();
    private isAuthenticated=false;
    private tokenTimer:any;
    private userId:string;
    constructor(private http:HttpClient,private router:Router){

    }

    getAuthStateListener(){
        return this.authStateListener.asObservable();
    }

    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId; 
    }

    createUser(email:string,password:string){
        const authData:AuthData={
            email:email,
            password:password
        }
        this.http.post(USER_BACKEND_URL+"signup",authData)
        .subscribe(()=>{
            this.router.navigate["/"];
        },error=>{
            console.log(error);
        })
    }

    login(email:string,password:string){
        const authData:AuthData={
            email:email,
            password:password
        }
        this.http.post<{token:string,expiresIn:number,userId:string}>(USER_BACKEND_URL+"login",authData)
        .subscribe(response=>{
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated=true;
                this.authStateListener.next(true);
                this.userId=response.userId;
                // save token info in local storage
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
                console.log(expirationDate);
                this.saveAuthData(token,expirationDate,this.userId);
                this.router.navigate(["/"]);
            }
        })
    }

    logout(){
        this.token=null;
        this.isAuthenticated=false;
        this.authStateListener.next(false);
        this.userId=null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        const now = new Date();
        // returns true if token is valid
        if(authInformation){
            const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        console.log("Expires in ",expiresIn);
        if(expiresIn>0){
            this.token=authInformation.token;
            this.isAuthenticated=true;
            this.userId = authInformation.userId;
            this.authStateListener.next(true);
            this.setAuthTimer(expiresIn/1000 );
        }
        }
    }

    private saveAuthData(token:string,expirationDate:Date,userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expiration",expirationDate.toISOString());
        localStorage.setItem("userId",userId);
    }
    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }
    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate){
            return;
        }
        return {
            token:token,
            expirationDate:new Date(expirationDate),
            userId:userId
        }
    }
    private setAuthTimer(duration:number){
        this.tokenTimer=setTimeout(()=>{
            this.logout();
      },duration*1000);
    }
}