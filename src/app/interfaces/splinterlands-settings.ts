export interface SplinterlandsSettings {
    last_block: number;
    dec: { ecr_regen_rate: number };
    leagues: {
      modern:
      [{
        name: string,
        group: string,
        league_limit: number,
        level: number,
        min_rating: number,
        season_rating_reset: 0
      }],
      wild: [{
        name: string,
        group: string,
        league_limit: number,
        level: number,
        min_rating: number,
        season_rating_reset: 0
      }]
    }
      ;
    season: {
      ends: string
    };
}
