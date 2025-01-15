import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {MatDialog} from "@angular/material/dialog";
import {AddEditPetDialogComponent} from "../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {PetsActions} from "../../features/pets/pets.actions";
import {PetStatus} from "../../enums/pet-status";
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
              readonly dialog: MatDialog,
              @Inject(DOCUMENT) private document: Document) {
  }

  @ViewChild('searchInput') searchInput: ElementRef | undefined;

  searchValue = '';
  currentTheme = 'dark';
  statuses = Object.values(PetStatus);
  firstAvailablePetId = 1;
  firstAvailableCategoryId = 1;
  availableTagIds: number[] = [];

  firstAvailablePetId$ = this.store$.select('pets', 'firstAvailablePetId').pipe(takeUntil(this.unsubscribe$));
  firstAvailableCategoryId$ = this.store$.select('pets', 'firstAvailableCategoryId').pipe(takeUntil(this.unsubscribe$));
  availableTagIds$ = this.store$.select('pets', 'availableTagIds').pipe(takeUntil(this.unsubscribe$));

  ngOnInit(): void {
    this.firstAvailablePetId$.subscribe(data => this.firstAvailablePetId = data ?? 1);
    this.firstAvailableCategoryId$.subscribe(data => this.firstAvailableCategoryId = data ?? 1);
    this.availableTagIds$.subscribe(data => this.availableTagIds = data ?? [1]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  addNewPet(): void {
    this.dialog.open(AddEditPetDialogComponent, {
      data: {
        pet: null,
        isNewPet: true,
        firstAvailablePetId: this.firstAvailablePetId,
        firstAvailableCategoryId: this.firstAvailableCategoryId,
        availableTagIds: this.availableTagIds
      },
      width: '600px'
    });
  }

  filterByStatus(status: PetStatus): void {
    this.store$.dispatch(PetsActions.loadPets({status}))
  }

  filterPets($event: Event): void {
    this.searchValue = ($event.target as HTMLInputElement)?.value
    this.store$.dispatch(PetsActions.filterPets({searchValue: this.searchValue}));
  }

  clearSearchValue(): void {
    this.searchValue = '';
    (this.searchInput?.nativeElement as HTMLInputElement).value = '';
    this.store$.dispatch(PetsActions.filterPets({searchValue: this.searchValue}));
  }

  switchTheme($event: MatSlideToggleChange): void {
    const newTheme = $event.checked ? 'light' :'dark';
    this.document.body.classList.replace(this.currentTheme, newTheme);
    this.currentTheme = newTheme;
  }
}
