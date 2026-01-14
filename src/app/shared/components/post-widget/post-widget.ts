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
  urlImage: any;

  constructor(private fileService: FileService) { }

  // onFileSelect(event: any): void {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     this.fileName = file.name;

  //     this.fileService.uploadFile(file)
  //       .then((res: any) => {
  //         if (res) {
  //           fetch(res.url, {
  //             method: 'PUT',
  //             body: file,
  //             headers: {
  //               'Content-Type': file.type
  //             }
  //           });
  //         }
  //       });
  //   }
  // }

  onFileSelect(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      this.fileService.getUploadUrl(file.name).subscribe(async (res: any) => {
        if (res) {
          // await fetch(res.url, {
          //   method: 'PUT',
          //   body: file,
          //   headers: {
          //     'Content-Type': file.type
          //   }
          // });

          // Phải subscribe để Observable thực thi
          this.fileService.put('User/avatar', {
            avatarUrl: 'avatar_8514b8ae-1658-4c82-887f-ef780fb4c531.png'
          }).subscribe({
            next: (response: any) => {
              console.log('Avatar đã được cập nhật:', response);
            },
            error: (error: any) => {
              console.error('Lỗi khi cập nhật avatar:', error);
            }
          });
        }
      });

      // this.fileService.uploadFile(file)
      //   .then((res: any) => {
      //     if (res) {
      //       fetch(res.url, {
      //         method: 'PUT',
      //         body: file,
      //         headers: {
      //           'Content-Type': file.type
      //         }
      //       });
      //     }
      //   });
    }
  }

  downloadFile() {
    this.fileService.downloadFile('vietnam_b4441949-c8c9-4a12-b9ad-8b06095c3606.jpg');
  }
}
