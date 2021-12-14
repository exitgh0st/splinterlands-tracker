import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  donateButtonClicked() {
    console.log("donate button clicked");
  }

  settingsButtonClicked() {
    console.log("settings button clicked");
  }
}
