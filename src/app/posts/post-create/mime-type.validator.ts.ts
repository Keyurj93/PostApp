import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

// the array notation in generic indicates that the name of the parameter will be any value
export const mimeType = (control:AbstractControl):Promise<{[key:string]:any}> | Observable<{[key:string]:any}>=>{
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer:Observer<{[key:string]:any}>)=>{
        fileReader.addEventListener("loadend",()=>{
            // allows us to read patterns inside the image file
            const arr = new Uint8Array(fileReader.result).subarray(0,4);
            let header="";
            let isValid = false;
            for(let i=0;i<arr.length;i++){
                
                // convert to string of hexadecimal values 
                header+=arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                isValid = true;
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                isValid = true;
                  break;
                default:
                isValid = false; // Or you can use the blob.type as fallback
                  break;
              }
              if(isValid){
                  observer.next(null); 
              }else{
                  observer.next({invaildMimeType:true});
              }
              observer.complete();

        });
        fileReader.readAsArrayBuffer(file);
    })
    return frObs;
}