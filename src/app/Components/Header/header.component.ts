import { Component, Input }   from '@angular/core'

import { MainManager }        from '../../Managers/Main/main.service'

import { AppRoutes }          from '../../Managers/Router/router+defines.module'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  logoTitle: String

  @Input()
  isInstall: Boolean = false

  constructor(private mainManager: MainManager) { 
    
  }

  ngOnInit() {
    this.logoTitle = this.mainManager.websiteTitle
  }

  logoClicked() {
    this.mainManager.RoutingProvider.navigate([AppRoutes.Index])
  }

  accountClicked() {
    if(this.mainManager.SessionProvider.hasValidSession()) {
      
      this.mainManager.RoutingProvider.navigate([AppRoutes.Account])
    } else {
      this.mainManager.RoutingProvider.navigate([AppRoutes.Connect])
    }
  }

}
