import { NgModule }                       from '@angular/core'
import { Routes, RouterModule }   from '@angular/router'

import { IndexPageComponent }             from '../../Pages/IndexPage/index-page.component'
import { InstallPageComponent }           from '../../Pages/InstallPage/install-page.component'
import { TalkPageComponent }              from '../../Pages/TalkPage/talk-page.component'
import { ConnectPageComponent }           from '../../Pages/ConnectPage/connect-page.component'
import { LoadingPageComponent }           from '../../Pages/LoadingPage/loading-page.component'
import { AccountPageComponent }           from '../../Pages/AccountPage/account-page.component'

import { AppRoutes }                      from './router+defines.module'

const routes: Routes = [
  {
    path: AppRoutes.Index,
    component: IndexPageComponent
  },
  {
    path: AppRoutes.Install,
    component: InstallPageComponent
  },
  {
    path: AppRoutes.Talk + "/:id",
    component: TalkPageComponent
  },
  {
    path: AppRoutes.Connect,
    component: ConnectPageComponent
  },
  {
    path: AppRoutes.Loading,
    component: LoadingPageComponent
  },
  {
    path: AppRoutes.Account,
    component: AccountPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingManager {
  constructor() {

  }
}
