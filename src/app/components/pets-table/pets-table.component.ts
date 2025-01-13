import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {State} from "../../reducers";
import {getAllPets, getPetById} from "../../features/pets/pets.selectors";
import {Pet} from "../../models/pet";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddEditPetDialogComponent} from "../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {PetsActions} from "../../features/pets/pets.actions";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {ConfirmationDialogComponent} from "../../dialogs/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-pets-table',
  templateUrl: './pets-table.component.html',
  styleUrl: './pets-table.component.scss',
  standalone: false,
})
export class PetsTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly unsubscribe$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  displayedColumns = [
    'id',
    'name',
    'category',
    'photoUrls',
    'tags',
    'status',
    'actions'
  ];
  pets: Pet[] = [];
  lastPetId = 0;
  lastCategoryId = 0;
  lastTagId = 0;
  petsDataSource = new MatTableDataSource<Pet>([]);

  pets$: Observable<Pet[]> = this.store$.pipe(select(getAllPets), takeUntil(this.unsubscribe$));
  isLoadingPets$: Observable<boolean> = this.store$.select('pets', 'loadingPets').pipe(takeUntil(this.unsubscribe$));
  wasPetDeleted$: Observable<number | null> = this.store$.select('pets', 'petDeleted').pipe(takeUntil(this.unsubscribe$));
  wasPetAdded$: Observable<Pet | null> = this.store$.select('pets', 'petAdded').pipe(takeUntil(this.unsubscribe$));
  petError$: Observable<any> = this.store$.select('pets', 'petRequestError').pipe(takeUntil(this.unsubscribe$));
  lastPetId$ = this.store$.select('pets', 'lastPetId').pipe(takeUntil(this.unsubscribe$));
  lastCategoryId$ = this.store$.select('pets', 'lastCategoryId').pipe(takeUntil(this.unsubscribe$));
  lastTagId$ = this.store$.select('pets', 'lastTagId').pipe(takeUntil(this.unsubscribe$));

  constructor(private readonly store$: Store<State>,
              private readonly dialog: MatDialog,
              private readonly snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.pets$.subscribe(data => {
      this.pets = data;
      this.petsDataSource.data = data;
    });
    this.lastPetId$.subscribe(data => this.lastPetId = data ?? 0);
    this.lastCategoryId$.subscribe(data => this.lastCategoryId = data ?? 0);
    this.lastTagId$.subscribe(data => this.lastTagId = data ?? 0);
    this.wasPetDeleted$.subscribe((data: number | null) => {
      if (data) {
        const pet = getPetById(data);
        this.snackBar.open(`Pet ${pet.name} was successfully deleted`, 'Close', {duration: 2000});
      }
    });
    this.wasPetAdded$.subscribe((pet: Pet | null) => {
      if (pet) {
        this.snackBar.open(`Pet ${pet.name} was successfully added`, 'Close', {duration: 2000});
      }
    });
    this.petError$.subscribe((data: HttpErrorResponse | null) => {
      if (data) {
        this.snackBar.open(`An error occured: ${data.error?.code} - ${data.error?.error?.message ?? data.error?.message}`, 'Close');
      }
    });
  }

  ngAfterViewInit(): void {
    this.petsDataSource.paginator = this.paginator;
    this.petsDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  openPetDetails(pet: Pet): void {
    console.log(pet)
  }

  editPet(pet: Pet): void {
    this.store$.dispatch(PetsActions.clearAddedAndDeleted());
    this.dialog.open(AddEditPetDialogComponent, {
      data: {
        pet: pet,
        isNewPet: false,
        lastPetId: this.lastPetId,
        lastCategoryId: this.lastCategoryId,
        lastTagId: this.lastTagId
      },
      width: '600px'
    }).afterClosed().subscribe((data: Pet) => {
      if (data) {
        this.snackBar.open(`Pet ${data.name} successfully edited`, 'Close', {duration: 2000});
      }
    });
  }

  deletePet(pet: Pet): void {
    this.store$.dispatch(PetsActions.clearAddedAndDeleted());
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Deleting pet ${pet.name}`,
        text: `Are you sure you want to delete ${pet.name}?`,
        confirmButtonText: 'Yes',
      },
      width: '600px'
    }).afterClosed().subscribe(data => {
      if (data) {
        this.store$.dispatch(PetsActions.deletePet({pet}));
      }
    })
  }
}
