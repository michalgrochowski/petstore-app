import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Pet} from "../../models/pet";
import {PetStatus} from "../../enums/pet-status";
import {HttpErrorResponse} from "@angular/common/http";

export const PetsActions = createActionGroup({
  source: 'Pets',
  events: {
    'Load Pets': props<{readonly status: PetStatus}>(),
    'Pets Loaded': props<{readonly pets: Pet[]}>(),
    'Pets Failed to Load': props<{readonly error: HttpErrorResponse}>(),
    'Delete Pet': props<{readonly pet: Pet}>(),
    'Pet Deleted': props<{readonly petId: number}>(),
    'Pet Failed to Delete': props<{readonly error: HttpErrorResponse}>(),
    'Edit Pet': props<{readonly pet: Pet}>(),
    'Pet Edited': props<{readonly pet: Pet}>(),
    'pet Failed to Edit': props<{readonly error: HttpErrorResponse}>(),
    'Add Pet': props<{readonly pet: Pet}>(),
    'Pet Added': props<{readonly pet: Pet}>(),
    'Pet Failed to Add': props<{readonly error: HttpErrorResponse}>(),
    'Load Pet': props<{readonly id: number}>(),
    'Pet Loaded': props<{readonly pet: Pet}>(),
    'Pet Failed to Load': props<{readonly error: HttpErrorResponse}>(),
    'Filter Pets': props<{readonly searchValue: string}>(),
    'Set Filter Results': props<{readonly searchResults: Pet[]}>(),
    'Clear Added and Deleted': emptyProps(),
  }
});
