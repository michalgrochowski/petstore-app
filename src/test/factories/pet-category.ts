import {PetCategory} from "../../app/models/pet-category";

export const createCategory = (params: {id?: number, name?: string}): PetCategory => {
  return {
    id: params.id || 1,
    name: params.name || 'Test Category'
  }
}
