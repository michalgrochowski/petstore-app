import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {Pet} from "../../models/pet";
import {PetStatus} from "../../enums/pet-status";

export const PetsActions = createActionGroup({
  source: 'Pets',
  events: {
    'Load Pets': props<{status: PetStatus}>(),
    'Pets Loaded': props<{ pets: Pet[]}>(),
    'Pets Failed to Load': emptyProps(),
    'Delete Pet': props<{pet: Pet}>(),
    'Pet Deleted': props<{pet: Pet}>(),
    'Pet Failed to Delete': emptyProps(),
    'Edit Pet': props<{pet: Pet}>(),
    'Pet Edited': props<{pet: Pet}>(),
    'pet Failed to Edit': emptyProps(),
    'Add Pet': props<{pet: Pet}>(),
    'Pet Added': props<{pet: Pet}>(),
    'Pet Failed to Add': emptyProps(),
    'Load Pet': props<{id: number}>(),
    'Pet Loaded': props<{pet: Pet}>(),
    'Pet Failed to Load': emptyProps(),
  }
});
