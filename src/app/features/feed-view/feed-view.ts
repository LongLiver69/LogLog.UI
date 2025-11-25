import { Component } from '@angular/core';
import { PostWidget } from "../../shared/components/post-widget/post-widget";

@Component({
  selector: 'app-feed-view',
  imports: [PostWidget],
  templateUrl: './feed-view.html',
  styleUrl: './feed-view.scss',
})
export class FeedView {

}
