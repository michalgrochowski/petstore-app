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
import {MatChipSet} from "@angular/material/chips";
import {HarnessLoader} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {createPet} from "../../../test/factories/pet-factory";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideAnimations} from "@angular/platform-browser/animations";

describe('PetsTableComponent', () => {
  let component: PetsTableComponent;
  let fixture: ComponentFixture<PetsTableComponent>;
  let store: MockStore;

  let loader: HarnessLoader;

  const storeInitialState = {
    ...initialState(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetsTableComponent],
      providers: [
        provideMockStore({ initialState: storeInitialState }),
        provideAnimationsAsync(),
        provideAnimations()
      ],
      imports: [
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
        MatChipSet
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsTableComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.petsDataSource.data = [createPet({id: 1, name: 'Pet1'})];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
