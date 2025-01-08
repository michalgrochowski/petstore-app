import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./reducers";
import {ReactiveFormsModule} from "@angular/forms";
import {PetsEffects} from "./features/pets/pets.effects";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {HttpClient} from "@angular/common/http";
import {HttpClientService} from "./services/http-client.service";
import {PetsTableComponent} from "./components/pets-table/pets-table.component";
import {AddEditPetDialogComponent} from "./modals/add-edit-pet-dialog/add-edit-pet-dialog.component";
import { PetsTableRowComponent } from './components/pets-table-row/pets-table-row.component';

@NgModule({
  declarations: [
    AppComponent,
    PetsTableComponent,
    PetsTableRowComponent,
    AddEditPetDialogComponent,
    PetsTableRowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([PetsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
  ],
  providers: [
    {provide: HttpClient, useClass: HttpClientService},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
