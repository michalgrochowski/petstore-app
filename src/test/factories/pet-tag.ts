import {PetTag} from "../../app/models/pet-tag";

export const createTag = (params: {id?: number, name?: string}): PetTag => {
  return {
    id: params.id || 1,
    name: params.name || 'Test Tag'
  }
}
