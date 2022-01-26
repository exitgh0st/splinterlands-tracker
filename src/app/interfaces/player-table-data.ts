export class PlayerTableData {
  [key: string]: TableData;
  "#": TableData;
  "USERNAME": TableData;
  "ECR (%)": TableData;
  "WIN RATE (%)": TableData;
  "RANK": TableData;
  "RATING": TableData;
  "POWER": TableData;
  "DEC": TableData;
  "SPS": TableData;
  "STAKED SPS": TableData;
  "CREDITS": TableData;

  static dummy() {
    const playerTableData = new PlayerTableData();

    playerTableData["#"] = {value: ""};
    playerTableData["USERNAME"] = {value: ""};
    playerTableData["ECR (%)"] = {value: ""};
    playerTableData["WIN RATE (%)"] = {value: ""};
    playerTableData["RANK"] = {value: ""};
    playerTableData["RATING"] = {value: ""};
    playerTableData["POWER"] = {value: ""};
    playerTableData["DEC"] = {value: ""};
    playerTableData["SPS"] = {value: ""};
    playerTableData["STAKED SPS"] = {value: ""};
    playerTableData["CREDITS"] = {value: ""};

    return playerTableData;
  }
}

interface TableData {
  value: string;
  details?: {
    color?: string;
  };
}
