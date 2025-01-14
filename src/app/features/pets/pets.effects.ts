import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import { of } from 'rxjs';
import { PetsActions } from './pets.actions';
import {ApiClientService} from "../../services/api-client.service";
import {Pet} from "../../models/pet";
import {HttpErrorResponse} from "@angular/common/http";
import {getAllPets} from "./pets.selectors";
import {Store} from "@ngrx/store";
import {State} from "../../reducers";

@Injectable()
export class PetsEffects {
  constructor(private actions$: Actions,
              private readonly httpClient: ApiClientService,
              private readonly store$: Store<State>) {
  }

  loadPets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.loadPets),
      switchMap(action => this.httpClient.getPetsByStatus(action.status)),
      withLatestFrom(this.store$.select('pets', 'searchValue')),
      switchMap(([pets, searchValue]) => {
        return [PetsActions.petsLoaded({pets}), PetsActions.filterPets({searchValue: searchValue})]
      }),
      catchError((error: HttpErrorResponse) => of(PetsActions.petsFailedToLoad({error})))
    ));

  loadPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.loadPet),
      switchMap(action => this.httpClient.getPet(action.id)),
      withLatestFrom(this.store$.select('pets', 'searchValue')),
      switchMap(([pet, searchValue]) =>
        [PetsActions.petLoaded({pet}), PetsActions.filterPets({searchValue: searchValue})]),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToLoad({error})))
    ));

  addPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.addPet),
      switchMap(action => this.httpClient.addPet(action.pet)),
      withLatestFrom(this.store$.select('pets', 'searchValue')),
      switchMap(([pet, searchValue]) =>
        [PetsActions.petAdded({pet}), PetsActions.filterPets({searchValue: searchValue})]),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToAdd({error})))
  ));

  deletePet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.deletePet),
      switchMap(action => this.httpClient.deletePet(action.pet.id)),
      withLatestFrom(this.store$.select('pets', 'searchValue')),
      switchMap(([deleteResponse, searchValue]) =>
        [PetsActions.petDeleted({petId: Number(deleteResponse.message)}), PetsActions.filterPets({searchValue: searchValue})]),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToDelete({error})))
    ));

  editPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.editPet),
      switchMap(action => this.httpClient.editPet(action.pet)),
      withLatestFrom(this.store$.select('pets', 'searchValue')),
      switchMap(([pet, searchValue]) =>
        [PetsActions.petEdited({pet}), PetsActions.filterPets({searchValue: searchValue})]),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToEdit({error})))
    ));

  filterPets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.filterPets),
      withLatestFrom(this.store$.select(getAllPets)),
      switchMap(([action, pets]) => {
        const cleanSearchValue = action.searchValue
          .trim()
          .toLowerCase();
        const filteredPets = pets.filter((pet: Pet) => pet.name ? pet.name.toLowerCase().includes(cleanSearchValue) : false);
        return of(PetsActions.setFilterResults({searchResults: filteredPets}))
      })
    ));

  calculateAvailableIds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.petsLoaded, PetsActions.petAdded, PetsActions.petDeleted, PetsActions.petEdited, PetsActions.petLoaded),
      switchMap(() => of(PetsActions.calculateAvailableIds()))
    ),
  )
}
