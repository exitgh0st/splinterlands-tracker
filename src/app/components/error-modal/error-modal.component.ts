import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent extends ModalComponent {

  errorMessage?: string;

  constructor(protected modalService: ModalService,
    protected elementRef: ElementRef) {
    super(modalService, elementRef);
  }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  ngOnInit(): void {
  }

  refresh() {
    window.location.reload();
  }
}
