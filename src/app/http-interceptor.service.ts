import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { ModalIds } from './enums/modal-ids';
import { ModalService } from './services/modal.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private modalService: ModalService) { }

  errorModal?: ErrorModalComponent;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!window.navigator.onLine) {
      if (!this.errorModal) {
        this.errorModal = this.modalService.openModal(ModalIds.ERROR_MODAL_ID) as ErrorModalComponent;
        this.errorModal.setErrorMessage("No internet connection");
      }

      return throwError("No internet connection");
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (!this.errorModal) {
          this.errorModal = this.modalService.openModal(ModalIds.ERROR_MODAL_ID) as ErrorModalComponent;
          this.errorModal.setErrorMessage(error.message);
        }
        return throwError(error.message);
      })
    );
  }
}
