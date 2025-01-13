import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../../reducers";
import {MatDialog} from "@angular/material/dialog";
import {AddEditPetDialogComponent} from "../../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {PetsActions} from "../../../features/pets/pets.actions";
import {PetStatus} from "../../../enums/pet-status";
import {Subject, takeUntil} from "rxjs";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly store$: Store<State>,
              private readonly dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document) {
  }

  currentTheme = 'dark';
  statuses = Object.values(PetStatus);
  lastPetId = 0;
  lastCategoryId = 0;
  lastTagId = 0;

  lastPetId$ = this.store$.select('pets', 'lastPetId').pipe(takeUntil(this.unsubscribe$));
  lastCategoryId$ = this.store$.select('pets', 'lastCategoryId').pipe(takeUntil(this.unsubscribe$));
  lastTagId$ = this.store$.select('pets', 'lastTagId').pipe(takeUntil(this.unsubscribe$));

  ngOnInit(): void {
    this.lastPetId$.subscribe(data => this.lastPetId = data ?? 0);
    this.lastCategoryId$.subscribe(data => this.lastCategoryId = data ?? 0);
    this.lastTagId$.subscribe(data => this.lastTagId = data ?? 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  addNewPet(): void {
    this.dialog.open(AddEditPetDialogComponent, {
      data: {
        pet: null,
        isNewPet: true,
        lastPetId: this.lastPetId,
        lastCategoryId: this.lastCategoryId,
        lastTagId: this.lastTagId
      },
      width: '600px'
    });
  }

  filterByStatus(status: PetStatus): void {
    this.store$.dispatch(PetsActions.loadPets({status}))
  }

  switchTheme($event: MatSlideToggleChange): void {
    const newTheme = $event.checked ? 'light' :'dark';
    this.document.body.classList.replace(this.currentTheme, newTheme);
    this.currentTheme = newTheme;
  }
}
