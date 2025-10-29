export enum BloomLevel {
  Remember = "Se souvenir",
  Understand = "Comprendre",
  Apply = "Appliquer",
  Analyze = "Analyser",
  Evaluate = "Évaluer",
  Create = "Créer",
}

export enum TargetAudience {
    Children = "Enfants (6-11 ans)",
    Teenagers = "Adolescents (12-17 ans)",
    Adults = "Adultes",
    Professionals = "Professionnels / Experts",
}

export enum Duration {
    VeryShort = "Très courte (< 5 min)",
    Short = "Courte (5-15 min)",
    Medium = "Moyenne (15-30 min)",
    Long = "Longue (> 30 min)",
}

export enum Style {
    Formal = "Formel",
    Informal = "Informel",
    Academic = "Académique",
    Playful = "Ludique",
}

export enum Tone {
    Neutral = "Neutre",
    Encouraging = "Encourageant",
    Serious = "Sérieux",
    Humorous = "Humoristique",
}

export enum LanguageLevel {
    Simple = "Simple (A2)",
    Intermediate = "Intermédiaire (B2)",
    Advanced = "Avancé (C1)",
}

export enum FeedbackType {
    Corrective = "Correctif (juste/faux)",
    Explanatory = "Explicatif (pourquoi c'est juste/faux)",
    Encouraging = "Encourageant (axé sur la progression)",
}


export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface CaseStudy {
  title: string;
  scenario: string;
  questions: string[];
}

export interface InfographicSection {
    header: string;
    points: string[];
}

export interface Infographic {
  title: string;
  sections: InfographicSection[];
}

export interface VideoScene {
  sceneNumber: number;
  visuals: string;
  narration: string;
}

export interface VideoScript {
  title: string;
  scenes: VideoScene[];
}

export interface CollaborativeActivity {
  title: string;
  objective: string;
  instructions: string;
  duration: string;
}

export interface GeneratedResources {
  quiz: Quiz;
  caseStudy: CaseStudy;
  infographic: Infographic;
  videoScript: VideoScript;
  collaborativeActivity: CollaborativeActivity;
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