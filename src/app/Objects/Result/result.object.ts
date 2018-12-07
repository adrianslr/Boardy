import { HttpErrorResponse }            from "@angular/common/http";

export class Result<T> {
    success: Boolean
    error: HttpErrorResponse
    object: T
}