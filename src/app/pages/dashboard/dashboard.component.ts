import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { AddAccountModalComponent, AddAccountModalListener } from 'src/app/components/add-account-modal/add-account-modal.component';
import { TokenDetails } from 'src/app/components/models/token-details';
import { TokenAddresses } from 'src/app/contants/token-addresses';
import { Currency } from 'src/app/enums/currency';
import { ModalIds } from 'src/app/enums/modal-ids';
import { ExchangeRateDetails } from 'src/app/interfaces/exchange-rate-details';
import { PlayerData } from 'src/app/interfaces/player-data';
import { SplinterlandsSettings } from 'src/app/interfaces/splinterlands-settings';
import { Player } from 'src/app/models/player';
import { CurrencyService } from 'src/app/services/currency.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { ModalService } from 'src/app/services/modal.service';
import { PlayerService } from 'src/app/services/player.service';
import { SplinterlandsService } from 'src/app/services/splinterlands.service';
import { TokenService } from 'src/app/services/token.service';
import { TimeUtil } from 'src/app/utils/time-util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AddAccountModalListener {
  viewModel = new DashboardViewModel();
  currency: Currency;

  splinterlandsSettings$ = new BehaviorSubject<SplinterlandsSettings | undefined>(undefined)
  usdExchangeRateDetails$ = new BehaviorSubject<ExchangeRateDetails | undefined>(undefined);
  decTokenDetails$ = new BehaviorSubject<TokenDetails | undefined>(undefined);
  spsTokenDetails$ = new BehaviorSubject<TokenDetails | undefined>(undefined);
  playersData$ = new BehaviorSubject<PlayerData[] | undefined>(undefined);

  players$ = new BehaviorSubject<Player[] | undefined>(undefined);

  players?: Player[];

  gridIconForDecRate = {
    directory: "assets/images/bar_chart_icon.png",
    link: "https://poocoin.app/tokens/0xe9d7023f2132d55cbd4ee1f78273cb7a3e74f10a"
  };

  gridIconForSpsRate = {
    directory: "assets/images/bar_chart_icon.png",
    link: "https://poocoin.app/tokens/0x1633b7157e7638c4d6593436111bf125ee74703f"
  };

  constructor(private viewContainerRef: ViewContainerRef,
    private modalService: ModalService,
    private currencyService: CurrencyService,
    private splinterlandsService: SplinterlandsService,
    private exchangeRateService: ExchangeRateService,
    private tokenService: TokenService,
    private playerService: PlayerService) {
    this.modalService.setViewContainerRef(this.viewContainerRef);
    this.currency = this.currencyService.getNativeCurrency();
  }

  ngOnInit(): void {
    this.fetchSplinterlandsSettings();
    this.fetchUsdExchangeRate();
    this.fetchDecTokenDetails();
    this.fetchSpsTokenDetails();
    this.fetchPlayersData();

    this.splinterlandsSettings$.subscribe(splinterlandsSettings => {
      if (!splinterlandsSettings) {
        return;
      }

      const seasonEndMs = splinterlandsSettings.season.ends;

      const msRemainingBeforeSeasonEnds = new Date(seasonEndMs).getTime() - new Date().getTime();
      const seasonEndDHM = TimeUtil.convertMillisecondsToDHM(msRemainingBeforeSeasonEnds);

      this.viewModel.endOfSeason = seasonEndDHM.days + " : " + seasonEndDHM.hours + " : " + seasonEndDHM.minutes;
    });

    this.decTokenDetails$.subscribe(decTokenDetails => {
      if (!decTokenDetails) {
        return;
      }

      const decValue = parseFloat(decTokenDetails.data.price);

      if (this.currency === Currency.DEFAULT) {
        this.viewModel.decRate = this.currency + " " + decValue.toFixed(4);
      }
    });

    this.spsTokenDetails$.subscribe(spsTokenDetails => {
      if (!spsTokenDetails) {
        return;
      }

      const spsValue = parseFloat(spsTokenDetails.data.price);

      if (this.currency === Currency.DEFAULT) {
        this.viewModel.spsRate = this.currency + " " + spsValue.toFixed(4);
      }
    });

    this.playersData$.subscribe(playersData => {
      if (!playersData) {
        return;
      }

      this.viewModel.totalAccounts = playersData.length.toString();
    });

    combineLatest([this.splinterlandsSettings$, this.playersData$]).subscribe(result => {
      const splinterlandsSettings = result[0];
      const playersData = result[1];

      if (!splinterlandsSettings || !playersData) {
        return;
      }

      this.players = this.playerService.initPlayers(playersData, splinterlandsSettings);

      const playersTableData = new Array<PlayerTableData>();

      for (let i = 0; i < this.players.length; i++) {
        playersTableData.push(this.getPlayerTableData(this.players[i], i));
      }

      this.viewModel.players = playersTableData;
      this.players$.next(this.players);
    });

    if (this.currency !== Currency.DEFAULT) {
      combineLatest([this.usdExchangeRateDetails$, this.decTokenDetails$]).subscribe(results => {
        const usdExchangeRateDetails = results[0];
        const decTokenDetails = results[1];

        if (!usdExchangeRateDetails || !decTokenDetails) {
          return;
        }

        this.viewModel.decRate = this.currency + " " + (parseFloat(decTokenDetails.data.price) * usdExchangeRateDetails.rates[this.currency]).toFixed(2);
      });

      combineLatest([this.usdExchangeRateDetails$, this.spsTokenDetails$]).subscribe(results => {
        const usdExchangeRateDetails = results[0];
        const spsTokenDetails = results[1];

        if (!usdExchangeRateDetails || !spsTokenDetails) {
          return;
        }

        this.viewModel.spsRate = this.currency + " " + (parseFloat(spsTokenDetails.data.price) * usdExchangeRateDetails.rates[this.currency]).toFixed(2);
      });
    }

    combineLatest([this.usdExchangeRateDetails$, this.decTokenDetails$, this.spsTokenDetails$, this.players$]).subscribe(results => {
      const usdExchangeRateDetails = results[0];
      const decTokenDetails = results[1];
      const spsTokenDetails = results[2];
      const players = results[3];

      if (!usdExchangeRateDetails || !decTokenDetails || !spsTokenDetails || !players) {
        return;
      }

      let totalDec = 0;
      let totalSps = 0;
      let totalStakedSps = 0;

      for (const player of players) {
        if (player.dec === undefined || player.sps === undefined || player.stakedSps === undefined) {
          continue;
        }

        totalDec += player.dec;
        totalSps += player.sps;
        totalStakedSps += player.stakedSps;
      }

      let decValue = parseFloat(decTokenDetails.data.price);
      let spsValue = parseFloat(spsTokenDetails.data.price);

      if (this.currency !== Currency.DEFAULT) {
        const usdExchangeRateToNativeCurrency = usdExchangeRateDetails.rates[this.currency];
        decValue *= usdExchangeRateToNativeCurrency;
        spsValue *= usdExchangeRateToNativeCurrency;
      }

      const totalDecInNative = parseFloat((totalDec * decValue).toFixed(2));
      const totalSpsInNative = parseFloat((totalSps * spsValue).toFixed(2));
      const totalStakedSpsInNative = parseFloat((totalStakedSps * spsValue).toFixed(2));

      const totalAssetsInNative = (totalDecInNative + totalSpsInNative + totalStakedSpsInNative).toFixed(2);

      this.viewModel.totalDec = totalDec.toFixed(2);
      this.viewModel.totalSps = totalSps.toFixed(2);
      this.viewModel.totalStakedSps = totalStakedSps.toFixed(2);

      this.viewModel.totalDecInNative = this.currency + " " + totalDecInNative.toString();
      this.viewModel.totalSpsInNative = this.currency + " " + totalSpsInNative.toString();
      this.viewModel.totalStakedSpsInNative = this.currency + " " + totalStakedSpsInNative.toString();
      this.viewModel.totalAssets = this.currency + " " + totalAssetsInNative.toString();
    });
  }

  fetchSplinterlandsSettings() {
    this.splinterlandsService.fetchSettings().toPromise().then(splinterlandsSettings => {
      this.splinterlandsSettings$.next(splinterlandsSettings);
    });
  }

  fetchUsdExchangeRate() {
    this.exchangeRateService.getExchangeRateDetails(Currency.USD).toPromise().then(exchangeRateDetails => {
      this.usdExchangeRateDetails$.next(exchangeRateDetails);
    });
  }

  fetchDecTokenDetails() {
    this.tokenService.getTokenDetails(TokenAddresses.DEC_TOKEN_ADDRESS).toPromise().then(tokenDetails => {
      this.decTokenDetails$.next(tokenDetails);
    });
  }

  fetchSpsTokenDetails() {
    this.tokenService.getTokenDetails(TokenAddresses.SPS_TOKEN_ADDRESS).toPromise().then(tokenDetails => {
      this.spsTokenDetails$.next(tokenDetails);
    });
  }

  fetchPlayersData() {
    this.playerService.fetchPlayersData().then(playersData => {
      this.playersData$.next(playersData);
    });
  }

  getPlayerTableData(player: Player, playerCtr: number): PlayerTableData {
    console.log(player);
    return {
      number: playerCtr.toString(),
      username: player.name !== undefined ? player.name : "",
      ecr: player.captureRate !== undefined ? player.captureRate.toFixed(2) : "",
      winRate: player.winRate !== undefined ? player.winRate.toFixed(2) : "",
      rank: player.rank !== undefined ? player.rank : "",
      rating: player.rating !== undefined ? player.rating.toString() : "",
      power: player.collectionPower !== undefined ? player.collectionPower.toString() : "",
      dec: player.dec !== undefined ? player.dec.toFixed(2) : "",
      sps: player.sps !== undefined ? player.sps.toFixed(2) : "",
      stakedSps: player.stakedSps !== undefined ? player.stakedSps.toFixed(2) : "",
      credits: player.credits !== undefined ? player.credits.toFixed(2) : ""
    };
  }

  donateButtonClicked() {
    console.log("donate button clicked");
  }

  settingsButtonClicked() {
    const settingsModal = this.modalService.openModal(ModalIds.SETTINGS_MODAL_ID);

    console.log("settings button clicked");
  }

  refresh() {
    this.splinterlandsSettings$.next(undefined);
    this.usdExchangeRateDetails$.next(undefined);
    this.decTokenDetails$.next(undefined);
    this.spsTokenDetails$.next(undefined);
    this.playersData$.next(undefined);
    this.players$.next(undefined);

    this.resetViewModel();

    this.fetchSplinterlandsSettings();
    this.fetchUsdExchangeRate();
    this.fetchDecTokenDetails();
    this.fetchSpsTokenDetails();
    this.fetchPlayersData();
  }

  resetViewModel() {
    this.viewModel.totalAccounts = undefined;
    this.viewModel.totalDec = undefined;
    this.viewModel.totalDecInNative = undefined;
    this.viewModel.totalSps = undefined;
    this.viewModel.totalSpsInNative = undefined;
    this.viewModel.totalStakedSps = undefined;
    this.viewModel.totalStakedSpsInNative = undefined;
    this.viewModel.endOfSeason = undefined;
    this.viewModel.totalAssets = undefined;
    this.viewModel.decRate = undefined;
    this.viewModel.spsRate = undefined;
    this.viewModel.players = undefined;
  }

  addNewAccount() {
    const addNewAccountModal = this.modalService.openModal(ModalIds.ADD_ACCOUNT_MODAL_ID);

    if (!addNewAccountModal) {
      return;
    }

    (addNewAccountModal as AddAccountModalComponent).setAddAccountModalListener(this);
    this.tokenService.getTokenDetails('xdasd');
  }

  confirmButtonClicked(username: string): void {
    this.refresh();
  }

  clearAccounts() {
    this.playerService.clearPlayers();
    this.refresh();
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
  players?: PlayerTableData[];
}

interface PlayerTableData {
  number: string;
  username: string;
  ecr: string;
  winRate: string;
  rank: string;
  rating: string;
  power: string;
  dec: string;
  sps: string;
  stakedSps: string;
  credits: string;
}
