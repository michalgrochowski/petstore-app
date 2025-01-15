import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatOption, MatSelect} from "@angular/material/select";
import {PetStatus} from "../../enums/pet-status";
import {PetsActions} from "../../features/pets/pets.actions";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AsyncPipe, CommonModule} from "@angular/common";
import {AddEditPetDialogComponent} from "../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChip, MatChipGrid, MatChipInput} from "@angular/material/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {of} from "rxjs";
import {createPet} from "../../../test/factories/pet-factory";

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

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const storeInitialState = {
    ...initialState(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent, AddEditPetDialogComponent],
      providers: [
        provideMockStore({ initialState: storeInitialState }),
        {provide: MatDialog, useClass: DialogMock},
        provideAnimations(),
        provideAnimationsAsync(),
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatToolbar,
        MatIcon,
        MatSlideToggle,
        MatSelect,
        MatOption,
        AsyncPipe,
        CommonModule,
        MatFormFieldModule,
        MatChipGrid,
        MatChip,
        MatInputModule,
        MatChipInput
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('WHEN user selects status from MatSelect THEN it should dispatch LoadPets actions with that status', async () => {
    component.filterByStatus(PetStatus.Available);
    fixture.detectChanges();

    await fixture.whenStable().then(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(PetsActions.loadPets({status: PetStatus.Available}));
    });
  });

  it('WHEN user clicks on Add new pet button THEN it should dispatch open AddOrEditDialogComponent dialog', async () => {
    spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of(createPet({id: 1, name: 'Pet1'}))} as MatDialogRef<typeof component>);
    component.addNewPet();
    fixture.detectChanges();

    expect(component.dialog.open).toHaveBeenCalled();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
