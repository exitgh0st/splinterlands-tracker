import { AddAccountModalComponent } from "../components/add-account-modal/add-account-modal.component";
import { ModalComponent } from "../components/modal/modal.component";
import { SettingsModalComponent } from "../components/settings-modal/settings-modal.component";
import { ModalIds } from "../enums/modal-ids";

export const ModalClasses = {
  [ModalIds.MODAL_DEFAULT_ID] : ModalComponent,
  [ModalIds.ADD_ACCOUNT_MODAL_ID]: AddAccountModalComponent,
  [ModalIds.SETTINGS_MODAL_ID]: SettingsModalComponent
};
