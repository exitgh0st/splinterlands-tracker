import { Component, ElementRef, Input, OnInit, ViewRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  template: ''
})
export class ModalComponent implements OnInit {
  private element: HTMLElement;
  public index?: number;

  constructor(
    protected modalService: ModalService,
    protected elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
  }

  setIndex(index: number) {
    this.index = index;
  }

  open() {
    this.element.style.display = 'block';
  }

  close() {
    this.element.style.display = 'none';

    this.modalService.closeModal(this.index);
  }

  ngOnDestroy() {
  }
}
