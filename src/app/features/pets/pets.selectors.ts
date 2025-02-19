import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPets from './pets.reducer';
import {selectAll} from "./pets.reducer";

export const selectPetsState = createFeatureSelector<fromPets.State>(
  fromPets.petsFeatureKey
);

export const getAllPets =
  createSelector(selectPetsState, state => selectAll(state.pets));

export const getPetById = (id: number) =>
  createSelector(selectPetsState, state => selectAll(state.pets).find(pet => pet.id === id));
