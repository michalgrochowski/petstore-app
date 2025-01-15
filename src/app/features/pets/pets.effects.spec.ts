import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of} from 'rxjs';
import {addMatchers, cold, hot, initTestScheduler} from 'jasmine-marbles';
import {PetsEffects} from './pets.effects';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {HttpClient} from "@angular/common/http";
import {PetsActions} from "./pets.actions";
import {PetStatus} from "../../enums/pet-status";
import {createPet} from "../../../test/factories/pet-factory";

describe('PetsEffects', () => {
  let actions$: Observable<any>;
  let effects: PetsEffects;
  let store: MockStore;
  let httpClient: HttpClient;

  const petsResponse = [
    createPet({id: 1, name: 'Pet1'}),
    createPet({id: 2, name: 'Pet2'}),
  ]
  const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetsEffects,
        {provide: HttpClient, useValue: httpSpy},
        provideMockActions(() => actions$),
        provideMockStore({initialState})
      ]
    });

    initTestScheduler();
    addMatchers();
    effects = TestBed.inject(PetsEffects);
    store = TestBed.inject(MockStore);
    httpClient = TestBed.inject(HttpClient);
    store.setState(initialState())
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`WHEN loadPets action is called THEN petsLoaded and filterPets action should be invoked`, () => {
    const action = PetsActions.loadPets({status: PetStatus.Available});
    actions$ = hot('--a-', { a: action });
    httpSpy.get.and.returnValue(of(petsResponse));

    const completionB = PetsActions.petsLoaded({ pets: petsResponse });
    const completionC = PetsActions.filterPets({searchValue: ''});

    const expected = cold('--(bc)', { b: completionB, c: completionC });
    expect(effects.loadPets$).toBeObservable(expected);
  });

  it(`WHEN deletePet action is called THEN petDeleted and filterPets action should be invoked`, () => {
    const action = PetsActions.deletePet({pet: createPet({id: 1, name: 'Pet1'}),});
    actions$ = hot('--a-', { a: action });
    httpSpy.delete.and.returnValue(of({ code: 200, type: 'success', message: 1 }));

    const completionB = PetsActions.petDeleted({ petId: 1 });
    const completionC = PetsActions.filterPets({searchValue: initialState().pets.searchValue});

    const expected = cold('--(bc)', { b: completionB, c: completionC });
    expect(effects.deletePet$).toBeObservable(expected);
  });

  it(`WHEN filterPets action is called THEN setFilterResults action should be invoked`, () => {
    const action = PetsActions.filterPets({searchValue: 'Pet1'});
    actions$ = hot('--a-', { a: action });

    const completionB = PetsActions.setFilterResults({ searchResults: [createPet({id: 1,  name:'Pet1'})]});

    const expected = cold('--b', { b: completionB });
    expect(effects.filterPets$).toBeObservable(expected);
  });
});
