import { createReducer, on } from '@ngrx/store';
import { PetsActions } from './pets.actions';
import {Pet} from "../../models/pet";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";

export const petsFeatureKey = 'pets';

export interface State {
  pets: EntityState<Pet>,
  loadingPets: boolean,
  petsLoaded: boolean,
  petsFailedToLoad: boolean,
  addingPet: boolean,
  petAdded: boolean,
  petFailedToAdd: boolean,
  loadingPet: boolean,
  petLoaded: boolean,
  petFailedToLoad: boolean,
  updatingPet: boolean,
  petUpdated: boolean,
  petFailedToUpdate: boolean,
  deletingPet: boolean,
  petDeleted: boolean,
  petFailedToDelete: boolean,
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>({
  selectId: (item: Pet) => item.id,
});

export const initialState: State = {
  pets: adapter.getInitialState(),
  loadingPets: false,
  petsLoaded: false,
  petsFailedToLoad: false,
  loadingPet: false,
  petLoaded: false,
  petFailedToLoad: false,
  addingPet: false,
  deletingPet: false,
  petAdded: false,
  petDeleted: false,
  petFailedToAdd: false,
  petFailedToDelete: false,
  petFailedToUpdate: false,
  petUpdated: false,
  updatingPet: false
};

export const reducer = createReducer(
  initialState,
  on(PetsActions.loadPets, (state) => {
    return {...state, loadingPets: true};
  }),
  on(PetsActions.petsLoaded, (state, action) => {
    return {
      ...state,
      pets: adapter.setAll(action.pets, initialState.pets),
      loadingPets: false,
      petsLoaded: true
    };
  }),
  on(PetsActions.petsFailedToLoad, (state, action) => {
    return {...state, loadingPets: false, petsFailedToLoad: true};
  }),
  on(PetsActions.loadPet, (state) => {
    return {...state, loadingPets: true};
  }),
  on(PetsActions.petLoaded, (state, action) => {
    return {...state, pets: adapter.upsertOne(action.pet, initialState.pets)}
  }),
  on(PetsActions.petFailedToLoad, (state) => {
    return {...state, loadingPets: false, petFailedToLoad: true};
  }),
  on(PetsActions.addPet, (state) => {
    return {...state, addingPet: true};
  }),
  on(PetsActions.petAdded, (state, action) => {
    return {...state, addingPet: false, petAdded: true, pets: adapter.addOne(action.pet, initialState.pets)}
  }),
  on(PetsActions.petFailedToAdd, (state) => {
    return {...state, addingPet: false, petFailedToAdd: true};
  }),
  on(PetsActions.editPet, (state) => {
    return {...state, updatingPet: true};
  }),
  on(PetsActions.petEdited, (state, action) => {
    return {...state, updatingPet: false, petUpdated: true, pets: adapter.upsertOne(action.pet, initialState.pets)}
  }),
  on(PetsActions.petFailedToEdit, (state) => {
    return {...state, updatingPet: false, petFailedToUpdate: true};
  }),
  on(PetsActions.deletePet, (state) => {
    return {...state, deletingPet: true};
  }),
  on(PetsActions.petDeleted, (state, action) => {
    return {...state, deletingPet: false, petDeleted: true, pets: adapter.removeOne(action.pet.id, initialState.pets)}
  }),
  on(PetsActions.petFailedToDelete, (state) => {
    return {...state, deletingPet: false, petFailedToDelete: true};
  }),
);

export const {selectAll} = adapter.getSelectors();
