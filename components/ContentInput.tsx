import React, { useCallback, useState } from 'react';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  setIsLoadingText: (isLoading: boolean) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({ content, setContent, setIsLoadingText }) => {
  const [url, setUrl] = useState('');

  const handlePdfExtraction = async (file: File) => {
    if (typeof window.pdfjsLib === 'undefined') {
        alert("La bibliothèque PDF n'a pas pu être chargée. Veuillez rafraîchir la page.");
        return;
    }
    setIsLoadingText(true);
    try {
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs`;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let textContent = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const text = await page.getTextContent();
                textContent += text.items.map((s: any) => s.str).join(' ');
            }
            setContent(textContent);
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        alert('Erreur lors de l\'extraction du texte du PDF.');
    } finally {
        setIsLoadingText(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      handlePdfExtraction(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target?.result as string);
      reader.readAsText(file);
    } else {
        alert("Ce format de fichier n'est pas encore pris en charge. Veuillez utiliser .txt ou .pdf.");
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
     if (file.type === 'application/pdf') {
      handlePdfExtraction(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target?.result as string);
      reader.readAsText(file);
    } else {
        alert("Ce format de fichier n'est pas encore pris en charge. Veuillez utiliser .txt ou .pdf.");
    }
  }, [setContent]);

  const handleUrlFetch = () => {
      alert("La récupération de contenu à partir d'un lien n'est pas encore disponible en raison de limitations techniques. Cette fonctionnalité est prévue pour une future mise à jour.");
  }

  return (
    <div className="space-y-4">
      <label htmlFor="content-input" className="block text-lg font-medium text-cyan-300">
        1. Fournissez votre contenu source
      </label>
      <div 
        className="mt-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <textarea
          id="content-input"
          rows={8}
          className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:ring-0 focus:outline-none resize-y"
          placeholder="Collez votre texte ici ou déposez un fichier .txt / .pdf"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4">
            <p className="text-sm text-gray-500">ou</p>
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300">
                <span>Téléchargez un fichier</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt,.pdf,.docx,.pptx" onChange={handleFileChange} />
            </label>
            <p className="text-xs text-gray-600 mt-1">.txt, .pdf supportés</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
          <input 
            type="url"
            className="flex-grow bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            placeholder="Ou collez un lien internet..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleUrlFetch}
            className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
          >
            Importer
          </button>
      </div>
    </div>
  );
};

export default ContentInput;