import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {createPet} from "../../../test/factories/pet-factory";

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let store: MockStore;

  const dialogData = {
    pet: createPet({id: 1, name: 'Pet1'})
  };

  beforeEach(async () => {
    const closeSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatIcon,
        MatFormFieldModule,
        MatChipRow,
        MatChipGrid,
        MatChipInput
      ],
      providers: [
        { provide: MatDialog },
        { provide: MatDialogRef, useValue: closeSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        provideMockStore({initialState}),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
