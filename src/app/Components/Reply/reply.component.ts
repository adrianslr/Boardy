import { Component, OnInit, Input }     from '@angular/core';
import { Reply }                        from 'src/app/Objects/Reply/reply.object';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html'
})
export class ReplyComponent implements OnInit {

  @Input()
  reply: Reply 

  constructor() { }

  ngOnInit() {
  }

}
