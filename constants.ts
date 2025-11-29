import { Language, ChangelogEntry, TrainingPath } from './types';

// FIX: Added missing changelogData constant for GoogleBabaModal.
export const changelogData: ChangelogEntry[] = [
    {
        version: '1.0.0',
        date: '2024-07-26',
        changes: {
            en: [
                { type: 'new', text: 'Initial release of the Modern Clinic AI platform.' },
                { type: 'improvement', text: 'Enhanced AI analysis for virtual consultations.' },
                { type: 'fix', text: 'Fixed a bug in the login modal.' },
            ],
            fa: [
                { type: 'new', text: 'انتشار اولیه پلتفرم هوش مصنوعی کلینیک مدرن.' },
                { type: 'improvement', text: 'بهبود تحلیل هوش مصنوعی برای مشاوره‌های مجازی.' },
                { type: 'fix', text: 'رفع اشکال در مودال ورود.' },
            ],
            ar: [
                { type: 'new', text: 'الإصدار الأولي لمنصة العيادة الحديثة بالذكاء الاصطناعي.' },
                { type: 'improvement', text: 'تحسين تحليل الذكاء الاصطناعي للاستشارات الافتراضية.' },
                { type: 'fix', text: 'إصلاح خطأ في نافذة تسجيل الدخول.' },
            ]
        }
    }
];

// FIX: Added missing TRAINING_PATHS constant for DatingSimulator.
export const TRAINING_PATHS: TrainingPath[] = [
    {
        id: 'building-rapport',
        title: { en: 'Building Rapport', fa: 'ایجاد ارتباط', ar: 'بناء الألفة' },
        description: { en: 'Learn to create initial connections and make a great first impression.', fa: 'یاد بگیرید چگونه ارتباطات اولیه ایجاد کنید و تأثیر اولیه عالی بگذارید.', ar: 'تعلم كيفية إنشاء علاقات أولية وترك انطباع أول رائع.' },
        scenarios: [
            {
                id: 'rapport-1',
                title: { en: 'The Opening Line', fa: 'جمله شروع', ar: 'العبارة الافتتاحية' },
                description: { en: 'Practice starting a conversation smoothly.', fa: 'شروع روان یک گفتگو را تمرین کنید.', ar: 'تدرب على بدء محادثة بسلاسة.' },
                easy: { reward: { en: 'A confident start', fa: 'یک شروع با اعتماد به نفس', ar: 'بداية واثقة' } },
                hard: { reward: { en: 'A memorable introduction', fa: 'یک معرفی به یاد ماندنی', ar: 'مقدمة لا تُنسى' } }
            },
            {
                id: 'rapport-2',
                title: { en: 'Finding Common Ground', fa: 'پیدا کردن وجه مشترک', ar: 'إيجاد أرضية مشتركة' },
                description: { en: 'Practice asking questions to discover shared interests.', fa: 'سوال پرسیدن برای کشف علایق مشترک را تمرین کنید.', ar: 'تدرب على طرح الأسئلة لاكتشاف الاهتمامات المشتركة.' },
                easy: { reward: { en: 'Found a shared hobby', fa: 'یک سرگرمی مشترک پیدا شد', ar: 'تم العثور على هواية مشتركة' } },
                hard: { reward: { en: 'Discovered a unique shared experience', fa: 'یک تجربه مشترک منحصر به فرد کشف شد', ar: 'اكتشاف تجربة مشتركة فريدة' } }
            }
        ]
    },
    {
        id: 'deepening-connection',
        title: { en: 'Deepening the Connection', fa: 'عمیق‌تر کردن رابطه', ar: 'تعميق العلاقة' },
        description: { en: 'Move beyond small talk and build a more meaningful connection.', fa: 'فراتر از صحبت‌های کوتاه بروید و ارتباطی معنادارتر بسازید.', ar: 'تجاوز الأحاديث السطحية وابنِ علاقة ذات معنى أعمق.' },
        scenarios: [
            {
                id: 'deep-1',
                title: { en: 'Sharing Vulnerability', fa: 'به اشتراک گذاشتن آسیب‌پذیری', ar: 'مشاركة نقاط الضعف' },
                description: { en: 'Practice sharing a personal story that reveals character.', fa: 'به اشتراک گذاشتن یک داستان شخصی که شخصیت را آشکار می‌کند، تمرین کنید.', ar: 'تدرب على مشاركة قصة شخصية تكشف عن شخصيتك.' },
                easy: { reward: { en: 'Received an empathetic response', fa: 'پاسخی همدلانه دریافت شد', ar: 'تلقي استجابة متعاطفة' } },
                hard: { reward: { en: 'Partner shared a vulnerable story in return', fa: 'طرف مقابل در پاسخ، داستانی آسیب‌پذیر را به اشتراک گذاشت', ar: 'شارك الشريك قصة شخصية مؤثرة في المقابل' } }
            }
        ]
    }
];

export const PROMPTS = {
    specialistFinder: (language: Language) => `
You are an AI assistant for a modern beauty clinic. Your goal is to find relevant medical specialists based on a user's preliminary AI-driven skin condition analysis.
The user's potential conditions are:
{conditions}

The user's primary symptoms are:
{symptoms}

Generate a list of {maxResults} hypothetical specialists who would be a good fit to consult.
For each specialist, create a plausible name, specialty (e.g., Dermatologist, Allergist, Aesthetician), city, and a short, professional bio.
Most importantly, provide a relevance score as a percentage, briefly explaining why they are a relevant choice based on the user's conditions and symptoms.

The output must be a markdown table with the following columns: Name, Specialty, City, Bio, Relevance.
The table should be in {language}.
`,
};

export const CULTURAL_PROMPTS: { [key in Language]: string[] } = {
  en: [
    'I\'ve been feeling very stressed with the upcoming Nowruz preparations, and I\'ve noticed more acne on my chin and forehead.',
    'My skin feels constantly dry and tight, especially after being outside in the hot, dry weather here in the Gulf region.',
    'I have been experiencing more hair fall than usual lately. I think it might be related to post-Ramadan fatigue.',
    'I have dark circles under my eyes that don\'t go away, even with enough sleep. It makes me look tired all the time.',
  ],
  fa: [
    'به خاطر استرس کارهای قبل از نوروز، جوش‌های زیادی روی چانه و پیشانی‌ام زده‌ام.',
    'پوستم به شدت خشک و کشیده شده، مخصوصاً وقتی در هوای گرم و خشک اینجا در منطقه خلیج فارس بیرون می‌روم.',
    'اخیراً ریزش موی شدیدی پیدا کرده‌ام. فکر می‌کنم به خاطر خستگی بعد از ماه رمضان باشد.',
    'زیر چشم‌هایم سیاهی‌هایی دارم که حتی با خواب کافی هم از بین نمی‌روند و همیشه خسته به نظر می‌رسم.',
  ],
  ar: [
    'أشعر بضغط شديد بسبب التحضيرات لعيد النوروز، ولاحظت ظهور المزيد من حب الشباب على ذقني وجبهتي.',
    'أشعر بأن بشرتي جافة ومشدودة باستمرار، خاصة بعد قضاء وقت في الخارج في الطقس الحار والجاف هنا في منطقة الخليج.',
    'أعاني من تساقط شعر أكثر من المعتاد مؤخرًا. أعتقد أن له علاقة بالإرهاق بعد شهر رمضان.',
    'لدي هالات سوداء تحت عيني لا تختفي حتى مع النوم الكافي، مما يجعلني أبدو متعبة طوال الوقت.',
  ],
};

export const MOCK_USER_SEARCHES: string[] = [
  "best serum for oily skin", "how to get rid of acne scars", "protein powder for muscle gain", "HIIT workout for fat loss", "what is collagen", "retinol for beginners", "anti-aging treatments", "how to build a bigger chest", "best diet for weight loss", "collagen supplement benefits", "reduce wrinkles", "increase deadlift strength", "best sunscreens for sensitive skin",
  "خرید کرم ضد چروک", "فواید کلاژن برای پوست", "بهترین تمرین برای سیکس پک", "رژیم غذایی برای کاهش وزن سریع", "چگونه جوش صورت را از بین ببریم", "مکمل کراتین چیست", "درمان ریزش مو با هوش مصنوعی", "فواید سرم ویتامین سی", "حرکات ورزشی برای تقویت بازو", "کلاژن سازی پوست", "لیزر موهای زائد", "بهترین مکمل برای افزایش حجم", "ضد آفتاب برای پوست چرب",
  "what is hyaluronic acid", "korean skincare routine", "how to start lifting weights", "meal prep for fat loss", "is creatine safe", "microneedling benefits", "signs of overtraining", "best collagen peptides", "تمرینات قدرتی برای بانوان", "سرم ویتامین سی برای لک صورت", "راه های افزایش تستوسترون", "پروتئین وی یا کازئین",
];