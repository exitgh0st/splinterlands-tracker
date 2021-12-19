import { Component, ElementRef, OnInit, ViewRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'spl-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss']
})
export class AddAccountModalComponent extends ModalComponent {
  username?: string;

  constructor(protected modalService: ModalService,
    protected elementRef: ElementRef) {
    super(modalService, elementRef);
  }

  ngOnInit(): void {
  }


}
