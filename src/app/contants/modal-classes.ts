import { AddAccountModalComponent } from "../components/add-account-modal/add-account-modal.component";
import { ModalComponent } from "../components/modal/modal.component";
import { ModalIdsEnum } from "../enums/modal-ids-enum";

export const ModalClasses = {
  [ModalIdsEnum.MODAL_DEFAULT_ID] : ModalComponent,
  [ModalIdsEnum.ADD_ACCOUNT_MODAL_ID]: AddAccountModalComponent
};
