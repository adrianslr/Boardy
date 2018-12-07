import { Injectable }   from '@angular/core'

import { User }         from '../../Objects/User/user.object'

@Injectable()
export class SessionManager {

  secretMagicKey = 'WakandaForever'

  currentUser?: User

  constructor() { 
    
  }

  currentActiveUser() {
    return this.currentUser as User
  }

  login(usr: User) {
    localStorage.setItem('boardySession', usr.sessionToken.toString())

    this.currentUser = usr
  }

  logout() {
    localStorage.setItem('boardySession', this.secretMagicKey)

    this.currentUser = null
  }

  hasValidSession() {
    return localStorage.getItem('boardySession') != this.secretMagicKey && this.currentUser != null
  }

  currentSessionToken() {
    let token = localStorage.getItem('boardySession')

    if(token != this.secretMagicKey)
    {
      return token
    } else {
      return null
    }
  }
  
}
