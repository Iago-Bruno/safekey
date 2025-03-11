import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { IUsers } from "@/interfaces/IUser";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Função para exportar PDF
export const exportToPDF = (users: IUsers[]) => {
  const docDefinition = {
    content: [
      { text: "Lista de Usuários", style: "header" },
      {
        table: {
          body: [
            ["ID", "Nome", "Email", "Tipo", "Avatar"],
            ...users.map((user) => [
              user.id,
              user.name,
              user.email,
              user.type.type,
              user.avatar || "Sem avatar",
            ]),
          ],
        },
      },
    ],
    styles: { header: { fontSize: 18, bold: true, marginBottom: 10 } },
  };

  pdfMake.createPdf(docDefinition).download("safekey-usuarios.pdf");
};

// Função para exportar DOCX
export const exportToDOCX = (users: IUsers[]) => {
  const tableRows = users.map(
    (user) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(user.id.toString())] }),
          new TableCell({ children: [new Paragraph(user.name)] }),
          new TableCell({ children: [new Paragraph(user.email)] }),
          new TableCell({ children: [new Paragraph(user.type.type)] }),
          new TableCell({
            children: [new Paragraph(user.avatar || "Sem avatar")],
          }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph("Lista de Usuários"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: ["ID", "Nome", "Email", "Tipo", "Avatar"].map(
                  (header) =>
                    new TableCell({
                      children: [new Paragraph(header)],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    })
                ),
              }),
              ...tableRows,
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => saveAs(blob, "safekey-usuarios.docx"));
};

// Função para exportar XLSX
export const exportToXLSX = (users: IUsers[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    users.map((user) => ({
      ID: user.id,
      Nome: user.name,
      Email: user.email,
      Tipo: user.type.type,
      Avatar: user.avatar || "Sem avatar",
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, "safekey-usuarios.xlsx");
};

// Função para exportar CSV
export const exportToCSV = (users: IUsers[]) => {
  const headers = ["ID", "Nome", "Email", "Tipo", "Avatar"];
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.type.type,
    user.avatar || "Sem avatar",
  ]);

  const csvContent = [headers, ...rows].map((e) => e.join(";")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "safekey-usuarios.csv");
};
