import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ScoringResult } from './types';
import { createExportData } from './artifacts';

// Create and download ZIP file with all artifacts
export async function exportResults(scoring: ScoringResult): Promise<void> {
  const zip = new JSZip();
  const exportData = createExportData(scoring);
  
  // Create deliverables folder in ZIP
  const deliverables = zip.folder('deliverables');
  
  if (deliverables) {
    // Add Markdown files to deliverables folder
    deliverables.file('gap_list.md', exportData['gap_list.md']);
    deliverables.file('capa_plan.md', exportData['capa_plan.md']);
    deliverables.file('audit_interview_script.md', exportData['audit_interview_script.md']);
  }
  
  // Add JSON file to root of ZIP
  zip.file('readiness.json', exportData['readiness.json']);
  
  // Generate ZIP and trigger download
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `audit_readiness_${timestamp}.zip`;
  
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
  } catch (error) {
    console.error('Error generating ZIP file:', error);
    throw new Error('Failed to generate export file');
  }
}