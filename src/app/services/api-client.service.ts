import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiClient} from "./api-client";
import {Pet} from "../models/pet";
import {PetStatus} from "../enums/pet-status";

@Injectable({
  providedIn: 'root',
})
export class ApiClientService implements ApiClient {
  apiUrl = 'https://petstore.swagger.io/v2/pet';

  constructor(private readonly httpClient: HttpClient) {
  }

  addPet(pet: Pet): Observable<Pet> {
    return this.httpClient.post<Pet>(this.apiUrl, JSON.stringify(pet));
  }

  deletePet(petId: number): Observable<{ code: number, type: string, message: string }> {
    return this.httpClient.delete<{ code: number, type: string, message: string }>(this.apiUrl + `/${petId}`);
  }

  editPet(pet: Pet): Observable<Pet> {
    return this.httpClient.put<Pet>(this.apiUrl, pet);
  }

  getPet(petId: number): Observable<Pet> {
    return this.httpClient.get<Pet>(this.apiUrl + `/${petId}`);
  }

  getPetsByStatus(status: PetStatus): Observable<Pet[]> {
    return this.httpClient.get<Pet[]>(this.apiUrl + '/findByStatus', {params: new HttpParams().set("status", status)});
  }
}
