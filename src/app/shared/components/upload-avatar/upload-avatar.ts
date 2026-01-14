import { Component, EventEmitter, Output, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../services/file.service';
import { AvatarService } from '../../../services/avatar.service';

export interface AvatarTransform {
  positionRatio: { x: number; y: number };
  zoom: number;
}

@Component({
  selector: 'app-upload-avatar',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-avatar.html',
  styleUrl: './upload-avatar.scss',
})
export class UploadAvatar implements AfterViewInit {
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  zoomLevel: number = 1;
  position = { x: 0, y: 0 };

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private containerSize = 300; // Default size, will be updated in ngAfterViewInit

  @ViewChild('avatarPreview') avatarPreview!: ElementRef;

  constructor(
    private fileService: FileService,
    private avatarService: AvatarService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    // Get actual container size from DOM
    if (this.avatarPreview) {
      const rect = this.avatarPreview.nativeElement.getBoundingClientRect();
      this.containerSize = rect.width;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }

      this.selectedFile = file;
      this.resetControls();

      // Read and display the image
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  startDrag(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.dragStart = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging) {
        this.position = {
          x: e.clientX - this.dragStart.x,
          y: e.clientY - this.dragStart.y
        };
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  zoomIn(): void {
    if (this.zoomLevel < 3) {
      this.zoomLevel = Math.min(3, this.zoomLevel + 0.1);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.1);
    }
  }

  resetControls(): void {
    this.zoomLevel = 1;
    this.position = { x: 0, y: 0 };
  }

  saveAvatar(): void {
    if (this.selectedFile) {
      const transform: AvatarTransform = {
        positionRatio: {
          x: this.position.x / this.containerSize,
          y: this.position.y / this.containerSize
        },
        zoom: this.zoomLevel
      };

      this.fileService.uploadFile(this.selectedFile)
        .then((res: any) => {
          this.imageUrl = res.data;
          this.selectedFile = null;
          this.resetControls();
          this.avatarService.updateAvatar({
            avatarName: res.objectName,
            positionRatioX: transform.positionRatio.x,
            positionRatioY: transform.positionRatio.y,
            zoomLevel: transform.zoom
          }).subscribe();
        })
        .catch((error) => {
          console.error('Error uploading avatar:', error);
        });
    }
  }

  cancel(): void {
    this.imageUrl = null;
    this.selectedFile = null;
    this.resetControls();
  }
}
