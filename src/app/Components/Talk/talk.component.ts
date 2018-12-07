import { Component, OnInit, Input }     from '@angular/core';
import { Talk }                         from 'src/app/Objects/Talk/talk.object';

@Component({
  selector: 'app-talk',
  templateUrl: './talk.component.html'
})
export class TalkComponent implements OnInit {

  @Input()
  talk: Talk

  constructor() { }

  ngOnInit() {

  }

}
