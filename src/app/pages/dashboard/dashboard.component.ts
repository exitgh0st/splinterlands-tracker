import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  viewModel = new DashboardViewModel();

  constructor() { }

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
