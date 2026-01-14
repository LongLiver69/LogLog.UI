import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AvatarService } from '../../../services/avatar.service';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzInputModule, NzButtonModule, NzBadgeModule, NzDropDownModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements AfterViewInit {
  userInfo = signal<any>(null);
  zoomLevel: number = 1;
  position = { x: 0, y: 0 };
  containerSize = 50;

  @ViewChild('avatarPreview') avatarPreview!: ElementRef;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private avatarService: AvatarService,
    private fileService: FileService
  ) {
    try {
      const token = this.keycloakService.getKeycloakInstance().tokenParsed as any;
      const userInfo = {
        id: token?.sub,
        username: token?.preferred_username,
        email: token?.email,
        name: token?.name,
      };
      this.userInfo.set(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      this.getAvatar();
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }

  ngAfterViewInit() {
    // Get actual container size from DOM
    if (this.avatarPreview) {
      const rect = this.avatarPreview.nativeElement.getBoundingClientRect();
      this.containerSize = rect.width;
    }
  }

  getAvatar() {
    this.avatarService.getAvatar().subscribe((avatar: any) => {
      this.position = {
        x: avatar.positionRatioX * this.containerSize,
        y: avatar.positionRatioY * this.containerSize
      };
      this.zoomLevel = avatar.zoomLevel;
      this.fileService.getDownloadUrl(avatar.avatarName).subscribe((image: any) => {
        this.userInfo.set({
          ...this.userInfo(),
          avatarUrl: image.url
        });
      });
    });
    console.log(this.position, this.zoomLevel);

  }

  changeAvatar() {
    this.router.navigate(['/upload-avatar']);
  }

  logout() {
    this.keycloakService.logout(window.location.origin + '/');
  }

}

