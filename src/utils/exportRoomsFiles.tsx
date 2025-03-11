import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { IRooms } from "@/interfaces/IRooms";

pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

// Função para exportar PDF
export const exportToPDF = (rooms: IRooms[]) => {
  const docDefinition = {
    content: [
      { text: "Lista de Usuários", style: "header" },
      {
        table: {
          body: [
            ["ID", "Nome", "Bloco", "Andar", "Tipo de Sala", "Disponibilidade"],
            ...rooms.map((room) => [
              room.id,
              room.name,
              room.block,
              room.floor,
              room.type,
              room.status,
            ]),
          ],
        },
      },
    ],
    styles: { header: { fontSize: 18, bold: true, marginBottom: 10 } },
  };

  pdfMake.createPdf(docDefinition).download("safekey-salas.pdf");
};

// Função para exportar DOCX
export const exportToDOCX = (rooms: IRooms[]) => {
  const tableRows = rooms.map(
    (room) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(room.id.toString())] }),
          new TableCell({ children: [new Paragraph(room.name)] }),
          new TableCell({ children: [new Paragraph(room.block)] }),
          new TableCell({ children: [new Paragraph(room.floor)] }),
          new TableCell({ children: [new Paragraph(room.type)] }),
          new TableCell({ children: [new Paragraph(room.status)] }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph("Lista de Salas"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  "ID",
                  "Nome",
                  "Bloco",
                  "Andar",
                  "Tipo de Sala",
                  "Disponibilidade",
                ].map(
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

  Packer.toBlob(doc).then((blob) => saveAs(blob, "safekey-salas.docx"));
};

// Função para exportar XLSX
export const exportToXLSX = (rooms: IRooms[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    rooms.map((room) => ({
      ID: room.id,
      Nome: room.name,
      Bloco: room.block,
      Andar: room.floor,
      TipoDeSala: room.type,
      Disponibilidade: room.status,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Salas");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, "safekey-salas.xlsx");
};

// Função para exportar CSV
export const exportToCSV = (rooms: IRooms[]) => {
  const headers = [
    "ID",
    "Nome",
    "Bloco",
    "Andar",
    "Tipo de Sala",
    "Disponibilidade",
  ];
  const rows = rooms.map((room) => [
    room.id,
    room.name,
    room.block,
    room.floor,
    room.type,
    room.status,
  ]);

  const csvContent = [headers, ...rows].map((e) => e.join(";")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "safekey-salas.csv");
};
