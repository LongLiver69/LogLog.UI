import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  updateUser(body: any) {
    return this.put('User', body);
  }

}