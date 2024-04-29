import { NgModule } from "@angular/core";

import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatExpansionModule,
        MatIconModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatDividerModule
    ],
    providers: [
        provideNativeDateAdapter()
    ]
})
export class AngularMaterialModule {}