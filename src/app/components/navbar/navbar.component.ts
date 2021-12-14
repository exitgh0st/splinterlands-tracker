import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'spl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() pressedDonateButton = new EventEmitter<boolean>();
  @Output() pressedSettingsBUtton = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  donateButtonClicked() {
    this.pressedDonateButton.emit(true);
  }

  settingsButtonClicked() {
    this.pressedSettingsBUtton.emit(true);
  }
}
