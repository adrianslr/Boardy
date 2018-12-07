import { Component }          from '@angular/core'

import { ActivatedRoute }     from '@angular/router'

import { NgForm }             from '@angular/forms'

import { MainManager }        from '../../Managers/Main/main.service'

import { APIGetEndpoints }    from '../../Managers/API/api.service'
import { APIPostEndpoints }   from '../../Managers/API/api.service'

import { Result }             from '../../Objects/Result/result.object'
import { User }               from '../../Objects/User/user.object'
import { Reply }              from '../../Objects/Reply/reply.object'
import { Talk }               from '../../Objects/Talk/talk.object'

import { SnotifyService }     from 'ng-snotify'

import { ScrollToService }    from '@nicky-lenaers/ngx-scroll-to'

const repliesContainer = "repliesHr"
const replyModal = "closeReplyModal"

@Component({
  selector: 'app-talk-page',
  templateUrl: './talk-page.component.html'
})
export class TalkPageComponent {

  private talkId: string
  talk: Talk = Talk.mock()

  repliesPerUpdate = 20

  throttle = 300
  scrollDistance = 1

  replyList: Reply[] = []

  constructor(private route: ActivatedRoute, 
              private mainManager: MainManager,
              private snotifyService: SnotifyService,
              private _scrollToService: ScrollToService) {

    this.talkId = this.route.snapshot.params["id"]
  }

  ngOnInit() {
  
    let data = {
      "include": "author,tag",
      "limit": 1,
      "where": JSON.stringify(
        {
          "objectId": this.talkId
        }
      )
    }

    this.mainManager.APIProvider.get(APIGetEndpoints.get_talks, data).subscribe(
      (result: Result<any>) => {
        let talks = result.object as [Talk]

        if(result.success == true && talks.length > 0) { 
          this.talk = talks[0]
        } else {
          window.location.href = "/"
          return
        }
      }
    )

    this.getReplies(0, this.repliesPerUpdate)
  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      if(form.value.body) {
        
        let data = {
          "body": form.value.body,
          "author": User.exportable(this.mainManager.SessionProvider.currentUser),
          "talk": Talk.exportable(this.talk)
        }

        this.mainManager.APIProvider.post(APIPostEndpoints.create_reply, data).subscribe(
          (result: Result<any>) => {
            if(result.success == true) {
              let reply = result.object as Reply 
              reply.body = form.value.body 
              reply.author = this.mainManager.SessionProvider.currentUser

              this.replyList = [reply].concat(this.replyList)

              document.getElementById(replyModal).click()
           
              this._scrollToService.scrollTo({target: repliesContainer})

            } else {
              this.snotifyService.error("An error occured.")
              return 
            }
          }
        )
      } else {
        this.snotifyService.error("Invalid inputs.")
        return
      }
    }
  }

  leaveReply() {
    if(this.mainManager.SessionProvider.hasValidSession()) {
      document.getElementById("openReplyModal").click()
    } else {
      this.snotifyService.error('Please login.')
      return 
    }
  }

  getReplies(skip: number, show: number) {
    let data2 = {
      "include": "author,talk",
      "order": "-createdAt",
      "skip": skip,
      "limit": this.repliesPerUpdate,
      "where": JSON.stringify(
        {
          "talk": {
            "$inQuery": {
              "where": {
                "objectId": this.talkId
              },
              "className": "Talks"
            }
          }
        }
      )
    }

    this.mainManager.APIProvider.get(APIGetEndpoints.get_replies, data2).subscribe(
      (result: Result<any>) => {
        if(result.success == true ) { 
          
          let replies = result.object as Reply[]

          replies.forEach(
            (reply) => {
              this.replyList.push(reply)
            }
          )
        }
      }
    )
  }

  onScrollDown(ev) {
    this.getReplies(this.replyList.length, this.repliesPerUpdate)
  }
}
