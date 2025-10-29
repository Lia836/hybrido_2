import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GenerationConfig, GeneratedResources, ResourceKey } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SCHEMAS: { [key in ResourceKey]: any } = {
  quiz: {
    type: Type.OBJECT,
    description: "Quiz interactif avec questions à choix multiples, réponses et explications.",
    properties: {
      title: { type: Type.STRING, description: "Titre du quiz" },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "Le texte de la question" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Un tableau de 4 options de réponse" },
            correctAnswerIndex: { type: Type.INTEGER, description: "L'index de la bonne réponse dans le tableau d'options (0-3)" },
            explanation: { type: Type.STRING, description: "Une brève explication de la bonne réponse" },
          },
          required: ["questionText", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
    required: ["title", "questions"],
  },
  caseStudy: {
    type: Type.OBJECT,
    description: "Cas pratique basé sur le contenu source, avec un scénario et des questions de réflexion.",
    properties: {
      title: { type: Type.STRING, description: "Titre du cas pratique" },
      scenario: { type: Type.STRING, description: "Le scénario détaillé du cas pratique" },
      questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Un tableau de questions pour guider la réflexion de l'apprenant" },
    },
    required: ["title", "scenario", "questions"],
  },
  infographic: {
    type: Type.OBJECT,
    description: "Contenu textuel structuré pour une infographie, résumant les points clés.",
    properties: {
      title: { type: Type.STRING, description: "Titre de l'infographie" },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            header: { type: Type.STRING, description: "Titre de la section" },
            points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste des points clés pour cette section" }
          },
          required: ["header", "points"],
        }
      }
    },
    required: ["title", "sections"],
  },
  videoScript: {
    type: Type.OBJECT,
    description: "Script pour une courte vidéo explicative, découpé en scènes.",
    properties: {
      title: { type: Type.STRING, description: "Titre de la vidéo" },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sceneNumber: { type: Type.INTEGER, description: "Numéro de la scène" },
            visuals: { type: Type.STRING, description: "Description des éléments visuels à afficher" },
            narration: { type: Type.STRING, description: "Texte de la narration pour la scène" },
          },
          required: ["sceneNumber", "visuals", "narration"],
        },
      },
    },
    required: ["title", "scenes"],
  },
  collaborativeActivity: {
    type: Type.OBJECT,
    description: "Activité collaborative pour les apprenants, avec objectif et instructions.",
    properties: {
      title: { type: Type.STRING, description: "Titre de l'activité" },
      objective: { type: Type.STRING, description: "L'objectif pédagogique de l'activité" },
      instructions: { type: Type.STRING, description: "Les instructions détaillées pour mener l'activité" },
      duration: { type: Type.STRING, description: "Durée estimée de l'activité (ex: '25 minutes')" },
    },
    required: ["title", "objective", "instructions", "duration"],
  },
};

const getResourcePromptName = (resourceKey: ResourceKey): string => {
    switch(resourceKey) {
        case 'quiz': return 'Un quiz interactif';
        case 'caseStudy': return 'Un cas pratique';
        case 'infographic': return 'Le contenu textuel pour une infographie';
        case 'videoScript': return 'Un script de vidéo courte';
        case 'collaborativeActivity': return 'Une activité collaborative';
    }
}

export const generateSingleResource = async (
  resourceType: ResourceKey,
  config: GenerationConfig
): Promise<GeneratedResources[ResourceKey]> => {
  const prompt = `
    RÈGLES STRICTES :
    1.  RIGUEUR SCIENTIFIQUE : Le contenu généré doit être factuellement exact et fidèle au contenu source.
    2.  TRANSPOSITION DIDACTIQUE : Adapte la complexité et le langage en fonction des paramètres fournis.
    3.  FORMAT DE SORTIE : Tu dois impérativement retourner une réponse au format JSON qui respecte le schéma fourni pour le type de ressource demandé. Ne retourne rien d'autre.

    CONTEXTE DE LA TÂCHE :
    - Contenu source à transformer : """${config.sourceContent}"""
    - Public cible : "${config.targetAudience}"
    - Niveau de la taxonomie de Bloom visé : "${config.bloomLevel}"
    - Durée de la ressource : "${config.duration}"
    - Style de communication : "${config.style}"
    - Ton à employer : "${config.tone}"
    - Niveau linguistique attendu : "${config.languageLevel}"
    - Type de feedback à intégrer (si applicable, pour le quiz par ex.) : "${config.feedbackType}"

    TA MISSION :
    À partir du contenu source et des contraintes ci-dessus, génère la ressource pédagogique suivante : ${getResourcePromptName(resourceType)}.

    Génère maintenant le JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: config.systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCHEMAS[resourceType],
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeneratedResources[ResourceKey];
  } catch (error) {
    console.error("Error calling Gemini API for resource generation:", error);
    if (error instanceof Error) {
        throw new Error(`Erreur de l'API Gemini : ${error.message}`);
    }
    throw new Error("Une erreur inconnue est survenue lors de la génération de la ressource.");
  }
};


export const generateInfographicImage = async (infographicData: GeneratedResources['infographic']): Promise<string> => {
    const prompt = `Crée une infographie visuellement attrayante et claire basée sur le contenu suivant. Utilise des icônes simples, une typographie lisible et une palette de couleurs harmonieuse.
    Titre: ${infographicData.title}
    ${infographicData.sections.map(s => `Section "${s.header}":\n- ${s.points.join('\n- ')}`).join('\n\n')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("Aucune image n'a été générée par l'API.");

    } catch (error) {
        console.error("Error calling Gemini API for image generation:", error);
        if (error instanceof Error) {
            throw new Error(`Erreur de l'API Gemini (Image) : ${error.message}`);
        }
        throw new Error("Une erreur inconnue est survenue lors de la génération de l'image.");
    }
};