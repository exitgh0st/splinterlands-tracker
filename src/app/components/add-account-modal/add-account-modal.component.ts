import { Component, ElementRef, EventEmitter, OnInit, Output, ViewRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { PlayerService } from 'src/app/services/player.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'spl-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss']
})
export class AddAccountModalComponent extends ModalComponent {
  username?: string;
  addAccountModalListener?: AddAccountModalListener;
  isValidatingUsername = false;
  noUsernameError = false;
  playerAlreadyExistError = false;
  invalidUsernameError = false;


  constructor(protected modalService: ModalService,
    private playerService: PlayerService,
    protected elementRef: ElementRef) {
    super(modalService, elementRef);
  }

  setAddAccountModalListener(addAccountModalListener: AddAccountModalListener) {
    this.addAccountModalListener = addAccountModalListener;
  }

  ngOnInit(): void {
  }

  confirm() {
    this.invalidUsernameError = false;
    this.noUsernameError = false;
    this.playerAlreadyExistError = false;

    const username = this.username;

    if (!this.addAccountModalListener) {
      return;
    }

    if (!username) {
      this.noUsernameError = true;
      return;
    }

    if (this.playerService.isPlayerOnListAlready(username)) {
      this.playerAlreadyExistError = true;
      return;
    }

    this.isValidatingUsername = true;

    this.playerService.fetchPlayerDetails(username).toPromise().then(result => {
      this.isValidatingUsername = false;
      if (result.error) {
        this.invalidUsernameError = true;
        return;
      }

      this.playerService.addPlayer(username);
      this.addAccountModalListener?.confirmButtonClicked(username);
      this.close();
    });
  }
}

export interface AddAccountModalListener {
  confirmButtonClicked(username: string): void;
}
