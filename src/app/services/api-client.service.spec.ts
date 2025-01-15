import {ApiClientService} from "./api-client.service";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {TestBed} from "@angular/core/testing";
import {initialState} from "../../test/test-store";
import {provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {PetStatus} from "../enums/pet-status";
import {firstValueFrom} from "rxjs";
import {createPet} from "../../test/factories/pet-factory";

describe('ApiClientService', async () => {
  let service: ApiClientService;
  let store: MockStore;
  let httpTesting: HttpTestingController;

  const mockPetsResponse = [
    createPet({id: 1, name: 'Pet1'}),
    createPet({id: 2, name: 'Pet2'}),
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialState()}),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    store = TestBed.inject(MockStore);
    service = TestBed.inject(ApiClientService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.setState(initialState());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('GET Request for /pet/findByStatus?status={status} with provided status should return array of pets', async () => {
    const loadPets$ = service.getPetsByStatus(PetStatus.Available);

    const loadPetsPromise = firstValueFrom(loadPets$);

    const request = httpTesting.expectOne(service.apiUrl + `/findByStatus?status=${PetStatus.Available}`, 'Load Pets filtered by status');

    expect(request.request.method).toBe('GET');

    request.flush(mockPetsResponse);

    expect(await loadPetsPromise).toEqual(mockPetsResponse);

    httpTesting.verify();
  });

  it('POST Request to /pet should return added pet', async () => {
    const addPet$ = service.addPet(createPet({id: 1, name: 'Pet1'}));

    const addPetPromise = firstValueFrom(addPet$);

    const request = httpTesting.expectOne(service.apiUrl, 'Add Pet');

    expect(request.request.method).toBe('POST');

    request.flush(createPet({id: 1, name: 'Pet1'}));

    expect(await addPetPromise).toEqual(createPet({id: 1, name: 'Pet1'}));

    httpTesting.verify();
  });

  it('PUT Request to /pet should return edited pet', async () => {
    const editPet$ = service.editPet(createPet({id: 1, name: 'Pet1'}));

    const editPetPromise = firstValueFrom(editPet$);

    const request = httpTesting.expectOne(service.apiUrl, 'Edit Pet');

    expect(request.request.method).toBe('PUT');

    request.flush(createPet({id: 1, name: 'Pet1'}));

    expect(await editPetPromise).toEqual(createPet({id: 1, name: 'Pet1'}));

    httpTesting.verify();
  });

  it('DELETE Request to /pet/{id} should return deleted pet id', async () => {
    const deletePet$ = service.deletePet(1);

    const deletePetPromise = firstValueFrom(deletePet$);

    const request = httpTesting.expectOne(service.apiUrl + '/1', 'Delete Pet');

    expect(request.request.method).toBe('DELETE');

    request.flush({ code: 200, type: '', message: '1' });

    expect(await deletePetPromise).toEqual({ code: 200, type: '', message: '1' });

    httpTesting.verify();
  });

  it('GET Request to /pet/{id} should return deleted pet id', async () => {
    const getPet$ = service.getPet(1);

    const getPetPromise = firstValueFrom(getPet$);

    const request = httpTesting.expectOne(service.apiUrl + '/1', 'Get Pet');

    expect(request.request.method).toBe('GET');

    request.flush(createPet({id: 1, name: 'Pet1'}));

    expect(await getPetPromise).toEqual(createPet({id: 1, name: 'Pet1'}));

    httpTesting.verify();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
