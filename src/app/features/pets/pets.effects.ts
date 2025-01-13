import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { PetsActions } from './pets.actions';
import {ApiClientService} from "../../services/api-client.service";
import {Pet} from "../../models/pet";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class PetsEffects {
  constructor(private actions$: Actions, private readonly httpClient: ApiClientService) {
  }

  loadPets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.loadPets),
      switchMap(action => this.httpClient.getPetsByStatus(action.status)),
      switchMap((pets: Pet[]) => of(PetsActions.petsLoaded({pets}))),
      catchError((error: HttpErrorResponse) => of(PetsActions.petsFailedToLoad({error})))
    ));

  loadPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.loadPet),
      switchMap(action => this.httpClient.getPet(action.id)),
      switchMap((pet: Pet) => of(PetsActions.petLoaded({pet}))),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToLoad({error})))
    ));

  addPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.addPet),
      switchMap(action => this.httpClient.addPet(action.pet)),
      switchMap((pet: Pet) => of(PetsActions.petAdded({pet}))),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToAdd({error})))
  ));

  deletePet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.deletePet),
      switchMap(action => this.httpClient.deletePet(action.pet.id)),
      switchMap((deleteResponse: { code: number, type: string, message: string }) =>
        of(PetsActions.petDeleted({petId: Number(deleteResponse.message)}))),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToDelete({error})))
    ));

  editPet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PetsActions.editPet),
      switchMap(action => this.httpClient.editPet(action.pet)),
      switchMap((pet: Pet) => of(PetsActions.petEdited({pet}))),
      catchError((error: HttpErrorResponse) => of(PetsActions.petFailedToEdit({error})))
    ));
}
