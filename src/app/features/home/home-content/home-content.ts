import { Component } from '@angular/core';
import { PostWidget } from "../post-widget/post-widget";

@Component({
  selector: 'app-home-content',
  imports: [PostWidget],
  templateUrl: './home-content.html',
  styleUrl: './home-content.scss',
})
export class HomeContent {}
