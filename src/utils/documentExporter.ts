import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Packer } from 'docx';
import { jsPDF } from 'jspdf';
import { GeneratedDocumentData } from '../types';

/**
 * Exporte un document ecclésiastique officiel au format Microsoft Word (.docx)
 */
export async function exportDocumentToWord(
  docData: GeneratedDocumentData,
  signatureImageBase64?: string,
  sealImageBase64?: string
): Promise<void> {
  const paragraphs = docData.bodyContent
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          // En-tête institutionnel
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ÉGLISE DU NAZARÉEN DE DAMÉ',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A', // Deep Blue
                font: 'Times New Roman'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'District Bas Nord-Ouest d’Haïti — Assemblée Fondée en 1979',
                size: 20, // 10pt
                color: '4B5563',
                font: 'Times New Roman'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '« Sainteté à l’Éternel »',
                bold: true,
                italics: true,
                size: 22, // 11pt
                color: 'D97706', // Gold / Amber
                font: 'Times New Roman'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Haïti',
                size: 18,
                color: '6B7280',
                font: 'Times New Roman'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Tél : +509 48596089 | Email : eglisedunazareendedame@gmail.com',
                size: 18,
                color: '6B7280',
                font: 'Times New Roman'
              })
            ]
          }),

          // Ligne de séparation
          new Paragraph({
            border: {
              bottom: {
                color: '1E3A8A',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12
              }
            },
            spacing: { after: 300 }
          }),

          // Référence & Date
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Réf : ${docData.referenceNumber}`,
                bold: true,
                size: 20,
                font: 'Times New Roman'
              }),
              new TextRun({
                text: `\n${docData.place}, le ${docData.issueDate}`,
                size: 20,
                italics: true,
                font: 'Times New Roman'
              })
            ]
          }),

          // Titre du document en lettres capitales
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 300 },
            children: [
              new TextRun({
                text: docData.title,
                bold: true,
                size: 28, // 14pt
                color: '1E3A8A',
                underline: {},
                font: 'Times New Roman'
              })
            ]
          }),

          // Verset biblique (s'il existe)
          ...(docData.biblicalVerse
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 100, after: 250 },
                  children: [
                    new TextRun({
                      text: docData.biblicalVerse,
                      italics: true,
                      size: 20,
                      color: '4B5563',
                      font: 'Times New Roman'
                    })
                  ]
                })
              ]
            : []),

          // Paragraphes du corps du texte
          ...paragraphs.map(
            text =>
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200, line: 360 }, // 1.5 line spacing
                children: [
                  new TextRun({
                    text: `    ${text}`,
                    size: 22, // 11pt
                    font: 'Times New Roman',
                    color: '111827'
                  })
                ]
              })
          ),

          // Espace avant signatures
          new Paragraph({
            spacing: { before: 400, after: 200 }
          }),

          // Tableau de signatures à deux colonnes (Pasteur & Secrétaire)
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: 'Pour le Secrétariat Paroissial :',
                            bold: true,
                            size: 20,
                            font: 'Times New Roman'
                          }),
                          new TextRun({
                            text: '\n\n\n\n_________________________________',
                            size: 20,
                            font: 'Times New Roman'
                          }),
                          new TextRun({
                            text: '\nSecrétaire Général / Archiviste',
                            size: 18,
                            italics: true,
                            font: 'Times New Roman'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE }
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: 'Pour le Corps Pastoral :',
                            bold: true,
                            size: 20,
                            font: 'Times New Roman'
                          }),
                          new TextRun({
                            text: '\n\n\n\n_________________________________',
                            size: 20,
                            font: 'Times New Roman'
                          }),
                          new TextRun({
                            text: `\n${docData.pastorName}`,
                            bold: true,
                            size: 20,
                            font: 'Times New Roman'
                          }),
                          new TextRun({
                            text: '\nPasteur Principal & Bâtisseur',
                            size: 18,
                            italics: true,
                            font: 'Times New Roman'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = docData.recipientName.replace(/[^a-zA-Z0-9]/g, '_') || 'document';
  const fileName = `${docData.documentType}_${cleanName}_Nazareen_Dame.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exporte un document ecclésiastique officiel au format PDF haute fidélité via jsPDF
 */
export async function exportDocumentToPdf(
  docData: GeneratedDocumentData,
  signatureImageBase64?: string,
  sealImageBase64?: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Bordure décorative institutionnelle
  pdf.setDrawColor(30, 58, 138); // Deep Blue
  pdf.setLineWidth(0.8);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
  pdf.setLineWidth(0.2);
  pdf.rect(11.5, 11.5, pageWidth - 23, pageHeight - 23);

  // Sceau de l'église (si image présente)
  if (sealImageBase64 && sealImageBase64.startsWith('data:image')) {
    try {
      pdf.addImage(sealImageBase64, 'PNG', margin, y, 22, 22);
    } catch (e) {
      // Ignorer si format incompatible
    }
  }

  // En-tête de l'église
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(30, 58, 138);
  pdf.text('ÉGLISE DU NAZARÉEN DE DAMÉ', pageWidth / 2, y + 5, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(75, 85, 99);
  pdf.text('District Bas Nord-Ouest d’Haïti — Assemblée Fondée en 1979', pageWidth / 2, y + 10, { align: 'center' });

  pdf.setFont('helvetica', 'bolditalic');
  pdf.setFontSize(10);
  pdf.setTextColor(217, 119, 6); // Amber gold
  pdf.text('« Sainteté à l’Éternel »', pageWidth / 2, y + 15, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Haïti', pageWidth / 2, y + 20, { align: 'center' });
  pdf.text('Tél : +509 48596089 | Email : eglisedunazareendedame@gmail.com', pageWidth / 2, y + 24, { align: 'center' });

  y += 28;

  // Ligne de séparation
  pdf.setDrawColor(30, 58, 138);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Référence & Date
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(17, 24, 39);
  pdf.text(`Réf : ${docData.referenceNumber}`, margin, y);

  pdf.setFont('helvetica', 'italic');
  pdf.text(`${docData.place}, le ${docData.issueDate}`, pageWidth - margin, y, { align: 'right' });
  y += 12;

  // Titre du document
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(30, 58, 138);
  pdf.text(docData.title, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // Soulignement du titre
  const titleWidth = pdf.getTextWidth(docData.title);
  pdf.setLineWidth(0.4);
  pdf.line((pageWidth - titleWidth) / 2, y, (pageWidth + titleWidth) / 2, y);
  y += 8;

  // Verset biblique
  if (docData.biblicalVerse) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8.5);
    pdf.setTextColor(75, 85, 99);
    const verseLines = pdf.splitTextToSize(docData.biblicalVerse, contentWidth - 20);
    pdf.text(verseLines, pageWidth / 2, y, { align: 'center' });
    y += verseLines.length * 4.5 + 4;
  }

  // Corps du texte
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(17, 24, 39);

  const rawParagraphs = docData.bodyContent
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (const paragraph of rawParagraphs) {
    const lines = pdf.splitTextToSize(`    ${paragraph}`, contentWidth);
    pdf.text(lines, margin, y);
    y += lines.length * 5 + 4;

    // Gestion du saut de page si le texte est long
    if (y > pageHeight - 55) {
      pdf.addPage();
      y = margin + 10;
    }
  }

  // Zone de signature
  y = Math.max(y + 8, pageHeight - 50);

  // Signature du Secrétariat
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(17, 24, 39);
  pdf.text('Pour le Secrétariat Paroissial :', margin, y);
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.text('Secrétaire Général & Archives', margin, y + 20);

  // Signature du Pasteur
  const rightX = pageWidth - margin;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Pour le Corps Pastoral :', rightX, y, { align: 'right' });

  // Si une signature a été uploadée
  if (signatureImageBase64 && signatureImageBase64.startsWith('data:image')) {
    try {
      pdf.addImage(signatureImageBase64, 'PNG', rightX - 45, y + 2, 40, 15);
    } catch (e) {
      // Ignorer si format incompatible
    }
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(docData.pastorName, rightX, y + 18, { align: 'right' });
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.text('Pasteur Principal', rightX, y + 22, { align: 'right' });

  // Lignes de signature
  pdf.setDrawColor(156, 163, 175);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y + 16, margin + 45, y + 16);
  pdf.line(rightX - 45, y + 16, rightX, y + 16);

  // Téléchargement
  const cleanName = docData.recipientName.replace(/[^a-zA-Z0-9]/g, '_') || 'document';
  pdf.save(`${docData.documentType}_${cleanName}_Nazareen_Dame.pdf`);
}
