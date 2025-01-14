import {Pet} from "../../app/models/pet";
import {PetCategory} from "../../app/models/pet-category";
import {PetTag} from "../../app/models/pet-tag";
import {PetStatus} from "../../app/enums/pet-status";
import {createCategory} from "./pet-category";
import {createTag} from "./pet-tag";

export const createPet = (params: {
  id: number,
  name: string,
  category?: PetCategory,
  photoUrls?: string[],
  tags?: PetTag[],
  status?: PetStatus
}): Pet => {
  return {
    id: params.id || 1,
    name: params.name || 'Test',
    category: params.category || createCategory({}),
    photoUrls: params.photoUrls || ['www.test.com'],
    tags: params.tags || [createTag({id: 1}), createTag({id: 2})],
    status: params.status || PetStatus.Available
  }
}
