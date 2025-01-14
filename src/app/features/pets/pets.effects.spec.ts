import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { PetsEffects } from './pets.effects';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {initialState} from "../../../test/test-store";
import {HttpClient} from "@angular/common/http";

describe('PetsEffects', () => {
  let actions$: Observable<any>;
  let effects: PetsEffects;
  let store: MockStore;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['request']);
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
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
