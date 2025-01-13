import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "./reducers";
import {PetsActions} from "./features/pets/pets.actions";
import {PetStatus} from "./enums/pet-status";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private readonly store$: Store<State>) {
  }

  ngOnInit(): void {
    this.store$.dispatch(PetsActions.loadPets({status: PetStatus.Available}));
  }
}
