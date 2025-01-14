import {getAllPets, getPetById} from './pets.selectors';
import {createPet} from "../../../test/factories/pet-factory";
import {initialState} from "../../../test/test-store";
import {Pet} from "../../models/pet";

describe('Pets selectors', () => {
  describe('getAllPets', () => {
    it('should get all pets', () => {
      const pets = [
        createPet({id: 1, name: 'Pet1'}),
        createPet({id: 2, name: 'Pet2'}),
      ];

      const ids = pets.map(item => item.id);
      const entities = {};
      // @ts-ignore
      pets.forEach((item: Pet) => entities[item.id] = item);

      const characters = {ids, entities};
      const state = {...initialState(), characters};
      const select = getAllPets(state);

      expect(select).toEqual(pets);
    });
  });

  xdescribe('getPetById', () => {
    it('should get pet by id', () => {
      const charactersEntities = [
        createPet({id: 1, name: 'Pet1'}),
        createPet({id: 2, name: 'Pet2'}),
      ];

      const entities = {};
      // @ts-ignore
      charactersEntities.forEach(item => entities[item.id] = item);

      const select = getPetById(1);

      expect(select).toEqual(charactersEntities[0]);
    });
  });
});
