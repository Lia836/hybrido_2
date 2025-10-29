import React, { useState } from 'react';
import { GeneratedResources, PedagogyMetadata, ResourceKey } from '../types';
import { LoaderIcon, SparklesIcon, CopyIcon, DownloadIcon, FileJsonIcon, FileTextIcon, ImageIcon, FileArchiveIcon } from './icons';

interface ResultsDisplayProps {
  resources: Partial<GeneratedResources>;
  isLoading: boolean;
  generatingType: ResourceKey | 'image' | null;
  error: string | null;
  onGenerate: (resourceType: ResourceKey) => void;
  onGenerateImage: () => void;
  infographicImage: string | null;
}

// Reusable Copy Button Component
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) { console.error("Failed to copy text: ", err); }
    };
    return (
        <button onClick={handleCopy} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Copier le contenu">
            {isCopied ? <span className="text-xs font-semibold text-cyan-300">Copié!</span> : <CopyIcon className="w-4 h-4" />}
        </button>
    );
};

// Reusable Export Button
const ExportButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean; tooltip?: string }> = ({ label, icon, onClick, disabled, tooltip }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
    data-tooltip={disabled ? tooltip : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const formatFurtherReadingForCopy = (fr: PedagogyMetadata['furtherReading']): string => {
    let text = `\n\n--- Pour aller plus loin ---\n`;
    if (fr.bibliography?.length > 0) {
        text += `\nBibliographie (Format APA):\n${fr.bibliography.join('\n')}`;
    }
    if (fr.applicationIdeas?.length > 0) {
        text += `\n\nPistes d'application:\n- ${fr.applicationIdeas.join('\n- ')}`;
    }
    return text;
}

// Formatting functions
const formatQuizForCopy = (quiz: GeneratedResources['quiz']): string => {
    let text = `${quiz.title}\nVerbe d'action: ${quiz.actionVerb}\n\n`;
    quiz.questions.forEach((q, index) => {
        text += `Question ${index + 1}: ${q.questionText}\n`;
        q.options.forEach((opt, i) => {
            text += `  - ${i === q.correctAnswerIndex ? '[X]' : '[ ]'} ${opt}\n`;
        });
        text += `Explication: ${q.explanation}\n\n`;
    });
    text += formatFurtherReadingForCopy(quiz.furtherReading);
    return text;
};
const formatCaseStudyForCopy = (cs: GeneratedResources['caseStudy']): string => {
    let text = `${cs.title}\nVerbe d'action: ${cs.actionVerb}\n\n`;
    text += `Scénario:\n${cs.scenario}\n\n`;
    text += `Questions de réflexion:\n- ${cs.questions.join('\n- ')}`;
    text += formatFurtherReadingForCopy(cs.furtherReading);
    return text;
}
const formatInfographicForCopy = (info: GeneratedResources['infographic']): string => {
    let text = `${info.title}\nVerbe d'action: ${info.actionVerb}\n\n`;
    info.sections.forEach(sec => {
        text += `${sec.header}:\n`;
        sec.points.forEach(p => text += `  - ${p}\n`);
        text += '\n';
    });
    text += formatFurtherReadingForCopy(info.furtherReading);
    return text;
};
const formatVideoScriptForCopy = (vs: GeneratedResources['videoScript']): string => {
    let text = `Titre: ${vs.title}\nVerbe d'action: ${vs.actionVerb}\n\n`;
    vs.scenes.forEach(scene => {
        text += `--- Scène ${scene.sceneNumber} ---\n`;
        text += `Visuel: ${scene.visuals}\n`;
        text += `Narration: ${scene.narration}\n\n`;
    });
    text += formatFurtherReadingForCopy(vs.furtherReading);
    return text;
};
const formatActivityForCopy = (act: GeneratedResources['collaborativeActivity']): string => {
    let text = `${act.title}\nVerbe d'action: ${act.actionVerb}\n\n`;
    text += `Objectif: ${act.objective}\n\n`;
    text += `Instructions:\n${act.instructions}\n\n`;
    text += `Durée: ${act.duration}`;
    text += formatFurtherReadingForCopy(act.furtherReading);
    return text;
}
const formatEvaluationForCopy = (evalData: GeneratedResources['evaluation']): string => {
    let text = `${evalData.title} (${evalData.evaluationType})\nVerbe d'action: ${evalData.actionVerb}\n\n`;
    text += `Instructions:\n${evalData.instructions}\n\n`;
    evalData.questions.forEach((q, index) => {
        text += `--- Question ${index + 1} (${q.questionType}) ---\n`;
        text += `${q.questionText}\n`;
        if (q.questionType === 'QCM' && q.options) {
            q.options.forEach(opt => text += `  - [ ] ${opt}\n`);
        }
        if (q.correctAnswer) {
            text += `Réponse attendue: ${q.correctAnswer}\n`;
        }
        if (q.explanation) {
            text += `Explication: ${q.explanation}\n`;
        }
        text += `\n`;
    });
    text += formatFurtherReadingForCopy(evalData.furtherReading);
    return text;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ resources, isLoading, generatingType, error, onGenerate, onGenerateImage, infographicImage }) => {
  const [activeTab, setActiveTab] = useState<ResourceKey>('quiz');

  const tabs: { id: ResourceKey; label: string }[] = [
    { id: 'quiz', label: 'Quiz' },
    { id: 'caseStudy', label: 'Cas Pratique' },
    { id: 'infographic', label: 'Infographie' },
    { id: 'videoScript', label: 'Script Vidéo' },
    { id: 'collaborativeActivity', label: 'Activité Collab.' },
    { id: 'evaluation', label: 'Évaluation' },
  ];

  const renderContent = () => {
    const resource = resources[activeTab];
    const isCurrentLoading = isLoading && generatingType === activeTab;
    
    if (isCurrentLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-10 min-h-[300px]">
          <LoaderIcon className="w-12 h-12 text-cyan-400 animate-spin" />
          <p className="mt-4 text-lg text-gray-300">Génération en cours...</p>
        </div>
      );
    }

    if (!resource) {
      return (
        <div className="flex flex-col items-center justify-center p-10 min-h-[300px]">
          <SparklesIcon className="w-12 h-12 text-gray-600" />
          <p className="mt-4 text-lg text-gray-500">Cliquez ci-dessous pour générer cette ressource.</p>
          <button
            onClick={() => onGenerate(activeTab)}
            disabled={isLoading}
            className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600"
          >
            Générer {tabs.find(t=>t.id === activeTab)?.label}
          </button>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'quiz': return <QuizContent quiz={resource as GeneratedResources['quiz']} />;
      case 'caseStudy': return <CaseStudyContent caseStudy={resource as GeneratedResources['caseStudy']} />;
      case 'infographic': return <InfographicContent infographic={resource as GeneratedResources['infographic']} onGenerateImage={onGenerateImage} isLoadingImage={isLoading && generatingType === 'image'} infographicImage={infographicImage} />;
      case 'videoScript': return <VideoScriptContent videoScript={resource as GeneratedResources['videoScript']} />;
      case 'collaborativeActivity': return <CollaborativeActivityContent activity={resource as GeneratedResources['collaborativeActivity']} />;
      case 'evaluation': return <EvaluationContent evaluation={resource as GeneratedResources['evaluation']} />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
             <h2 className="text-lg font-medium text-cyan-300">
                3. Explorez et générez vos ressources
            </h2>
        </div>
      <div className="border-b border-gray-700 flex-shrink-0">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto p-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border-transparent'} whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm rounded-t-md transition-colors focus:outline-none`}
            >
              {tab.label} {resources[tab.id] ? '✅' : '—'}
            </button>
          ))}
        </nav>
      </div>
      {error && (
        <div className="m-4 p-4 bg-red-900/20 border border-red-500 text-red-300 rounded-lg">
          <h3 className="font-bold">Erreur de génération</h3>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}
      <div className="p-6 overflow-y-auto flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

// Reusable components for displaying results
const FurtherReadingComponent: React.FC<{ furtherReading: PedagogyMetadata['furtherReading'] }> = ({ furtherReading }) => (
    <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Pour aller plus loin</h4>
        {furtherReading.bibliography && furtherReading.bibliography.length > 0 && (
            <div>
                <h5 className="font-semibold text-gray-400">Bibliographie (Format APA)</h5>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-400">
                    {furtherReading.bibliography.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        )}
        {furtherReading.applicationIdeas && furtherReading.applicationIdeas.length > 0 && (
            <div className="mt-4">
                <h5 className="font-semibold text-gray-400">Pistes d'application</h5>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-400">
                    {furtherReading.applicationIdeas.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        )}
    </div>
);

const ResourceWrapper: React.FC<{ title: string; actionVerb: string; textToCopy: string; data: any; children: React.ReactNode }> = ({ title, actionVerb, textToCopy, data, children }) => {
    const downloadFile = (content: string, filename: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadJson = () => downloadFile(JSON.stringify(data, null, 2), `${title.toLowerCase().replace(/ /g, '_')}.json`, 'application/json');
    const downloadTxt = () => downloadFile(textToCopy, `${title.toLowerCase().replace(/ /g, '_')}.txt`, 'text/plain;charset=utf-8');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-cyan-400">{title}</h3>
                    <p className="text-sm text-cyan-300 font-medium">Verbe d'action : <span className="font-semibold">{actionVerb}</span></p>
                </div>
                <CopyButton textToCopy={textToCopy} />
            </div>
            
            {children}
            
            <FurtherReadingComponent furtherReading={data.furtherReading} />
            
            <div className="mt-8 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Options d'export</h4>
                <div className="flex flex-wrap gap-2">
                    <ExportButton label="JSON" icon={<FileJsonIcon />} onClick={downloadJson} />
                    <ExportButton label="TXT" icon={<FileTextIcon />} onClick={downloadTxt} />
                    <ExportButton label="PDF" icon={<FileTextIcon />} onClick={() => {}} disabled tooltip="Prochainement" />
                    <ExportButton label="DOCX" icon={<FileTextIcon />} onClick={() => {}} disabled tooltip="Prochainement" />
                    <ExportButton label="SCORM 1.2" icon={<FileArchiveIcon />} onClick={() => {}} disabled tooltip="Fonctionnalité avancée, prochainement" />
                    <ExportButton label="H5P" icon={<FileArchiveIcon />} onClick={() => {}} disabled tooltip="Fonctionnalité avancée, prochainement" />
                </div>
            </div>
        </div>
    );
}

const QuizContent: React.FC<{ quiz: GeneratedResources['quiz'] }> = ({ quiz }) => (
    <ResourceWrapper title={quiz.title} actionVerb={quiz.actionVerb} textToCopy={formatQuizForCopy(quiz)} data={quiz}>
        <div className="space-y-4">
            {quiz.questions.map((q, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="font-semibold text-gray-300">Question {index + 1}: {q.questionText}</p>
                    <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                            <li key={i} className={`pl-4 pr-2 py-1 rounded ${i === q.correctAnswerIndex ? 'bg-green-900/40 text-green-300' : 'text-gray-400'}`}>
                                {opt}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-sm text-gray-500 border-t border-gray-700 pt-2">
                        <span className="font-semibold text-gray-400">Explication :</span> {q.explanation}
                    </p>
                </div>
            ))}
        </div>
    </ResourceWrapper>
);
const CaseStudyContent: React.FC<{ caseStudy: GeneratedResources['caseStudy'] }> = ({ caseStudy }) => (
    <ResourceWrapper title={caseStudy.title} actionVerb={caseStudy.actionVerb} textToCopy={formatCaseStudyForCopy(caseStudy)} data={caseStudy}>
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-gray-300">Scénario</h4>
            <p className="mt-2 whitespace-pre-wrap">{caseStudy.scenario}</p>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-gray-300">Questions de réflexion</h4>
            <ul className="mt-2 list-disc list-inside space-y-1">{caseStudy.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </div>
    </ResourceWrapper>
);
const InfographicContent: React.FC<{ infographic: GeneratedResources['infographic'], onGenerateImage: () => void, isLoadingImage: boolean, infographicImage: string | null }> = ({ infographic, onGenerateImage, isLoadingImage, infographicImage }) => (
    <ResourceWrapper title={infographic.title} actionVerb={infographic.actionVerb} textToCopy={formatInfographicForCopy(infographic)} data={infographic}>
        <div className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-cyan-500">
            {infographic.sections.map((section, i) => (
                <div key={i} className={i > 0 ? "mt-4" : ""}>
                    <h4 className="text-lg font-semibold text-gray-200">{section.header}</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-gray-300">{section.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
            ))}
        </div>
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="text-md font-semibold text-gray-300 mb-3">Visuel de l'infographie</h4>
            {isLoadingImage ? (
                 <div className="flex items-center justify-center p-4"><LoaderIcon className="w-8 h-8 text-cyan-400 animate-spin" /></div>
            ) : infographicImage ? (
                <img src={`data:image/png;base64,${infographicImage}`} alt="Infographie générée" className="rounded-lg w-full" />
            ) : (
                <p className="text-sm text-gray-400">Générez une proposition visuelle pour cette infographie.</p>
            )}
             <button onClick={onGenerateImage} disabled={isLoadingImage} className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600">
                <ImageIcon className="w-4 h-4 mr-2" />
                {isLoadingImage ? "Génération..." : (infographicImage ? "Régénérer le visuel" : "Générer le visuel")}
            </button>
        </div>
    </ResourceWrapper>
);
const VideoScriptContent: React.FC<{ videoScript: GeneratedResources['videoScript'] }> = ({ videoScript }) => (
    <ResourceWrapper title={videoScript.title} actionVerb={videoScript.actionVerb} textToCopy={formatVideoScriptForCopy(videoScript)} data={videoScript}>
        <div className="space-y-4">
            {videoScript.scenes.map(scene => (
                <div key={scene.sceneNumber} className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-cyan-500">
                    <h4 className="text-lg font-semibold text-gray-200">Scène {scene.sceneNumber}</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-400">Visuels :</p>
                            <p className="text-gray-300">{scene.visuals}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-400">Narration :</p>
                            <p className="text-gray-300 whitespace-pre-wrap">{scene.narration}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ResourceWrapper>
);
const CollaborativeActivityContent: React.FC<{ activity: GeneratedResources['collaborativeActivity'] }> = ({ activity }) => (
    <ResourceWrapper title={activity.title} actionVerb={activity.actionVerb} textToCopy={formatActivityForCopy(activity)} data={activity}>
        <div className="space-y-4">
             <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-300">Objectif Pédagogique</h4>
                <p className="mt-2 whitespace-pre-wrap">{activity.objective}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-300">Instructions</h4>
                <p className="mt-2 whitespace-pre-wrap">{activity.instructions}</p>
            </div>
             <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-300">Durée Estimée</h4>
                <p className="mt-2">{activity.duration}</p>
            </div>
        </div>
    </ResourceWrapper>
);

const EvaluationContent: React.FC<{ evaluation: GeneratedResources['evaluation'] }> = ({ evaluation }) => (
    <ResourceWrapper title={evaluation.title} actionVerb={evaluation.actionVerb} textToCopy={formatEvaluationForCopy(evaluation)} data={evaluation}>
        <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-300">Type d'évaluation</h4>
                <p className="mt-1">{evaluation.evaluationType}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-300">Instructions</h4>
                <p className="mt-2 whitespace-pre-wrap">{evaluation.instructions}</p>
            </div>
            {evaluation.questions.map((q, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="font-semibold text-gray-300">Question {index + 1} <span className="text-xs font-mono bg-gray-700 px-1.5 py-0.5 rounded">{q.questionType}</span></p>
                    <p className="mt-2">{q.questionText}</p>
                    {q.questionType === 'QCM' && q.options && (
                        <ul className="mt-2 space-y-1 text-gray-400">
                            {q.options.map((opt, i) => <li key={i} className="pl-4">{opt}</li>)}
                        </ul>
                    )}
                    {(q.correctAnswer || q.explanation) && (
                         <p className="mt-3 text-sm text-gray-500 border-t border-gray-700 pt-2">
                            {q.correctAnswer && <span className="block"><span className="font-semibold text-gray-400">Réponse attendue :</span> {q.correctAnswer}</span>}
                            {q.explanation && <span className="block mt-1"><span className="font-semibold text-gray-400">Explication :</span> {q.explanation}</span>}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </ResourceWrapper>
);


export default ResultsDisplay;