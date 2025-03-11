export class DateUtils {
  public static formatDateToPTBR(date: Date): string {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  public static formatTimeToHHMM(time: string): string {
    const [hours, minutes] = time.split(":");

    return `${hours}:${minutes}`;
  }
}
