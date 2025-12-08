import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

/**
 * Generate Excel report
 */
export const generateExcelReport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  
  // Metadata
  workbook.creator = 'Project Management System';
  workbook.created = new Date();
  
  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary', {
    properties: { tabColor: { argb: 'FF4472C4' } }
  });
  
  // Header styling
  summarySheet.getCell('A1').value = 'SYSTEM DASHBOARD REPORT';
  summarySheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF4472C4' } };
  summarySheet.mergeCells('A1:D1');
  
  summarySheet.getCell('A2').value = `Generated: ${new Date().toLocaleString()}`;
  summarySheet.getCell('A2').font = { italic: true, size: 10 };
  summarySheet.mergeCells('A2:D2');
  
  // Summary statistics
  summarySheet.addRow([]);
  summarySheet.addRow(['OVERALL STATISTICS']);
  summarySheet.getCell('A4').font = { bold: true, size: 14 };
  summarySheet.mergeCells('A4:D4');
  
  const summaryData = [
    ['Metric', 'Value', 'Active', 'Percentage'],
    ['Total Users', data.totalUsers, data.activeUsers, `${((data.activeUsers / data.totalUsers) * 100).toFixed(1)}%`],
    ['Total Workspaces', data.totalWorkspaces, '-', '-'],
    ['Total Projects', data.totalProjects, '-', '-'],
    ['Total Tasks', data.totalTasks, Math.round(data.totalTasks * data.taskCompletionRate / 100), `${data.taskCompletionRate.toFixed(1)}%`],
  ];
  
  summarySheet.addRow([]);
  summaryData.forEach((row, index) => {
    const excelRow = summarySheet.addRow(row);
    if (index === 0) {
      excelRow.font = { bold: true };
      excelRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }
      };
    }
  });
  
  // Auto-fit columns
  summarySheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 }
  ];
  
  // Projects by Status Sheet
  if (data.projectsByStatus && data.projectsByStatus.length > 0) {
    const projectSheet = workbook.addWorksheet('Projects by Status');
    projectSheet.addRow(['PROJECT STATUS BREAKDOWN']);
    projectSheet.getCell('A1').font = { bold: true, size: 14 };
    projectSheet.addRow([]);
    
    projectSheet.addRow(['Status', 'Count', 'Percentage']);
    projectSheet.getRow(3).font = { bold: true };
    projectSheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };
    
    const totalProjects = data.projectsByStatus.reduce((sum, item) => sum + item.count, 0);
    data.projectsByStatus.forEach(item => {
      projectSheet.addRow([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalProjects) * 100).toFixed(1)}%`
      ]);
    });
    
    projectSheet.columns = [{ width: 20 }, { width: 15 }, { width: 15 }];
  }
  
  // Tasks by Status Sheet
  if (data.tasksByStatus && data.tasksByStatus.length > 0) {
    const taskSheet = workbook.addWorksheet('Tasks by Status');
    taskSheet.addRow(['TASK STATUS BREAKDOWN']);
    taskSheet.getCell('A1').font = { bold: true, size: 14 };
    taskSheet.addRow([]);
    
    taskSheet.addRow(['Status', 'Count', 'Percentage']);
    taskSheet.getRow(3).font = { bold: true };
    taskSheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };
    
    const totalTasks = data.tasksByStatus.reduce((sum, item) => sum + item.count, 0);
    data.tasksByStatus.forEach(item => {
      taskSheet.addRow([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalTasks) * 100).toFixed(1)}%`
      ]);
    });
    
    taskSheet.columns = [{ width: 20 }, { width: 15 }, { width: 15 }];
  }
  
  // Projects by Priority Sheet
  if (data.projectsByPriority && data.projectsByPriority.length > 0) {
    const prioritySheet = workbook.addWorksheet('Projects by Priority');
    prioritySheet.addRow(['PROJECT PRIORITY BREAKDOWN']);
    prioritySheet.getCell('A1').font = { bold: true, size: 14 };
    prioritySheet.addRow([]);
    
    prioritySheet.addRow(['Priority', 'Count', 'Percentage']);
    prioritySheet.getRow(3).font = { bold: true };
    prioritySheet.getRow(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };
    
    const totalProjects = data.projectsByPriority.reduce((sum, item) => sum + item.count, 0);
    data.projectsByPriority.forEach(item => {
      prioritySheet.addRow([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalProjects) * 100).toFixed(1)}%`
      ]);
    });
    
    prioritySheet.columns = [{ width: 20 }, { width: 15 }, { width: 15 }];
  }
  
  return workbook;
};

/**
 * Generate PDF report
 */
export const generatePDFReport = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    // Header
    doc.fontSize(24).fillColor('#4472C4').text('SYSTEM DASHBOARD REPORT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#666666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Overall Statistics
    doc.fontSize(16).fillColor('#000000').text('Overall Statistics', { underline: true });
    doc.moveDown();
    
    const stats = [
      { label: 'Total Users', value: data.totalUsers, extra: `(${data.activeUsers} active)` },
      { label: 'Total Workspaces', value: data.totalWorkspaces },
      { label: 'Total Projects', value: data.totalProjects },
      { label: 'Total Tasks', value: data.totalTasks, extra: `(${data.taskCompletionRate.toFixed(1)}% completion)` },
    ];
    
    stats.forEach(stat => {
      doc.fontSize(12).fillColor('#000000').text(`${stat.label}: `, { continued: true })
         .fontSize(12).fillColor('#4472C4').text(stat.value.toString(), { continued: stat.extra ? true : false });
      if (stat.extra) {
        doc.fontSize(10).fillColor('#666666').text(` ${stat.extra}`);
      } else {
        doc.text('');
      }
    });
    
    doc.moveDown(2);
    
    // Projects by Status
    if (data.projectsByStatus && data.projectsByStatus.length > 0) {
      doc.fontSize(16).fillColor('#000000').text('Projects by Status', { underline: true });
      doc.moveDown();
      
      const totalProjects = data.projectsByStatus.reduce((sum, item) => sum + item.count, 0);
      data.projectsByStatus.forEach(item => {
        const percentage = ((item.count / totalProjects) * 100).toFixed(1);
        doc.fontSize(11).fillColor('#000000').text(`• ${item._id.toUpperCase()}: `, { continued: true })
           .fillColor('#4472C4').text(`${item.count} `, { continued: true })
           .fillColor('#666666').text(`(${percentage}%)`);
      });
      
      doc.moveDown(2);
    }
    
    // Tasks by Status
    if (data.tasksByStatus && data.tasksByStatus.length > 0) {
      doc.fontSize(16).fillColor('#000000').text('Tasks by Status', { underline: true });
      doc.moveDown();
      
      const totalTasks = data.tasksByStatus.reduce((sum, item) => sum + item.count, 0);
      data.tasksByStatus.forEach(item => {
        const percentage = ((item.count / totalTasks) * 100).toFixed(1);
        doc.fontSize(11).fillColor('#000000').text(`• ${item._id.toUpperCase()}: `, { continued: true })
           .fillColor('#4472C4').text(`${item.count} `, { continued: true })
           .fillColor('#666666').text(`(${percentage}%)`);
      });
      
      doc.moveDown(2);
    }
    
    // Projects by Priority
    if (data.projectsByPriority && data.projectsByPriority.length > 0) {
      doc.fontSize(16).fillColor('#000000').text('Projects by Priority', { underline: true });
      doc.moveDown();
      
      const totalProjects = data.projectsByPriority.reduce((sum, item) => sum + item.count, 0);
      data.projectsByPriority.forEach(item => {
        const percentage = ((item.count / totalProjects) * 100).toFixed(1);
        doc.fontSize(11).fillColor('#000000').text(`• ${item._id.toUpperCase()}: `, { continued: true })
           .fillColor('#4472C4').text(`${item.count} `, { continued: true })
           .fillColor('#666666').text(`(${percentage}%)`);
      });
      
      doc.moveDown(2);
    }
    
    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#999999').text(
      'This report is generated automatically by Project Management System',
      { align: 'center' }
    );
    
    doc.end();
  });
};
