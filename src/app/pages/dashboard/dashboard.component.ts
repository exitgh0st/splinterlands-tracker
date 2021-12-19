import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalIdsEnum } from 'src/app/contants/modal-ids-enum';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  viewModel = new DashboardViewModel();

  constructor(private viewContainerRef: ViewContainerRef,
    private modalService: ModalService) {
    this.modalService.setViewContainerRef(this.viewContainerRef);
  }

  ngOnInit(): void {
  }

  donateButtonClicked() {
    console.log("donate button clicked");
  }

  settingsButtonClicked() {
    console.log("settings button clicked");
  }

  refresh() {

  }

  addNewAccount() {
    this.modalService.openModal(ModalIdsEnum.ADD_ACCOUNT_MODAL_ID);
    // this.viewContainerRef.clear();
  }
}

class DashboardViewModel {
  totalAccounts?: string;
  totalDec?: string;
  totalDecInNative?: string;
  totalSps?: string;
  totalSpsInNative?: string;
  totalStakedSps?: string;
  totalStakedSpsInNative?: string;
  endOfSeason?: string;
  totalAssets?: string;
  decRate?: string;
  spsRate?: string;
}
