import { Component, OnInit }      from '@angular/core'

import { MainManager }            from '../../Managers/Main/main.service'

import { AppRoutes }              from '../../Managers/Router/router+defines.module'

const redBackgroundClass = "red-background"

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html'
})
export class LoadingPageComponent implements OnInit {

  constructor(private mainManager: MainManager) {

  }

  ngOnInit() {
    document.body.classList.add(redBackgroundClass)

    let __this = this
    setTimeout(function() {
      __this.mainManager.initiateApp().subscribe(
      (installed: Boolean) => {
        if(installed) {
          __this.mainManager.RoutingProvider.navigate([AppRoutes.Index])
        } else {
          __this.mainManager.RoutingProvider.navigate([AppRoutes.Install])
        }
      }
    )
    }, 450)
  }

  ngOnDestroy() {
    document.body.classList.remove(redBackgroundClass)
  }
}
