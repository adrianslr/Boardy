import { BrowserModule }                      from '@angular/platform-browser'

import { NgModule }                           from '@angular/core'

import { HttpClientModule }                   from '@angular/common/http'

import { MainComponent }                      from './Components/Main/main.component'
import { IndexPageComponent }                 from './Pages/IndexPage/index-page.component'
import { InstallPageComponent }               from './Pages/InstallPage/install-page.component'
import { TalkPageComponent }                  from './Pages/TalkPage/talk-page.component'
import { ConnectPageComponent }               from './Pages/ConnectPage/connect-page.component'
import { LoadingPageComponent }               from './Pages/LoadingPage/loading-page.component'
import { AccountPageComponent }               from './Pages/AccountPage/account-page.component'

import { HeaderComponent }                    from './Components/Header/header.component'
import { TalkComponent }                      from './Components/Talk/talk.component'
import { ReplyComponent }                     from './Components/Reply/reply.component'

import { MainManager }                        from './Managers/Main/main.service'
import { APIManager }                         from './Managers/API/api.service'
import { SessionManager }                     from './Managers/Session/session.service'
import { RoutingManager }                     from './Managers/Router/router.module'

import { FormsModule }                        from '@angular/forms'

import { TruncatePipe }                       from './Utils/StringUtils/string.pipe'

import { InfiniteScrollModule }               from 'ngx-infinite-scroll'

import { SnotifyModule, 
  SnotifyService, 
  ToastDefaults }                             from 'ng-snotify'
  
import { ScrollToModule, ScrollToService }    from '@nicky-lenaers/ngx-scroll-to'

@NgModule({
  declarations: [
    MainComponent,
    IndexPageComponent,
    InstallPageComponent,
    HeaderComponent,
    TalkPageComponent,
    ConnectPageComponent,
    LoadingPageComponent,
    AccountPageComponent,
    TruncatePipe,
    TalkComponent,
    ReplyComponent
  ],
  imports: [
    BrowserModule,
    RoutingManager,
    HttpClientModule,
    FormsModule,
    SnotifyModule,
    InfiniteScrollModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    {
      provide: 'SnotifyToastConfig', 
      useValue: ToastDefaults
    },
    SnotifyService,
    MainManager,
    APIManager,
    SessionManager,
    ScrollToService
  ],
  bootstrap: [MainComponent]
})  
export class AppMainModule {  
  
  constructor() {

  }
  
}
