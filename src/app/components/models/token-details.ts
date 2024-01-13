export interface TokenDetails {
  data: {
    [key: string]: {
      quote: {
        USD: {
          price: number
        }
      }
    }
  };
}
