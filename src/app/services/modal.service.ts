import { ComponentFactoryResolver, Injectable, ViewContainerRef, ViewRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalClasses } from '../contants/modal-classes';
import { ModalIdsEnum } from '../enums/modal-ids-enum';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private viewContainerRef?: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {

  }

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  openModal(modalId: ModalIdsEnum) {
    if (!this.viewContainerRef) {
      return;
    }

    const modalClass = ModalClasses[modalId];

    const factory = this.resolver.resolveComponentFactory(modalClass);
    const componentRef = this.viewContainerRef.createComponent(factory);

    const modalComponent = componentRef.instance;

    modalComponent.setIndex(this.viewContainerRef.indexOf(componentRef.hostView));
    modalComponent.open();
  }

  closeModal(modalIndex?: number) {
    this.viewContainerRef?.remove(modalIndex);
  }
}
