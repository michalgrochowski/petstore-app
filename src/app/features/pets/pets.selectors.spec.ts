import {getAllPets, getPetById} from './pets.selectors';
import {createPet} from "../../../test/factories/pet-factory";
import {initialState} from "../../../test/test-store";
import {Pet} from "../../models/pet";
import {State} from "../../reducers";

describe('Pets selectors', () => {
  describe('getAllPets', () => {
    it('should get all pets', () => {
      const petEntities = [
        createPet({id: 1, name: 'Pet1'}),
        createPet({id: 2, name: 'Pet2'}),
      ];

      const ids = petEntities.map(item => item.id);
      const entities = {};
      // @ts-ignore
      petEntities.forEach((item: Pet) => entities[item.id] = item);

      const pets = {ids, entities};
      const state: State = {...initialState(), pets: {...initialState().pets, pets: pets}};
      const select = getAllPets(state);

      expect(select).toEqual(petEntities);
    });
  });

  describe('getPetById', () => {
    it('should get pet by id', () => {
      const petEntities = [
        createPet({id: 1, name: 'Pet1'}),
        createPet({id: 2, name: 'Pet2'}),
      ];

      const ids = petEntities.map(item => item.id);
      const entities = {};
      // @ts-ignore
      petEntities.forEach((item: Pet) => entities[item.id] = item);

      const pets = {ids, entities};
      const state: State = {...initialState(), pets: {...initialState().pets, pets: pets}};
      const select: Pet | undefined = getPetById(1).projector(state.pets);

      expect(select).toEqual(petEntities[0]);
    });
  });
});
