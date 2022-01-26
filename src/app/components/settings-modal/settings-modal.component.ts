import { Component, ElementRef, OnInit } from '@angular/core';
import { Currency } from 'src/app/enums/currency';
import { ModalService } from 'src/app/services/modal.service';
import { PlayerTableDataHeaderSetting, SettingsService } from 'src/app/services/settings.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent extends ModalComponent {

  allCurrency: string[];
  // allPlayerTableDataHeaders: string[];

  playerTableDataHeaderSettings: PlayerTableDataHeaderSetting[];

  currency: Currency;
  ecrThreshold: number;
  winRateThreshold: number;

  aboveThreshold: string;
  belowThreshold: string;

  settingsModalListener?: SettingsModalListener;

  constructor(protected modalService: ModalService,
    protected elementRef: ElementRef,
    private settingsService: SettingsService) {
    super(modalService, elementRef);
    this.allCurrency = this.settingsService.getAllCurrency();
    this.playerTableDataHeaderSettings = this.settingsService.getPlayerTableDataHeaderSettings();

    this.currency = this.settingsService.getCurrency();

    this.ecrThreshold = this.settingsService.getEcrThreshold();
    this.winRateThreshold = this.settingsService.getWinRateThreshold();

    this.aboveThreshold = this.settingsService.getAboveThresholdColor();
    this.belowThreshold = this.settingsService.getBelowThresholdColor();
  }

  ngOnInit(): void {
  }

  setSettingsModalListener(settingsModalListener: SettingsModalListener) {
    this.settingsModalListener = settingsModalListener;
  }

  save() {
    this.settingsService.setCurrency(this.currency);
    this.settingsService.setEcrThreshold(this.ecrThreshold);
    this.settingsService.setWinRateThreshold(this.winRateThreshold);
    this.settingsService.setAboveThresholdColor(this.aboveThreshold);
    this.settingsService.setBelowThresholdColor(this.belowThreshold);
    this.settingsService.setPlayerTableDataHeaderSettings(this.playerTableDataHeaderSettings);

    if (this.settingsModalListener) {
      this.settingsModalListener.savedSettings();
    }

    this.close();
  }

  cancel() {
    this.close();
  }
}

export interface SettingsModalListener {
  savedSettings(): void;
}
