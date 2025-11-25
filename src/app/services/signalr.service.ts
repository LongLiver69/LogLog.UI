import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private readonly keycloak = inject(KeycloakService);

  private connection?: HubConnection;
  private readonly connectionState$ = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);

  get state$(): Observable<HubConnectionState> {
    return this.connectionState$.asObservable();
  }

  async start(): Promise<void> {
    if (this.connection && this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    const accessToken = await this.tryGetAccessToken();
    
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.signalrHubUrl, {
        accessTokenFactory: accessToken ? () => accessToken : undefined,
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 2000 })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onreconnecting(() => this.connectionState$.next(HubConnectionState.Reconnecting));
    this.connection.onreconnected(() => this.connectionState$.next(HubConnectionState.Connected));
    this.connection.onclose(() => this.connectionState$.next(HubConnectionState.Disconnected));

    await this.connection.start();
    this.connectionState$.next(HubConnectionState.Connected);
  }

  async stop(): Promise<void> {
    if (!this.connection) return;
    await this.connection.stop();
    this.connectionState$.next(HubConnectionState.Disconnected);
  }

  on<T = any>(method: string, handler: (data: T) => void) {
    this.ensureConnection('on');
    this.connection!.on(method, handler);
  }

  off(method: string, handler?: (...args: any[]) => void) {
    this.ensureConnection('off');
    this.connection!.off(method, handler as any);
  }

  invoke<T = any>(method: string, ...args: any[]): Promise<T> {
    this.ensureConnection('invoke');
    return this.connection!.invoke(method, ...args);
  }

  private ensureConnection(operation: string): void {
    if (!this.connection) {
      throw new Error(`SignalR connection not started before calling ${operation}. Call start() first.`);
    }
  }

  private async tryGetAccessToken(): Promise<string | undefined> {
    try {
      const isLoggedIn = this.keycloak.isLoggedIn();
      if (!isLoggedIn) return undefined;
      return await this.keycloak.getToken();
    } catch {
      return undefined;
    }
  }
}


