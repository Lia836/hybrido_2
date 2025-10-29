export enum BloomLevel {
  Remember = "Se souvenir",
  Understand = "Comprendre",
  Apply = "Appliquer",
  Analyze = "Analyser",
  Evaluate = "Évaluer",
  Create = "Créer",
}

export enum TargetAudience {
    None = "Sans",
    Children = "Enfants (6-11 ans)",
    Teenagers = "Adolescents (12-17 ans)",
    Adults = "Adultes",
    Professionals = "Professionnels / Experts",
}

export enum Duration {
    None = "Sans",
    VeryShort = "Très courte (< 5 min)",
    Short = "Courte (5-15 min)",
    Medium = "Moyenne (15-30 min)",
    Long = "Longue (> 30 min)",
}

export enum Style {
    None = "Sans",
    Formal = "Formel",
    Informal = "Informel",
    Academic = "Académique",
    Playful = "Ludique",
}

export enum Tone {
    None = "Sans",
    Neutral = "Neutre",
    Encouraging = "Encourageant",
    Serious = "Sérieux",
    Humorous = "Humoristique",
}

export enum LanguageLevel {
    None = "Sans",
    Simple = "Simple (A2)",
    Intermediate = "Intermédiaire (B2)",
    Advanced = "Avancé (C1)",
}

export enum FeedbackType {
    None = "Sans",
    Corrective = "Correctif (juste/faux)",
    Explanatory = "Explicatif (pourquoi c'est juste/faux)",
    Encouraging = "Encourageant (axé sur la progression)",
}

export interface PedagogyMetadata {
  actionVerb: string;
  furtherReading: {
    bibliography: string[];
    applicationIdeas: string[];
  };
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz extends PedagogyMetadata {
  title: string;
  questions: QuizQuestion[];
}

export interface CaseStudy extends PedagogyMetadata {
  title: string;
  scenario: string;
  questions: string[];
}

export interface InfographicSection {
    header: string;
    points: string[];
}

export interface Infographic extends PedagogyMetadata {
  title: string;
  sections: InfographicSection[];
}

export interface VideoScene {
  sceneNumber: number;
  visuals: string;
  narration: string;
}

export interface VideoScript extends PedagogyMetadata {
  title: string;
  scenes: VideoScene[];
}

export interface CollaborativeActivity extends PedagogyMetadata {
  title: string;
  objective: string;
  instructions: string;
  duration: string;
}

export type EvaluationQuestionType = 'QCM' | 'Ouverte' | 'Vrai/Faux';

export interface EvaluationQuestion {
    questionText: string;
    questionType: EvaluationQuestionType;
    options?: string[];
    correctAnswer?: string; // Pour Vrai/Faux ou QCM (texte de la réponse)
    explanation?: string;
}

export interface Evaluation extends PedagogyMetadata {
    title: string;
    evaluationType: 'Initiale' | 'Formative' | 'Sommative';
    instructions: string;
    questions: EvaluationQuestion[];
}

export interface GeneratedResources {
  quiz: Quiz;
  caseStudy: CaseStudy;
  infographic: Infographic;
  videoScript: VideoScript;
  collaborativeActivity: CollaborativeActivity;
  evaluation: Evaluation;
}

export type ResourceKey = keyof GeneratedResources;

export interface GenerationConfig {
    sourceContent: string;
    targetAudience: TargetAudience;
    bloomLevel: BloomLevel;
    duration: Duration;
    style: Style;
    tone: Tone;
    languageLevel: LanguageLevel;
    feedbackType: FeedbackType;
    systemInstruction: string;
}

declare global {
    interface Window {
        pdfjsLib: any;
        jspdf: any;
        docx: any;
        JSZip: any;
    }
}