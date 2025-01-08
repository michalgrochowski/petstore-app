import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPets from './pets.reducer';

export const selectPetsState = createFeatureSelector<fromPets.State>(
  fromPets.petsFeatureKey
);
