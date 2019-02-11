import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { _throw as throwError } from 'rxjs/observable/throw';
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(private dialog:MatDialog) {

    }

    intercept(req:HttpRequest<any>,next:HttpHandler){
    //    console.log("Error interceptor");
       return next.handle(req)
       .pipe(
           catchError((error:HttpErrorResponse)=>{
            let errorMessage="An Unknown error occurred!";
            if(error.error.message){
                errorMessage=error.error.message;
            }
            this.dialog.open(ErrorComponent,{data:{message:errorMessage}})
               return throwError(error);
           })
       )
    }
}