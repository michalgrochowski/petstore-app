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

  petsDataSource = new MatTableDataSource<Pet>([]);

  pets$: Observable<Pet[]> = this.store$.pipe(select(getAllPets), takeUntil(this.unsubscribe$));

  isLoadingPets$: Observable<boolean> = this.store$.select('pets', 'loadingPets');
  wasPetDeleted$: Observable<number | null> = this.store$.select('pets', 'petDeleted');
  wasPetAdded$: Observable<Pet | null> = this.store$.select('pets', 'petAdded');

  constructor(private readonly store$: Store<State>,
              private readonly dialog: MatDialog,
              private readonly snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.pets$.subscribe(data => {
      this.pets = data;
      this.petsDataSource.data = data;
    });
    this.wasPetDeleted$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: number | null) => {
        if (data) {
          const pet = getPetById(data)
          this.snackBar.open(`Pet ${pet.name} was successfully deleted`, 'Close', {duration: 2000});
        }
      });
    this.wasPetAdded$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((pet: Pet | null) => {
        if (pet) {
          this.snackBar.open(`Pet ${pet.name} was successfully added`, 'Close', {duration: 2000});
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
    this.dialog.open(AddEditPetDialogComponent, {
      data: {
        pet: pet,
        isNewPet: false
      },
      width: '600px'
    }).afterClosed().subscribe((data: Pet) => {
      this.snackBar.open(`Pet ${data.name} successfully edited`, 'Close', {duration: 2000});
    });
  }

  deletePet(pet: Pet): void {
    this.store$.dispatch(PetsActions.deletePet({pet}));
  }
}
