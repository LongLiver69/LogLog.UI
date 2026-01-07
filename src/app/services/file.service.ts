import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService extends BaseApiService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getUploadUrl(fileName: string) {
    return this.post('File/upload-url', JSON.stringify(fileName));
  }

  getDownloadUrl(objectName: string) {
    return this.get('File/download-url' + objectName);
  }

  async uploadFile(file: File) {
    const res: any = await firstValueFrom(this.getUploadUrl(file.name));

    await fetch(res.url, {
      method: 'PUT',
      body: file
    });
  }

}


