import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  address?: string;
  birthday?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$: Observable<UserInfo | null> = this.userInfoSubject.asObservable();

  constructor() {
    // Load từ localStorage khi service khởi tạo
    this.loadFromLocalStorage();
  }

  /**
   * Lấy giá trị hiện tại của userInfo (synchronous)
   */
  get currentUserInfo(): UserInfo | null {
    return this.userInfoSubject.value;
  }

  /**
   * Load user info từ Keycloak token
   */
  loadUserInfoFromToken(keycloakService: KeycloakService): void {
    try {
      const tokenParsed = keycloakService.getKeycloakInstance().tokenParsed as any;

      const userInfo: UserInfo = {
        id: tokenParsed?.sub,
        username: tokenParsed?.preferred_username,
        email: tokenParsed?.email,
        name: tokenParsed?.name,
        firstName: tokenParsed?.given_name,
        lastName: tokenParsed?.family_name,
      };

      this.updateUserInfo(userInfo);
    } catch (error) {
      console.error('Error loading user info from token:', error);
    }
  }

  /**
   * Cập nhật user info và sync với localStorage
   */
  updateUserInfo(userInfo: UserInfo | null): void {
    this.userInfoSubject.next(userInfo);

    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }

  /**
   * Merge thêm thông tin vào user info hiện tại (ví dụ: avatarUrl)
   */
  mergeUserInfo(partialInfo: Partial<UserInfo>): void {
    const currentInfo = this.currentUserInfo;
    if (currentInfo) {
      const updatedInfo = { ...currentInfo, ...partialInfo };
      this.updateUserInfo(updatedInfo);
    }
  }

  /**
   * Load từ localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        const userInfo = JSON.parse(stored);
        this.userInfoSubject.next(userInfo);
      }
    } catch (error) {
      console.error('Error loading user info from localStorage:', error);
    }
  }

  /**
   * Clear user info (khi logout)
   */
  clearUserInfo(): void {
    this.updateUserInfo(null);
  }
}
