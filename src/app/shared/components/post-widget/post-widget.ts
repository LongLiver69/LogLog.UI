import { NzIconModule } from 'ng-zorro-antd/icon';
import { Component } from '@angular/core';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-post-widget',
  imports: [NzIconModule],
  templateUrl: './post-widget.html',
  styleUrl: './post-widget.scss',
})
export class PostWidget {
  fileName: any;

  constructor(private fileService: FileService) { }

  onFileSelect(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      this.fileService.uploadFile(file)
        .then((res: any) => {
          if (res) {
            fetch(res.url, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': file.type
              }
            });
          }
        });
    }
  }
}
