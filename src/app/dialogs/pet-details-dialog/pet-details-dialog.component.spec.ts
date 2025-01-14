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
import {HarnessLoader} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {MatTooltip} from "@angular/material/tooltip";

describe('PetDetailsDialogComponent', () => {
  let component: PetDetailsDialogComponent;
  let fixture: ComponentFixture<PetDetailsDialogComponent>;
  let store: MockStore;

  const dialogData = {
    pet: createPet({id: 1, name: 'Pet1'})
  };

  let loader: HarnessLoader;

  beforeEach(async () => {
    const closeSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

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
        MatTooltip
      ],
      providers: [
        { provide: MatDialog },
        { provide: MatDialogRef, useValue: closeSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        provideMockStore({initialState}),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetDetailsDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
