import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let store: MockStore;

  const dialogData = {
    title: `Deleting pet`,
    text: `Are you sure you want to delete?`,
    confirmButtonText: 'Yes',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatIcon,
        MatFormFieldModule,
        MatChipRow,
        MatChipGrid,
        MatChipInput,
      ],
      providers: [
        MatDialog,
        {provide: MatDialogRef,
          useValue: {
            close: () => {},
            componentInstance: () => {}
          }
        },
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

  it('WHEN confirm method is used THEN it should close the dialog', async () => {
    spyOn(component.dialogRef, 'close');
    component.confirm();
    fixture.detectChanges();

    await fixture.whenStable().then(() => {
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
