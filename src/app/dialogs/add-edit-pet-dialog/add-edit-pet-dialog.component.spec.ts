import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPetDialogComponent } from './add-edit-pet-dialog.component';

describe('AddEditPetComponent', () => {
  let component: AddEditPetDialogComponent;
  let fixture: ComponentFixture<AddEditPetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
