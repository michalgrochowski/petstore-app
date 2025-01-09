import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./reducers";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PetsEffects} from "./features/pets/pets.effects";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ApiClientService} from "./services/api-client.service";
import {PetsTableComponent} from "./components/pets-table/pets-table.component";
import {AddEditPetDialogComponent} from "./dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {ApiClient} from "./services/api-client";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatCellDef, MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    PetsTableComponent,
    AddEditPetDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatInputModule,
    MatCellDef,
    MatSnackBarModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([PetsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: ApiClient, useClass: ApiClientService},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
