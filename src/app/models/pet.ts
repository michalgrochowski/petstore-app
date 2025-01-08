import {PetCategory} from "./pet-category";
import {PetTag} from "./pet-tag";
import {PetStatus} from "../enums/pet-status";

export interface Pet {
  id: number;
  category: PetCategory;
  name: string;
  photoUrls: string[];
  tags: PetTag[];
  status: PetStatus;
}
