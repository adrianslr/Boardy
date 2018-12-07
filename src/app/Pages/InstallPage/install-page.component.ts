import { Component }          from '@angular/core'

import { NgForm }             from '@angular/forms'

import { SnotifyService }     from 'ng-snotify'

import { MainManager }        from '../../Managers/Main/main.service'

@Component({
  selector: 'app-install-page',
  templateUrl: './install-page.component.html'
})
export class InstallPageComponent {

  private secretKey = 'zuhtfjgpfjnhhkjlfsrtn'

  constructor(private mainManager: MainManager, private snotifyService: SnotifyService) { 

  }

  onSubmit(form: NgForm) {
    if(form.valid) {
      if(!form.value.title || !form.value.username || !form.value.password || !form.value.secret) {
          this.snotifyService.error('Invalid inputs.')
          return
        }
      
      if(form.value.secret != this.secretKey) {
        this.snotifyService.error('Invalid secret key.')
        return
      }

      this.mainManager.installApp(form.value.title.toString(), 
                                  form.value.username.toString(), 
                                  form.value.password.toString()).subscribe(
                                    (installed) => {
                                      if(installed) {
                                        window.location.replace("/")
                                      } else {
                                        this.snotifyService.error('An error occured. Please try again!')
                                      }
                                    }
                                  )
    }
  }
}
