import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Pet} from "../../models/pet";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {delay, Observable, Subject, takeUntil} from "rxjs";
import {PetStatus} from "../../enums/pet-status";
import {MatChipInputEvent} from "@angular/material/chips";
import {PetsActions} from "../../features/pets/pets.actions";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface AddOrEditPetDialogData {
  pet: Pet;
  isNewPet: boolean;
  lastPetId: number;
  lastCategoryId: number;
  lastTagId: number;
}

@Component({
  selector: 'app-add-edit-pet-dialog',
  templateUrl: './add-edit-pet-dialog.component.html',
  styleUrl: './add-edit-pet-dialog.component.scss',
  standalone: false
})
export class AddEditPetDialogComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddOrEditPetDialogData,
              private readonly store$: Store<State>,
              private readonly dialogRef: MatDialogRef<AddEditPetDialogComponent>,
              private readonly formBuilder: FormBuilder,
              private readonly snackBar: MatSnackBar) {
  }


  statuses = Object.values(PetStatus);
  submitAttempt = false;
  dialogTitle = this.data.isNewPet ? 'Add new pet' : `Edit pet - ${this.data.pet.name}`;
  isSavingPet$ = this.store$.select('pets', 'petUpdating').pipe(takeUntil(this.unsubscribe$));
  petSaved$ = this.store$.select('pets', 'petUpdated').pipe(takeUntil(this.unsubscribe$));
  savingPetFailed$ = this.store$.select('pets', 'petFailedToUpdate').pipe(takeUntil(this.unsubscribe$));

  petError$: Observable<HttpErrorResponse | null> = this.store$.select('pets', 'petRequestError');

  petForm: FormGroup = this.formBuilder.group({
    id: [null, Validators.required],
    name: ['', [Validators.required, Validators.minLength(1)]],
    category: this.formBuilder.group({
      id: [null, Validators.required],
      name: ['', Validators.minLength(1)],
    }),
    photoUrls: new FormArray([]),
    tags: new FormArray([]),
    status: [PetStatus.Available, Validators.required],
  });

  get tagsArray(): FormArray {
    return this.petForm.get('tags') as FormArray;
  }

  get photoUrlsArray(): FormArray {
    return this.petForm.get('photoUrls') as FormArray;
  }

  ngOnInit(): void {
    if (!this.data.isNewPet) {
      this.convertPetToFormData(this.data.pet);
    } else {
      this.initForm();
    }
    this.petError$.pipe(takeUntil(this.unsubscribe$)).subscribe((data: HttpErrorResponse | null) => {
      if (data) {
        this.snackBar.open(`An error occured: ${data.error.code} - ${data.error?.error?.message ?? data.error?.message}`, 'Close');
      }
    });
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
      this.tagsArray.push(new FormControl({id: this.data.lastTagId + 10, name: value}));
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
    this.store$.dispatch(PetsActions.clearAddedAndDeleted());
    if (this.data.isNewPet) {
      this.petForm.patchValue({...this.petForm.value, id: this.data.lastPetId + 10});
    }
    if (this.petForm.invalid) {
      return;
    } else {
      this.store$.dispatch(this.data.isNewPet ? PetsActions.addPet({pet: this.petForm.value}) : PetsActions.editPet({pet: this.petForm.value}));
      this.petSaved$.pipe(delay(500)).subscribe((data) => {
        if (data) {
          this.dialogRef.close(this.petForm.value);
        }
      });
    }
  }

  private initForm(): void {
    this.petForm = this.formBuilder.group({
      id: [this.data.lastPetId + 10, Validators.required],
      name: ['', [Validators.required, Validators.minLength(1)]],
      category: this.formBuilder.group({
        id: [this.data.lastCategoryId + 10, Validators.required],
        name: ['', Validators.minLength(1)],
      }),
      photoUrls: new FormArray([]),
      tags: new FormArray([]),
      status: [PetStatus.Available, Validators.required],
    });
    this.petForm.get('photoUrls')?.addValidators(Validators.pattern(/^(https?|ftp)?(:\/\/)?[^\s/$.?#].[^\s]*$/));
  }

  private convertPetToFormData(pet: Pet): void {
    this.petForm = this.formBuilder.group({
      id: [pet.id, Validators.required],
      name: [pet.name || null, [Validators.required, Validators.minLength(1)]],
      category: this.formBuilder.group({
        id: [pet.category?.id ?? this.data.lastCategoryId + 10, Validators.required],
        name: [pet.category?.name ?? '', Validators.minLength(1)],
      }),
      photoUrls: this.data.pet.photoUrls ? new FormArray(this.data.pet.photoUrls.map(url => new FormControl(url))) : new FormArray([]),
      tags: this.data.pet.tags ? new FormArray(this.data.pet.tags.map(tag => new FormControl(tag))) : new FormArray([]),
      status: [pet.status ?? PetStatus.Available, Validators.required],
    });
    this.petForm.get('photoUrls')?.addValidators(Validators.pattern(/^(https?|ftp)?(:\/\/)?[^\s/$.?#].[^\s]*$/));
  }
}
