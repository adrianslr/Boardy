import { Component }          from '@angular/core'

import { NgForm }             from '@angular/forms'

import { MainManager }        from '../../Managers/Main/main.service'

import { AppRoutes }          from '../../Managers/Router/router+defines.module'

import { APIPostEndpoints,
  APIGetEndpoints }           from '../../Managers/API/api.service'

import { Result }             from '../../Objects/Result/result.object'
import { User }               from '../../Objects/User/user.object'

import { Md5 }                from 'md5-typescript'

import { SnotifyService }     from 'ng-snotify'

const redBackground = "red-background"

@Component({
  selector: 'app-connect-page',
  templateUrl: './connect-page.component.html'
})
export class ConnectPageComponent {

  constructor(private mainManager: MainManager, private snotifyService: SnotifyService) { 

  }

  ngOnInit() {
    document.body.classList.add(redBackground)
  }

  ngOnDestroy() {
    document.body.classList.remove(redBackground)
  }

  onLogin(form: NgForm) {
    if(form.valid) {
      let username = form.value.username 
      let password = form.value.password 

      let data = {
        'username': username,
        'password': password
      }
      
      if(username.length > 0 && password.length > 0) {
        this.mainManager.APIProvider.get(APIGetEndpoints.login_user, data).subscribe(
          (result: Result<any>) => {
            if(result.success == true) {
              let usr = result.object as User

              this.mainManager.SessionProvider.login(usr)
              this.mainManager.RoutingProvider.navigate([AppRoutes.Loading])

              this.snotifyService.success("Logged in.")
            } else {
              this.snotifyService.error("Login failed.")
            }
          }
        )
      } else {
        this.snotifyService.error("Invalid inputs.")
      }
    }
  }

  onSignup(form: NgForm) {
    if (form.valid) {
      let username = form.value.username 
      let email = form.value.email 
      let password = form.value.password 
      let password2 = form.value.password2 

      let data = {
        'username': username,
        'email': email,
        'password': password,
        'avatar': 'https://gravatar.com/avatar/' + Md5.init(email) + '?s=256'
      }
      
      if(username.length > 0 && password.length > 0 && password2.length > 0) {
        this.mainManager.APIProvider.post(APIPostEndpoints.signup_user, data).subscribe(
          (result: Result<any>) => {
            if(result.success == true) {
              let usr = result.object as User

              this.mainManager.SessionProvider.login(usr)
              this.mainManager.RoutingProvider.navigate([AppRoutes.Loading])

              this.snotifyService.success("Signed up.")
            } else {
              this.snotifyService.error("An error occured.")
            }
          }
        )
      } else {
        this.snotifyService.error("Invalid inputs.")
      }
    }
  }
}
