import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseApiService {
  protected baseUrl = environment.apiUrl;
  public headers: HttpHeaders = new HttpHeaders({
    "Accept": "multipart/form-data",
    "Content-Type": "application/json; charset=utf-8",
  });

  constructor(protected http: HttpClient) { }

  protected get<T>(
    endpoint: string,
    params?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}`,
      {
        params: this.buildParams(params),
        headers: headers || this.headers
      }
    );
  }

  protected post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers: headers || this.headers }
    );
  }

  protected put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.put<T>(
      `${this.baseUrl}/${endpoint}`,
      body,
      { headers: headers || this.headers }
    );
  }

  protected delete<T>(
    endpoint: string,
    params?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.delete<T>(
      `${this.baseUrl}/${endpoint}`,
      {
        params: this.buildParams(params),
        headers: headers || this.headers
      }
    );
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return httpParams;
  }
}
