import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvatarService extends BaseApiService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  updateAvatar(body: any) {
    return this.put('Avatar', body);
  }

  getAvatar() {
    return this.get('Avatar');
  }
}