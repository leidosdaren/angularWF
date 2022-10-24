import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const OPERATOR_URL = "https://dsm-1.operate.camunda.io/e106da45-e2d7-45c1-b6d8-1c444f666691";
const VARIABLE_SEARCH_URI = "/v1/variables/search";

const token = environment.CAMUNDA_AUTH_TOKEN;
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});
const variableFilter = { "filter": { "processInstanceKey": 2251799813876750, "name": "zipcode_out" } };
const requestOptions = { headers: headers };

@Injectable({
  providedIn: 'root',
})
export class CamundaOperatorService {

  

  constructor(private http: HttpClient) {}

  getVariable() {
    return this.http.post<any>(OPERATOR_URL + VARIABLE_SEARCH_URI, 
      variableFilter, requestOptions);
  }
}