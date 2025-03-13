export class DateUtils {
  public static formatDateToPTBR(date: Date | string): string {
    if (typeof date === "string") {
      const [year, month, day] = date.split("-").map(Number);
      const localDate = new Date(year, month - 1, day); // Criar a data manualmente sem fuso horário
      return localDate.toLocaleDateString("pt-BR");
    }

    return new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    ).toLocaleDateString("pt-BR");
  }

  public static formatTimeToHHMM(time: string): string {
    const [hours, minutes] = time.split(":");

    return `${hours}:${minutes}`;
  }
}
