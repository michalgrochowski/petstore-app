import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditPetDialogComponent } from './add-edit-pet-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {createPet} from "../../../test/factories/pet-factory";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {forwardRef} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

describe('AddEditPetComponent', () => {
  let component: AddEditPetDialogComponent;
  let fixture: ComponentFixture<AddEditPetDialogComponent>;
  let store: MockStore;
  let formBuilder: FormBuilder;
  let snackbar: MatSnackBar;

  const dialogData = {
    pet: createPet({id: 1, name: 'Pet1'})
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
        MatInputModule
      ],
      providers: [
        { provide: MatDialog },
        { provide: MatDialogRef, useValue: closeSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        FormBuilder,
        MatSnackBar,
        provideMockStore({initialState}),
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => AddEditPetDialogComponent),
          multi: true,
        }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPetDialogComponent);
    component = fixture.componentInstance;
    component.convertPetToFormData(dialogData.pet);
    console.log(component.petForm.value)
    store = TestBed.inject(MockStore);
    formBuilder = TestBed.inject((FormBuilder));
    snackbar = TestBed.inject((MatSnackBar));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
