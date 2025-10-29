import React from 'react';
import { BloomLevel, TargetAudience, Duration, Style, Tone, LanguageLevel, FeedbackType } from '../types';
import { BLOOM_LEVELS, TARGET_AUDIENCES, DURATIONS, STYLES, TONES, LANGUAGE_LEVELS, FEEDBACK_TYPES } from '../constants';

interface ConfigPanelProps {
  systemInstruction: string;
  setSystemInstruction: (instruction: string) => void;
  targetAudience: TargetAudience;
  setTargetAudience: (audience: TargetAudience) => void;
  bloomLevel: BloomLevel;
  setBloomLevel: (level: BloomLevel) => void;
  duration: Duration;
  setDuration: (duration: Duration) => void;
  style: Style;
  setStyle: (style: Style) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  languageLevel: LanguageLevel;
  setLanguageLevel: (level: LanguageLevel) => void;
  feedbackType: FeedbackType;
  setFeedbackType: (type: FeedbackType) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = (props) => {
  const {
    systemInstruction, setSystemInstruction,
    targetAudience, setTargetAudience,
    bloomLevel, setBloomLevel,
    duration, setDuration,
    style, setStyle,
    tone, setTone,
    languageLevel, setLanguageLevel,
    feedbackType, setFeedbackType
  } = props;

  return (
    <div className="space-y-6">
       <h2 className="text-lg font-medium text-cyan-300">
        2. Configurez la génération
      </h2>
      
      <div>
        <label htmlFor="system-instruction" className="block text-sm font-medium text-gray-300">
          Instructions système (Assistant IA)
        </label>
        <textarea
          id="system-instruction"
          rows={3}
          className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm resize-y"
          value={systemInstruction}
          onChange={(e) => setSystemInstruction(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <ConfigSelect label="Public Cible" value={targetAudience} onChange={e => setTargetAudience(e.target.value as TargetAudience)} options={TARGET_AUDIENCES} />
        <ConfigSelect label="Niveau de Bloom" value={bloomLevel} onChange={e => setBloomLevel(e.target.value as BloomLevel)} options={BLOOM_LEVELS} />

        {/* Row 2 */}
        <ConfigSelect label="Durée / Longueur" value={duration} onChange={e => setDuration(e.target.value as Duration)} options={DURATIONS} />
        <ConfigSelect label="Niveau linguistique" value={languageLevel} onChange={e => setLanguageLevel(e.target.value as LanguageLevel)} options={LANGUAGE_LEVELS} />

        {/* Row 3 */}
        <ConfigSelect label="Style" value={style} onChange={e => setStyle(e.target.value as Style)} options={STYLES} />
        <ConfigSelect label="Ton" value={tone} onChange={e => setTone(e.target.value as Tone)} options={TONES} />
        
        {/* Row 4 */}
        <ConfigSelect label="Type de feedback" value={feedbackType} onChange={e => setFeedbackType(e.target.value as FeedbackType)} options={FEEDBACK_TYPES} />
      </div>
    </div>
  );
};

// Reusable Select Component
const ConfigSelect: React.FC<{label: string, value: string, onChange: React.ChangeEventHandler<HTMLSelectElement>, options: readonly string[]}> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
        </label>
        <select
            className="block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={value}
            onChange={onChange}
        >
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default ConfigPanel;