import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditPetDialogComponent } from './add-edit-pet-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {createPet} from "../../../test/factories/pet-factory";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatChipGrid, MatChipInput, MatChipRow, MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideAnimations} from "@angular/platform-browser/animations";
import {PetsActions} from "../../features/pets/pets.actions";

describe('AddEditPetComponent', () => {
  let component: AddEditPetDialogComponent;
  let fixture: ComponentFixture<AddEditPetDialogComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;
  let snackbar: MatSnackBar;
  let dispatchSpy: jasmine.Spy;

  const dialogData = {
    pet: createPet({id: 1, name: 'Pet1'}),
    isNewPet: false,
    firstAvailablePetId: 1,
    firstAvailableCategoryId: 1,
    availableTagIds: [1]
  };

  beforeEach(async () => {
    const closeSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AddEditPetDialogComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatChipRow,
        MatChipGrid,
        MatChipInput,
        MatInputModule,
        MatLabel,
        MatChipsModule,
        MatSelectModule
      ],
      providers: [
        { provide: MatDialog },
        { provide: MatDialogRef, useValue: closeSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        FormBuilder,
        MatSnackBar,
        provideMockStore({initialState}),
        provideAnimationsAsync(),
        provideAnimations()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPetDialogComponent);
    component = fixture.componentInstance;
    component.convertPetToFormData(dialogData.pet);
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject((FormBuilder));
    snackbar = TestBed.inject((MatSnackBar));
    fixture.detectChanges();
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Modal methods validation', () => {
    it('WHEN save method is triggered THEN it should invoke addPet and clearAddedAndDeleted actions', async () => {
      component.save();

      fixture.detectChanges();

      await fixture.whenStable().then(() => {
        expect(dispatchSpy).toHaveBeenCalledTimes(2)
        expect(dispatchSpy).toHaveBeenCalledWith(PetsActions.clearAddedAndDeleted());
        expect(dispatchSpy).toHaveBeenCalledWith(PetsActions.editPet({pet: createPet({id: 1, name: 'Pet1'})}));
      });
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
