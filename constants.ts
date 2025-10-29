import { BloomLevel, TargetAudience, Duration, Style, Tone, LanguageLevel, FeedbackType } from "./types";

export const BLOOM_LEVELS: BloomLevel[] = [
  BloomLevel.Remember,
  BloomLevel.Understand,
  BloomLevel.Apply,
  BloomLevel.Analyze,
  BloomLevel.Evaluate,
  BloomLevel.Create,
];

export const TARGET_AUDIENCES: TargetAudience[] = [
    TargetAudience.Children,
    TargetAudience.Teenagers,
    TargetAudience.Adults,
    TargetAudience.Professionals,
];

export const DURATIONS: Duration[] = [
    Duration.VeryShort,
    Duration.Short,
    Duration.Medium,
    Duration.Long,
];

export const STYLES: Style[] = [
    Style.Formal,
    Style.Informal,
    Style.Academic,
    Style.Playful,
];

export const TONES: Tone[] = [
    Tone.Neutral,
    Tone.Encouraging,
    Tone.Serious,
    Tone.Humorous,
];

export const LANGUAGE_LEVELS: LanguageLevel[] = [
    LanguageLevel.Simple,
    LanguageLevel.Intermediate,
    LanguageLevel.Advanced,
];

export const FEEDBACK_TYPES: FeedbackType[] = [
    FeedbackType.Corrective,
    FeedbackType.Explanatory,
    FeedbackType.Encouraging,
];

export const DEFAULT_SYSTEM_INSTRUCTION = `Tu es un expert en ingénierie pédagogique et un concepteur de contenu e-learning, travaillant sur un outil appelé Hybrido.
Ta mission est de transformer un contenu source en une ressource pédagogique spécifique, en respectant scrupuleusement les paramètres fournis.`;