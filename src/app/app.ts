import { Component, signal } from '@angular/core';
import { SignalrService } from './services/signalr.service';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterModule, MainLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('LogLog');

  constructor(
    private signalrService: SignalrService
  ) {
    this.signalrService.start()
      .then(() => {
        console.log('SignalR connection started successfully');
      })
      .catch(err => {
        console.error('Failed to start SignalR connection', err);
      });
  }

  // ngOnDestroy() {
  //   this.signalrService.stop();
  // }
  
}
