import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent extends ModalComponent {

  constructor(protected modalService: ModalService,
    protected elementRef: ElementRef) {
    super(modalService, elementRef);
  }

  ngOnInit(): void {
  }

}
