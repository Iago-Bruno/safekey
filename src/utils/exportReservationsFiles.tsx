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
import { IReservations } from "@/interfaces/IReservations";
import { DateUtils } from "./dateUtils";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Função para exportar PDF
export const exportToPDF = (reservations: IReservations[]) => {
  const docDefinition = {
    content: [
      { text: "Lista de Reservas", style: "header" },
      {
        table: {
          body: [
            ["ID", "Data da Reserva", "Horário de Início", "Horário de Termino", "Motivo da Reserva", "Comentários extras", "Status da Reserva", "Reservado Por", "Responsável", "Sala Reservada"],
            ...reservations.map((reservation) => [
              reservation.id,
              DateUtils.formatDateToPTBR(reservation.date_schedulling),
              DateUtils.formatTimeToHHMM(reservation.start_time),
              DateUtils.formatTimeToHHMM(reservation.end_time),
              reservation.reason,
              reservation.commentary,
              reservation.status,
              reservation.user.name + " | " + `(${reservation.user.type.type})`,
              reservation.responsible.name + " | " + `(${reservation.responsible.type.type})`,
              reservation.room.name + " - " + reservation.room.block + " - " + reservation.room.floor,
            ]),
          ],
        },
      },
    ],
    styles: { header: { fontSize: 18, bold: true, marginBottom: 10 } },
  };

  pdfMake.createPdf(docDefinition).download("safekey-reservas.pdf");
};

// Função para exportar DOCX
export const exportToDOCX = (reservations: IReservations[]) => {
  const tableRows = reservations.map(
    (reservation) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(reservation.id.toString())] }),
          new TableCell({ children: [new Paragraph(DateUtils.formatDateToPTBR(reservation.date_schedulling))] }),
          new TableCell({ children: [new Paragraph(DateUtils.formatTimeToHHMM(reservation.start_time))] }),
          new TableCell({ children: [new Paragraph(DateUtils.formatTimeToHHMM(reservation.end_time))] }),
          new TableCell({ children: [new Paragraph(reservation.reason)] }),
          new TableCell({ children: [new Paragraph(reservation.commentary)] }),
          new TableCell({ children: [new Paragraph(reservation.status)] }),
          new TableCell({ children: [new Paragraph(reservation.user.name + " | " + `(${reservation.user.type.type})`)] }),
          new TableCell({ children: [new Paragraph(reservation.responsible.name + " | " + `(${reservation.responsible.type.type})`)] }),
          new TableCell({ children: [new Paragraph(reservation.room.name + " - " + reservation.room.block + " - " + reservation.room.floor)] }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph("Lista de Reservas"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  "ID",
                  "Data da Reserva",
                  "Horário de Início",
                  "Horário de Termino",
                  "Motivo da Reserva",
                  "Comentário extra",
                  "Status da Reserva",
                  "Reservado Por",
                  "Responsável",
                  "Sala Reservada",
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

  Packer.toBlob(doc).then((blob) => saveAs(blob, "safekey-reservas.docx"));
};

// Função para exportar XLSX
export const exportToXLSX = (reservations: IReservations[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    reservations.map((reservation) => ({
      ID: reservation.id,
      DatadaReserva: DateUtils.formatDateToPTBR(reservation.date_schedulling),
      HoráriodeInício: DateUtils.formatTimeToHHMM(reservation.start_time),
      HoráriodeTermino: DateUtils.formatTimeToHHMM(reservation.end_time),
      MotivodaReserva: reservation.reason,
      Comentariosextras: reservation.commentary,
      StatusdaReserva: reservation.status,
      ReservadoPor: reservation.user.name + " | " + `(${reservation.user.type.type})`,
      Responsável: reservation.responsible.name + " | " + `(${reservation.responsible.type.type})`,
      SalaReservada: reservation.room.name + " - " + reservation.room.block + " - " + reservation.room.floor,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, "safeke-reservas.xlsx");
};

// Função para exportar CSV
export const exportToCSV = (reservations: IReservations[]) => {
  const headers = [
    "ID",
    "Data da Reserva",
    "Horário de Início",
    "Horário de Termino",
    "Motivo da Reserva",
    "Comentários extras",
    "Status da Reserva",
    "Reservado Por",
    "Responsável",
    "Sala Reservada",
  ];
  const rows = reservations.map((reservation) => [
    reservation.id,
    DateUtils.formatDateToPTBR(reservation.date_schedulling),
    DateUtils.formatTimeToHHMM(reservation.start_time),
    DateUtils.formatTimeToHHMM(reservation.end_time),
    reservation.reason,
    reservation.commentary,
    reservation.status,
    reservation.user.name + " | " + `(${reservation.user.type.type})`,
    reservation.responsible.name + " | " + `(${reservation.responsible.type.type})`,
    reservation.room.name + " - " + reservation.room.block + " - " + reservation.room.floor,
  ]);

  const csvContent = [headers, ...rows].map((e) => e.join(";")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "safekey-reservations.csv");
};
