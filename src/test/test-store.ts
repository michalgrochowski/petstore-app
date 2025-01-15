import {State} from "../app/reducers";
import {createPet} from "./factories/pet-factory";
import {PetStatus} from "../app/enums/pet-status";

export const initialState = (): State => {
  return {
    pets: {
      pets: {ids: [1, 2], entities: {1: createPet({id: 1, name: 'Pet1'}), 2: createPet({id: 2, name: 'Pet2'})}},
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
    }
  }
};
