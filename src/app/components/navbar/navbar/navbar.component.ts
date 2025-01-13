import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../../reducers";
import {MatDialog} from "@angular/material/dialog";
import {AddEditPetDialogComponent} from "../../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {PetsActions} from "../../../features/pets/pets.actions";
import {PetStatus} from "../../../enums/pet-status";

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  statuses = Object.values(PetStatus);

  constructor(private readonly store$: Store<State>,
              private readonly dialog: MatDialog) {
  }

  addNewPet(): void {
    this.dialog.open(AddEditPetDialogComponent, {
      data: {
        pet: null,
        isNewPet: true
      },
      width: '600px'
    });
  }

  filterByStatus(status: PetStatus): void {
    this.store$.dispatch(PetsActions.loadPets({status}))
  }
}
