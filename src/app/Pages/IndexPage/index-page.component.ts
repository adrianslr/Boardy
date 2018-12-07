import { Component }            from '@angular/core'

import { NgForm }               from '@angular/forms'

import { MainManager }          from '../../Managers/Main/main.service'

import { AppRoutes }            from '../../Managers/Router/router+defines.module'
import { APIGetEndpoints,
  APIPostEndpoints }            from '../../Managers/API/api.service'

import { Result }               from '../../Objects/Result/result.object'
import { Tag }                  from '../../Objects/Tag/tag.object'
import { Talk }                 from '../../Objects/Talk/talk.object'
import { User }                 from 'src/app/Objects/User/user.object'

import { SnotifyService }       from 'ng-snotify'

declare var $: any

const activeTagClass = "active-tag"
const activeTagSelector = ".active-tag"
const openModal = "openStartTalkModal"

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html'
})
export class IndexPageComponent {

  tagList: [Tag]
  currentTagId: number = -1

  talkList: Talk[] = []

  tagsPerUpdate = 20

  throttle = 300
  scrollDistance = 1

  constructor(private mainManager: MainManager, private snotifyService: SnotifyService) { 

  }

  ngOnInit() {
    this.mainManager.APIProvider.get(APIGetEndpoints.get_tags, {}).subscribe(
      (result: Result<any>) => {
        if(result.success == true) {
          let tags = result.object as [Tag]

          this.tagList = tags
        }
      }
    )

    this.getTalksByTagId("all", 0, this.tagsPerUpdate)
  }
  
  onSubmit(form: NgForm) {
    if (form.valid) {
      if(form.value.body && form.value.title) {
        
        let data = {
          "title": form.value.title,
          "body": form.value.body,
          "author": User.exportable(this.mainManager.SessionProvider.currentUser),
          "tag": Tag.exportable(this.tagList[this.currentTagId])
        }

        this.mainManager.APIProvider.post(APIPostEndpoints.create_talk, data).subscribe(
          (result: Result<any>) => {
            if(result.success == true) {
              window.location.reload(true)
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

  allTalks() {
    this.currentTagId = -1 

    $(activeTagSelector).removeClass(activeTagClass)
    $(event.target).addClass(activeTagClass)

    this.talkList = []
    this.getTalksByTagId("all", 0, this.tagsPerUpdate)
  }

  tagTalk(index: number, event) {
    this.currentTagId = index 

    $(activeTagSelector).removeClass(activeTagClass)
    $(event.target).addClass(activeTagClass)

    this.talkList = []
    this.getTalksByTagId(this.tagList[this.currentTagId].objectId, 0, this.tagsPerUpdate)
  }

  startATalk() {
    if(this.mainManager.SessionProvider.hasValidSession()) {
      if(this.currentTagId != -1) {
        document.getElementById(openModal).click()
      } else {
        this.snotifyService.error("Please select a tag.")
        return
      }
    } else {
      this.snotifyService.error('Please login.')
      return 
    }
  }

  clickedTalk(talkId: number) {
    this.mainManager.RoutingProvider.navigate([AppRoutes.Talk + "/" + this.talkList[talkId].objectId])
  }

  getTalksByTagId(tagId: String, skip: number, show: number) {
    var data

    if(tagId == "all") {
      data = {
        "include": "author,tag",
        "order": "-createdAt",
        "skip": skip,
        "limit": this.tagsPerUpdate
      }
    } else {
      data = {
        "include": "author,tag",
        "order": "-createdAt",
        "skip": skip,
        "limit": this.tagsPerUpdate,
        "where": JSON.stringify(
          {
            "tag": {
              "$inQuery": {
                "where": {
                  "objectId": tagId
                },
                "className": "Tags"
              }
            }
          }
        )
      }
  
    }

    this.mainManager.APIProvider.get(APIGetEndpoints.get_talks, data).subscribe(
      (result: Result<any>) => {
        if(result.success == true) {
          let talks = result.object as [Talk]

          talks.forEach(talk => {
            this.talkList.push(talk)
          })
      
        }
      }
    )
  }

  onScrollDown(ev) {
    if(this.currentTagId == -1) {
      this.getTalksByTagId("all", this.talkList.length, this.tagsPerUpdate)
    } else {
      this.getTalksByTagId(this.tagList[this.currentTagId].objectId, this.talkList.length, this.tagsPerUpdate)
    }
  }
}
