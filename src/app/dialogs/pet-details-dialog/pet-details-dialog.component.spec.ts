import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetDetailsDialogComponent } from './pet-details-dialog.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {createPet} from "../../../test/factories/pet-factory";
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChip, MatChipGrid, MatChipInput, MatChipRow, MatChipSet} from "@angular/material/chips";
import {initialState} from "../../../test/test-store";
import {MatTooltip} from "@angular/material/tooltip";
import {TitleCasePipe} from "@angular/common";

describe('PetDetailsDialogComponent', () => {
  let component: PetDetailsDialogComponent;
  let fixture: ComponentFixture<PetDetailsDialogComponent>;
  let store: MockStore;

  const dialogData = {
    pet: createPet({id: 1, name: 'Pet1'})
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [PetDetailsDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatIcon,
        MatChip,
        MatFormFieldModule,
        MatChipRow,
        MatChipGrid,
        MatChipInput,
        MatChipSet,
        MatTooltip,
        TitleCasePipe
      ],
      providers: [
        { provide: MatDialog },
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

    fixture = TestBed.createComponent(PetDetailsDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('WHEN close method is used THEN it should close the dialog', async () => {
    spyOn(component.dialogRef, 'close');
    component.close();
    fixture.detectChanges();

    await fixture.whenStable().then(() => {
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
