import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { PetsActions } from './pets.actions';

@Injectable()
export class PetsEffects {

  loadPetss$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(PetsActions.loadPets),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => PetsActions.loadPetsSuccess({ data })),
          catchError(error => of(PetsActions.loadPetsFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
