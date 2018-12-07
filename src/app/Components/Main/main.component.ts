import { Component }      from '@angular/core'

import { MainManager }    from '../../Managers/Main/main.service'

import { AppRoutes }      from '../../Managers/Router/router+defines.module'

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
})
export class MainComponent {

  constructor(private mainManager: MainManager ) {

    this.mainManager.RoutingProvider.navigate([AppRoutes.Loading])
  }
}
