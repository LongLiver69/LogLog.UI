import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { UserInfoService, UserInfo } from '../../../services/user-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzInputModule, NzButtonModule, NzBadgeModule, NzDropDownModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, AfterViewInit, OnDestroy {
  userInfo: UserInfo | null = null;
  zoomLevel: number = 1;
  position = { x: 0, y: 0 };
  containerSize: number = 50;
  avatarUrl: string = "";

  private userInfoSubscription?: Subscription;

  @ViewChild('avatarPreview') avatarPreview!: ElementRef;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private avatarService: AvatarService,
    private userInfoService: UserInfoService,
  ) { }

  ngOnInit(): void {
    // Subscribe to userInfo changes
    this.userInfoSubscription = this.userInfoService.userInfo$.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    // Load user info from Keycloak token
    this.userInfoService.loadUserInfoFromToken(this.keycloakService);

    // Load avatar
    this.getAvatar();
  }

  ngAfterViewInit() {
    // Get actual container size from DOM
    if (this.avatarPreview) {
      const rect = this.avatarPreview.nativeElement.getBoundingClientRect();
      this.containerSize = rect.width;
    }
  }

  getAvatar() {
    this.avatarService.getAvatar().subscribe((res: any) => {
      if (res) {
        this.position = {
          x: res.positionRatioX * this.containerSize,
          y: res.positionRatioY * this.containerSize
        };
        this.zoomLevel = res.zoomLevel;
        this.avatarUrl = res.avatarUrl;
      }
    });
  }

  changeAvatar() {
    this.router.navigate(['/upload-avatar']);
  }

  logout() {
    this.userInfoService.clearUserInfo();
    this.keycloakService.logout(window.location.origin + '/');
  }

  ngOnDestroy(): void {
    this.userInfoSubscription?.unsubscribe();
  }
}

