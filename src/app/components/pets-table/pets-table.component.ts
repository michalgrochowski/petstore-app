import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {State} from "../../reducers";
import {getAllPets} from "../../features/pets/pets.selectors";
import {Pet} from "../../models/pet";
import {Observable, Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddEditPetDialogComponent} from "../../dialogs/add-edit-pet-dialog/add-edit-pet-dialog.component";
import {PetsActions} from "../../features/pets/pets.actions";

@Component({
  selector: 'app-pets-table',
  templateUrl: './pets-table.component.html',
  styleUrl: './pets-table.component.scss',
  standalone: false
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

  constructor(private readonly store$: Store<State>,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.pets$.subscribe(data => {
      this.pets = data;
      this.petsDataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    this.petsDataSource.paginator = this.paginator;
    this.petsDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  editPet(pet: Pet): void {
    this.dialog.open(AddEditPetDialogComponent).afterClosed().subscribe(data => data);
  }

  deletePet(pet: Pet): void {
    this.store$.dispatch(PetsActions.deletePet({pet}));
  }
}
