import {createReducer, on} from '@ngrx/store';
import {PetsActions} from './pets.actions';
import {Pet} from "../../models/pet";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import * as _ from 'lodash';
import {flatten} from 'lodash';
import {HttpErrorResponse} from "@angular/common/http";
import {findFirstAvailableId} from "../../helpers/find-first-available-id";
import {findMissingNumbers} from "../../helpers/find-missing-ids";
import {PetStatus} from "../../enums/pet-status";

export const petsFeatureKey = 'pets';

export interface State {
  pets: EntityState<Pet>,
  filteredPets: Pet[];
  searchValue: string;
  selectedStatus: PetStatus;
  loadingPets: boolean,
  petsLoaded: boolean,
  petsFailedToLoad: boolean,
  petUpdating: boolean,
  petUpdated: boolean,
  petFailedToUpdate: boolean,
  petDeleted: number | null;
  petAdded: Pet | null;
  petRequestError: HttpErrorResponse | null;
  firstAvailablePetId: number;
  firstAvailableCategoryId: number;
  availableTagIds: number[]
}

export const adapter: EntityAdapter<Pet> = createEntityAdapter<Pet>({
  selectId: (item: Pet) => item.id,
});

export const initialState: State = {
  pets: adapter.getInitialState(),
  filteredPets: [],
  searchValue: '',
  selectedStatus: PetStatus.Available,
  loadingPets: false,
  petsLoaded: false,
  petsFailedToLoad: false,
  petUpdating: false,
  petUpdated: false,
  petFailedToUpdate: false,
  petDeleted: null,
  petAdded: null,
  petRequestError: null,
  firstAvailablePetId: 1,
  firstAvailableCategoryId: 1,
  availableTagIds: []
};

export const reducer = createReducer(
  initialState,
  on(PetsActions.loadPets, (state, action) => {
    return {
      ...state,
      loadingPets: true,
      petRequestError: null,
      selectedStatus: action.status,
    };
  }),
  on(PetsActions.petsLoaded, (state, action) => {
    return {
      ...state,
      pets: adapter.setAll(action.pets, initialState.pets),
      loadingPets: false,
      petsLoaded: true
    };
  }),
  on(PetsActions.calculateAvailableIds, (state) => {
    return {
      ...state,
      firstAvailablePetId: findFirstAvailableId(_.cloneDeep(selectAll(state.pets))
        .map(pet => pet.id)
        .filter(num => num > 0)),
      firstAvailableCategoryId: findFirstAvailableId(_.cloneDeep(selectAll(state.pets))
        .map(pet => pet.category ? pet.category.id : null)
        .filter(num => num && num > 0).filter(num => num !== null)),
      availableTagIds: findMissingNumbers(flatten(_.cloneDeep(selectAll(state.pets))
        .map(pet => pet.tags ? pet.tags.map(tag => tag.id).filter(num => num > 0 && num < 1000) : []))
        .filter(num => num !== null))
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
