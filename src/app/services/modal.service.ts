import { ComponentFactoryResolver, Injectable, ViewContainerRef, ViewRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalClasses } from '../contants/modal-classes';
import { ModalIds } from '../enums/modal-ids';

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

  openModal(modalId: ModalIds) {
    if (!this.viewContainerRef) {
      return;
    }

    const modalClass = ModalClasses[modalId];

    const factory = this.resolver.resolveComponentFactory(modalClass);
    const componentRef = this.viewContainerRef.createComponent(factory);

    const modalComponent = componentRef.instance;

    modalComponent.setIndex(this.viewContainerRef.indexOf(componentRef.hostView));
    modalComponent.open();

    return modalComponent;
  }

  closeModal(modalIndex?: number) {
    this.viewContainerRef?.remove(modalIndex);
  }
}
