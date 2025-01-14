import { createReducer, on } from '@ngrx/store';
import { PetsActions } from './pets.actions';
import {Pet} from "../../models/pet";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {flattenArray} from "../../helpers/flatten-array";
import {PetTag} from "../../models/pet-tag";
import {PetCategory} from "../../models/pet-category";
import * as _ from 'lodash';
import {HttpErrorResponse} from "@angular/common/http";

export const petsFeatureKey = 'pets';

export interface State {
  pets: EntityState<Pet>,
  filteredPets: Pet[];
  searchValue: string;
  loadingPets: boolean,
  petsLoaded: boolean,
  petsFailedToLoad: boolean,
  petUpdating: boolean,
  petUpdated: boolean,
  petFailedToUpdate: boolean,
  petDeleted: number | null;
  petAdded: Pet | null;
  petRequestError: HttpErrorResponse | null;
  lastPetId: number | null;
  lastCategoryId: number | null;
  lastTagId: number | null;
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>({
  selectId: (item: Pet) => item.id,
});

export const initialState: State = {
  pets: adapter.getInitialState(),
  filteredPets: [],
  searchValue: '',
  loadingPets: false,
  petsLoaded: false,
  petsFailedToLoad: false,
  petUpdating: false,
  petUpdated: false,
  petFailedToUpdate: false,
  petDeleted: null,
  petAdded: null,
  petRequestError: null,
  lastPetId: null,
  lastCategoryId: null,
  lastTagId: null,
};

export const reducer = createReducer(
  initialState,
  on(PetsActions.loadPets, (state) => {
    return {
      ...state,
      loadingPets: true,
      petRequestError: null
    };
  }),
  on(PetsActions.petsLoaded, (state, action) => {
    return {
      ...state,
      pets: adapter.setAll(action.pets, initialState.pets),
      loadingPets: false,
      petsLoaded: true,
      lastPetId: _.cloneDeep(action.pets).sort((a: Pet, b: Pet) => b.id > a.id ? 1 : -1)[0]?.id,
      lastCategoryId: _.cloneDeep(action.pets).map((pet: Pet) => pet.category).sort((a: PetCategory, b: PetCategory) => b.id > a.id ? 1 : -1)[0]?.id,
      lastTagId: flattenArray(_.cloneDeep(action.pets).map((pet: Pet) => pet.tags)).sort((a: PetTag, b: PetTag) => b.id > a.id ? 1 : -1)[0]?.id,
    };
  }),
  on(PetsActions.petsFailedToLoad, (state, action) => {
    return {
      ...state,
      loadingPets: false,
      petsFailedToLoad: true,
      petRequestError: action.error
    };
  }),
  on(PetsActions.loadPet, (state) => {
    return {
      ...state,
      petUpdating: true,
      petRequestError: null
    };
  }),
  on(PetsActions.petLoaded, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petUpdated: true,
      pets: adapter.upsertOne(action.pet, state.pets)
    }
  }),
  on(PetsActions.petFailedToLoad, (state, action) => {
    return {
      ...state,
      loadingPets: false,
      petFailedToUpdate: true,
      petRequestError: action.error
    };
  }),
  on(PetsActions.addPet, (state) => {
    return {
      ...state,
      petUpdating: true,
      petUpdated: false,
      petFailedToUpdate: false,
      petRequestError: null
    };
  }),
  on(PetsActions.petAdded, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petUpdated: true,
      pets: adapter.addOne(action.pet, state.pets),
      petAdded: action.pet
    }
  }),
  on(PetsActions.petFailedToAdd, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petFailedToUpdate: true,
      petRequestError: action.error
    };
  }),
  on(PetsActions.editPet, (state) => {
    return {
      ...state,
      petUpdating: true,
      petUpdated: false,
      petFailedToUpdate: false,
      petRequestError: null
    };
  }),
  on(PetsActions.petEdited, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petUpdated: true,
      pets: adapter.upsertOne(action.pet, state.pets)
    }
  }),
  on(PetsActions.petFailedToEdit, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petFailedToUpdate: true,
      petRequestError: action.error
    };
  }),
  on(PetsActions.deletePet, (state) => {
    return {
      ...state,
      petUpdating: true,
      petUpdated: false,
      petFailedToUpdate: false,
      petRequestError: null
    };
  }),
  on(PetsActions.petDeleted, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petUpdated: true,
      pets: adapter.removeOne(action.petId, state.pets),
      petDeleted: action.petId
    }
  }),
  on(PetsActions.petFailedToDelete, (state, action) => {
    return {
      ...state,
      petUpdating: false,
      petFailedToUpdate: true,
      petRequestError: action.error
    };
  }),
  on(PetsActions.filterPets, (state, action) => {
    return {
      ...state,
      searchValue: action.searchValue
    }
  }),
  on(PetsActions.setFilterResults, (state, action) => {
    return {
      ...state,
      filteredPets: action.searchResults
    }
  }),
  on(PetsActions.clearAddedAndDeleted, (state) =>
    ({...state, petAdded: null, petDeleted: null}))
);

export const {selectAll, selectEntities} = adapter.getSelectors();
