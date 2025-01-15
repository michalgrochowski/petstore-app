import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsTableComponent } from './pets-table.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {MatIconModule} from "@angular/material/icon";
import {MatOption, MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {
  MatCell,
  MatCellDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRowDef,
  MatTableModule
} from "@angular/material/table";
import {MatChip, MatChipGrid, MatChipInput, MatChipRow, MatChipSet} from "@angular/material/chips";
import {createPet} from "../../../test/factories/pet-factory";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideAnimations} from "@angular/platform-browser/animations";
import {PetsActions} from "../../features/pets/pets.actions";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonModule, TitleCasePipe} from "@angular/common";
import {AddEditPetDialogComponent} from "../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PetDetailsDialogComponent} from "../../dialogs/pet-details-dialog/pet-details-dialog.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {of} from "rxjs";

class DialogMock {
  open(): any {
    return {
      afterClosed: () => of(true)
    };
  }
  close(): any {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('PetsTableComponent', () => {
  let component: PetsTableComponent;
  let fixture: ComponentFixture<PetsTableComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const storeInitialState = {
    ...initialState(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PetsTableComponent,
        AddEditPetDialogComponent,
        PetDetailsDialogComponent
      ],
      providers: [
        provideMockStore({ initialState: storeInitialState }),
        provideAnimationsAsync(),
        provideAnimations(),
        {provide: MatDialog, useClass: DialogMock}
      ],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatSelectModule,
        MatOption,
        MatPaginatorModule,
        MatTableModule,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatCellDef,
        MatRowDef,
        MatHeaderRow,
        MatChipSet,
        TitleCasePipe,
        CommonModule,
        MatFormFieldModule,
        MatChipRow,
        MatChipGrid,
        MatChip,
        MatInputModule,
        MatChipInput,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsTableComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    component.petsDataSource.data = [createPet({id: 1, name: 'Pet1'})];
    fixture.detectChanges();
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('WHEN user clicks on details THEN it should dispatch open details dialog', async () => {
    spyOn(component.dialog, 'open');
    component.openPetDetails(createPet({id: 1, name: 'Pet1'}));
    fixture.detectChanges();

    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('WHEN user clicks on edit THEN it should dispatch open AddOrEditDialogComponent dialog', async () => {
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of(createPet({id: 1, name: 'Pet1'}))} as MatDialogRef<typeof component>);
    component.editPet(createPet({id: 1, name: 'Pet1'}));
    fixture.detectChanges();

    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('WHEN user clicks delete pet and confirms action THEN it should dispatch deletePet action', async () => {
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of(createPet({id: 1, name: 'Pet1'}))} as MatDialogRef<typeof component>);
    component.deletePet(createPet({id: 1, name: 'Pet1'}));
    fixture.detectChanges();

    await fixture.whenStable().then(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(PetsActions.deletePet({pet: createPet({id: 1, name: 'Pet1'})}));
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
