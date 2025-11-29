
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
            postureAnalysis: "AI Posture Analysis",
            conversationCoach: "AI Conversation Coach",
            cosmeticSimulator: "Cosmetic Simulator",
            physiqueSimulator: "Physique Simulator",
            liveBeautyCoach: "Live Beauty Coach",
            locationFinder: "Find Locations",
            aiCoach: "AI Coach",
            marketTrends: "Market Trends",
            ourExperts: "Our Experts",
            collaboration: "Collaboration",
            joinUs: "Join Us",
            sellerHub: "Seller Hub",
            myPlans: "My Plans",
            myProfile: "My Profile",
            login: "Login / Sign Up",
            logout: "Logout",
            downloadApp: "Download App",
            contentCreator: "Content Studio",
            trendHub: "Trend Hub",
            findAndLearn: "Find & Learn",
            forBusiness: "For Business",
            aboutUs: "About Us",
            baristaStyler: "Barista Styler",
            siteAnalytics: "Site Analytics",
        },
        hero: {
            title: "AURA AI: Your Partner in<br/>Wellness & Physique",
            subtitle: "Personalized skin analysis, AI-generated workout plans, and treatment suggestions to help you achieve your peak form, inside and out.",
            button1: "Start AI Skin Analysis",
            button2: "Start AI Fitness Plan",
            button3: "Start AI Movement Analysis",
            button4: "Practice Conversation Skills",
            button5: "Start Live Beauty Coach",
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
        downloadAppPage: {
            title: "Get the AURA AI App",
            subtitle: "Take your personalized wellness and physique coach with you. Track your progress, access your plans, and connect with your AI coach anytime, anywhere.",
            appStore: "Download on the App Store",
            googlePlay: "Get it on Google Play",
            scanQr: "Scan to Download",
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
            facebook: "Continue with Facebook",
            instagram: "Continue with Instagram",
            or: "OR",
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
            errors: {
                permissionDenied: "Location access was denied. Please enable it in your browser settings to search by location.",
                positionUnavailable: "Your location could not be determined. This can happen due to network issues. Please check your connection or try a text search.",
                timeout: "Finding your location took too long. Please try again.",
                generic: "An unknown error occurred while getting your location.",
                searchingWithoutLocation: "Searching without location."
            }
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
                // Skin Report Visuals
                yourAnalyzedPhoto: "Your Analyzed Photo",
                visualizeCondition: "Visualize Condition",
                visualizing: "Visualizing...",
                visualizationTitle: "AI Visualization",
                generatingVisualization: "Generating visual representation...",
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
            email: "Please enter a valid email address.",
            passwordLength: "Password must be at least 6 characters long.",
        },
        permissions: {
            cameraDenied: "Camera access is denied. To use the camera feature, please enable it in your browser settings.",
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
            photoshootTab: "AI Photoshoot",
            photoshootTitle: "Generate a New Viewpoint",
            photoshootDescription: "Describe a style, and our AI will create a professional-style photoshoot image.",
            photoshootPromptPlaceholder: "e.g., 'Vogue magazine cover, dramatic lighting, soft focus'",
            generatePhotoshootButton: "Generate Viewpoint",
            glamourTab: "AI Glamour",
            glamourTitle: "AI Glamour Shot",
            glamourDescription: "Let our AI perform a professional glamour retouch on your photo. It will enhance lighting, smooth skin, and apply tasteful makeup for a polished look.",
            beautifyButton: "Beautify My Photo",
        },
        liveBeautyCoachPage: {
            title: "Live AI Beauty Coach",
            subtitle: "Get real-time beauty enhancements and personalized product recommendations. Position your face in the frame and capture an image to begin.",
            startCamera: "Start Camera",
            stopCamera: "Stop Camera",
            captureAndAnalyze: "Capture & Analyze",
            analyzing: "Analyzing...",
            before: "Before",
            after: "After",
            recommendationsTitle: "Personalized Recommendations",
            getStarted: "Start your camera to begin the live analysis.",
            preparingCamera: "Preparing Camera...",
            errors: {
                permissionDenied: "Camera access was denied. To use this feature, please allow camera access in your browser's site settings and refresh the page.",
                notFound: "No camera found on your device. Please ensure a camera is connected and enabled.",
                generic: "Could not start the camera. Please ensure it's not being used by another application and that you have granted permission.",
                cameraNotReady: "Camera not ready or video has no dimensions. Please wait a moment and try again."
            }
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
        collaborationPage: {
            title: "Collaboration & Investment",
            goalTitle: "Our Goal",
            goalText: "To expand AURA AI's reach and impact by partnering with visionary investors, clinics, and entrepreneurs who share our passion for revolutionizing the wellness and beauty industry through technology.",
            canvasTitle: "Our Business Model Canvas",
            canvasItems: {
                'item1': "Value Proposition: AI-driven personalized wellness and beauty plans.",
                'item2': "Customer Segments: Individuals, beauty clinics, gyms, and wellness brands.",
                'item3': "Channels: Mobile app, web platform, and partner clinics.",
                'item4': "Revenue Streams: Subscriptions, B2B licensing, and franchise fees.",
                'item5': "Key Activities: AI model development, content creation, and partner support.",
                'item6': "Key Partners: Medical experts, fitness coaches, and technology providers."
            },
            statusTitle: "Current Status",
            progressLabel: "Pre-Seed Stage",
            statusText: "We are currently in the pre-seed funding stage, seeking initial capital to finalize our MVP and onboard our first cohort of partner clinics.",
            methodsTitle: "How to Collaborate",
            seedTitle: "Seed Investment",
            seedText: "We are offering equity to early-stage investors. This is an opportunity to be part of the foundational growth of AURA AI. Review our contract and contact us for more details.",
            viewContractButton: "View Contract Draft",
            contactWhatsAppButton: "Contact via WhatsApp",
            franchiseTitle: "Become a Franchise Partner",
            franchiseText: "Own and operate an AURA AI-powered clinic in your city. We provide the technology, branding, and operational support you need to succeed.",
            franchiseButton: "Learn About Franchising",
            crowdfundingTitle: "Community Crowdfunding",
            crowdfundingText: "Our community token offering will launch soon, allowing our users and supporters to own a piece of AURA AI's future. Stay tuned for announcements.",
            buyTokenButton: "Coming Soon"
        },
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
            // New Admin Role
            adminRoleTitle: "Instagram Admin & Content Creator",
            adminRoleDescription: "We are seeking a creative and professional Instagram Admin. If you can grow a page using 2025 organic strategies, we want you on our team.",
            adminResponsibilities: [
                "Full mastery of content creation, attractive caption writing, photo/video editing.",
                "Professional creation of Stories and Reels.",
                "Deep familiarity with the Instagram 2025 algorithm and organic growth techniques.",
                "Ability to engage with the audience and build a community.",
                "Submission of a strong portfolio is required."
            ],
            adminSkills: [
                "Expertise in mobile editing apps (CapCut, VN, InShot) and design tools.",
                "Creative storytelling skills.",
                "Knowledge of latest trends and viral audio.",
                "Discipline and consistency in posting."
            ],
            whatsappResumeButton: "Send Resume via WhatsApp",
            whatsappResumeText: "Send your resume and portfolio directly to our WhatsApp:",
            collaborationType: "Type of Cooperation:",
            collaborationText: "Full-time, Part-time, and Project-based positions available.",
            applyTitle: "Ready to Apply?",
            applySubtitle: "Choose your path or fill out the form below and our team will get in touch with you.",
            formName: "Full Name",
            formEmail: "Email Address",
            formMessage: "Tell us why you're a good fit (Optional) - Please include portfolio link.",
            formSubmit: "Submit Application",
            applySuccess: "Your application has been submitted successfully!",
            becomeCoachButton: "Become a Coach",
            applyMarketingButton: "Apply for Roles",
        },
        contentCreator: {
            title: "AI Content Studio",
            subtitle: "Generate engaging blog posts and social media content for your wellness brand in seconds.",
            topicLabel: "What topic do you want to write about?",
            topicPlaceholder: "e.g., 'Benefits of Vitamin C serum', 'Beginner's guide to yoga'",
            contentTypeLabel: "Choose a content format",
            contentTypes: {
                blog: "Blog Post",
                instagram: "Instagram Post",
                twitter: "Twitter Thread",
            },
            toneLabel: "Select a tone of voice",
            tones: {
                professional: "Professional",
                friendly: "Friendly & Casual",
                inspirational: "Inspirational",
                scientific: "Scientific",
            },
            generateButton: "Generate Content",
            generating: "Generating...",
            placeholder: "Your generated content will appear here. Start by entering a topic above.",
            copyButton: "Copy Content",
            copySuccess: "Copied!",
        },
        trendHub: {
            title: "AI Trend & Content Hub",
            subtitle: "Automatically discover what your users are searching for, analyze emerging trends, and create relevant content instantly.",
            analyzeButton: "Analyze User Search Trends",
            analyzing: "Analyzing...",
            trendsTitle: "Top User Trends",
            placeholder: "Click the button above to analyze recent user searches and discover trends.",
            createContentButton: "Create Content on this Topic",
            contentCreationTitle: "Content Creation",
        },
        baristaStyler: {
            title: "AI Barista & Cafe Styler",
            subtitle: "Describe your cafe's mood and theme, and our AI will generate a complete visual and auditory identity for your brand.",
            descriptionLabel: "Describe your cafe's atmosphere",
            descriptionPlaceholder: "e.g., 'A cozy, rustic cafe with lots of wood, plants, and warm lighting, focused on specialty coffee and homemade pastries.'",
            buttonText: "Generate Style",
            generating: "Generating Style...",
            placeholder: "Your generated style will appear here. Start by describing your cafe's mood.",
            resultsTitle: "Your AI-Generated Cafe Style",
            femaleStyle: "Female Barista Uniform",
            maleStyle: "Male Barista Uniform",
            counterDesign: "Counter & Ambiance Design",
            musicTheme: "Suggested Music Theme",
            generatingImage: "Generating...",
            imageFailed: "Image generation failed.",
            validationError: "Please describe your cafe's atmosphere before generating a style."
        },
        analyticsPage: {
            title: "Site Analytics",
            subtitle: "A real-time overview of your website's performance and audience engagement.",
            refreshButton: "Refresh Data",
            liveVisitors: "Live Visitors",
            today: "Today",
            thisWeek: "This Week",
            thisMonth: "This Month",
            topCountries: "Top Countries by Visitors",
            trafficSources: "Traffic Sources",
            deviceBreakdown: "Device Breakdown",
            topPages: "Most Visited Pages",
            page: "Page",
            views: "Views",
            howToConnect: "About This Dashboard",
            howToConnectBody: "This is an AI-powered simulation of a real analytics dashboard. The data is hypothetically generated by Gemini to showcase what's possible. To get real data for your website, you would typically integrate a service like Google Analytics. This involves adding a tracking script to your site and then using the Google Analytics API with secure authentication (OAuth 2.0) to fetch and display live data in a dashboard like this one.",
        },
        postureAnalysisPage: {
            title: "AI Posture & Movement Analysis",
            subtitle: "Using computer vision to analyze your biomechanics, inspired by the principles of Kinematum.",
            instructionsTitle: "How it Works",
            instructions: [
                "1. Select 'Static Posture' or 'Squat' analysis below.",
                "2. Press 'Start Camera' and grant permissions if prompted.",
                "3. Position yourself to match the sample pose. Ensure your entire body is visible.",
                "4. Click 'Analyze' to capture your image for AI analysis."
            ],
            startCamera: "Start Camera",
            stopCamera: "Stop Camera",
            cameraError: "Could not access camera. Please check your browser permissions.",
            analysisType: "Analysis Type",
            posture: "Static Posture",
            squat: "Squat Movement",
            analyzePosture: "Analyze Posture",
            analyzeSquat: "Analyze Squat",
            analyzing: "Analyzing...",
            resultsTitle: "Your Analysis",
            summary: "Summary",
            keyObservations: "Key Observations",
            correctiveExercises: "Corrective Exercises",
            severity: "Severity",
            placeholder: "Your analysis results will appear here after capturing.",
            getStarted: "Enable your camera and match the sample pose to get started.",
            samplePose: "Sample Pose",
            yourCamera: "Your Camera",
            visualizeCorrection: "Visualize Correction",
            visualizing: "Visualizing...",
            visualizationTitle: "Corrective Visualization",
            before: "Your Posture",
            after: "Potential Improvement",
            close: "Close",
            visualizationError: "Could not generate visualization.",
        },
        profilePage: {
            title: "My Profile",
            subtitle: "Manage your profile, settings, and saved plans.",
            welcome: "Welcome, Aura User",
            userInfo: "User Information",
            email: "Email",
            mockEmail: "user@aura-ai.com (demo)",
            settings: "Preferences",
            language: "Language",
            myPlans: "My Saved Plans",
            view: "View"
        },
        datingSimulator: {
            title: "AI Conversation Coach",
            subtitle: "Hone your social skills in a safe, guided environment. Practice conversations and get instant feedback."
        },
        coach: {
            explorePaths: "Explore Training Paths",
            fullReset: "Reset Coach",
            partnerSelectLabel: "Practice with:",
            partners: [
                { id: 'supportive', name: 'Supportive & Empathetic' },
                { id: 'direct', name: 'Direct & Logical' },
                { id: 'playful', name: 'Playful & Witty' },
                { id: 'reserved', name: 'Thoughtful & Reserved' },
            ],
            trainingMode: "Training Mode",
            endSessionButton: "Analyze Conversation",
            messagePlaceholder: "Type your message...",
            trainingPathsTitle: "Conversation Training Paths",
            trainingPathsSubtitle: "Select a path to focus on specific conversational skills through guided scenarios.",
            startPathButton: "Start Path",
            exitTraining: "Exit Training",
            practiceButton: "Practice",
            difficultyTitle: "Select Difficulty",
            easy: "Easy",
            hard: "Hard",
            easyReward: "Reward",
            hardReward: "Reward",
            selectButton: "Select",
            scenarioEnded: "Scenario complete! You can choose another or exit training.",
            scenarioStartPrompt: "The scene is set. How do you begin?",
            analyzing: "Analyzing your conversation...",
            analysisTitle: "Conversation Analysis",
            goalAnalysisTitle: "Practice Round Analysis",
            scores: {
                rapport: "Rapport",
                curiosity: "Curiosity",
                vulnerability: "Vulnerability",
                confidence: "Confidence"
            },
            strengths: "What Went Well",
            improvements: "Areas for Improvement",
            pathSuggestionTitle: "Recommended Training",
            startThisPath: "Start This Path",
            nextPractice: "Next Round",
            endPractice: "End Practice",
            finishAndReview: "Finish & Review",
            startNewChat: "Start New Conversation",
            endScenarioButton: "End Scenario",
            analysisPlaceholder: "Your conversation analysis will appear here after you click 'Analyze Conversation'."
        },
    },
    fa: {
        header: {
            home: "خانه",
            aiServices: "خدمات هوشمند",
            skinConsultation: "تحلیل پوست",
            fitnessAssessment: "ارزیابی تناسب اندام",
            postureAnalysis: "تحلیل وضعیت بدن",
            conversationCoach: "مربی مکالمه",
            cosmeticSimulator: "شبیه‌ساز زیبایی",
            physiqueSimulator: "شبیه‌ساز بدن",
            liveBeautyCoach: "مربی زیبایی زنده",
            locationFinder: "مکان‌یاب",
            aiCoach: "مربی هوشمند",
            marketTrends: "ترندهای بازار",
            ourExperts: "متخصصان ما",
            collaboration: "همکاری",
            joinUs: "به ما بپیوندید",
            sellerHub: "پنل فروشندگان",
            myPlans: "برنامه‌های من",
            myProfile: "پروفایل من",
            login: "ورود / ثبت نام",
            logout: "خروج",
            downloadApp: "دانلود اپلیکیشن",
            contentCreator: "استودیوی محتوا",
            trendHub: "مرکز ترند",
            findAndLearn: "جستجو و یادگیری",
            forBusiness: "برای کسب و کار",
            aboutUs: "درباره ما",
            baristaStyler: "طراحی باریستا",
            siteAnalytics: "تحلیل سایت",
        },
        hero: {
            title: "AURA AI: همراه شما در<br/>سلامتی و تناسب اندام",
            subtitle: "تحلیل پوست شخصی‌سازی‌شده، برنامه‌های تمرینی هوشمند و پیشنهادات درمانی برای رسیدن به بهترین فرم شما، از درون و بیرون.",
            button1: "شروع تحلیل پوست",
            button2: "دریافت برنامه تناسب اندام",
            button3: "شروع تحلیل حرکت",
            button4: "تمرین مهارت‌های گفتگو",
            button5: "شروع مربی زیبایی زنده",
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
         downloadAppPage: {
            title: "اپلیکیشن AURA AI را دریافت کنید",
            subtitle: "مربی شخصی سلامتی و تناسب اندام خود را همیشه همراه داشته باشید. پیشرفت خود را پیگیری کنید، به برنامه‌های خود دسترسی داشته باشید و در هر زمان و مکان با مربی هوشمند خود در ارتباط باشید.",
            appStore: "دانلود از اپ استور",
            googlePlay: "دریافت از گوگل پلی",
            scanQr: "برای دانلود اسکن کنید",
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
            facebook: "ادامه با فیسبوک",
            instagram: "ادامه با اینستاگرام",
            or: "یا",
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
            errors: {
                permissionDenied: "دسترسی به موقعیت مکانی رد شد. لطفاً برای جستجو بر اساس مکان، آن را در تنظیمات مرورگر خود فعال کنید.",
                positionUnavailable: "موقعیت مکانی شما قابل تشخیص نیست. این مشکل ممکن است به دلیل مشکلات شبکه باشد. لطفاً اتصال خود را بررسی کنید یا جستجوی متنی را امتحان کنید.",
                timeout: "پیدا کردن موقعیت مکانی شما بیش از حد طول کشید. لطفاً دوباره تلاش کنید.",
                generic: "خطای ناشناخته‌ای هنگام دریافت موقعیت مکانی شما رخ داد.",
                searchingWithoutLocation: "جستجو بدون موقعیت مکانی انجام می‌شود."
            }
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
                 // Skin Report Visuals
                yourAnalyzedPhoto: "تصویر تحلیل شده شما",
                visualizeCondition: "تجسم عارضه",
                visualizing: "در حال تجسم...",
                visualizationTitle: "تجسم هوش مصنوعی",
                generatingVisualization: "در حال تولید نمایش بصری...",
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
            email: "لطفا یک آدرس ایمیل معتبر وارد کنید.",
            passwordLength: "رمز عبور باید حداقل ۶ کارکاتر باشد.",
        },
        permissions: {
            cameraDenied: "دسترسی به دوربین مسدود است. برای استفاده از دوربین، لطفاً آن را در تنظیمات مرورگر خود فعال کنید.",
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
            photoshootTab: "فتوشات هوشمند",
            photoshootTitle: "ایجاد یک نمای جدید",
            photoshootDescription: "یک سبک را توصیف کنید تا هوش مصنوعی ما یک تصویر فتوشات حرفه‌ای برای شما بسازد.",
            photoshootPromptPlaceholder: "مثال: «عکس روی جلد مجله ووگ، نورپردازی دراماتیک، فوکوس نرم»",
            generatePhotoshootButton: "ایجاد نما",
            glamourTab: "زیبایی هوشمند",
            glamourTitle: "رتوش هوشمند",
            glamourDescription: "اجازه دهید هوش مصنوعی ما یک رتوش حرفه‌ای روی عکس شما انجام دهد. نورپردازی بهبود یافته، پوست صاف‌تر و آرایش طبیعی برای یک ظاهر بی‌نقص.",
            beautifyButton: "عکس مرا زیبا کن",
        },
        liveBeautyCoachPage: {
            title: "مربی زیبایی زنده هوش مصنوعی",
            subtitle: "بهبودهای زیبایی لحظه‌ای و توصیه‌های شخصی محصولات را دریافت کنید. صورت خود را در کادر قرار دهید و برای شروع یک عکس بگیرید.",
            startCamera: "شروع دوربین",
            stopCamera: "توقف دوربین",
            captureAndAnalyze: "عکس بگیر و تحلیل کن",
            analyzing: "در حال تحلیل...",
            before: "قبل",
            after: "بعد",
            recommendationsTitle: "توصیه‌های شخصی‌سازی‌شده",
            getStarted: "برای شروع تحلیل زنده، دوربین خود را فعال کنید.",
            preparingCamera: "در حال آماده‌سازی دوربین...",
            errors: {
                permissionDenied: "دسترسی به دوربین رد شد. برای استفاده از این قابلیت، لطفاً دسترسی دوربین را در تنظیمات سایت مرورگر خود فعال کرده و صفحه را دوباره بارگیری کنید.",
                notFound: "هیچ دوربینی در دستگاه شما یافت نشد. لطفاً اطمینان حاصل کنید که دوربین متصل و فعال است.",
                generic: "دوربین روشن نشد. لطفاً بررسی کنید که توسط برنامه دیگری استفاده نمی‌شود و مجوزهای لازم را داده‌اید.",
                cameraNotReady: "دوربین آماده نیست یا ویدیو ابعادی ندارد. لطفاً لحظه‌ای صبر کرده و دوباره تلاش کنید."
            }
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
            body: "درخواست شما برای اطلاعات بیشتر در مورد <strong>{topic}</strong> ثبت شد. تیم ما آن را بررسی خواهد کرد و ممکن است این موضوع برای به‌روز‌رسانی‌های محتوایی آینده در اولویت قرار گیرد.",
            close: "متوجه شدم"
        },
        collaborationPage: {
            title: "همکاری و سرمایه‌گذاری",
            goalTitle: "هدف ما",
            goalText: "گسترش دامنه و تأثیر AURA AI با همکاری سرمایه‌گذاران، کلینیک‌ها و کارآفرینان آینده‌نگری که در اشتیاق ما برای تحول در صنعت سلامتی و زیبایی از طریق فناوری شریک هستند.",
            canvasTitle: "بوم مدل کسب‌وکار ما",
            canvasItems: {
                'item1': "ارزش پیشنهادی: برنامه‌های سلامتی و زیبایی شخصی‌سازی‌شده مبتنی بر هوش مصنوعی.",
                'item2': "بخش‌های مشتریان: افراد، کلینیک‌های زیبایی، باشگاه‌ها و برندهای سلامتی.",
                'item3': "کانال‌ها: اپلیکیشن موبایل، پلتفرم وب و کلینیک‌های همکار.",
                'item4': "جریان‌های درآمدی: اشتراک‌ها، مجوزهای B2B و هزینه‌های فرانشیز.",
                'item5': "فعالیت‌های کلیدی: توسعه مدل هوش مصنوعی، تولید محتوا و پشتیبانی از همکاران.",
                'item6': "شرکای کلیدی: متخصصان پزشکی، مربیان تناسب اندام و ارائه‌دهندگان فناوری."
            },
            statusTitle: "وضعیت فعلی",
            progressLabel: "مرحله پیش-بذری",
            statusText: "ما در حال حاضر در مرحله تأمین مالی پیش-بذری هستیم و به دنبال سرمایه اولیه برای نهایی کردن MVP و پیوستن اولین گروه از کلینیک‌های همکار خود هستیم.",
            methodsTitle: "روش‌های همکاری",
            seedTitle: "سرمایه‌گذاری بذری",
            seedText: "ما به سرمایه‌گذاران اولیه سهام پیشنهاد می‌دهیم. این فرصتی است برای اینکه بخشی از رشد بنیادین AURA AI باشید. پیش‌نویس قرارداد ما را بررسی کرده و برای جزئیات بیشتر با ما تماس بگیرید.",
            viewContractButton: "مشاهده پیش‌نویس قرارداد",
            contactWhatsAppButton: "تماس از طریق واتس‌اپ",
            franchiseTitle: "شریک فرانشیز ما شوید",
            franchiseText: "یک کلینیک مجهز به AURA AI را در شهر خود مالک و اداره کنید. ما فناوری، برندسازی و پشتیبانی عملیاتی مورد نیاز برای موفقیت شما را فراهم می‌کنیم.",
            franchiseButton: "بیشتر درباره فرانشیز بدانید",
            crowdfundingTitle: "تأمین مالی جمعی",
            crowdfundingText: "عرضه توکن جامعه ما به زودی آغاز خواهد شد و به کاربران و حامیان ما این امکان را می‌دهد که بخشی از آینده AURA AI را در اختیار داشته باشند. منتظر اطلاعیه‌ها باشید.",
            buyTokenButton: "به زودی"
        },
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
            // New Admin Role
            adminRoleTitle: "ادمین و تولیدکننده محتوای اینستاگرام",
            adminRoleDescription: "ما به دنبال یک ادمین خلاق و حرفه‌ای برای مدیریت پیج اینستاگرام هستیم. اگر توانایی رشد پیج با استراتژی‌های ارگانیک سال ۲۰۲۵ را دارید، جای شما در تیم ما خالیست.",
            adminResponsibilities: [
                "تسلط کامل به تولید محتوا، کپشن‌نویسی جذاب، ادیت عکس و ویدیو.",
                "ساخت استوری و ریلز حرفه‌ای و تعاملی.",
                "آشنایی کامل با الگوریتم اینستاگرام ۲۰۲۵ و تکنیک‌های رشد ارگانیک.",
                "توانایی تعامل با مخاطب و ایجاد کامیونیتی.",
                "ارسال نمونه‌کار قوی الزامی است."
            ],
            adminSkills: [
                "تسلط به ابزارهای ادیت موبایل (CapCut, VN, InShot) و طراحی.",
                "خلاقیت در سناریونویسی و ایده‌پردازی.",
                "شناخت ترندهای روز و صداهای وایرال.",
                "نظم و استمرار در انتشار محتوا."
            ],
            whatsappResumeButton: "ارسال رزومه در واتس‌اپ",
            whatsappResumeText: "رزومه و نمونه‌کار خود را مستقیم به واتس‌اپ ما ارسال کنید:",
            collaborationType: "نوع همکاری:",
            collaborationText: "امکان همکاری به صورت تمام وقت، پاره وقت و پروژه‌ای.",
            applyTitle: "آماده همکاری هستید؟",
            applySubtitle: "مسیر خود را انتخاب کنید یا فرم زیر را پر کنید تا تیم ما با شما تماس بگیرد.",
            formName: "نام کامل",
            formEmail: "آدرس ایمیل",
            formMessage: "به ما بگویید چرا فرد مناسبی هستید (اختیاری) - لطفا لینک نمونه‌کار ارسال کنید.",
            formSubmit: "ارسال درخواست",
            applySuccess: "درخواست شما با موفقیت ثبت شد!",
            becomeCoachButton: "مربی شوید",
            applyMarketingButton: "برای فرصت‌های شغلی اقدام کنید",
        },
        contentCreator: {
            title: "استودیوی محتوای هوشمند",
            subtitle: "در چند ثانیه، پست‌های جذاب وبلاگ و محتوای شبکه‌های اجتماعی برای برند سلامتی خود تولید کنید.",
            topicLabel: "می‌خواهید در مورد چه موضوعی بنویسید؟",
            topicPlaceholder: "مثال: «فواید سرم ویتامین C»، «راهنمای یوگا برای مبتدیان»",
            contentTypeLabel: "یک فرمت محتوا انتخاب کنید",
            contentTypes: {
                blog: "پست وبلاگ",
                instagram: "پست اینستاگرام",
                twitter: "رشته توییت",
            },
            toneLabel: "یک لحن انتخاب کنید",
            tones: {
                professional: "حرفه‌ای",
                friendly: "دوستانه و غیررسمی",
                inspirational: "الهام‌بخش",
                scientific: "علمی",
            },
            generateButton: "تولید محتوا",
            generating: "در حال تولید...",
            placeholder: "محتوای تولید شده شما در اینجا نمایش داده می‌شود. با وارد کردن یک موضوع شروع کنید.",
            copyButton: "کپی کردن محتوا",
            copySuccess: "کپی شد!",
        },
        trendHub: {
            title: "مرکز ترند و محتوای هوشمند",
            subtitle: "به‌طور خودکار جستجوهای کاربران را کشف کنید، ترندهای نوظهور را تحلیل کرده و فوراً محتوای مرتبط تولید کنید.",
            analyzeButton: "تحلیل ترندهای جستجوی کاربران",
            analyzing: "در حال تحلیل...",
            trendsTitle: "برترین ترندهای کاربران",
            placeholder: "برای تحلیل جستجوهای اخیر کاربران و کشف ترندها، دکمه بالا را کلیک کنید.",
            createContentButton: "ایجاد محتوا در این موضوع",
            contentCreationTitle: "ایجاد محتوا",
        },
        baristaStyler: {
            title: "طراح هوشمند باریستا و کافه",
            subtitle: "حال و هوا و تم کافه خود را توصیف کنید تا هوش مصنوعی ما یک هویت بصری و شنیداری کامل برای برند شما ایجاد کند.",
            descriptionLabel: "فضای کافه خود را توصیف کنید",
            descriptionPlaceholder: "مثال: «یک کافه دنج و روستایی با چوب فراوان، گیاهان و نور گرم، با تمرکز بر قهوه تخصصی و شیرینی‌های خانگی.»",
            buttonText: "ایجاد استایل",
            generating: "در حال ایجاد استایل...",
            placeholder: "استایل تولید شده شما در اینجا نمایش داده می‌شود. با توصیف حال و هوای کافه خود شروع کنید.",
            resultsTitle: "استایل کافه تولید شده توسط هوش مصنوعی",
            femaleStyle: "یونیفرم باریستای زن",
            maleStyle: "یونیفرم باریستای مرد",
            counterDesign: "طراحی کانتر و فضا",
            musicTheme: "تم موسیقی پیشنهادی",
            generatingImage: "در حال تولید...",
            imageFailed: "تولید تصویر ناموفق بود.",
            validationError: "لطفا قبل از ایجاد استایل، فضای کافه خود را توصیف کنید."
        },
        analyticsPage: {
            title: "تحلیل سایت",
            subtitle: "نمای کلی لحظه‌ای از عملکرد وب‌سایت و تعامل مخاطبان.",
            refreshButton: "به‌روزرسانی داده‌ها",
            liveVisitors: "بازدیدکنندگان زنده",
            today: "امروز",
            thisWeek: "این هفته",
            thisMonth: "این ماه",
            topCountries: "کشورهای برتر بر اساس بازدید",
            trafficSources: "منابع ترافیک",
            deviceBreakdown: "تفکیک دستگاه‌ها",
            topPages: "پربازدیدترین صفحات",
            page: "صفحه",
            views: "بازدید",
            howToConnect: "درباره این داشبورد",
            howToConnectBody: "این یک شبیه‌سازی مبتنی بر هوش مصنوعی از یک داشبورد تحلیلی واقعی است. داده‌ها به صورت فرضی توسط Gemini تولید شده‌اند تا امکانات موجود را نمایش دهند. برای دریافت داده‌های واقعی برای وب‌سایت خود، معمولاً باید سرویسی مانند Google Analytics را ادغام کنید. این کار شامل افزودن یک اسکریپت ردیابی به سایت شما و سپس استفاده از API گوگل آنالیتیکس با احراز هویت امن (OAuth 2.0) برای دریافت و نمایش داده‌های زنده در داشبوردی مانند این است.",
        },
        postureAnalysisPage: {
            title: "تحلیل هوشمند وضعیت بدن و حرکت",
            subtitle: "استفاده از بینایی کامپیوتری برای تحلیل بیومکانیک شما، با الهام از اصول Kinematum.",
            instructionsTitle: "چگونه کار می‌کند",
            instructions: [
                "۱. نوع تحلیل 'وضعیت ایستا' یا 'اسکات' را در پایین انتخاب کنید.",
                "۲. دکمه 'شروع دوربین' را فشار دهید و در صورت درخواست، مجوزها را تایید کنید.",
                "۳. بدن خود را مطابق با ژست نمونه قرار دهید. اطمینان حاصل کنید که تمام بدن شما قابل مشاهده است.",
                "۴. برای ثبت عکس و ارسال برای تحلیل هوش مصنوعی، روی 'تحلیل کن' کلیک کنید."
            ],
            startCamera: "شروع دوربین",
            stopCamera: "توقف دوربین",
            cameraError: "دسترسی به دوربین امکان‌پذیر نیست. لطفاً مجوزهای مرورگر خود را بررسی کنید.",
            analysisType: "نوع تحلیل",
            posture: "وضعیت ایستا",
            squat: "حرکت اسکات",
            analyzePosture: "تحلیل وضعیت بدن",
            analyzeSquat: "تحلیل اسکات",
            analyzing: "در حال تحلیل...",
            resultsTitle: "تحلیل شما",
            summary: "خلاصه",
            keyObservations: "مشاهدات کلیدی",
            correctiveExercises: "تمرینات اصلاحی",
            severity: "شدت",
            placeholder: "نتایج تحلیل شما پس از ثبت در اینجا نمایش داده می‌شود.",
            getStarted: "برای شروع، دوربین خود را فعال کرده و با ژست نمونه هماهنگ شوید.",
            samplePose: "ژست نمونه",
            yourCamera: "دوربین شما",
            visualizeCorrection: "تجسم اصلاح",
            visualizing: "در حال تجسم...",
            visualizationTitle: "تجسم اصلاحی",
            before: "وضعیت فعلی شما",
            after: "بهبود بالقوه",
            close: "بستن",
            visualizationError: "امکان تولید تصویر وجود نداشت.",
        },
        profilePage: {
            title: "پروفایل من",
            subtitle: "پروفایل، تنظیمات و برنامه‌های ذخیره شده خود را مدیریت کنید.",
            welcome: "خوش آمدید، کاربر اورا",
            userInfo: "اطلاعات کاربری",
            email: "ایمیل",
            mockEmail: "user@aura-ai.com (نمایشی)",
            settings: "تنظیمات",
            language: "زبان",
            myPlans: "برنامه‌های ذخیره شده من",
            view: "مشاهده"
        },
        datingSimulator: {
            title: "مربی مکالمه هوشمند",
            subtitle: "مهارت‌های اجتماعی خود را در یک محیط امن و هدایت‌شده تقویت کنید. مکالمات را تمرین کرده و بازخورد فوری دریافت کنید."
        },
        coach: {
            explorePaths: "کاوش مسیرهای آموزشی",
            fullReset: "ریست مربی",
            partnerSelectLabel: "تمرین با:",
            partners: [
                { id: 'supportive', name: 'همراه و همدل' },
                { id: 'direct', name: 'رک و منطقی' },
                { id: 'playful', name: 'شوخ و پرانرژی' },
                { id: 'reserved', name: 'متفکر و آرام' },
            ],
            trainingMode: "حالت تمرین",
            endSessionButton: "تحلیل گفتگو",
            messagePlaceholder: "پیام خود را تایپ کنید...",
            trainingPathsTitle: "مسیرهای آموزش مکالمه",
            trainingPathsSubtitle: "برای تمرکز بر مهارت‌های خاص مکالمه از طریق سناریوهای هدایت‌شده، یک مسیر را انتخاب کنید.",
            startPathButton: "شروع مسیر",
            exitTraining: "خروج از تمرین",
            practiceButton: "تمرین",
            difficultyTitle: "انتخاب سطح سختی",
            easy: "آسان",
            hard: "سخت",
            easyReward: "پاداش",
            hardReward: "پاداش",
            selectButton: "انتخاب",
            scenarioEnded: "سناریو تمام شد! می‌توانید سناریوی دیگری را انتخاب کنید یا از تمرین خارج شوید.",
            scenarioStartPrompt: "صحنه آماده است. چگونه شروع می‌کنید؟",
            analyzing: "در حال تحلیل گفتگوی شما...",
            analysisTitle: "تحلیل گفتگو",
            goalAnalysisTitle: "تحلیل دور تمرین",
            scores: {
                rapport: "ارتباط",
                curiosity: "کنجکاوی",
                vulnerability: "آسیب‌پذیری",
                confidence: "اعتماد به نفس"
            },
            strengths: "نقاط قوت",
            improvements: "زمینه‌های بهبود",
            pathSuggestionTitle: "آموزش پیشنهادی",
            startThisPath: "این مسیر را شروع کن",
            nextPractice: "دور بعدی",
            endPractice: "پایان تمرین",
            finishAndReview: "پایان و بررسی",
            startNewChat: "شروع گفتگوی جدید",
            endScenarioButton: "پایان سناریو",
            analysisPlaceholder: "تحلیل گفتگوی شما پس از کلیک بر روی 'تحلیل گفتگو' در اینجا نمایش داده می‌شود."
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
  | 'join_us'
  | 'download_app'
  | 'content_creator'
  | 'trend_hub'
  | 'posture_analysis'
  | 'conversation_coach'
  | 'barista_styler'
  | 'analytics'
  | 'live_beauty_coach'
  | 'user_profile';

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

export interface ProductRecommendation {
    name: string;
    description: string;
    link: string;
    category: 'Skincare' | 'Makeup' | 'Treatment' | 'Tool' | 'Haircare';
}

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
    generatedImageBase64?: string | null;
    isGeneratingImage?: boolean;
    generationError?: string | null;
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

// --- Trend Hub Types ---
export interface SearchTrend {
    topic: string;
    reasoning: string;
    search_volume: 'High' | 'Medium' | 'Low';
}

// --- Analytics Types ---
export interface SiteAnalyticsData {
  liveVisitors: number;
  todayVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  topCountries: { country: string; visitors: number; flag: string; }[];
  trafficSources: { source: string; percentage: number; }[];
  deviceBreakdown: { device: string; percentage: number; }[];
  topPages: { path: string; views: number; }[];
}

// --- Posture Analysis Types ---
export interface PostureObservation {
  observation: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface HighlightShapeCircle {
  type: 'circle';
  cx: number; // 0-100
  cy: number; // 0-100
  r: number;  // 0-100
}

export interface HighlightShapeLine {
  type: 'line';
  x1: number; // 0-100
  y1: number; // 0-100
  x2: number; // 0-100
  y2: number; // 0-100
}

export type HighlightShape = HighlightShapeCircle | HighlightShapeLine;

export interface CorrectiveExercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  rest: string;
  generatedImageBase64?: string | null;
  isGenerating?: boolean;
  generationError?: string | null;
  highlightShapes?: HighlightShape[] | null;
  isGeneratingHighlights?: boolean;
}

export interface PostureAnalysisResult {
  summary: string;
  keyObservations: PostureObservation[];
  correctiveExercises: CorrectiveExercise[];
}


// --- END OF ADDED TYPES ---

export interface SearchResultItem {
    title: string;
    description: string;
    targetPage: Page;
}
