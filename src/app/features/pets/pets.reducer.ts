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
  petUpdating: boolean,
  petUpdated: boolean,
  petFailedToUpdate: boolean,
  petDeleted: number | null;
  petAdded: Pet | null;
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>({
  selectId: (item: Pet) => item.id,
});

export const initialState: State = {
  pets: adapter.getInitialState(),
  loadingPets: false,
  petsLoaded: false,
  petsFailedToLoad: false,
  petUpdating: false,
  petUpdated: false,
  petFailedToUpdate: false,
  petDeleted: null,
  petAdded: null,
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
  on(PetsActions.petsFailedToLoad, (state) => {
    return {...state, loadingPets: false, petsFailedToLoad: true};
  }),
  on(PetsActions.loadPet, (state) => {
    return {...state, petUpdating: true};
  }),
  on(PetsActions.petLoaded, (state, action) => {
    return {...state, petUpdating: false, petUpdated: true, pets: adapter.upsertOne(action.pet, state.pets)}
  }),
  on(PetsActions.petFailedToLoad, (state) => {
    return {...state, loadingPets: false, petFailedToUpdate: true};
  }),
  on(PetsActions.addPet, (state) => {
    return {...state, petUpdating: true};
  }),
  on(PetsActions.petAdded, (state, action) => {
    return {...state, petUpdating: false, petUpdated: true, pets: adapter.addOne(action.pet, state.pets), petAdded: action.pet}
  }),
  on(PetsActions.petFailedToAdd, (state) => {
    return {...state, petUpdating: false, petFailedToUpdate: true};
  }),
  on(PetsActions.editPet, (state) => {
    return {...state, petUpdating: true};
  }),
  on(PetsActions.petEdited, (state, action) => {
    return {...state, petUpdating: false, petUpdated: true, pets: adapter.upsertOne(action.pet, state.pets)}
  }),
  on(PetsActions.petFailedToEdit, (state) => {
    return {...state, petUpdating: false, petFailedToUpdate: true};
  }),
  on(PetsActions.deletePet, (state) => {
    return {...state, petUpdating: true};
  }),
  on(PetsActions.petDeleted, (state, action) => {
    return {...state, petUpdating: false, petUpdated: true, pets: adapter.removeOne(action.petId, state.pets), petDeleted: action.petId}
  }),
  on(PetsActions.petFailedToDelete, (state) => {
    return {...state, petUpdating: false, petFailedToUpdate: true};
  }),
);

export const {selectAll, selectEntities} = adapter.getSelectors();
