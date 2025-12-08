import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate Excel report from dashboard data (client-side)
 */
export const generateClientExcelReport = (dashboardData) => {
  const wb = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['SYSTEM DASHBOARD REPORT'],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    ['OVERALL STATISTICS'],
    [],
    ['Metric', 'Value', 'Active', 'Percentage'],
    [
      'Total Users', 
      dashboardData.totalUsers, 
      dashboardData.activeUsers,
      `${((dashboardData.activeUsers / dashboardData.totalUsers) * 100).toFixed(1)}%`
    ],
    ['Total Workspaces', dashboardData.totalWorkspaces, '-', '-'],
    ['Total Projects', dashboardData.totalProjects, '-', '-'],
    [
      'Total Tasks', 
      dashboardData.totalTasks, 
      Math.round(dashboardData.totalTasks * dashboardData.taskCompletionRate / 100),
      `${dashboardData.taskCompletionRate?.toFixed(1) || 0}%`
    ],
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');
  
  // Projects by Status Sheet
  if (dashboardData.projectsByStatus && dashboardData.projectsByStatus.length > 0) {
    const projectStatusData = [
      ['PROJECT STATUS BREAKDOWN'],
      [],
      ['Status', 'Count', 'Percentage'],
    ];
    
    const totalProjects = dashboardData.projectsByStatus.reduce((sum, item) => sum + item.count, 0);
    dashboardData.projectsByStatus.forEach(item => {
      projectStatusData.push([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalProjects) * 100).toFixed(1)}%`
      ]);
    });
    
    const wsProjects = XLSX.utils.aoa_to_sheet(projectStatusData);
    XLSX.utils.book_append_sheet(wb, wsProjects, 'Projects by Status');
  }
  
  // Tasks by Status Sheet
  if (dashboardData.tasksByStatus && dashboardData.tasksByStatus.length > 0) {
    const taskStatusData = [
      ['TASK STATUS BREAKDOWN'],
      [],
      ['Status', 'Count', 'Percentage'],
    ];
    
    const totalTasks = dashboardData.tasksByStatus.reduce((sum, item) => sum + item.count, 0);
    dashboardData.tasksByStatus.forEach(item => {
      taskStatusData.push([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalTasks) * 100).toFixed(1)}%`
      ]);
    });
    
    const wsTasks = XLSX.utils.aoa_to_sheet(taskStatusData);
    XLSX.utils.book_append_sheet(wb, wsTasks, 'Tasks by Status');
  }
  
  // Projects by Priority Sheet
  if (dashboardData.projectsByPriority && dashboardData.projectsByPriority.length > 0) {
    const priorityData = [
      ['PROJECT PRIORITY BREAKDOWN'],
      [],
      ['Priority', 'Count', 'Percentage'],
    ];
    
    const totalProjects = dashboardData.projectsByPriority.reduce((sum, item) => sum + item.count, 0);
    dashboardData.projectsByPriority.forEach(item => {
      priorityData.push([
        item._id.toUpperCase(),
        item.count,
        `${((item.count / totalProjects) * 100).toFixed(1)}%`
      ]);
    });
    
    const wsPriority = XLSX.utils.aoa_to_sheet(priorityData);
    XLSX.utils.book_append_sheet(wb, wsPriority, 'Projects by Priority');
  }
  
  // Generate and download
  XLSX.writeFile(wb, `dashboard-report-${Date.now()}.xlsx`);
};

/**
 * Generate PDF report from dashboard data (client-side)
 */
export const generateClientPDFReport = (dashboardData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(68, 114, 196);
  doc.text('SYSTEM DASHBOARD REPORT', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
  
  let yPosition = 40;
  
  // Overall Statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Statistics', 14, yPosition);
  yPosition += 10;
  
  const statsData = [
    ['Metric', 'Value', 'Details'],
    [
      'Total Users',
      dashboardData.totalUsers.toString(),
      `${dashboardData.activeUsers} active`
    ],
    ['Total Workspaces', dashboardData.totalWorkspaces.toString(), '-'],
    ['Total Projects', dashboardData.totalProjects.toString(), '-'],
    [
      'Total Tasks',
      dashboardData.totalTasks.toString(),
      `${dashboardData.taskCompletionRate?.toFixed(1) || 0}% completion`
    ],
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [statsData[0]],
    body: statsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [68, 114, 196] },
    margin: { left: 14, right: 14 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 15;
  
  // Projects by Status
  if (dashboardData.projectsByStatus && dashboardData.projectsByStatus.length > 0) {
    doc.setFontSize(14);
    doc.text('Projects by Status', 14, yPosition);
    yPosition += 10;
    
    const totalProjects = dashboardData.projectsByStatus.reduce((sum, item) => sum + item.count, 0);
    const projectsData = dashboardData.projectsByStatus.map(item => [
      item._id.toUpperCase(),
      item.count.toString(),
      `${((item.count / totalProjects) * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Status', 'Count', 'Percentage']],
      body: projectsData,
      theme: 'striped',
      headStyles: { fillColor: [68, 114, 196] },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // Add new page if needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Tasks by Status
  if (dashboardData.tasksByStatus && dashboardData.tasksByStatus.length > 0) {
    doc.setFontSize(14);
    doc.text('Tasks by Status', 14, yPosition);
    yPosition += 10;
    
    const totalTasks = dashboardData.tasksByStatus.reduce((sum, item) => sum + item.count, 0);
    const tasksData = dashboardData.tasksByStatus.map(item => [
      item._id.toUpperCase(),
      item.count.toString(),
      `${((item.count / totalTasks) * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Status', 'Count', 'Percentage']],
      body: tasksData,
      theme: 'striped',
      headStyles: { fillColor: [68, 114, 196] },
      margin: { left: 14, right: 14 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
  }
  
  // Add new page if needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Projects by Priority
  if (dashboardData.projectsByPriority && dashboardData.projectsByPriority.length > 0) {
    doc.setFontSize(14);
    doc.text('Projects by Priority', 14, yPosition);
    yPosition += 10;
    
    const totalProjects = dashboardData.projectsByPriority.reduce((sum, item) => sum + item.count, 0);
    const priorityData = dashboardData.projectsByPriority.map(item => [
      item._id.toUpperCase(),
      item.count.toString(),
      `${((item.count / totalProjects) * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Priority', 'Count', 'Percentage']],
      body: priorityData,
      theme: 'striped',
      headStyles: { fillColor: [68, 114, 196] },
      margin: { left: 14, right: 14 },
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'This report is generated automatically by Project Management System',
      105,
      290,
      { align: 'center' }
    );
  }
  
  // Save
  doc.save(`dashboard-report-${Date.now()}.pdf`);
};

/**
 * Download report from API
 */
export const downloadReportFromAPI = async (apiFunction, format) => {
  try {
    const response = await apiFunction(format);
    const blob = new Blob([response.data], {
      type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};
