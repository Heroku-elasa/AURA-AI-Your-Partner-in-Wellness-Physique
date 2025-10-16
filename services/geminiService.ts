import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TreatmentPlan, Language, MarketAnalysisMode, SymptomDetails, ComprehensiveBeautyResult, SearchResultItem, ProviderSearchResult, SurgeryType, ProcedureIntensity, LipAugmentationIntensity, ComprehensiveFitnessResult, WorkoutPlan } from '../types';

// This is a placeholder check. In a real-world scenario, the API key
// should be handled securely, e.g., via a backend proxy or environment variables
// set during the build process.
if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

// Generic function to handle generateContent calls
async function generateContent(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to get response from AI model.");
    }
}

export const generateComprehensiveBeautyAnalysis = async (
    symptoms: string, 
    symptomDetails: SymptomDetails, 
    language: Language,
    imageBase64: string | null,
    imageMimeType: string | null
): Promise<ComprehensiveBeautyResult | { error: string }> => {
    
    const textPrompt = `
    You are a helpful AI assistant for a luxury beauty clinic called AURA. Analyze the following user-described symptoms and provide a comprehensive, multi-faceted beauty and wellness analysis.

    User's primary description: "${symptoms}"
    
    Additional details provided:
    - What makes it worse: ${symptomDetails.aggravatingFactors || 'Not specified'}
    - What makes it better: ${symptomDetails.alleviatingFactors || 'Not specified'}
    - Duration: ${symptomDetails.duration || 'Not specified'}
    - Previous treatments: ${symptomDetails.previousTreatments || 'Not specified'}
    - Current medications/allergies: ${symptomDetails.medications || 'Not specified'}

    Your response MUST be a single, valid JSON object. The language for all user-facing text content within the JSON MUST be ${language}.
    
    IMPORTANT INSTRUCTIONS:
    1.  If an image is provided, you MUST validate it first. If the image does not contain a clear, single human face, or if it is inappropriate, you MUST respond ONLY with the following JSON object:
        { "error": "A clear, single human face was not detected in the image. Please upload a high-quality, forward-facing portrait." }
        Do not provide any other analysis if the image is invalid.
    2.  If the image is valid (or if no image is provided), your analysis should be based on the user's text description and, if available, the image.
    3.  Use the image to inform your analysis on skin tone, texture, visible concerns (e.g., redness, blemishes, wrinkles), and face shape. Integrate these visual observations with the user's text symptoms to provide a more accurate and personalized result.

    The JSON object must have the following structure and content:
    {
      "skinAnalysis": {
        "skinType": "e.g., Combination, Oily, Dry, Sensitive",
        "skinDescription": "A detailed description of the inferred skin type based on user's input.",
        "keyCharacteristics": ["List of 3-4 key skin characteristics as strings."],
        "recommendedIngredients": ["List of 3-5 recommended skincare ingredients as strings."],
        "ingredientsToAvoid": ["List of 2-4 ingredients to avoid as strings."],
        "actionableSuggestions": ["List of 3 actionable skincare routine suggestions as strings."]
      },
      "healthConsultation": {
        "disclaimer": "A standard disclaimer that this is not medical advice and they should consult a professional.",
        "recommendedSpecialists": ["List of 1-3 relevant specialist types, e.g., 'Dermatologist', 'Aesthetician'"],
        "identifiedConditions": [
          { "name": "Most likely condition name", "description": "Brief description of the condition.", "relevance": "High", "suggestedStep": "A simple, clear next step for the user." },
          { "name": "Another possible condition", "description": "Brief description.", "relevance": "Medium", "suggestedStep": "A simple, clear next step." }
        ],
        "lifestyleAdvice": "A paragraph of general lifestyle advice (e.g., diet, hydration, stress).",
        "treatmentSuggestions": [
          { "icon": "emoji related to treatment", "title": "Suggestion Title", "description": "Brief description of a potential professional treatment." }
        ],
        "followUpQuestions": ["List of 3-4 important questions the user could ask a real doctor."]
      },
      "makeupStyle": {
        "styleName": "A catchy name for a suitable makeup style (e.g., 'Natural Glow', 'Subtle Glam').",
        "description": "A short paragraph describing the makeup style and why it's suitable.",
        "keyProducts": ["List of 3-4 key product types for this look (e.g., 'Hydrating foundation', 'Cream blush')."]
      },
      "homemadeMask": {
        "maskName": "A name for a simple, relevant homemade face mask.",
        "description": "A brief sentence about the benefits of this mask for the user's concerns.",
        "ingredients": ["List of all ingredients with quantities, as strings (e.g., '1 tbsp honey')."],
        "instructions": "A single string containing numbered, step-by-step instructions for preparing and using the mask."
      }
    }
    `;

    let contents;
    if (imageBase64 && imageMimeType) {
        contents = {
            parts: [
                { text: textPrompt },
                {
                    inlineData: {
                        mimeType: imageMimeType,
                        data: imageBase64,
                    },
                },
            ],
        };
    } else {
        contents = textPrompt;
    }

    const response = await ai.models.generateContent({
        model,
        contents,
        config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text);
};

export const generateComprehensiveFitnessAnalysis = async (
    userData: any,
    language: Language,
    imageBase64: string | null,
    imageMimeType: string | null
): Promise<ComprehensiveFitnessResult | { error: string }> => {
    
    const textPrompt = `
    You are an expert AI fitness and nutrition coach for the AURA AI platform. Your task is to generate a comprehensive, personalized fitness and diet plan based on the user's data.

    User Data:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Height: ${userData.height} cm
    - Weight: ${userData.weight} kg
    - Primary Goal: ${userData.goal}
    - Training Experience: ${userData.experience}
    - Workout Days per Week: ${userData.daysPerWeek}
    - Dietary Preferences: ${userData.dietaryPrefs || 'None specified'}

    Your response MUST be a single, valid JSON object that strictly adheres to the provided schema. The language for all user-facing text content within the JSON MUST be ${language}.
    
    JSON Generation Instructions:
    1.  **Physique Assessment**: If a photo is provided, give a brief, positive, and general assessment of the user's current physique (e.g., "Ectomorph build with potential for lean muscle gain," or "Solid foundation to begin a fat loss phase."). AVOID specific negative critiques. Be encouraging. If no photo, state that the plan is based on provided stats only.
    2.  **General Recommendations**: Provide 3-4 high-level, actionable recommendations covering topics like hydration, sleep, consistency, or progressive overload.
    3.  **Workout Plan**:
        - Create a logical weekly split based on the user's goal and available days (e.g., Full Body, Upper/Lower, PPL). Name the split.
        - For each of the ${userData.daysPerWeek} days, create a workout.
        - Each workout day must have a clear 'focus' (e.g., "Push Day - Chest, Shoulders, Triceps").
        - List 5-7 appropriate 'exercises' for each workout day.
        - For each exercise, provide a realistic 'sets', 'reps', and 'rest' range (e.g., "3-4" sets, "8-12" reps, "60s" rest).
    4.  **Diet Plan**:
        - Calculate and provide a target for 'dailyCalories'. Base this on the user's stats, goal (e.g., slight surplus for muscle gain, slight deficit for fat loss), and an assumed activity level.
        - Calculate and provide a gram targets for 'macros' (protein, carbs, fat). A common starting point is ~1.6-2.2g protein per kg bodyweight.
        - Provide 3-4 'sampleMeals' (e.g., Breakfast, Lunch, Dinner, Snack) with a brief description of a suitable meal for each.
    `;

    const schema = {
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
                                            notes: { type: Type.STRING },
                                        },
                                        required: ["name", "sets", "reps", "rest"],
                                    },
                                },
                            },
                            required: ["day", "focus", "exercises"],
                        },
                    },
                },
                required: ["split", "days"],
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
                            fat: { type: Type.NUMBER },
                        },
                        required: ["protein", "carbs", "fat"],
                    },
                    sampleMeals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                            },
                            required: ["name", "description"],
                        },
                    },
                },
                required: ["dailyCalories", "macros", "sampleMeals"],
            },
        },
        required: ["physiqueAssessment", "generalRecommendations", "workoutPlan", "dietPlan"],
    };


    let contents;
    if (imageBase64 && imageMimeType) {
        contents = {
            parts: [
                { text: textPrompt },
                {
                    inlineData: {
                        mimeType: imageMimeType,
                        data: imageBase64,
                    },
                },
            ],
        };
    } else {
        contents = textPrompt;
    }

    const response = await ai.models.generateContent({
        model,
        contents,
        config: { 
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });
    
    return JSON.parse(response.text);
};


export const generateSpecialists = (prompt: string): Promise<string> => {
    return generateContent(prompt);
};

export const generateMarketAnalysis = async (query: string, language: Language, mode: MarketAnalysisMode): Promise<string> => {
    let prompt = `Analyze the beauty market for "${query}". The response must be in ${language}.`;

    switch (mode) {
        case 'in-depth':
            prompt += ` Provide an in-depth analysis including a detailed summary, key insights, emerging trends, opportunities, and risks.`;
            break;
        case 'swot':
            prompt += ` Provide a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).`;
            break;
        case 'quick':
            prompt += ` Provide a quick, concise summary.`;
            break;
    }
    
    prompt += ` The entire response, including headers and content, must be a single JSON object with two keys: "text" (a markdown string with the analysis) and "sources" (an array of source objects, each with "uri" and "title").`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Untitled',
    })) || [];
    
    // The model with search grounding doesn't always return perfect JSON.
    // We construct the JSON response ourselves.
    return JSON.stringify({ text, sources });
};

export const performSemanticSearch = async (query: string, searchIndex: string, language: Language): Promise<SearchResultItem[]> => {
    const prompt = `
        You are an intelligent search engine for the AURA Beauty Clinic website.
        Search the following content index to find items relevant to the user's query.
        The user's query is: "${query}"

        The content index is:
        ---
        ${searchIndex}
        ---

        Return a JSON array of up to 5 relevant results.
        Each result object must have a "title", a "description", and a "targetPage".
        - The "title" should be the name of the service, doctor, or page.
        - The "description" should be a brief, helpful explanation of why this result is relevant to the user's query.
        - The "targetPage" must be one of the following exact string values: 'home', 'skin_consultation', 'fitness_assessment', 'location_finder', 'ai_consultant', 'market_trends', 'our_experts', 'collaboration', 'my_consultations', 'cosmetic_simulator', 'physique_simulator'.

        The response language for the title and description fields must be ${language}.
        If there are no relevant results, return an empty array.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        targetPage: { type: Type.STRING },
                    },
                    required: ["title", "description", "targetPage"],
                },
            },
        },
    });

    return JSON.parse(response.text);
};

export const findLocalProviders = async (
    query: string,
    searchType: 'clinics' | 'doctors' | 'gyms' | 'coaches',
    userLocation: { lat: number; lon: number } | null,
    language: Language
): Promise<ProviderSearchResult[]> => {
    const locationInfo = userLocation
        ? `The user is at approximately latitude ${userLocation.lat} and longitude ${userLocation.lon}. When generating results, invent a plausible distance in kilometers (e.g., "approx. 2.5 km").`
        : "The user has not provided their location. The 'distance' field should be 'N/A'.";

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                services: { type: Type.ARRAY, items: { type: Type.STRING } },
                specialty: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING },
                website: { type: Type.STRING },
                whatsapp: { type: Type.STRING },
                distance: { type: Type.STRING },
            },
            required: ["id", "type", "name", "description", "address", "phone", "website", "whatsapp", "distance"],
        },
    };

    const resultTypeMap = {
        clinics: 'clinic',
        doctors: 'doctor',
        gyms: 'gym',
        coaches: 'coach',
    };
    const resultType = resultTypeMap[searchType];

    const prompt = `
        You are an AI assistant for the "AURA" beauty and wellness brand.
        Your task is to generate a list of 5 hypothetical ${searchType} that match the user's search query.
        The user's query is: "${query}".
        ${locationInfo}

        Generate plausible, fictional results.
        For each result, provide:
        - A unique 'id' (e.g., a UUID).
        - 'type': must be '${resultType}'.
        - 'name': a plausible name.
        - 'description': a short bio for a doctor or coach, or a description for a clinic or gym.
        - 'address': a fictional but realistic address.
        - 'phone': a realistic phone number.
        - 'website': a URL using the example.com domain.
        - 'whatsapp': a realistic phone number (can be the same as 'phone').
        - 'distance': as instructed above.
        - 'services': IF the type is 'clinic' or 'gym', provide a list of 3-5 relevant services. Otherwise, this can be an empty array.
        - 'specialty': IF the type is 'doctor' or 'coach', provide a specialty (e.g., 'Dermatologist' or 'Fitness Coach'). Otherwise, this can be an empty string.

        The response language for all user-facing text (name, description, etc.) MUST be ${language}.
        The output must be a valid JSON array matching the provided schema.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });
    
    const results = JSON.parse(response.text);
    return results.map((item: any) => ({
        ...item,
        services: (item.type === 'clinic' || item.type === 'gym') ? item.services : undefined,
        specialty: (item.type === 'doctor' || item.type === 'coach') ? item.specialty : undefined,
    }));
};


export const generateAftercare = async (plan: TreatmentPlan, language: Language): Promise<any> => {
    const treatments = plan.suggestedTreatments.map(t => t.name).join(', ');
    const prompt = `For the following beauty treatments: ${treatments}, generate aftercare instructions in ${language}. The response must be a JSON object with two keys: "instructions" and "precautions", each containing an array of strings.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
};

export const calculateTreatmentCosts = async (plan: TreatmentPlan, language: Language): Promise<any> => {
    const treatments = plan.suggestedTreatments.map(t => t.name).join(', ');
    const prompt = `Provide an estimated cost analysis in ${language} for these treatments: ${treatments}. Assume costs are in Iranian Toman (IRT). The response must be a JSON object with one key "treatmentCosts", which is an array of objects. Each object should have "name", "estimatedCost" (as a number), and "unit" (e.g., 'per session').`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
};

export const generatePreTreatmentPlan = async (plan: TreatmentPlan, language: Language): Promise<any> => {
    const treatments = plan.suggestedTreatments.map(t => t.name).join(', ');
    const prompt = `Generate a pre-treatment plan in ${language} for these treatments: ${treatments}. The response must be a JSON object with three keys: "oneWeekBefore", "oneDayBefore", and "dayOfTreatment". Each key should hold an array of objects, where each object has "item" and "instruction".`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
};

export const generateSellerConsultation = async (
    productsText: string, 
    language: Language,
    websiteUrl?: string,
    imageBase64?: string | null,
    imageMimeType?: string | null,
    audioBase64?: string | null,
    audioMimeType?: string | null
): Promise<string> => {
    
    let prompt = `
    You are an expert cosmetic marketing and product strategy consultant for the AURA brand. A seller has provided a list of their products. Your task is to analyze this portfolio and provide a strategic consultation.

    The seller's product list is:
    ---
    ${productsText}
    ---
    `;

    if (websiteUrl) {
        prompt += `\nTheir website is: ${websiteUrl}. Analyze its content for brand identity, tone of voice, and existing marketing angles.`;
    }
    if (imageBase64) {
        prompt += `\nAn image of a hero product has been provided. Analyze its aesthetics, packaging, target appeal, and overall visual branding.`;
    }
    if (audioBase64) {
        prompt += `\nA voice pitch for a product has been provided. Analyze the tone of voice, key selling points mentioned, and overall persuasiveness.`;
    }
    
    prompt += `\n\nGenerate a comprehensive analysis in markdown format. The language for the response MUST be ${language}. Incorporate insights from the website, image, and audio (if provided) into your recommendations. The analysis must include the following sections, each with a heading exactly as provided below:

    ### ${language === 'fa' ? 'تحلیل مخاطب هدف' : language === 'ar' ? 'تحليل الجمهور المستهدف' : 'Target Audience Analysis'}
    Describe the ideal customer profile for this collection of products. Consider demographics, psychographics, and skin concerns.

    ### ${language === 'fa' ? 'زوایای کلیدی بازاریابی' : language === 'ar' ? 'زوايا التسويق الرئيسية' : 'Key Marketing Angles'}
    Provide 3-4 compelling marketing messages or angles. Focus on the unique selling propositions of the portfolio as a whole.

    ### ${language === 'fa' ? 'هم‌افزایی و فرصت‌های پکیج‌بندی' : language === 'ar' ? 'تآزر المنتجات وفرص التجميع' : 'Product Synergy & Bundling Opportunities'}
    Explain how these products can be used together. Suggest 1-2 attractive product bundles with catchy names.

    ### ${language === 'fa' ? 'شکاف‌های سبد محصول و پیشنهادات' : language === 'ar' ? 'فجوات المجموعة والاقتراحات' : 'Portfolio Gaps & Expansion Suggestions'}
    Identify any missing product categories that would complement the existing line-up and suggest specific product types to consider adding.
    `;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64 && imageMimeType) {
        parts.push({
            inlineData: {
                mimeType: imageMimeType,
                data: imageBase64,
            },
        });
    }

    if (audioBase64 && audioMimeType) {
        parts.push({
            inlineData: {
                mimeType: audioMimeType,
                data: audioBase64,
            },
        });
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating seller consultation:", error);
        throw new Error("Failed to get response from AI model for seller consultation.");
    }
};

export const simulateSurgery = async (
    imageBase64: string,
    mimeType: string,
    procedure: SurgeryType,
    intensity: ProcedureIntensity,
    language: Language
): Promise<string> => {
    const intensityMap: { [key: number]: string } = {
        1: 'very subtle',
        2: 'subtle',
        3: 'moderate',
        4: 'noticeable',
        5: 'significant'
    };

    let prompt: string;

    if (procedure === 'lipAugmentation') {
        const lipIntensity = intensity as LipAugmentationIntensity;
        const upperIntensityStr = intensityMap[lipIntensity.upper];
        const lowerIntensityStr = intensityMap[lipIntensity.lower];
        prompt = `Perform a lip augmentation on the person in this photo. Add ${upperIntensityStr} volume to the upper lip and ${lowerIntensityStr} volume to the lower lip, enhancing their shape and definition without looking overdone. Only output the edited image.`;
    } else {
        const standardIntensity = intensity as number;
        const intensityStr = intensityMap[standardIntensity];
        const basePrompts: Record<Exclude<SurgeryType, 'lipAugmentation'>, string> = {
            rhinoplasty: `Perform a rhinoplasty on the person in this photo. Make the nose bridge slightly narrower, refine and slightly lift the tip, and make the nostrils a little smaller. The result must look natural and harmonious with the rest of the face. The magnitude of the change should be ${intensityStr}. Only output the edited image.`,
            blepharoplasty: `Perform a blepharoplasty (eyelid surgery) on the person in this photo. Reduce any puffiness under the eyes and slightly lift the upper eyelids to create a more rested and youthful appearance. The changes should be very natural. The magnitude of the change should be ${intensityStr}. Only output the edited image.`,
            genioplasty: `Perform a genioplasty (chin augmentation) on the person in this photo. Enhance the chin to provide a more balanced and defined profile. The change should be modest and fit the person's facial structure. The magnitude of the change should be ${intensityStr}. Only output the edited image.`,
            facelift: `Perform a natural-looking facelift on the person in this photo. Gently tighten the skin around the jawline (jowls), cheeks, and neck. Reduce the appearance of deep wrinkles and nasolabial folds to create a refreshed, more youthful look, but maintain the person's core facial identity. The magnitude of the change should be ${intensityStr}. Only output the edited image.`,
            jawSurgery: `Perform subtle jaw contouring on the person in this photo. Make the jawline appear slightly more defined and sculpted. The change should be minor and enhance the natural bone structure. The magnitude of the change should be ${intensityStr}. Only output the edited image.`
        };
        prompt = basePrompts[procedure as Exclude<SurgeryType, 'lipAugmentation'>];
    }
    
    if (!prompt) {
        throw new Error("Invalid surgery type specified.");
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("AI did not return an image. It may have refused the request.");

    } catch (error) {
        console.error("Error simulating surgery:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
             throw new Error("The simulation could not be performed due to safety policies. Please use a clear, appropriate photo of a face.");
        }
        throw new Error("Failed to get response from AI model for surgery simulation.");
    }
};

export const simulateWorkoutTransformation = async (
    imageBase64: string,
    mimeType: string,
    days: number,
    intensity: number, // 1-5
    goal: string, // muscleGain, fatLoss etc.
    gender: string,
    workoutPlan: WorkoutPlan | null
): Promise<string> => {
    const intensityMap: { [key: number]: string } = {
        1: 'light',
        2: 'moderate',
        3: 'consistent and challenging',
        4: 'very intense',
        5: 'elite athlete level'
    };

    const goalMap: { [key: string]: string } = {
        muscleGain: "significant muscle hypertrophy, focusing on increased size in the chest, shoulders, back, and legs, with visible but not extreme definition",
        fatLoss: "a significant reduction in body fat, revealing clear muscle definition and vascularity, particularly in the abdominal area, while preserving as much muscle mass as possible",
        recomposition: "a moderate increase in lean muscle mass combined with a noticeable decrease in body fat, resulting in a more toned and defined athletic look",
        strength: "denser, harder-looking muscles with significant functional strength improvements, which might include some size increase but prioritizes a powerful physique",
        fitness: "an overall healthier, more athletic appearance with good muscle tone, lower body fat than the original, and a fit, capable look without specializing in extreme size or leanness"
    };

    const intensityStr = intensityMap[intensity] || 'moderate';
    const goalStr = goalMap[goal] || goalMap['fitness'];

    let workoutDetails = `
- Workout Frequency: ${days} days per week.
- Intensity: ${intensityStr}.
- Primary Goal: ${goal}.
    `;

    if (workoutPlan) {
        const planSummary = `
- Workout Split: ${workoutPlan.split}.
- Weekly Focus: ${workoutPlan.days.map(d => `${d.day}: ${d.focus}`).join('; ')}.
- Key exercises likely include: ${[...new Set(workoutPlan.days.flatMap(d => d.exercises.map(e => e.name)))].slice(0, 5).join(', ')}.
        `;
        workoutDetails += planSummary;
    }

    const prompt = `
        Analyze the person in the image. They are a ${gender}.
        Simulate a realistic and impressive physical transformation after 6 months of dedicated training.
        Their training regimen is as follows:
        ${workoutDetails}

        Based on these parameters, the visual changes should reflect ${goalStr}. For example, if the plan is a Push/Pull/Legs split focused on muscle gain, show significant development in the chest, back, shoulders, and legs. If it's a full-body routine for fat loss, show a leaner, more athletic build.

        The final image must look realistic, maintaining the person's core facial features and identity.
        Avoid exaggerated or cartoonish results. The lighting and background should remain consistent with the original photo.
        Only output the edited image. Do not output any text.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("AI did not return an image. It may have refused the request.");

    } catch (error) {
        console.error("Error simulating workout:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
             throw new Error("The simulation could not be performed due to safety policies. Please use a clear, appropriate full-body photo.");
        }
        throw new Error("Failed to get response from AI model for workout simulation.");
    }
};