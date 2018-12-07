import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http'

import { Observable }                             from 'rxjs'
import { Injectable }                             from '@angular/core'

import { Result }                                 from '../../Objects/Result/result.object'

export enum APIGetEndpoints {
  get_install,
  get_tags,
  login_user,
  check_session,
  get_talks,
  get_replies
}

export enum APIPostEndpoints {
  set_install,
  signup_user,
  add_tag,
  create_talk,
  create_reply
}

export enum APIDeleteEndpoints {
  delete_tag
}

const apiEndpoint = "http://localhost:1337/parse"    
const parseAppId = "cvAR1s0Na45Q6l"

@Injectable()
export class APIManager {
  
  constructor(private http: HttpClient) { 
    
  }
  
  get(endpoint: APIGetEndpoints,
    data?: { [name: string]: string | any }, 
    sessionToken?: String): Observable<Result<any>> {
      
    var requestPath = apiEndpoint
    
    switch(+endpoint) {
      case APIGetEndpoints.get_install:
        requestPath += "/classes/Installation"
        break

      case APIGetEndpoints.check_session:
        requestPath += "/users/me"
        break

      case APIGetEndpoints.login_user:
        requestPath += "/login"
        break

      case APIGetEndpoints.get_tags:
        requestPath += "/classes/Tags"
        break

      case APIGetEndpoints.get_talks:
        requestPath += "/classes/Talks"
        break

      case APIGetEndpoints.get_replies:
        requestPath += "/classes/Replies"
        break
      
      default:
        return null
    }

    var httpHeaders = new HttpHeaders()
    httpHeaders = httpHeaders.append('Content-Type', 'application/json')
    httpHeaders = httpHeaders.append('X-Parse-Application-Id', parseAppId)

    if(sessionToken != null && sessionToken !== undefined) {
      httpHeaders = httpHeaders.append("X-Parse-Session-Token", sessionToken.toString())
    }
    
    return new Observable((observer) => {
      let httpParams = new HttpParams()
      for(let key in data) {
        httpParams = httpParams.set(key, data[key])
      }

      this.http.get(requestPath, {headers: httpHeaders, params: httpParams}).subscribe(
        payload => {
          var result = new Result()
          result.success = true

          if('results' in payload) {
            result.object = payload['results']
          } else {
            result.object = payload
          }

          observer.next(result)
          observer.complete()
        },
        err => {
          var result = new Result()
          result.success = false
          result.error = err

          observer.next(result)
          observer.complete()
        }
      )
    })
  }
      
  post(endpoint: APIPostEndpoints, 
    data?: { [name: string]: string | any }, 
    sessionToken?: String): Observable<Result<any>> {
    
    var requestPath = apiEndpoint
  
    switch(+endpoint) {
      case APIPostEndpoints.set_install:
        requestPath += "/classes/Installation"
        break

      case APIPostEndpoints.signup_user:
        requestPath += "/users"
        break

      case APIPostEndpoints.add_tag:
        requestPath += "/classes/Tags"
        break

      case APIPostEndpoints.create_talk:
        requestPath += "/classes/Talks"
        break

      case APIPostEndpoints.create_reply:
        requestPath += "/classes/Replies"
        break
      
      default:
        return null
    }

    var httpHeaders = new HttpHeaders()
    httpHeaders = httpHeaders.append('Content-Type', 'application/json')
    httpHeaders = httpHeaders.append('X-Parse-Application-Id', parseAppId)

    if(sessionToken != null && sessionToken !== undefined) {
      httpHeaders = httpHeaders.append("X-Parse-Session-Token", sessionToken.toString())
    }
    
    return new Observable((observer) => {
      this.http.post(requestPath, data, {headers: httpHeaders}).subscribe(
        payload => {
          var result = new Result()
          result.success = true
          result.object = payload
          
          observer.next(result)
          observer.complete()
        },
        err => {
          var result = new Result()
          result.success = false
          result.error = err

          observer.next(result)
          observer.complete()
        }
      )
    })
  }

  delete(endpoint: APIDeleteEndpoints, 
    data: String,
    sessionToken?: String): Observable<Result<any>> {
    
    var requestPath = apiEndpoint
  
    switch(+endpoint) {
      case APIDeleteEndpoints.delete_tag:
        requestPath += "/classes/Tags"
        break
      
      default:
        return null
    }

    requestPath += "/" + data

    var httpHeaders = new HttpHeaders()
    httpHeaders = httpHeaders.append('Content-Type', 'application/json')
    httpHeaders = httpHeaders.append('X-Parse-Application-Id', parseAppId)

    if(sessionToken != null && sessionToken !== undefined) {
      httpHeaders = httpHeaders.append("X-Parse-Session-Token", sessionToken.toString())
    }
    
    return new Observable((observer) => {
      this.http.delete(requestPath, {headers: httpHeaders}).subscribe(
        _ => {
          var result = new Result()
          result.success = true
          result.object = null
          
          observer.next(result)
          observer.complete()
        },
        err => {
          var result = new Result()
          result.success = false
          result.error = err

          observer.next(result)
          observer.complete()
        }
      )
    })
  }
}