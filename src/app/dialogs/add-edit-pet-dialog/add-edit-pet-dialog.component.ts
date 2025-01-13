import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Pet} from "../../models/pet";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {Subject, takeUntil} from "rxjs";
import {PetStatus} from "../../enums/pet-status";
import {MatChipInputEvent} from "@angular/material/chips";
import {PetsActions} from "../../features/pets/pets.actions";

interface DialogData {
  pet: Pet;
  isNewPet: boolean;
}

@Component({
  selector: 'app-add-edit-pet-dialog',
  templateUrl: './add-edit-pet-dialog.component.html',
  styleUrl: './add-edit-pet-dialog.component.scss',
  standalone: false
})
export class AddEditPetDialogComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly store$: Store<State>,
              private readonly dialogRef: MatDialogRef<AddEditPetDialogComponent>,
              private readonly formBuilder: FormBuilder) {
  }
  statuses = Object.values(PetStatus);
  submitAttempt = false;
  dialogTitle = this.data.isNewPet ? 'Add new pet' : `Edit pet - ${this.data.pet.name}`;
  isSavingPet$ = this.store$.select('pets', 'petUpdating').pipe(takeUntil(this.unsubscribe$));
  petSaved$ = this.store$.select('pets', 'petUpdated').pipe(takeUntil(this.unsubscribe$));
  savingPetFailed$ = this.store$.select('pets', 'petFailedToUpdate').pipe(takeUntil(this.unsubscribe$));

  petForm: FormGroup = this.formBuilder.group({
    id: [null, Validators.required],
    name: [null, [Validators.required, Validators.minLength(1)]],
    category: this.formBuilder.group({
      id: [null],
      name: [null],
    }),
    photoUrls: new FormArray([]),
    tags: new FormArray([]),
    status: [null, Validators.required],
  });

  get tagsArray(): FormArray {
    return this.petForm.get('tags') as FormArray;
  }

  get photoUrlsArray(): FormArray {
    return this.petForm.get('photoUrls') as FormArray;
  }

  ngOnInit(): void {
    if (!this.data.isNewPet) {
      setTimeout(() => {
        this.convertPerToFormData(this.data.pet);
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  removeTag(index: number) {
    this.tagsArray.removeAt(index);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tagsArray.push(new FormControl({id: Math.random(), name: value}));
    }

    event.chipInput.clear();
  }

  removePhotoUrl(index: number) {
    this.photoUrlsArray.removeAt(index);
  }

  addPhotoUrl(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.photoUrlsArray.push(new FormControl(value));
    }

    event.chipInput.clear();
  }

  close($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialogRef.close(null)
  }

  save(): void {
    this.submitAttempt = true;
    if (this.data.isNewPet) {
      this.petForm.get('id')?.setValue(Math.random());
    }
    if (this.petForm.invalid) {
      return;
    } else {
      this.store$.dispatch(this.data.isNewPet ? PetsActions.addPet({pet: this.petForm.value}) : PetsActions.editPet({pet: this.petForm.value}));
      this.petSaved$.subscribe(() => this.dialogRef.close(this.petForm.value));
    }
  }

  private convertPerToFormData(pet: Pet): any {
    const existingPetData = {
      id: pet.id,
      name: pet.name || null,
      category: pet.category || null,
      photoUrls: pet.photoUrls || [],
      tags: pet.tags || [],
      status: pet.status || null,
    };
    this.petForm.patchValue(existingPetData);
    this.petForm.get('name')?.setValidators([Validators.required, Validators.minLength(1)]);
    this.petForm.get('status')?.setValidators([Validators.required]);
    this.petForm.controls['photoUrls'] = new FormArray(this.data.pet.photoUrls.map(url => new FormControl(url)));
    this.petForm.controls['tags'] = new FormArray(this.data.pet.tags.map(tag => new FormControl(tag)));
    this.petForm.controls['category'] = this.formBuilder.group(
      {id: this.data.pet.category.id, name: this.data.pet.category.name});
  }
}
