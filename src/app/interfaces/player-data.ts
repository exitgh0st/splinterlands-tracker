import { PlayerBalance } from "./player-balance";
import { PlayerDetails } from "./player-details";

export interface PlayerData {
  playerDetails: PlayerDetails;
  playerBalances: PlayerBalance[];
}
