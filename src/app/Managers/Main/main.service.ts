import { Injectable }                       from '@angular/core'

import { Observable, forkJoin }             from 'rxjs'

import { Title }                            from '@angular/platform-browser'

import { Router }                           from '@angular/router'

import { APIManager, 
  APIGetEndpoints, 
  APIPostEndpoints }                        from '../API/api.service'

import { Installation }                     from '../../Objects/Installation/installation.object'
import { User }                             from '../../Objects/User/user.object'
import { Tag }                              from 'src/app/Objects/Tag/tag.object'

import { SessionManager }                   from '../Session/session.service'

@Injectable()
export class MainManager {

  websiteTitle = 'Boardy'
  
  constructor(public APIProvider: APIManager,
    public SessionProvider: SessionManager,
    public RoutingProvider: Router,
    private TitleService: Title) {

  }
  
  initiateApp(): Observable<Boolean> {
    return new Observable((observer) => {

      let token = this.SessionProvider.currentSessionToken()

      const sync = forkJoin(
        this.APIProvider.get(APIGetEndpoints.get_install, {'limit': '1'}),
        this.APIProvider.get(APIGetEndpoints.check_session, {}, token)
      )

      sync.subscribe(
        ([result, result2]) => {
          
          if(result.success == true) {
            
            let installs = result.object as Installation[]
            if(installs.length > 0) {
              if(installs[0].installed == "true" ) {
                
                this.websiteTitle = installs[0].title.toString()
                this.TitleService.setTitle(this.websiteTitle)

                if(result2.success == true) {
                  let usr = result2.object as User

                  this.SessionProvider.login(usr)
                } else {
                  this.SessionProvider.logout()
                }

                observer.next(true)
                observer.complete()
              }
            } 
          }

          observer.next(false)
          observer.complete()
        }
      )
    })
  }
    
  installApp(title: string, user: string, pass: string): Observable<Boolean> {
    let dataArray = {
      'title': title,
      'installed': 'true'
    }

    let data = {
      'username': user,
      'password': pass,
      'admin': 'true',
      'avatar': 'https://gravatar.com/avatar/82725eb2c32392f5c0338d4f0257ea1f?s=250'
    }

    const sync = forkJoin(
      this.APIProvider.post(APIPostEndpoints.set_install, dataArray),
      this.APIProvider.post(APIPostEndpoints.signup_user, data)
    )
    
    return new Observable((observer) => {
      sync.subscribe(
        ([result, result2]) => {
          console.log(result2)
          if(result.success == true) {    
            
            let admin = result2.object as User 
            admin.username = "admin"
            
            let tag1 = {
              "name": "General",
              "color": "474350"
            }
      
            let tag2 = {
              "name": "Offtopic",
              "color": "40798C"
            }
            
            const sync2 = forkJoin(
              this.APIProvider.post(APIPostEndpoints.add_tag, tag1),
              this.APIProvider.post(APIPostEndpoints.add_tag, tag2)
            )

            sync2.subscribe(
              ([res1, res2]) => {
                if(res1.success == false || res2.success == false) {
                  observer.next(true)
                  observer.complete()
                } else {
                  let tag1Obj = res1.object as Tag
                  let tag2Obj = res2.object as Tag

                  let post1 = {
                    "title": "First post.",
                    "body": "Welcome, this is your new board. Congrats!",
                    "author": User.exportable(admin),
                    "tag": Tag.exportable(tag1Obj)
                  }

                  let post2 = {
                    "title": "Jokes & Fun",
                    "body": "Here you can tell all your crazy ideas!",
                    "author": User.exportable(admin),
                    "tag": Tag.exportable(tag2Obj)
                  }
          
                  const sync3 = forkJoin(
                    this.APIProvider.post(APIPostEndpoints.create_talk, post1),
                    this.APIProvider.post(APIPostEndpoints.create_talk, post2)
                  )

                  sync3.subscribe(
                    ([_, __]) => {
                      observer.next(true)
                      observer.complete()
                    }
                  )
                }
              }
            )
          } else {
            observer.next(false)
            observer.complete()
          }
        }
      )
    })
  }
}