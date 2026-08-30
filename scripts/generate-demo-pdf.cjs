const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createDemoPDF() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1
  const page1 = doc.addPage([595, 842]); // A4
  page1.drawText('Demo Answer Sheet', { x: 50, y: 780, size: 24, font: boldFont, color: rgb(0.19, 0.19, 0.19) });
  page1.drawText('Subject: Mathematics', { x: 50, y: 740, size: 14, font, color: rgb(0.4, 0.4, 0.4) });
  page1.drawText('Student: Madhur Rastogi', { x: 50, y: 720, size: 14, font, color: rgb(0.4, 0.4, 0.4) });
  page1.drawText('Date: August 26, 2026', { x: 50, y: 700, size: 14, font, color: rgb(0.4, 0.4, 0.4) });

  page1.drawText('Q1. Solve for x: 2x + 5 = 15', { x: 50, y: 650, size: 12, font: boldFont });
  page1.drawText('2x + 5 = 15', { x: 70, y: 630, size: 11, font });
  page1.drawText('2x = 10', { x: 70, y: 614, size: 11, font });
  page1.drawText('x = 5', { x: 70, y: 598, size: 11, font });

  page1.drawText('Q2. What is the derivative of x^2 + 3x?', { x: 50, y: 560, size: 12, font: boldFont });
  page1.drawText('d/dx (x^2 + 3x) = 2x + 3', { x: 70, y: 540, size: 11, font });

  page1.drawText('Q3. Find the area of a circle with radius 7cm.', { x: 50, y: 500, size: 12, font: boldFont });
  page1.drawText('Area = pi * r^2 = 3.14159 * 49 = 153.94 cm^2', { x: 70, y: 480, size: 11, font });

  page1.drawText('Q4. Simplify: (3x^2)(2x^3)', { x: 50, y: 440, size: 12, font: boldFont });
  page1.drawText('= 6x^5', { x: 70, y: 420, size: 11, font });

  page1.drawText('Q5. What is the value of sin(30 degrees)?', { x: 50, y: 380, size: 12, font: boldFont });
  page1.drawText('sin(30) = 0.5', { x: 70, y: 360, size: 11, font });

  // Page 2
  const page2 = doc.addPage([595, 842]);
  page2.drawText('Demo Answer Sheet (continued)', { x: 50, y: 780, size: 20, font: boldFont, color: rgb(0.19, 0.19, 0.19) });

  page2.drawText('Q6. Solve the equation: x^2 - 4 = 0', { x: 50, y: 730, size: 12, font: boldFont });
  page2.drawText('x^2 = 4', { x: 70, y: 710, size: 11, font });
  page2.drawText('x = +/- 2', { x: 70, y: 694, size: 11, font });

  page2.drawText('Q7. What is the integral of 2x?', { x: 50, y: 650, size: 12, font: boldFont });
  page2.drawText('Integral of 2x dx = x^2 + C', { x: 70, y: 630, size: 11, font });

  page2.drawText('Q8. Find the slope of y = 3x + 7', { x: 50, y: 590, size: 12, font: boldFont });
  page2.drawText('Slope = 3', { x: 70, y: 570, size: 11, font });

  page2.drawText('Q9. Convert 45 degrees to radians.', { x: 50, y: 530, size: 12, font: boldFont });
  page2.drawText('45 degrees = pi/4 radians = 0.7854 radians', { x: 70, y: 510, size: 11, font });

  page2.drawText('Q10. What is the square root of 144?', { x: 50, y: 470, size: 12, font: boldFont });
  page2.drawText('sqrt(144) = 12', { x: 70, y: 450, size: 11, font });

  const pdfBytes = await doc.save();
  const outPath = path.join(__dirname, '..', 'public', 'demo-answer-sheet.pdf');
  fs.writeFileSync(outPath, pdfBytes);
  console.log('Created:', outPath);
}

createDemoPDF().catch(console.error);
