import React, { useState } from 'react';
import Header from './components/Header';
import ContentInput from './components/ContentInput';
import ConfigPanel from './components/ConfigPanel';
import ResultsDisplay from './components/ResultsDisplay';
import { BloomLevel, GeneratedResources, TargetAudience, Duration, Style, Tone, LanguageLevel, FeedbackType, ResourceKey, GenerationConfig } from './types';
import { generateSingleResource, generateInfographicImage } from './services/geminiService';
import { SparklesIcon, LoaderIcon } from './components/icons';
import { DEFAULT_SYSTEM_INSTRUCTION } from './constants';

const App: React.FC = () => {
  // State for inputs and configurations
  const [sourceContent, setSourceContent] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(DEFAULT_SYSTEM_INSTRUCTION);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(TargetAudience.Adults);
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>(BloomLevel.Understand);
  const [duration, setDuration] = useState<Duration>(Duration.Short);
  const [style, setStyle] = useState<Style>(Style.Formal);
  const [tone, setTone] = useState<Tone>(Tone.Neutral);
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>(LanguageLevel.Intermediate);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.Explanatory);
  
  // State for generation process and results
  const [generatedResources, setGeneratedResources] = useState<Partial<GeneratedResources>>({});
  const [infographicImage, setInfographicImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [generatingType, setGeneratingType] = useState<ResourceKey | 'image' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfigReady = sourceContent.trim() !== '';

  const handleGenerateResource = async (resourceType: ResourceKey) => {
    if (!isConfigReady) {
      setError("Veuillez fournir un contenu source.");
      return;
    }
    setIsLoading(true);
    setGeneratingType(resourceType);
    setError(null);

    const config: GenerationConfig = { sourceContent, targetAudience, bloomLevel, duration, style, tone, languageLevel, feedbackType, systemInstruction };
    
    try {
      const resource = await generateSingleResource(resourceType, config);
      setGeneratedResources(prev => ({ ...prev, [resourceType]: resource }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setIsLoading(false);
      setGeneratingType(null);
    }
  };

  const handleGenerateInfographicImage = async () => {
      if (!generatedResources.infographic) {
          setError("Veuillez d'abord générer le contenu textuel de l'infographie.");
          return;
      }
      setIsLoading(true);
      setGeneratingType('image');
      setError(null);
      try {
          const base64Image = await generateInfographicImage(generatedResources.infographic);
          setInfographicImage(base64Image);
      } catch (err) {
          setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      } finally {
          setIsLoading(false);
          setGeneratingType(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column: Input and Config */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg space-y-6 relative">
              {isLoadingText && (
                <div className="absolute inset-0 bg-gray-900/70 flex flex-col items-center justify-center z-10 rounded-lg">
                    <LoaderIcon className="w-8 h-8 animate-spin text-cyan-400" />
                    <p className="mt-2 text-gray-300">Extraction du texte...</p>
                </div>
              )}
              <ContentInput content={sourceContent} setContent={setSourceContent} setIsLoadingText={setIsLoadingText} />
              <ConfigPanel 
                systemInstruction={systemInstruction} setSystemInstruction={setSystemInstruction}
                targetAudience={targetAudience} setTargetAudience={setTargetAudience}
                bloomLevel={bloomLevel} setBloomLevel={setBloomLevel}
                duration={duration} setDuration={setDuration}
                style={style} setStyle={setStyle}
                tone={tone} setTone={setTone}
                languageLevel={languageLevel} setLanguageLevel={setLanguageLevel}
                feedbackType={feedbackType} setFeedbackType={setFeedbackType}
              />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:max-h-[calc(100vh-120px)]">
             <ResultsDisplay 
              resources={generatedResources}
              isLoading={isLoading}
              generatingType={generatingType}
              error={error}
              onGenerate={handleGenerateResource}
              onGenerateImage={handleGenerateInfographicImage}
              infographicImage={infographicImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;