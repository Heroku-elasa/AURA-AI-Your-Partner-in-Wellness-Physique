import { GoogleGenAI, Type, Modality } from "@google/genai";
import {
    Language,
    SymptomDetails,
    ComprehensiveBeautyResult,
    ComprehensiveFitnessResult,
    ProviderSearchResult,
    SearchResultItem,
    SiteAnalyticsData,
    PostureAnalysisResult,
    MarketAnalysisMode,
    TreatmentPlan,
    AftercareInstructions,
    CostAnalysisResult,
    PreTreatmentPlanResult,
    SearchTrend,
    Message,
    TrainingScenario,
    Difficulty,
    ConversationAnalysis,
    PathSuggestion,
    ProductRecommendation,
    HighlightShape,
    SpecialistProfile,
    BaristaStyleResult
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const handleGeminiError = (error: unknown, context: string): string => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
            return "API Quota Exceeded. Please check billing.";
        }
        return error.message;
    }
    return `Error in ${context}. Please try again.`;
};

export const generateComprehensiveBeautyAnalysis = async (
    symptoms: string,
    details: SymptomDetails,
    imageBase64: string | null,
    mimeType: string | null,
    language: Language
): Promise<ComprehensiveBeautyResult> => {
    const parts: any[] = [];

    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: mimeType
            }
        });
    }

    const promptText = `
    You are a professional dermatologist and beauty consultant AI.
    Analyze the user's skin condition${imageBase64 ? " based on the provided image and description" : " based on the description"}.

    User Description: "${symptoms}"
    Additional Details:
    - Aggravating Factors: ${details.aggravatingFactors}
    - Alleviating Factors: ${details.alleviatingFactors}
    - Duration: ${details.duration}
    - Previous Treatments: ${details.previousTreatments}
    - Medications: ${details.medications}

    Provide a comprehensive analysis.
    IMPORTANT: The response must be in ${language}.
    `;

    parts.push({ text: promptText });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                   type: Type.OBJECT,
                   properties: {
                       skinAnalysis: {
                           type: Type.OBJECT,
                           properties: {
                               skinType: { type: Type.STRING },
                               skinDescription: { type: Type.STRING },
                               keyCharacteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
                               recommendedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                               ingredientsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
                               actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                           },
                           required: ['skinType', 'skinDescription', 'keyCharacteristics', 'recommendedIngredients', 'ingredientsToAvoid', 'actionableSuggestions']
                       },
                       healthConsultation: {
                           type: Type.OBJECT,
                           properties: {
                               disclaimer: { type: Type.STRING },
                               recommendedSpecialists: { type: Type.ARRAY, items: { type: Type.STRING } },
                               identifiedConditions: {
                                   type: Type.ARRAY,
                                   items: {
                                       type: Type.OBJECT,
                                       properties: {
                                           name: { type: Type.STRING },
                                           description: { type: Type.STRING },
                                           relevance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                                           suggestedStep: { type: Type.STRING }
                                       },
                                       required: ['name', 'description', 'relevance', 'suggestedStep']
                                   }
                               },
                               lifestyleAdvice: { type: Type.STRING },
                               treatmentSuggestions: {
                                   type: Type.ARRAY,
                                   items: {
                                       type: Type.OBJECT,
                                       properties: {
                                           icon: { type: Type.STRING },
                                           title: { type: Type.STRING },
                                           description: { type: Type.STRING }
                                       },
                                       required: ['icon', 'title', 'description']
                                   }
                               },
                               followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                           },
                           required: ['disclaimer', 'recommendedSpecialists', 'identifiedConditions', 'lifestyleAdvice', 'treatmentSuggestions', 'followUpQuestions']
                       },
                       makeupStyle: {
                           type: Type.OBJECT,
                           properties: {
                               styleName: { type: Type.STRING },
                               description: { type: Type.STRING },
                               keyProducts: { type: Type.ARRAY, items: { type: Type.STRING } }
                           },
                           required: ['styleName', 'description', 'keyProducts']
                       },
                       homemadeMask: {
                           type: Type.OBJECT,
                           properties: {
                               maskName: { type: Type.STRING },
                               description: { type: Type.STRING },
                               ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                               instructions: { type: Type.STRING }
                           },
                           required: ['maskName', 'description', 'ingredients', 'instructions']
                       }
                   },
                   required: ['skinAnalysis', 'healthConsultation', 'makeupStyle', 'homemadeMask']
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'generateComprehensiveBeautyAnalysis');
    }
};

export const performSemanticSearch = async (query: string, searchIndex: string, language: Language): Promise<SearchResultItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Given the following site index: ${searchIndex}.
            User query: "${query}".
            Return a JSON array of the most relevant pages or services from the index.
            Limit to 5 results. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            targetPage: { type: Type.STRING }
                        },
                        required: ['title', 'description', 'targetPage']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        throw handleGeminiError(error, 'performSemanticSearch');
    }
};

export const findLocalProviders = async (query: string, searchType: string, location: { lat: number; lon: number } | null, language: Language): Promise<ProviderSearchResult[]> => {
    try {
        const prompt = location 
            ? `Find ${searchType} near latitude ${location.lat}, longitude ${location.lon}. Query: ${query}. Language: ${language}.`
            : `Find ${searchType}. Query: ${query}. Language: ${language}.`;

        const tools: any[] = location ? [{ googleMaps: {} }] : [{ googleSearch: {} }];
        const toolConfig = location ? { retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lon } } } : undefined;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: tools,
                toolConfig: toolConfig,
            }
        });

        // We need to extract results from groundingChunks or text.
        // Since responseSchema is not supported with tools, we ask Gemini to format the text response or parse it manually.
        // For simplicity in this demo, we'll parse a structured text response if possible, or rely on a secondary call to format it.
        // Here, we'll do a secondary call to structure the raw text/chunks.
        
        const rawText = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        // Second pass to format as JSON
        const formatResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Extract a list of providers from this text and grounding data.
            Text: ${rawText}
            Chunks: ${JSON.stringify(chunks)}
            
            Return a JSON array.
            Provider types: 'clinic', 'doctor', 'gym', 'coach'.
            `,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING },
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            address: { type: Type.STRING },
                            phone: { type: Type.STRING },
                            website: { type: Type.STRING },
                            distance: { type: Type.STRING },
                            services: { type: Type.ARRAY, items: { type: Type.STRING } },
                            specialty: { type: Type.STRING },
                        },
                        required: ['name', 'type', 'address']
                    }
                }
            }
        });

        return JSON.parse(formatResponse.text || "[]");

    } catch (error) {
        throw handleGeminiError(error, 'findLocalProviders');
    }
};

export const generateBaristaImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '3:4', // Approximating portrait
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        throw handleGeminiError(error, 'generateBaristaImage');
    }
};

export const generateBaristaMusicTheme = async (description: string, language: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest a music theme and playlist vibe for a cafe with this description: "${description}". Language: ${language}. Keep it concise.`,
        });
        return response.text || "";
    } catch (error) {
        throw handleGeminiError(error, 'generateBaristaMusicTheme');
    }
};

export const generateSiteAnalytics = async (language: Language): Promise<SiteAnalyticsData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate realistic mock site analytics data for a beauty/fitness platform. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        liveVisitors: { type: Type.NUMBER },
                        todayVisitors: { type: Type.NUMBER },
                        weeklyVisitors: { type: Type.NUMBER },
                        monthlyVisitors: { type: Type.NUMBER },
                        topCountries: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    country: { type: Type.STRING },
                                    visitors: { type: Type.NUMBER },
                                    flag: { type: Type.STRING }
                                },
                                required: ['country', 'visitors', 'flag']
                            }
                        },
                        trafficSources: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    source: { type: Type.STRING },
                                    percentage: { type: Type.NUMBER }
                                },
                                required: ['source', 'percentage']
                            }
                        },
                        deviceBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    device: { type: Type.STRING },
                                    percentage: { type: Type.NUMBER }
                                },
                                required: ['device', 'percentage']
                            }
                        },
                        topPages: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    path: { type: Type.STRING },
                                    views: { type: Type.NUMBER }
                                },
                                required: ['path', 'views']
                            }
                        }
                    },
                    required: ['liveVisitors', 'todayVisitors', 'weeklyVisitors', 'monthlyVisitors', 'topCountries', 'trafficSources', 'deviceBreakdown', 'topPages']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'generateSiteAnalytics');
    }
};

export const analyzePostureAndMovement = async (imageBase64: string, mimeType: string, analysisType: 'posture' | 'squat', language: Language): Promise<PostureAnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Analyze this ${analysisType} image. Provide observations and corrective exercises. Language: ${language}.` }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        keyObservations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    observation: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                                },
                                required: ['observation', 'description', 'severity']
                            }
                        },
                        correctiveExercises: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    sets: { type: Type.STRING },
                                    reps: { type: Type.STRING },
                                    rest: { type: Type.STRING }
                                },
                                required: ['name', 'description', 'sets', 'reps', 'rest']
                            }
                        }
                    },
                    required: ['summary', 'keyObservations', 'correctiveExercises']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'analyzePostureAndMovement');
    }
};

export const sendCoachMessage = async (history: Message[], language: Language, partner: any, scenario: any, difficulty: any): Promise<string> => {
    try {
        const systemInstruction = `You are a conversation coach playing the role of: ${JSON.stringify(partner)}. 
        Scenario: ${scenario ? JSON.stringify(scenario) : 'Free conversation'}.
        Difficulty: ${difficulty || 'Adaptive'}.
        Language: ${language}.
        Keep responses concise and natural.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history.map(msg => ({ role: msg.role, parts: msg.parts })),
            config: { systemInstruction }
        });
        return response.text || "";
    } catch (error) {
        throw handleGeminiError(error, 'sendCoachMessage');
    }
};

export const analyzeConversation = async (history: Message[], language: Language): Promise<ConversationAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: `Analyze this conversation history for social skills. Language: ${language}.` },
                ...history.map(m => ({ role: m.role, parts: m.parts }))
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scores: {
                            type: Type.OBJECT,
                            properties: {
                                rapport: { type: Type.NUMBER },
                                curiosity: { type: Type.NUMBER },
                                vulnerability: { type: Type.NUMBER },
                                confidence: { type: Type.NUMBER }
                            },
                            required: ['rapport', 'curiosity', 'vulnerability', 'confidence']
                        },
                        strengths: { type: Type.STRING },
                        areasForImprovement: { type: Type.STRING }
                    },
                    required: ['scores', 'strengths', 'areasForImprovement']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'analyzeConversation');
    }
};

export const suggestTrainingPaths = async (history: Message[], language: Language): Promise<PathSuggestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: `Suggest training paths based on this conversation. Available paths are: 'building-rapport', 'deepening-connection'. Language: ${language}.` },
                 ...history.map(m => ({ role: m.role, parts: m.parts }))
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pathId: { type: Type.STRING },
                            reasoning: { type: Type.STRING }
                        },
                        required: ['pathId', 'reasoning']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        throw handleGeminiError(error, 'suggestTrainingPaths');
    }
};

export const performLiveBeautification = async (imageBase64: string, mimeType: string, language: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: "Apply subtle beauty enhancements: smooth skin, adjust lighting, enhance eyes. Keep it natural." }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'performLiveBeautification');
    }
};

export const getBeautyRecommendations = async (imageBase64: string, mimeType: string, language: Language): Promise<ProductRecommendation[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Analyze facial features and suggest cosmetic products. Classify each into a category: 'Skincare', 'Makeup', 'Treatment', 'Tool', or 'Haircare'. Language: ${language}.` }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            link: { type: Type.STRING },
                            category: { type: Type.STRING, enum: ['Skincare', 'Makeup', 'Treatment', 'Tool', 'Haircare'] }
                        },
                        required: ['name', 'description', 'link', 'category']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        throw handleGeminiError(error, 'getBeautyRecommendations');
    }
};

export const generateSpecialists = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (error) {
        throw handleGeminiError(error, 'generateSpecialists');
    }
};

export const generateMarketAnalysis = async (query: string, language: Language, mode: MarketAnalysisMode): Promise<string> => {
    try {
        const prompt = `Analyze market trends for: ${query}. Mode: ${mode}. Language: ${language}.
        Format response as JSON with 'text' field containing Markdown, and 'sources' list.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // The response might not be strict JSON because of googleSearch tool, so we might need to parse carefully or rely on gemini to strictly output json string in text.
        // For better reliability with tools, we often get text.
        // We will ask for JSON structure in the prompt, but let's wrap it in a second call if needed or assume text is JSON.
        
        // Simple approach: return the text directly and let component handle parsing or errors.
        // But component expects JSON string with { text, sources }.
        
        const text = response.text || "";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web ? { uri: c.web.uri, title: c.web.title } : null).filter(Boolean) || [];
        
        return JSON.stringify({ text, sources });
        
    } catch (error) {
        throw handleGeminiError(error, 'generateMarketAnalysis');
    }
};

export const generateComprehensiveFitnessAnalysis = async (data: any, language: Language): Promise<ComprehensiveFitnessResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a fitness plan based on: ${JSON.stringify(data)}. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        physiqueAssessment: { type: Type.STRING },
                        generalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        workoutPlan: {
                            type: Type.OBJECT,
                            properties: {
                                split: { type: Type.STRING },
                                days: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            day: { type: Type.STRING },
                                            focus: { type: Type.STRING },
                                            exercises: {
                                                type: Type.ARRAY,
                                                items: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        name: { type: Type.STRING },
                                                        sets: { type: Type.STRING },
                                                        reps: { type: Type.STRING },
                                                        rest: { type: Type.STRING },
                                                        notes: { type: Type.STRING }
                                                    },
                                                    required: ['name', 'sets', 'reps', 'rest']
                                                }
                                            }
                                        },
                                        required: ['day', 'focus', 'exercises']
                                    }
                                }
                            },
                            required: ['split', 'days']
                        },
                        dietPlan: {
                            type: Type.OBJECT,
                            properties: {
                                dailyCalories: { type: Type.NUMBER },
                                macros: {
                                    type: Type.OBJECT,
                                    properties: {
                                        protein: { type: Type.NUMBER },
                                        carbs: { type: Type.NUMBER },
                                        fat: { type: Type.NUMBER }
                                    },
                                    required: ['protein', 'carbs', 'fat']
                                },
                                sampleMeals: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            description: { type: Type.STRING }
                                        },
                                        required: ['name', 'description']
                                    }
                                }
                            },
                            required: ['dailyCalories', 'macros', 'sampleMeals']
                        }
                    },
                    required: ['physiqueAssessment', 'generalRecommendations', 'workoutPlan', 'dietPlan']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'generateComprehensiveFitnessAnalysis');
    }
};

export const simulateWorkoutTransformation = async (imageBase64: string, mimeType: string, intensity: number): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Transform this body to look more fit/muscular, intensity level ${intensity}/5.` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'simulateWorkoutTransformation');
    }
};

export const generateAftercare = async (plan: TreatmentPlan, language: Language): Promise<AftercareInstructions> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate aftercare instructions for: ${plan.planTitle}. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        precautions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['instructions', 'precautions']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'generateAftercare');
    }
};

export const calculateTreatmentCosts = async (plan: TreatmentPlan, language: Language): Promise<CostAnalysisResult> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Estimate costs for: ${plan.planTitle}. Treatments: ${JSON.stringify(plan.suggestedTreatments)}. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                         treatmentCosts: {
                             type: Type.ARRAY,
                             items: {
                                 type: Type.OBJECT,
                                 properties: {
                                     name: { type: Type.STRING },
                                     estimatedCost: { type: Type.NUMBER },
                                     unit: { type: Type.STRING }
                                 },
                                 required: ['name', 'estimatedCost', 'unit']
                             }
                         }
                    },
                    required: ['treatmentCosts']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'calculateTreatmentCosts');
    }
};

export const generatePreTreatmentPlan = async (plan: TreatmentPlan, language: Language): Promise<PreTreatmentPlanResult> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate pre-treatment plan for: ${plan.planTitle}. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        oneWeekBefore: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, instruction: { type: Type.STRING } }, required: ['item', 'instruction'] } },
                        oneDayBefore: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, instruction: { type: Type.STRING } }, required: ['item', 'instruction'] } },
                        dayOfTreatment: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, instruction: { type: Type.STRING } }, required: ['item', 'instruction'] } }
                    },
                    required: ['oneWeekBefore', 'oneDayBefore', 'dayOfTreatment']
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        throw handleGeminiError(error, 'generatePreTreatmentPlan');
    }
};

export const generateSellerConsultation = async (
    productsText: string, 
    language: Language,
    websiteUrl: string,
    imageBase64: string | null,
    imageMimeType: string | null,
    audioBase64: string | null,
    audioMimeType: string | null
): Promise<string> => {
    try {
        const parts: any[] = [{ text: `Analyze these products and provide a seller consultation. Website: ${websiteUrl}. Products: ${productsText}. Language: ${language}.` }];
        if (imageBase64 && imageMimeType) {
            parts.push({ inlineData: { data: imageBase64, mimeType: imageMimeType } });
        }
        if (audioBase64 && audioMimeType) {
            parts.push({ inlineData: { data: audioBase64, mimeType: audioMimeType } });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts }
        });
        return response.text || "";
    } catch (error) {
        throw handleGeminiError(error, 'generateSellerConsultation');
    }
};

export const simulateSurgery = async (imageBase64: string, mimeType: string, procedure: string, intensity: any, language: Language): Promise<string> => {
    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Simulate ${procedure} surgery. Intensity: ${JSON.stringify(intensity)}.` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'simulateSurgery');
    }
};

export const generatePhotoshootImage = async (imageBase64: string, mimeType: string, prompt: string, language: Language): Promise<string> => {
     try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Photoshoot style: ${prompt}` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'generatePhotoshootImage');
    }
};

export const beautifyImage = async (imageBase64: string, mimeType: string, language: Language): Promise<string> => {
     try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Apply professional glamour retouching.` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'beautifyImage');
    }
};

export const generateMarketingContent = async (topic: string, contentType: string, tone: string, language: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a ${tone} ${contentType} about "${topic}". Language: ${language}.`
        });
        return response.text || "";
    } catch (error) {
        throw handleGeminiError(error, 'generateMarketingContent');
    }
};

export const analyzeSearchTrends = async (searches: string[], language: Language): Promise<SearchTrend[]> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze these user searches: ${JSON.stringify(searches)}. Identify trends. Language: ${language}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            search_volume: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                        },
                        required: ['topic', 'reasoning', 'search_volume']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        throw handleGeminiError(error, 'analyzeSearchTrends');
    }
};

export const visualizePostureCorrection = async (imageBase64: string, mimeType: string, summary: string, exerciseName: string, language: Language): Promise<string> => {
     try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Visualize posture correction for "${exerciseName}" based on issue: ${summary}. Show the corrected posture.` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }
        throw new Error("No image generated.");
    } catch (error) {
        throw handleGeminiError(error, 'visualizePostureCorrection');
    }
};

export const generatePostureHighlights = async (originalBase64: string, generatedBase64: string, mimeType: string, language: Language): Promise<HighlightShape[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: originalBase64, mimeType } },
                    { inlineData: { data: generatedBase64, mimeType: 'image/png' } }, // Generated is usually PNG
                    { text: `Compare these two images (original vs corrected). Identify key anatomical changes as geometric shapes (circles or lines) to highlight them on the corrected image. Return JSON array of shapes.` }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['circle', 'line'] },
                            cx: { type: Type.NUMBER },
                            cy: { type: Type.NUMBER },
                            r: { type: Type.NUMBER },
                            x1: { type: Type.NUMBER },
                            y1: { type: Type.NUMBER },
                            x2: { type: Type.NUMBER },
                            y2: { type: Type.NUMBER }
                        },
                        required: ['type']
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        // Fallback or ignore if highlight generation fails
        console.warn('Highlight generation failed', error);
        return [];
    }
};