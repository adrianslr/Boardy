import { Component }          from '@angular/core'

import { NgForm }             from '@angular/forms'

import { MainManager }        from '../../Managers/Main/main.service'

import { Result }             from '../../Objects/Result/result.object'
import { Talk }               from '../../Objects/Talk/talk.object'
import { Tag }                from '../../Objects/Tag/tag.object'

import { AppRoutes }          from '../../Managers/Router/router+defines.module'

import { APIPostEndpoints,
  APIGetEndpoints,
  APIDeleteEndpoints }        from '../../Managers/API/api.service'

import { SnotifyService }     from 'ng-snotify'

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html'
})
export class AccountPageComponent {
  
  currentUserIsAdmin: Boolean = false

  tagList: [Tag]

  constructor(private mainManager: MainManager, private snotifyService: SnotifyService) { 

    this.currentUserIsAdmin = (this.mainManager.SessionProvider.currentUser.admin == "true")
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
  }

  deleteTag(i: number) {
    let delTag = this.tagList[i]

    let data = {
      "where": JSON.stringify(
        {
          "tag": {
            "$inQuery": {
              "where": {
                "objectId": delTag.objectId
              },
              "className": "Tags"
            }
          }
        }
      )
    }

    this.mainManager.APIProvider.get(APIGetEndpoints.get_talks, data).subscribe(
      (result: Result<any>) => {
        if(result.success) {
          let talks = result.object as [Talk]

          if(!talks || talks == undefined || talks == null || !(talks.length > 0)) {
            this.mainManager.APIProvider.delete(APIDeleteEndpoints.delete_tag, delTag.objectId).subscribe(
              (result: Result<any>) => {
                if(result.success == true) {
                  this.tagList.splice(i, 1)
                  
                  this.snotifyService.success("Tag deleted.")
                } else {
                  this.snotifyService.error("An error occured.")
                }
              }
            )
          } else {
            this.snotifyService.error("Tag contains active posts.")
          }
        } else {
          this.snotifyService.error("An error occured.")
          console.log(result.error)
        }
      }
    )
  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      if( !form.value.name || !form.value.color) {
        this.snotifyService.error("Invalid inputs.")
        return
      }

      let data = {
        "name": form.value.name,
        "color": form.value.color
      }

      this.mainManager.APIProvider.post(APIPostEndpoints.add_tag, data).subscribe(
        (result: Result<any>) => {
          if(result.success == true) {
            this.snotifyService.success("Tag added.")
            
            let tag = result.object as Tag
            tag.name = form.value.name 
            tag.color = form.value.color 

            this.tagList.push(tag)
          } else {
            this.snotifyService.error("An error occured.")
          }
        }
      )

    }
  }

  logout() {
    this.snotifyService.success("Logged out!")
    this.mainManager.SessionProvider.logout()
    this.mainManager.RoutingProvider.navigate([AppRoutes.Index])
  }
}
