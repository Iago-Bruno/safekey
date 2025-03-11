export enum UsersTypeEnum {
  Administrador = "Administrador",
  Professor = "Professor",
  Aluno = "Aluno",
}

export namespace UsersTypeEnum {
  export const mapDescricao: Map<UsersTypeEnum, string> = new Map([
    [UsersTypeEnum.Administrador, "Administrador"],
    [UsersTypeEnum.Professor, "Professor"],
    [UsersTypeEnum.Aluno, "Aluno"],
  ]);

  export function getDescricao(key: UsersTypeEnum): string {
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
