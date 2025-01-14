import {adapter, initialState, reducer} from './pets.reducer';
import {PetsActions} from "./pets.actions";
import {createPet} from "../../../test/factories/pet-factory";

describe('Pets Reducer', () => {
  describe('Pets Loaded', () => {
    it('should add pets from action', () => {
      const action = PetsActions.petsLoaded({pets: [createPet({id: 1, name: 'Pet1'}), createPet({id: 2, name: 'Pet2'})]});
      const result = reducer(initialState, action);

      expect(result).toEqual({...initialState, pets: adapter.setAll(action.pets, initialState.pets), loadingPets: false, petsLoaded: true});
    });
  });

  describe('Pet Added', () => {
    it('should add new pet from action', () => {
      const action = PetsActions.petAdded({pet: createPet({id: 3, name: 'Pet3'})});
      const result = reducer(initialState, action);

      expect(result).toEqual({...initialState, pets: adapter.addOne(action.pet, initialState.pets), petUpdating: false, petUpdated: true, petAdded: action.pet});
    });
  });

  describe('Pet Deleted', () => {
    it('should delete pet from action', () => {
      const action = PetsActions.petDeleted({petId: 1});
      const result = reducer(initialState, action);

      expect(result).toEqual({...initialState, pets: adapter.removeOne(action.petId, initialState.pets), petUpdating: false, petUpdated: true, petDeleted: action.petId});
    });
  });

  describe('Pet Updated', () => {
    it('should update pet from action', () => {
      const action = PetsActions.petEdited({pet: createPet({id: 3, name: 'Pet3'})});
      const result = reducer(initialState, action);

      expect(result).toEqual({...initialState, pets: adapter.upsertOne(action.pet, initialState.pets), petUpdating: false, petUpdated: true});
    });
  });
});
