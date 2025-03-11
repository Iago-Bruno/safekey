export enum RoomStatusKeyEnum {
  Disponivel = "Disponivel",
  Retirada = "Retirada",
}

export namespace RoomStatusKeyEnum {
  export const mapDescricao: Map<RoomStatusKeyEnum, string> = new Map([
    [RoomStatusKeyEnum.Disponivel, "Disponivel"],
    [RoomStatusKeyEnum.Retirada, "Retirada"],
  ]);

  export function getDescricao(key: RoomStatusKeyEnum): string {
    return mapDescricao.get(key) ?? "Descrição não encontrada";
  }

  export function getOptions(): { label: string; value: string }[] {
    const list: { label: string; value: string }[] = [];
    mapDescricao.forEach((label, value) => {
      list.push({ label: label, value: value });
    });

    return list;
  }
}
