import XLSX from 'xlsx';
import fs from 'fs';

// Read the Excel file
const workbook = XLSX.readFile('attached_assets/Expel-NIST-CSF-2.0-self-scoring-tool-04162024_1751563770365.xlsx');

console.log('Available worksheets:');
workbook.SheetNames.forEach((name, index) => {
  console.log(`${index + 1}. ${name}`);
});

// Extract each worksheet to CSV
workbook.SheetNames.forEach((sheetName) => {
  const worksheet = workbook.Sheets[sheetName];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  
  // Clean up filename
  const filename = `nist-csf-${sheetName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.csv`;
  
  fs.writeFileSync(`attached_assets/${filename}`, csvData);
  console.log(`Extracted: ${filename}`);
});

console.log('All worksheets extracted successfully!');