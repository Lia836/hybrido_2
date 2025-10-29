import { GeneratedResources, ResourceKey } from "../types";

// Helper to sanitize filenames
const sanitizeFilename = (name: string) => name.toLowerCase().replace(/[^a-z0-9_]/g, '_').substring(0, 50);

// Helper to save blob
const saveAs = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// --- PDF EXPORT LOGIC (using jsPDF) ---
const exportResourceAsPdf = (resourceKey: ResourceKey, data: any) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;

    const addText = (text: string | string[], options: any = {}) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, margin, y, options);
        y += (doc.getTextDimensions(splitText).h) + 5;
    };
    
    doc.setFontSize(18);
    addText(data.title, { maxWidth: 180 });
    y += 5;

    doc.setFontSize(10);
    doc.setTextColor(100);
    addText(`Verbe d'action: ${data.actionVerb}`);
    y += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0);

    switch (resourceKey) {
        case 'quiz':
            (data as GeneratedResources['quiz']).questions.forEach((q, i) => {
                doc.setFont(undefined, 'bold');
                addText(`Question ${i + 1}: ${q.questionText}`);
                doc.setFont(undefined, 'normal');
                q.options.forEach((opt, j) => add