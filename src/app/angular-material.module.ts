import { NgModule } from "@angular/core";
import {
  MatPaginatorModule,
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatCardModule, 
  MatDialogModule
} from '@angular/material';

@NgModule({
  exports:[
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
  ]
})
export class AngularMaterialModule{
  
}