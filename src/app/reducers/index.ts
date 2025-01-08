import {ActionReducerMap} from "@ngrx/store";
import {reducer as petsReducer, State as PetsState} from '../features/pets/pets.reducer';

export interface State {
  pets: PetsState,
}

export const reducers: ActionReducerMap<State> = {
  pets: petsReducer,
}
