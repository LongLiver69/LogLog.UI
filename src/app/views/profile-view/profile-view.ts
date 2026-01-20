import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/modules/shared.module';
import { AvatarService } from '../../services/avatar.service';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from '../../services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserInfoService } from '../../services/user-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.scss',
})
export class ProfileView implements OnInit, AfterViewInit, OnDestroy {
  isEditMode = false;
  coverPhotoUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop';

  formGroup!: FormGroup;

  private userInfoSubscription?: Subscription;
  avatarUrl: string = "";
  position = { x: 0, y: 0 };
  zoomLevel = 1;
  containerSize = 168;

  @ViewChild('avatarPreview') avatarPreview!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private avatarService: AvatarService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private notification: NzNotificationService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.userInfoSubscription = this.userInfoService.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.formGroup.patchValue(userInfo);
      }
    });

    this.getAvatar();
  }

  ngAfterViewInit() {
    if (this.avatarPreview) {
      const rect = this.avatarPreview.nativeElement.getBoundingClientRect();
      this.containerSize = rect.width;
    }
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      firstName: [""],
      lastName: ["", [Validators.required]],
      bio: [""],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      address: [""],
      birthday: [""],
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {

    }
  }

  saveProfile(): void {
    if (this.formGroup.invalid) {
      this.notification.error('Lỗi', 'Vui lòng kiểm tra lại thông tin!', {
        nzPlacement: 'bottom',
      });
      return;
    }

    this.userService.updateUser(this.formGroup.getRawValue()).subscribe({
      next: async (res: any) => {
        this.isEditMode = false;

        await this.keycloakService.updateToken(-1);
        this.userInfoService.loadUserInfoFromToken(this.keycloakService);

        this.notification.success('Thành công', 'Cập nhật thông tin thành công!', {
          nzPlacement: 'bottom',
        });
      },
      error: (err: any) => {
        this.notification.error('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại!', {
          nzPlacement: 'bottom',
        });
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    const currentUserInfo = this.userInfoService.currentUserInfo;
    if (currentUserInfo) {
      this.formGroup.patchValue(currentUserInfo);
    }
  }

  getAvatar() {
    this.avatarService.getAvatar().subscribe((res: any) => {
      this.position = {
        x: res.positionRatioX * this.containerSize,
        y: res.positionRatioY * this.containerSize
      };
      this.zoomLevel = res.zoomLevel;
      this.avatarUrl = res.avatarUrl
    });
  }

  ngOnDestroy(): void {
    // Cleanup subscription
    this.userInfoSubscription?.unsubscribe();
  }
}
