import React, { createContext, useContext, useState } from 'react';

// This is a mock implementation for demonstration purposes.
// In a real application, you would use a library like i18next and load translations from JSON files.
const translations: Record<string, any> = {
    en: {
        header: {
            home: "Home",
            aiServices: "AI Services",
            skinConsultation: "AI Skin Analysis",
            fitnessAssessment: "AI Fitness Assessment",
            cosmeticSimulator: "Cosmetic Simulator",
            physiqueSimulator: "Physique Simulator",
            locationFinder: "Find Locations",
            aiCoach: "AI Coach",
            marketTrends: "Market Trends",
            ourExperts: "Our Experts",
            collaboration: "Collaboration",
            joinUs: "Join Us",
            sellerHub: "Seller Hub",
            myPlans: "My Plans",
            login: "Login / Sign Up",
            logout: "Logout",
        },
        hero: {
            title: "AURA AI: Your Partner in<br/>Wellness & Physique",
            subtitle: "Personalized skin analysis, AI-generated workout plans, and treatment suggestions to help you achieve your peak form, inside and out.",
            button1: "Start AI Skin Analysis",
            button2: "Start AI Fitness Plan",
            servicesTitle: "Our Premier Services",
            servicesSubtitle: "A holistic approach to well-being, combining advanced aesthetic treatments with scientific fitness coaching.",
            cosmeticServices: [
                { "icon": "laser", "title": "Laser Treatments", "description": "Advanced laser therapies for hair removal, skin rejuvenation, and scar reduction." },
                { "icon": "injectables", "title": "Injectables & Fillers", "description": "Expertly administered Botox and dermal fillers to restore volume and smooth wrinkles." },
                { "icon": "facial", "title": "Advanced Facials", "description": "Customized facial treatments, from hydrafacials to chemical peels, for radiant skin." },
                { "icon": "skincare", "title": "Pro Skincare", "description": "Professional-grade products and routines tailored to your specific skin type and concerns." }
            ],
            fitnessServices: [
                { "icon": "workout", "title": "Personalized Training", "description": "AI-generated weekly workout plans tailored to your goals, experience, and schedule." },
                { "icon": "nutrition", "title": "AI Nutrition Coaching", "description": "Custom meal plans and macro targets to fuel your workouts and accelerate results." },
                { "icon": "physique", "title": "Physique Simulation", "description": "Visualize your potential transformation with our AI-powered physique simulator." },
                { "icon": "wellness", "title": "Wellness Tracking", "description": "Integrate data from wearables to monitor progress and receive real-time advice." }
            ],
            aiFitnessExplanation: {
                title: "How AI Revolutionizes Bodybuilding",
                subtitle: "Artificial intelligence is no longer a luxury tool; it acts as a scientific and precise companion in your fitness journey.",
                points: [
                    { "title": "Personalized Training Programs", "description": "AI algorithms analyze your physical attributes, training history, goals, and daily readiness to create a customized workout plan. It recommends compound exercises like squats and deadlifts for maximum results." },
                    { "title": "Progress Monitoring", "description": "Using data from fitness trackers, AI analyzes your reps, sets, weight, and rest times to provide personalized feedback and visualize your progress with easy-to-understand charts." },
                    { "title": "Injury Prevention", "description": "By analyzing your range of motion and exercise form, AI can detect potential injury risks. If you repeatedly perform a movement incorrectly, it will suggest form corrections to prevent strain." },
                    { "title": "Supplement Selection", "description": "AI examines your diet, goals, and physical data to identify nutritional gaps and recommend supplements like protein powder, creatine, and vitamins to enhance your training efficiency." }
                ]
            }
        },
        b2bCta: {
            title: "Power Your Growth with AURA AI",
            subtitle: "Leverage our intelligent platform to analyze market trends, generate compelling content, and engage your audience like never before. AURA AI is your partner for digital marketing in the wellness and beauty space.",
            features: [
                { icon: "analytics", title: "AI Market Analyzer", description: "Get real-time insights into market trends, competitor strategies, and consumer behavior to make data-driven decisions." },
                { icon: "content", title: "Strategic Content Generation", description: "Receive AI-powered consultations for your product portfolio, identifying key marketing angles and creating strategic content." },
                { icon: "engagement", title: "Enhanced Customer Engagement", description: "Utilize AI coaches and personalized plans to build deeper, more meaningful relationships with your clients." }
            ],
            ctaButton1: "Explore Collaboration",
            ctaButton2: "Join Our Marketing Team"
        },
        myPlansPage: {
            title: "My Saved Plans",
            subtitle: "Review, restore, or delete your past AI-generated skin and fitness plans.",
            restore: "View Plan",
            delete: "Delete",
            deleteConfirm: "Are you sure you want to delete '{name}'? This action cannot be undone.",
            savedOn: "Saved on",
            emptyTitle: "No plans saved",
            emptyText: "Your saved AI plans will appear here.",
            goBackButton: "Start a New Assessment",
        },
        footer: {
            description: "Your AI partner for personalized beauty, wellness, and fitness coaching.",
            copyright: "© 2024 AURA AI. All Rights Reserved.",
        },
        quotaErrorModal: {
            title: "Quota Exceeded",
            body: "You have exceeded your API quota. Please check your billing status or try again later. AI features are temporarily unavailable.",
            cta: "Check Billing",
            close: "Close",
        },
        loginModal: {
            title: "Login to Your Account",
            google: "Continue with Google",
            emailPlaceholder: "Enter your email",
            passwordPlaceholder: "Enter your password",
            loginButton: "Login",
        },
        aiCoach: {
            title: "AURA AI Coach",
            subtitle: "Ask me anything about skincare, fitness, nutrition, or wellness routines. I'm here to help you on your journey.",
            placeholder: "Type your question here...",
        },
        marketTrends: {
            title: "Market Trends Analyzer",
            subtitle: "Enter a topic to get the latest market insights, trends, and analyses for the beauty and fitness industries.",
            searchPlaceholder: "e.g., 'anti-aging serums' or 'home fitness equipment'",
            searching: "Analyzing...",
            searchButton: "Analyze",
            placeholder: "Your market analysis will appear here.",
            loading: {
                scanning: "Scanning search results...",
                synthesizing: "Synthesizing information...",
                extracting: "Extracting key insights...",
                compiling: "Compiling your report...",
            },
            analysisModes: {
                quick: "Quick Summary",
                "in-depth": "In-depth Analysis",
                swot: "SWOT Analysis",
            },
            results: {
                keyInsights: "Key Insights",
                detailedSummary: "Detailed Summary",
                emergingTrends: "Emerging Trends",
                opportunities: "Opportunities",
                risks: "Risks",
                strengths: "Strengths",
                weaknesses: "Weaknesses",
                threats: "Threats",
            },
            sources: "Sources",
            relatedTopics: "Related Topics",
            suggestionsLabel: "Try searching for",
            suggestions: ["collagen supplements", "HIIT workout trends", "personalized nutrition apps", "wearable fitness tech"],
        },
        ourExperts: {
            title: "Meet Our Expert Team",
            subtitle: "Our platform is backed by a team of highly qualified and experienced specialists dedicated to providing the best care.",
            tabs: {
                coaches: "Fitness Coaches",
                doctors: "Cosmetic Doctors",
            },
            tableHeaders: { "name": "Name", "specialty": "Specialty", "bio": "Biography", "license": "Medical License No.", "certification": "Certification ID" },
            doctors: [
                { "name": "Dr. Sarah Chen", "specialty": "Dermatologist", "bio": "Specializes in cosmetic dermatology and laser treatments, with over 15 years of experience.", "licenseNumber": "MD-12345" },
                { "name": "Dr. Ben Carter", "specialty": "Aesthetic Physician", "bio": "Expert in injectables like Botox and fillers, focusing on natural-looking results.", "licenseNumber": "MD-67890" },
                { "name": "Dr. Ava Nazari", "specialty": "Trichologist", "bio": "Focuses on hair and scalp health, providing advanced solutions for hair loss.", "licenseNumber": "MD-54321" }
            ],
            coaches: [
                { "name": "Alex 'Raptor' Vance", "specialty": "Strength & Conditioning", "bio": "Former pro athlete specializing in explosive power development and hypertrophy training.", "licenseNumber": "CSCS-98765" },
                { "name": "Isabelle Rossi", "specialty": "Nutrition & Fat Loss", "bio": "Certified nutritionist focused on sustainable diet plans and body recomposition.", "licenseNumber": "PN1-55432" },
                { "name": "Kenji Tanaka", "specialty": "Mobility & Functional Fitness", "bio": "Expert in functional movement and injury prevention for long-term athletic health.", "licenseNumber": "FRC-11223" }
            ],
        },
        locationFinder: {
            title: "Find Our Locations",
            subtitle: "Locate the nearest AURA-affiliated clinic, gym, or specialist.",
            searchPlaceholder: "Search by city, specialty, or name...",
            searchButtonText: "Search",
            or: "OR",
            geoSearchButton: "Find Locations Near Me",
            searching: "Searching...",
            placeholder: "Search results will appear here.",
            resultsTitle: "Our Locations",
            services: "Services Offered",
            searchCategoryLabel: "I'm looking for:",
            categoryBeauty: "Beauty",
            categoryFitness: "Fitness",
            searchTypeClinics: "Clinics",
            searchTypeDoctors: "Doctors",
            searchTypeGyms: "Gyms",
            searchTypeCoaches: "Coaches",
        },
        assessment: {
            saveButton: "Save Plan",
            skinTitle: "Virtual AI Skin Consultation",
            skinSubtitle: "Describe your skin concerns, and our AI will provide a preliminary analysis and suggest next steps.",
            fitnessTitle: "AI Fitness Assessment",
            fitnessSubtitle: "Input your stats and goals to receive a personalized, AI-generated workout and diet plan.",
            form: {
                // Skin Form
                title: "Tell Us About Your Concerns",
                symptomsLabel: "Describe your symptoms, their appearance, and duration.",
                symptomsPlaceholder: "e.g., 'I have red, itchy patches on my cheeks that have been there for about 2 weeks.'",
                voiceInputStart: "Start voice input",
                voiceInputStop: "Stop voice input",
                culturalPromptsTitle: "Need inspiration? Try these common concerns",
                uploadImageTitle: "Add a Photo for Analysis",
                uploadButton: "Upload Photo",
                cameraButton: "Use Camera",
                removeImage: "Remove Photo",
                validationError: "Please describe your concerns or upload a photo before analyzing.",
                buttonText: "Get Comprehensive Analysis",
                detailsTitle: "Provide More Details (Optional)",
                aggravatingFactors: "What makes it worse?",
                alleviatingFactors: "What makes it better?",
                duration: "How long has this been happening?",
                durationPlaceholder: "e.g., 2 weeks, about a month",
                previousTreatments: "Previous treatments you've tried",
                medications: "Current medications or allergies",
                // Fitness Form
                statsTitle: "Your Stats",
                ageLabel: "Age",
                genderLabel: "Gender",
                genders: { male: "Male", female: "Female" },
                heightLabel: "Height (cm)",
                weightLabel: "Weight (kg)",
                goalsTitle: "Your Goals",
                goalLabel: "Primary Goal",
                goals: {
                    muscleGain: "Muscle Gain (Hypertrophy)",
                    fatLoss: "Fat Loss",
                    recomposition: "Body Recomposition",
                    strength: "Strength Gain",
                    fitness: "General Fitness"
                },
                experienceLabel: "Training Experience",
                experiences: {
                    beginner: "Beginner (0-1 years)",
                    intermediate: "Intermediate (1-3 years)",
                    advanced: "Advanced (3+ years)"
                },
                daysLabel: "Workout Days per Week",
                dietLabel: "Dietary Preferences (Optional)",
                dietPlaceholder: "e.g., Vegetarian, gluten-free, any allergies...",
                fitnessButtonText: "Generate My Fitness Plan",
                fitnessValidationError: "Please fill in all required stats and goals.",
                presets: {
                    age: ["25", "30", "35", "40"],
                    height: ["165", "175", "180", "185"],
                    weight: ["60", "75", "85", "95"],
                    diet: ["High protein", "Low carb", "Vegetarian"]
                },
            },
            report: {
                generating: "Generating your personalized plan...",
                placeholder1: "Your analysis will appear here.",
                placeholder2: "Fill out the form to get started.",
                // Fitness Report
                physiqueTitle: "Physique Assessment",
                recommendationsTitle: "General Recommendations",
                workoutTitle: "Your Weekly Workout Plan",
                dietTitle: "Your Nutrition & Diet Plan",
                calories: "Daily Calories",
                protein: "Protein",
                carbs: "Carbs",
                fat: "Fat",
                sampleMealPlan: "Sample Meal Plan",
                exercise: "Exercise",
                sets: "Sets",
                reps: "Reps",
                rest: "Rest",
                video: "Video",
            },
            workoutSimulator: {
                title: "Workout Transformation Simulator",
                subtitle: "Visualize your potential physique based on your commitment.",
                uploadPrompt: "Upload a full-body photo in the form above to enable the simulator.",
                useMaleDefault: "Use Male Default Photo",
                useFemaleDefault: "Use Female Default Photo",
                loadingDefault: "Loading default image...",
                before: "Before",
                after: "After",
                daysLabel: "Workout Days/Week",
                intensityLabel: "Workout Intensity",
                intensityLevels: {
                    1: "Light",
                    2: "Moderate",
                    3: "Consistent",
                    4: "Intense",
                    5: "Athlete"
                },
                simulateButton: "Simulate Transformation",
                simulating: "Simulating...",
                reset: "Reset Simulation",
                planRequiredError: "A workout plan must be generated first to run the simulation."
            }
        },
        validation: {
            required: "This field is required.",
        },
        sellerHub: {
             presets: {
                category: ["Serum", "Moisturizer", "Cleanser", "Sunscreen"],
                brand: ["AURA Private Label", "Brand X", "Brand Y"]
            },
        },
        aiSurgerySimulator: {
            title: "AI Cosmetic Simulator",
            subtitle: "Visualize potential cosmetic enhancements with our advanced AI. Upload a clear, forward-facing photo to begin.",
            uploadTitle: "Upload Your Photo",
            uploadPrompt: "Please upload a photo to use the simulator.",
            uploadButton: "Upload from Device",
            cameraButton: "Use Camera",
            removeImage: "Use a Different Photo",
            reset: "Reset Simulation",
            proceduresTitle: "Select a Procedure",
            procedures: {
                rhinoplasty: "Rhinoplasty (Nose)",
                blepharoplasty: "Blepharoplasty (Eyelids)",
                genioplasty: "Genioplasty (Chin)",
                lipAugmentation: "Lip Augmentation",
                facelift: "Facelift",
                jawSurgery: "Jaw Contouring",
            },
            upperLip: "Upper Lip",
            lowerLip: "Lower Lip",
            generating: "Simulating...",
            before: "Before",
            after: "After",
            useDefaultMaleFace: "Use Default Male Face",
            useDefaultFemaleFace: "Use Default Female Face",
            loadingDefault: "Loading default...",
            showChanges: "Highlight Changes",
            hideChanges: "Hide Highlights",
            simulatedEffectText: "Simulated effect of {procedure}.",
        },
        proAthletePlatform: {
            hero: {
                title: "AI-Powered Performance for Elite Athletes",
                subtitle: "Personalized training, recovery, and nutrition protocols using intelligent algorithms to unlock peak performance.",
                cta: "Explore Our AI Platform"
            },
            pillars: {
                title: "The Three Pillars of Elite Performance",
                data: {
                    title: "Biometric Data Analysis",
                    description: "Our AI analyzes data from wearables, blood work, and performance tests to create a complete physiological profile."
                },
                performance: {
                    title: "Optimized Training Cycles",
                    description: "AI generates dynamic periodization plans, adjusting volume and intensity for optimal adaptation and supercompensation."
                },
                recovery: {
                    title: "Predictive Recovery Protocols",
                    description: "Algorithms monitor fatigue and readiness scores to recommend precise recovery methods, from sleep optimization to nutrition timing."
                }
            },
            aiEngine: {
                title: "The 'Olympus' Performance Engine",
                subtitle: "From data to decision in three simple steps.",
                step1: {
                    title: "Data Input",
                    description: "Sync wearables and upload performance data, health records, and competition schedules."
                },
                step2: {
                    title: "AI Analysis",
                    description: "Our algorithms identify patterns, predict performance peaks, and flag potential overtraining or injury risks."
                },
                step3: {
                    title: "Personalized Plan",
                    description: "Receive daily, actionable recommendations for training, nutrition, and recovery protocols."
                }
            },
            contact: {
                title: "Partner With Us",
                subtitle: "Join the top teams and athletes leveraging AI to redefine the limits of human performance.",
                name: "Full Name",
                organization: "Team / Organization",
                email: "Email Address",
                submit: "Send Inquiry"
            }
        },
        changelog: {
            title: "Changelog",
            new: "New",
            improvement: "Improvement",
            fix: "Fix"
        },
        researchRequestModal: {
            title: "Research Request Sent",
            body: "Your request for more information on <strong>{topic}</strong> has been submitted. Our team will review it, and this topic may be prioritized for future content updates.",
            close: "Got it"
        },
        collaborationPage: { canvasItems: {} },
        franchisePage: { canvasItems: {} },
        joinUsPage: {
            title: "Join Our Team",
            subtitle: "We are looking for passionate individuals to revolutionize the wellness and beauty industry with AI.",
            roleTitle: "AI Marketer for Gyms & Beauty Clinics",
            roleDescription: "As a key member of our growth team, you will be the face of AURA AI, connecting with personal clients, gyms, beauty clinics, and retail stores to drive adoption of our innovative platform.",
            responsibilitiesTitle: "Key Responsibilities",
            responsibilities: [
                "Analyze competitors and similar products they produce.",
                "Establish an effective and influential market presence.",
                "Attract and persuade new clients and partners.",
                "Implement effective advertising methods and campaigns.",
                "Understand and analyze customer behavior and needs.",
                "Maintain complete mastery of product knowledge, including its advantages and disadvantages.",
                "Analyze the needs of the target market to identify opportunities.",
                "Maintain a strong physical and virtual presence in the target market.",
                "Collaborate with the market research unit to provide feedback.",
                "Provide excellent after-sales service and support."
            ],
            skillsTitle: "Skills & Abilities",
            skills: [
                "Deep understanding of the consumer, their behaviors, and interests.",
                "Strong public speaking, presentation, and communication skills.",
                "Proven ability to attract customers and build lasting trust.",
                "Excellent time management and organizational skills.",
                "Ability to work effectively as part of a collaborative team.",
                "Proficiency with computers and internet tools (basic Word and Excel required)."
            ],
            collaborationType: "Type of Cooperation:",
            collaborationText: "Full-time, Part-time, and Project-based positions available.",
            applyTitle: "Ready to Apply?",
            applySubtitle: "Choose your path or fill out the form below and our team will get in touch with you.",
            formName: "Full Name",
            formEmail: "Email Address",
            formMessage: "Tell us why you're a good fit (Optional)",
            formSubmit: "Submit Application",
            applySuccess: "Your application has been submitted successfully!",
            becomeCoachButton: "Become a Coach",
            applyMarketingButton: "Apply for Marketing Role",
        },
    },
    fa: {
        header: {
            home: "خانه",
            aiServices: "خدمات هوشمند",
            skinConsultation: "تحلیل پوست",
            fitnessAssessment: "ارزیابی تناسب اندام",
            cosmeticSimulator: "شبیه‌ساز زیبایی",
            physiqueSimulator: "شبیه‌ساز بدن",
            locationFinder: "مکان‌یاب",
            aiCoach: "مربی هوشمند",
            marketTrends: "ترندهای بازار",
            ourExperts: "متخصصان ما",
            collaboration: "همکاری",
            joinUs: "به ما بپیوندید",
            sellerHub: "پنل فروشندگان",
            myPlans: "برنامه‌های من",
            login: "ورود / ثبت نام",
            logout: "خروج",
        },
        hero: {
            title: "AURA AI: همراه شما در<br/>سلامتی و تناسب اندام",
            subtitle: "تحلیل پوست شخصی‌سازی‌شده، برنامه‌های تمرینی هوشمند و پیشنهادات درمانی برای رسیدن به بهترین فرم شما، از درون و بیرون.",
            button1: "شروع تحلیل پوست",
            button2: "دریافت برنامه تناسب اندام",
            servicesTitle: "خدمات برتر ما",
            servicesSubtitle: "نگاهی جامع به سلامتی، با ترکیب درمان‌های زیبایی پیشرفته و مربیگری علمی تناسب اندام.",
            cosmeticServices: [
                { "icon": "laser", "title": "درمان‌های لیزری", "description": "تراپی‌های لیزری پیشرفته برای حذف مو، جوان‌سازی پوست و کاهش اسکار." },
                { "icon": "injectables", "title": "تزریقات و فیلرها", "description": "بوتاکس و فیلرهای پوستی توسط متخصصین برای بازگرداندن حجم و رفع چین و چروک." },
                { "icon": "facial", "title": "فیشیال‌های پیشرفته", "description": "درمان‌های فیشیال سفارشی، از هیدرافیشیال تا لایه‌برداری شیمیایی، برای پوستی درخشان." },
                { "icon": "skincare", "title": "مراقبت حرفه‌ای پوست", "description": "محصولات حرفه‌ای و روتین‌های متناسب با نوع پوست و نگرانی‌های خاص شما." }
            ],
            fitnessServices: [
                { "icon": "workout", "title": "تمرین شخصی‌سازی‌شده", "description": "برنامه‌های تمرینی هفتگی تولید شده توسط هوش مصنوعی متناسب با اهداف، تجربه و برنامه شما." },
                { "icon": "nutrition", "title": "مربی تغذیه هوشمند", "description": "برنامه‌های غذایی سفارشی و اهداف ماکرو برای تامین انرژی تمرینات و تسریع نتایج." },
                { "icon": "physique", "title": "شبیه‌سازی بدن", "description": "تغییرات بالقوه خود را با شبیه‌ساز بدن مبتنی بر هوش مصنوعی ما تجسم کنید." },
                { "icon": "wellness", "title": "رهگیری سلامتی", "description": "ادغام داده‌ها از دستگاه‌های پوشیدنی برای نظارت بر پیشرفت و دریافت مشاوره لحظه‌ای." }
            ],
            aiFitnessExplanation: {
                title: "چگونه هوش مصنوعی بدنسازی را متحول می‌کند",
                subtitle: "هوش مصنوعی دیگر یک ابزار لوکس نیست؛ بلکه به عنوان یک همراه علمی و دقیق در سفر تناسب اندام شما عمل می‌کند.",
                points: [
                    { "title": "برنامه‌های تمرینی شخصی‌سازی‌شده", "description": "الگوریتم‌های هوش مصنوعی ویژگی‌های فیزیکی، سابقه تمرینی، اهداف و آمادگی روزانه شما را تحلیل کرده و یک برنامه تمرینی سفارشی ایجاد می‌کنند. این برنامه‌ها تمرینات ترکیبی مانند اسکات و ددلیفت را برای حداکثر نتیجه توصیه می‌کنند." },
                    { "title": "نظارت بر پیشرفت", "description": "با استفاده از داده‌های ردیاب‌های تناسب اندام، هوش مصنوعی تعداد تکرارها، ست‌ها، وزنه‌ها و زمان استراحت شما را تحلیل کرده و بازخورد شخصی برای بهبود برنامه ارائه می‌دهد و پیشرفت شما را به صورت نمودار نمایش می‌دهد." },
                    { "title": "پیشگیری از آسیب", "description": "با تحلیل دامنه حرکت و فرم بدن، هوش مصنوعی می‌تواند خطرات احتمالی آسیب را تشخیص دهد. اگر حرکتی را به طور مکرر اشتباه انجام دهید، اصلاح فرم را برای جلوگیری از فشار بیش از حد پیشنهاد می‌دهد." },
                    { "title": "انتخاب مکمل مناسب", "description": "هوش مصنوعی با بررسی رژیم غذایی، اهداف و داده‌های جسمی شما، کمبودهای مواد مغذی را شناسایی کرده و مکمل‌هایی مانند پروتئین، کراتین و ویتامین‌ها را برای افزایش بازدهی تمرین توصیه می‌کند." }
                ]
            }
        },
        b2bCta: {
            title: "رشد کسب‌وکار خود را با AURA AI تقویت کنید",
            subtitle: "از پلتفرم هوشمند ما برای تحلیل ترندهای بازار، تولید محتوای جذاب و تعامل با مخاطبان خود به روشی نوین استفاده کنید. AURA AI شریک شما در بازاریابی دیجیتال در حوزه سلامتی و زیبایی است.",
            features: [
                { icon: "analytics", title: "تحلیلگر هوشمند بازار", description: "بینش‌های لحظه‌ای در مورد ترندهای بازار، استراتژی‌های رقبا و رفتار مصرف‌کننده برای تصمیم‌گیری‌های داده‌محور دریافت کنید." },
                { icon: "content", title: "تولید محتوای استراتژیک", description: "مشاوره‌های مبتنی بر هوش مصنوعی برای سبد محصولات خود دریافت کنید، زوایای کلیدی بازاریابی را شناسایی کرده و محتوای استراتژیک بسازید." },
                { icon: "engagement", title: "تعامل پیشرفته با مشتری", description: "از مربیان هوشمند و برنامه‌های شخصی‌سازی‌شده برای ایجاد روابط عمیق‌تر و معنادارتر با مشتریان خود استفاده کنید." }
            ],
            ctaButton1: "بررسی فرصت‌های همکاری",
            ctaButton2: "به تیم بازاریابی ما بپیوندید"
        },
        myPlansPage: {
            title: "برنامه‌های ذخیره شده من",
            subtitle: "برنامه‌های پوست و تناسب اندام تولید شده توسط هوش مصنوعی خود را مرور، بازیابی یا حذف کنید.",
            restore: "مشاهده برنامه",
            delete: "حذف",
            deleteConfirm: "آیا از حذف «{name}» مطمئن هستید؟ این عمل قابل بازگشت نیست.",
            savedOn: "ذخیره شده در",
            emptyTitle: "هیچ برنامه‌ای ذخیره نشده است",
            emptyText: "برنامه‌های ذخیره شده شما در اینجا نمایش داده می‌شوند.",
            goBackButton: "شروع ارزیابی جدید",
        },
        footer: {
            description: "همراه هوشمند شما برای زیبایی، سلامتی و مربیگری تناسب اندام شخصی‌سازی‌شده.",
            copyright: "© ۲۰۲۴ AURA AI. تمام حقوق محفوظ است.",
        },
        quotaErrorModal: {
            title: "سهمیه به پایان رسید",
            body: "شما از سهمیه API خود فراتر رفته‌اید. لطفاً وضعیت صورتحساب خود را بررسی کنید یا بعداً دوباره تلاش کنید. ویژگی‌های هوش مصنوعی موقتاً در دسترس نیستند.",
            cta: "بررسی صورتحساب",
            close: "بستن",
        },
        loginModal: {
            title: "ورود به حساب کاربری",
            google: "ادامه با گوگل",
            emailPlaceholder: "ایمیل خود را وارد کنید",
            passwordPlaceholder: "رمز عبور خود را وارد کنید",
            loginButton: "ورود",
        },
        aiCoach: {
            title: "مربی هوشمند AURA",
            subtitle: "هر سوالی در مورد مراقبت از پوست، تناسب اندام، تغذیه یا روتین‌های سلامتی دارید بپرسید. من اینجا هستم تا در سفر شما کمک کنم.",
            placeholder: "سوال خود را اینجا تایپ کنید...",
        },
        marketTrends: {
            title: "تحلیلگر ترندهای بازار",
            subtitle: "یک موضوع را وارد کنید تا آخرین دیدگاه‌ها، ترندها و تحلیل‌های بازار در صنایع زیبایی و تناسب اندام را دریافت کنید.",
            searchPlaceholder: "مثلا: «سرم‌های ضد پیری» یا «تجهیزات ورزشی خانگی»",
            searching: "در حال تحلیل...",
            searchButton: "تحلیل کن",
            placeholder: "تحلیل بازار شما در اینجا نمایش داده خواهد شد.",
            loading: {
                scanning: "در حال اسکن نتایج جستجو...",
                synthesizing: "در حال ترکیب اطلاعات...",
                extracting: "در حال استخراج نکات کلیدی...",
                compiling: "در حال آماده‌سازی گزارش شما...",
            },
            analysisModes: {
                quick: "خلاصه سریع",
                "in-depth": "تحلیل عمیق",
                swot: "تحلیل SWOT",
            },
            results: {
                keyInsights: "نکات کلیدی",
                detailedSummary: "خلاصه تفصیلی",
                emergingTrends: "ترندهای نوظهور",
                opportunities: "فرصت‌ها",
                risks: "ریسک‌ها",
                strengths: "نقاط قوت",
                weaknesses: "نقاط ضعف",
                threats: "تهدیدها",
            },
            sources: "منابع",
            relatedTopics: "موضوعات مرتبط",
            suggestionsLabel: "پیشنهاد جستجو",
            suggestions: ["مکمل‌های کلاژن", "ترندهای تمرینات HIIT", "اپلیکیشن‌های تغذیه شخصی", "فناوری پوشیدنی ورزشی"],
        },
        ourExperts: {
            title: "با تیم متخصص ما آشنا شوید",
            subtitle: "پلتفرم ما توسط تیمی از متخصصان مجرب و واجد شرایط برای ارائه بهترین مراقبت‌ها پشتیبانی می‌شود.",
            tabs: {
                coaches: "مربیان تناسب اندام",
                doctors: "پزشکان زیبایی",
            },
            tableHeaders: { "name": "نام", "specialty": "تخصص", "bio": "بیوگرافی", "license": "شماره نظام پزشکی", "certification": "کد گواهینامه" },
            doctors: [
                { "name": "دکتر سارا چن", "specialty": "متخصص پوست", "bio": "متخصص در درماتولوژی زیبایی و درمان‌های لیزری، با بیش از ۱۵ سال تجربه.", "licenseNumber": "ن-۱۲۳۴۵" },
                { "name": "دکتر بن کارتر", "specialty": "پزشک زیبایی", "bio": "متخصص در تزریقات مانند بوتاکس و فیلر، با تمرکز بر نتایج طبیعی.", "licenseNumber": "ن-۶۷۸۹۰" },
                { "name": "دکتر آوا نظری", "specialty": "متخصص مو", "bio": "تمرکز بر سلامت مو و پوست سر، ارائه راه‌حل‌های پیشرفته برای ریزش مو.", "licenseNumber": "ن-۵۴۳۲۱" }
            ],
            coaches: [
                { "name": "الکس 'رپتور' ونس", "specialty": "قدرت و آماده‌سازی", "bio": "ورزشکار حرفه‌ای سابق، متخصص در توسعه قدرت انفجاری و تمرینات هایپرتروفی.", "licenseNumber": "CSCS-98765" },
                { "name": "ایزابل روسی", "specialty": "تغذیه و کاهش چربی", "bio": "متخصص تغذیه تایید شده با تمرکز بر برنامه‌های غذایی پایدار و بازسازی بدن.", "licenseNumber": "PN1-55432" },
                { "name": "کنجی تاناکا", "specialty": "تحرک و تناسب اندام عملکردی", "bio": "متخصص در حرکت عملکردی و پیشگیری از آسیب برای سلامت ورزشی طولانی‌مدت.", "licenseNumber": "FRC-11223" }
            ],
        },
        locationFinder: {
            title: "مکان‌های ما را پیدا کنید",
            subtitle: "نزدیک‌ترین کلینیک، باشگاه یا متخصص وابسته به AURA را پیدا کنید.",
            searchPlaceholder: "جستجو بر اساس شهر، تخصص، یا نام...",
            searchButtonText: "جستجو",
            or: "یا",
            geoSearchButton: "پیدا کردن مکان‌های نزدیک من",
            searching: "در حال جستجو...",
            placeholder: "نتایج جستجو در اینجا نمایش داده خواهد شد.",
            resultsTitle: "مکان‌های ما",
            services: "خدمات ارائه شده",
            searchCategoryLabel: "من به دنبال:",
            categoryBeauty: "زیبایی",
            categoryFitness: "تناسب اندام",
            searchTypeClinics: "کلینیک‌ها",
            searchTypeDoctors: "پزشکان",
            searchTypeGyms: "باشگاه‌ها",
            searchTypeCoaches: "مربیان",
        },
        assessment: {
            saveButton: "ذخیره برنامه",
            skinTitle: "مشاوره مجازی پوست با هوش مصنوعی",
            skinSubtitle: "مشکلات پوستی خود را شرح دهید تا هوش مصنوعی ما یک تحلیل جامع ارائه داده و مراحل بعدی را پیشنهاد دهد.",
            fitnessTitle: "ارزیابی تناسب اندام با هوش مصنوعی",
            fitnessSubtitle: "آمار و اهداف خود را وارد کنید تا یک برنامه تمرینی و رژیم غذایی شخصی‌سازی‌شده توسط هوش مصنوعی دریافت کنید.",
            form: {
                // Skin form
                title: "مشکلات خود را شرح دهید",
                symptomsLabel: "علائم، ظاهر و مدت زمان آن‌ها را شرح دهید.",
                symptomsPlaceholder: "مثلا: «لکه‌های قرمز و خارش‌دار روی گونه‌هایم دارم که حدود ۲ هفته است ظاهر شده‌اند.»",
                voiceInputStart: "شروع ورودی صوتی",
                voiceInputStop: "توقف ورودی صوتی",
                culturalPromptsTitle: "نیاز به ایده دارید؟ این موارد رایج را امتحان کنید",
                uploadImageTitle: "برای تحلیل یک عکس اضافه کنید",
                uploadButton: "آپلود عکس",
                cameraButton: "استفاده از دوربین",
                removeImage: "حذف عکس",
                validationError: "لطفا قبل از تحلیل، مشکلات خود را شرح دهید یا یک عکس بارگذاری کنید.",
                buttonText: "دریافت تحلیل جامع",
                detailsTitle: "جزئیات بیشتر (اختیاری)",
                aggravatingFactors: "چه چیزی آن را بدتر می‌کند؟",
                alleviatingFactors: "چه چیزی آن را بهتر می‌کند؟",
                duration: "چه مدت است که این مشکل را دارید؟",
                durationPlaceholder: "مثال: ۲ هفته، حدود یک ماه",
                previousTreatments: "درمان‌های قبلی که امتحان کرده‌اید",
                medications: "داروهای مصرفی فعلی یا حساسیت‌ها",
                // Fitness Form
                statsTitle: "آمار شما",
                ageLabel: "سن",
                genderLabel: "جنسیت",
                genders: { male: "مرد", female: "زن" },
                heightLabel: "قد (سانتی‌متر)",
                weightLabel: "وزن (کیلوگرم)",
                goalsTitle: "اهداف شما",
                goalLabel: "هدف اصلی",
                goals: {
                    muscleGain: "افزایش عضله (هایپرتروفی)",
                    fatLoss: "کاهش چربی",
                    recomposition: "بازسازی بدن",
                    strength: "افزایش قدرت",
                    fitness: "تناسب اندام عمومی"
                },
                experienceLabel: "تجربه تمرینی",
                experiences: {
                    beginner: "مبتدی (۰-۱ سال)",
                    intermediate: "متوسط (۱-۳ سال)",
                    advanced: "پیشرفته (۳+ سال)"
                },
                daysLabel: "تعداد روزهای تمرین در هفته",
                dietLabel: "ترجیحات غذایی (اختیاری)",
                dietPlaceholder: "مثال: گیاهخوار، بدون گلوتن، هرگونه حساسیت...",
                fitnessButtonText: "تولید برنامه تناسب اندام من",
                fitnessValidationError: "لطفاً تمام آمار و اهداف مورد نیاز را پر کنید.",
                presets: {
                    age: ["۲۵", "۳۰", "۳۵", "۴۰"],
                    height: ["۱۶۵", "۱۷۵", "۱۸۰", "۱۸۵"],
                    weight: ["۶۰", "۷۵", "۸۵", "۹۵"],
                    diet: ["پروتئین بالا", "کربوهیدرات کم", "گیاهخواری"]
                },
            },
            report: {
                generating: "در حال تولید برنامه شخصی شما...",
                placeholder1: "تحلیل شما در اینجا نمایش داده خواهد شد.",
                placeholder2: "برای شروع، فرم را تکمیل کنید.",
                // Fitness Report
                physiqueTitle: "ارزیابی بدن",
                recommendationsTitle: "توصیه‌های عمومی",
                workoutTitle: "برنامه تمرینی هفتگی شما",
                dietTitle: "برنامه تغذیه و رژیم شما",
                calories: "کالری روزانه",
                protein: "پروتئین",
                carbs: "کربوهیدرات",
                fat: "چربی",
                sampleMealPlan: "نمونه برنامه غذایی",
                exercise: "تمرین",
                sets: "ست",
                reps: "تکرار",
                rest: "استراحت",
                video: "ویدیو",
            },
            workoutSimulator: {
                title: "شبیه‌ساز تحول با ورزش",
                subtitle: "فیزیک بدنی بالقوه خود را بر اساس تعهدتان تجسم کنید.",
                uploadPrompt: "برای فعال‌سازی شبیه‌ساز، یک عکس تمام قد در فرم بالا آپلود کنید.",
                useMaleDefault: "استفاده از عکس پیش‌فرض مرد",
                useFemaleDefault: "استفاده از عکس پیش‌فرض زن",
                loadingDefault: "در حال بارگذاری عکس پیش‌فرض...",
                before: "قبل",
                after: "بعد",
                daysLabel: "روزهای تمرین/هفته",
                intensityLabel: "شدت تمرین",
                intensityLevels: {
                    1: "سبک",
                    2: "متوسط",
                    3: "مداوم",
                    4: "شدید",
                    5: "ورزشکار"
                },
                simulateButton: "شبیه‌سازی تحول",
                simulating: "در حال شبیه‌سازی...",
                reset: "ریست شبیه‌سازی",
                planRequiredError: "برای اجرای شبیه‌سازی، ابتدا باید یک برنامه تمرینی ایجاد شود."
            }
        },
        validation: {
            required: "این فیلد الزامی است.",
        },
        sellerHub: {
            presets: {
                category: ["سرم", "مرطوب‌کننده", "پاک‌کننده", "ضدآفتاب"],
                brand: ["برند اورا", "برند ایکس", "برند وای"]
            },
        },
        aiSurgerySimulator: {
            title: "شبیه‌ساز زیبایی با هوش مصنوعی",
            subtitle: "تغییرات احتمالی زیبایی را با هوش مصنوعی پیشرفته ما تجسم کنید. برای شروع، یک عکس واضح از روبرو آپلود کنید.",
            uploadTitle: "عکس خود را آپلود کنید",
            uploadPrompt: "لطفا برای استفاده از شبیه‌ساز یک عکس آپلود کنید.",
            uploadButton: "آپلود از دستگاه",
            cameraButton: "استفاده از دوربین",
            removeImage: "استفاده از عکس دیگر",
            reset: "ریست شبیه‌سازی",
            proceduresTitle: "انتخاب عمل",
            procedures: {
                rhinoplasty: "رینوپلاستی (بینی)",
                blepharoplasty: "بلفاروپلاستی (پلک)",
                genioplasty: "ژنیوپلاستی (چانه)",
                lipAugmentation: "حجم‌دهی لب",
                facelift: "لیفت صورت",
                jawSurgery: "زاویه‌سازی فک",
            },
            upperLip: "لب بالا",
            lowerLip: "لب پایین",
            generating: "در حال شبیه‌سازی...",
            before: "قبل",
            after: "بعد",
            useDefaultMaleFace: "استفاده از چهره پیش‌فرض مرد",
            useDefaultFemaleFace: "استفاده از چهره پیش‌فرض زن",
            loadingDefault: "در حال بارگذاری...",
            showChanges: "نمایش تغییرات",
            hideChanges: "پنهان کردن تغییرات",
            simulatedEffectText: "تأثیر شبیه‌سازی شده برای {procedure}.",
        },
        proAthletePlatform: {
            hero: {
                title: "عملکرد مبتنی بر هوش مصنوعی برای ورزشکاران نخبه",
                subtitle: "پروتکل‌های تمرینی، ریکاوری و تغذیه شخصی‌سازی‌شده با استفاده از الگوریتم‌های هوشمند برای دستیابی به اوج عملکرد.",
                cta: "پلتفرم هوش مصنوعی ما را کاوش کنید"
            },
            pillars: {
                title: "سه ستون عملکرد نخبگان",
                data: {
                    title: "تحلیل داده‌های بیومتریک",
                    description: "هوش مصنوعی ما داده‌های دستگاه‌های پوشیدنی، آزمایش خون و تست‌های عملکرد را برای ایجاد یک پروفایل فیزیولوژیکی کامل تحلیل می‌کند."
                },
                performance: {
                    title: "چرخه‌های تمرینی بهینه",
                    description: "هوش مصنوعی برنامه‌های زمان‌بندی پویا تولید می‌کند و حجم و شدت را برای سازگاری بهینه و جبران فوق‌العاده تنظیم می‌کند."
                },
                recovery: {
                    title: "پروتکل‌های ریکاوری پیش‌بینانه",
                    description: "الگوریتم‌ها نمرات خستگی و آمادگی را برای توصیه روش‌های دقیق ریکاوری، از بهینه‌سازی خواب تا زمان‌بندی تغذیه، نظارت می‌کنند."
                }
            },
            aiEngine: {
                title: "موتور عملکرد 'المپوس'",
                subtitle: "از داده تا تصمیم در سه مرحله ساده.",
                step1: {
                    title: "ورود داده",
                    description: "همگام‌سازی دستگاه‌های پوشیدنی و بارگذاری داده‌های عملکرد، سوابق بهداشتی و برنامه‌های مسابقات."
                },
                step2: {
                    title: "تحلیل هوش مصنوعی",
                    description: "الگوریتم‌های ما الگوها را شناسایی می‌کنند، اوج عملکرد را پیش‌بینی می‌کنند و خطرات بالقوه تمرین بیش از حد یا آسیب را مشخص می‌کنند."
                },
                step3: {
                    title: "برنامه شخصی‌سازی‌شده",
                    description: "دریافت توصیه‌های روزانه و عملی برای پروتکل‌های تمرین، تغذیه و ریکاوری."
                }
            },
            contact: {
                title: "با ما شریک شوید",
                subtitle: "به تیم‌ها و ورزشکاران برتر بپیوندید که از هوش مصنوعی برای بازتعریف محدودیت‌های عملکرد انسانی استفاده می‌کنند.",
                name: "نام کامل",
                organization: "تیم / سازمان",
                email: "آدرس ایمیل",
                submit: "ارسال درخواست"
            }
        },
        changelog: {
            title: "لیست تغییرات",
            new: "جدید",
            improvement: "بهبود",
            fix: "اصلاح"
        },
        researchRequestModal: {
            title: "درخواست تحقیق ارسال شد",
            body: "درخواست شما برای اطلاعات بیشتر در مورد <strong>{topic}</strong> ثبت شد. تیم ما آن را بررسی خواهد کرد و ممکن است این موضوع برای به‌روزرسانی‌های محتوایی آینده در اولویت قرار گیرد.",
            close: "متوجه شدم"
        },
        collaborationPage: { canvasItems: {} },
        franchisePage: { canvasItems: {} },
        joinUsPage: {
            title: "به تیم ما بپیوندید",
            subtitle: "ما به دنبال افراد پرشور برای ایجاد تحول در صنعت سلامتی و زیبایی با هوش مصنوعی هستیم.",
            roleTitle: "بازاریاب هوش مصنوعی برای باشگاه‌ها و کلینیک‌های زیبایی",
            roleDescription: "به عنوان عضوی کلیدی از تیم رشد ما، شما چهره AURA AI خواهید بود و با مشتریان شخصی، باشگاه‌ها، کلینیک‌های زیبایی و فروشگاه‌ها برای پیشبرد پلتفرم نوآورانه ما ارتباط برقرار خواهید کرد.",
            responsibilitiesTitle: "وظایف و مسئولیت‌ها",
            responsibilities: [
                "بررسی رقبا و محصولات مشابهی که تولید می‌کنند.",
                "حضور موثر و تاثیرگذار در بازار.",
                "توانایی جذب و متقاعد کردن مشتریان و شرکای جدید.",
                "استفاده از روش‌های موثر تبلیغات و کمپین‌ها.",
                "تلاش برای شناخت رفتار و نیازهای مشتریان.",
                "تسلط کامل بر شناخت محصول و اطلاع از مزایا و معایب آن.",
                "تحلیل نیاز بازار هدف برای شناسایی فرصت‌ها.",
                "حضور موثر در بازار هدف به‌صورت فیزیکی یا مجازی.",
                "ارتباط و همکاری با واحد تحقیقات بازاریابی.",
                "ارائه خدمات پس از فروش عالی و پشتیبانی."
            ],
            skillsTitle: "مهارت‌ها و توانایی‌ها",
            skills: [
                "شناخت عمیق مصرف‌کننده، رفتارها و علایق او.",
                "داشتن فن بیان قوی و مهارت‌های ارتباطی و سخنوری.",
                "توانایی اثبات‌شده در جذب مشتری و ایجاد اطمینان در او.",
                "مدیریت زمان و مهارت‌های سازماندهی عالی.",
                "توانایی کار تیمی موثر در یک محیط همکاری.",
                "کار با کامپیوتر و اینترنت (توانایی کار با ورد و اکسل در حد مقدماتی الزامی است)."
            ],
            collaborationType: "نوع همکاری:",
            collaborationText: "امکان همکاری به صورت تمام وقت، پاره وقت و پروژه‌ای.",
            applyTitle: "آماده همکاری هستید؟",
            applySubtitle: "مسیر خود را انتخاب کنید یا فرم زیر را پر کنید تا تیم ما با شما تماس بگیرد.",
            formName: "نام کامل",
            formEmail: "آدرس ایمیل",
            formMessage: "به ما بگویید چرا فرد مناسبی هستید (اختیاری)",
            formSubmit: "ارسال درخواست",
            applySuccess: "درخواست شما با موفقیت ثبت شد!",
            becomeCoachButton: "مربی شوید",
            applyMarketingButton: "برای بازاریابی اقدام کنید",
        },
    },
    ar: {
        // Arabic translations would go here, following the same structure.
        // For brevity, I'll omit them, but a full implementation would include them.
    }
};

const getDescendantProp = (obj: any, desc: string): any => {
    const arr = desc.split('.');
    while (arr.length) {
        const next = arr.shift();
        if (next && obj && typeof obj === 'object' && next in obj) {
            obj = obj[next];
        } else {
            return desc; // Key not found
        }
    }
    return obj || desc;
};


export type Page =
  | 'home'
  | 'skin_consultation'
  | 'fitness_assessment'
  | 'location_finder'
  | 'ai_consultant'
  | 'market_trends'
  | 'our_experts'
  | 'collaboration'
  | 'my_consultations'
  | 'franchise'
  | 'seller_hub'
  | 'cosmetic_simulator'
  | 'physique_simulator'
  | 'case_study_bayer_aflak'
  | 'join_us';

export type SurgeryType = 'rhinoplasty' | 'blepharoplasty' | 'genioplasty' | 'lipAugmentation' | 'facelift' | 'jawSurgery';

export interface LipAugmentationIntensity {
    upper: number;
    lower: number;
}

export type ProcedureIntensity = number | LipAugmentationIntensity;

export type Language = 'en' | 'fa' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fa');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
    }
  };
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        document.documentElement.dir = (language === 'fa' || language === 'ar') ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }
  }, [language]);


  const t = (key: string): any => {
    return getDescendantProp(translations[language], key) || getDescendantProp(translations['en'], key) || key;
  };
  
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- App Data Structures ---

export type MarketAnalysisMode = 'quick' | 'in-depth' | 'swot';

export interface SymptomDetails {
    aggravatingFactors: string;
    alleviatingFactors: string;
    duration: string;
    previousTreatments: string;
    medications: string;
}

export interface IdentifiedCondition {
    name: string;
    description: string;
    relevance: 'High' | 'Medium' | 'Low';
    details?: string;
    isLoadingDetails?: boolean;
    detailsError?: string | null;
    furtherReading?: string;
    isLoadingFurtherReading?: boolean;
    furtherReadingError?: string | null;
    suggestedStep: string;
}

export interface TreatmentSuggestion {
    icon: string;
    title: string;
    description: string;
}

export interface ConsultationResult {
    disclaimer: string;
    recommendedSpecialists: string[];
    identifiedConditions: IdentifiedCondition[];
    lifestyleAdvice: string;
    treatmentSuggestions: TreatmentSuggestion[];
    followUpQuestions: string[];
}

export interface SkinAnalysisResult {
    skinType: string;
    skinDescription: string;
    keyCharacteristics: string[];
    recommendedIngredients: string[];
    ingredientsToAvoid: string[];
    actionableSuggestions: string[];
}

export interface MakeupStyleSuggestion {
    styleName: string;
    description: string;
    keyProducts: string[];
}

export interface HomemadeMaskRecipe {
    maskName: string;
    description: string;
    ingredients: string[];
    instructions: string;
}

export interface ComprehensiveBeautyResult {
    skinAnalysis: SkinAnalysisResult;
    healthConsultation: ConsultationResult;
    makeupStyle: MakeupStyleSuggestion;
    homemadeMask: HomemadeMaskRecipe;
}

// --- Fitness Assessment Types ---

export interface Exercise {
    name: string;
    sets: string; // e.g., "3-4"
    reps: string; // e.g., "8-12"
    rest: string; // e.g., "60-90s"
    notes?: string;
}

export interface WorkoutDay {
    day: string; // e.g., "Day 1"
    focus: string; // e.g., "Push (Chest, Shoulders, Triceps)"
    exercises: Exercise[];
}

export interface WorkoutPlan {
    split: string; // e.g., "Push/Pull/Legs (PPL)"
    days: WorkoutDay[];
}

export interface Meal {
    name: string; // e.g., "Breakfast", "Post-Workout"
    description: string;
}

export interface DietPlan {
    dailyCalories: number;
    macros: {
        protein: number; // in grams
        carbs: number;   // in grams
        fat: number;     // in grams
    };
    sampleMeals: Meal[];
}

export interface ComprehensiveFitnessResult {
    physiqueAssessment: string;
    generalRecommendations: string[];
    workoutPlan: WorkoutPlan;
    dietPlan: DietPlan;
}


export interface SavedConsultation {
    id: string;
    name: string;
    timestamp: number;
    mode: 'skin' | 'fitness';
    // Skin data
    symptoms?: string;
    symptomDetails?: SymptomDetails;
    // Fitness data
    fitnessData?: any; 
    // Shared
    imageBase64?: string | null;
    imageMimeType?: string | null;
    // Result
    result: ComprehensiveBeautyResult | ComprehensiveFitnessResult | null;
}


export interface SpecialistProfile {
    id: string;
    name: string;
    specialty: string;
    city: string;
    bio: string;
    relevanceScore: number;
    notes?: string;
}

export interface Source {
  uri: string;
  title: string;
}

// FIX: Export individual analysis types and redefine MarketTrendsResult as a union.
export interface QuickSummary {
    type: 'quick';
    summary: string;
    sources: Source[];
    suggestedQueries: string[];
}

export interface InDepthAnalysis {
    type: 'in-depth';
    keyInsights: string[];
    detailedSummary: string;
    emergingTrends: { name: string; description: string }[];
    opportunities: string[];
    risks: string[];
    sources: Source[];
    suggestedQueries: string[];
}

export interface SWOTAnalysis {
    type: 'swot';
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    sources: Source[];
    suggestedQueries: string[];
}

export type MarketTrendsResult = QuickSummary | InDepthAnalysis | SWOTAnalysis;

export interface TreatmentPlan {
    planTitle: string;
    concernSummary: string;
    suggestedTreatments: {
        icon: string;
        name: string;
        description: string;
    }[];
    disclaimer: string;
}

export interface CostAnalysisItem {
    name: string;
    estimatedCost: number;
    unit: string;
}

export interface CostAnalysisResult {
    treatmentCosts: CostAnalysisItem[];
}

export interface ProviderSearchResult {
    id: string;
    type: 'clinic' | 'doctor' | 'gym' | 'coach';
    name: string;
    description: string; // Bio for doctor, description for clinic
    services?: string[]; // For clinics
    specialty?: string; // For doctors
    address: string;
    phone: string;
    website: string;
    distance?: string;
    whatsapp?: string;
}

export interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export interface DoctorProfile {
    name: string;
    specialty: string;
    bio: string;
    licenseNumber: string;
}

// --- START OF ADDED TYPES ---

// --- Changelog Types ---
export interface ChangelogChange {
    type: 'new' | 'improvement' | 'fix';
    text: string;
}
export interface ChangelogEntry {
    version: string;
    date: string;
    changes: {
        [key in Language]: ChangelogChange[];
    };
}

// --- Dating Simulator Types ---
export type Difficulty = 'easy' | 'hard';

export interface TrainingScenarioReward {
    reward: { [key in Language]: string };
}

export interface TrainingScenario {
    id: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    easy: TrainingScenarioReward;
    hard: TrainingScenarioReward;
}

export interface TrainingPath {
    id: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    scenarios: TrainingScenario[];
}

export interface Goal {
    id: string;
    title: string;
    maxPractices: number;
}

export interface ConversationAnalysis {
    scores: {
        rapport: number;
        curiosity: number;
        vulnerability: number;
        confidence: number;
    };
    strengths: string;
    areasForImprovement: string;
}

export interface PathSuggestion {
    pathId: string;
    reasoning: string;
}

export interface ConversationCoachState {
    chatHistory: Message[];
    isStreaming: boolean;
    isLoadingAnalysis: boolean;
    currentAnalysis: ConversationAnalysis | null;
    error: string | null;
    activeGoal: Goal | null;
    practiceCount: number;
    showPathSelectionScreen: boolean;
    activeTrainingPathId: string | null;
    activeScenarioId: string | null;
    activeDifficulty: Difficulty | null;
    completedScenarios: Record<string, Difficulty[]>;
    pathSuggestions: PathSuggestion[] | null;
    selectedPartnerId: string | null;
}

// --- Treatment Plan Extended Types ---
export interface AftercareInstructions {
    instructions: string[];
    precautions: string[];
}

export interface PreTreatmentPlanItem {
    item: string;
    instruction: string;
}

export interface PreTreatmentPlanResult {
    oneWeekBefore: PreTreatmentPlanItem[];
    oneDayBefore: PreTreatmentPlanItem[];
    dayOfTreatment: PreTreatmentPlanItem[];
}

// --- Barista Styler Types ---
export interface BaristaStyleResult {
    isLoadingFemaleOutfits: boolean;
    femaleOutfitUrls: string[] | null;
    isLoadingMaleOutfits: boolean;
    maleOutfitUrls: string[] | null;
    isLoadingCounterDesigns: boolean;
    counterUrls: string[] | null;
    musicTheme: string;
}

// --- END OF ADDED TYPES ---

export interface SearchResultItem {
    title: string;
    description: string;
    targetPage: Page;
}