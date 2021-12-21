export class TimeUtil {
  public static convertMillisecondsToDHM(milliseconds: number): {days: number, hours: number, minutes: number} {
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const daysms = milliseconds % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = milliseconds % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));

    return {days , hours, minutes};
  }
}
