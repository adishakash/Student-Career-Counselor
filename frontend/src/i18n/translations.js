/**
 * Translations for English (en) and casual Hindi (hi).
 * Usage: t.nav.startFree  — where t = translations[language]
 */

const translations = {
  en: {
    lang: 'en',
    langLabel: 'English',
    switchLabel: 'हिंदी',

    nav: {
      whyCounseling: 'Why Counseling?',
      plans: 'Plans',
      stories: 'Stories',
      faq: 'FAQ',
      startFree: 'Start Free',
    },

    hero: {
      badge: 'Trusted by students across India',
      title: 'Your Dream Career',
      titleHighlight: 'Starts with Clarity',
      subtitle:
        'Get a personalized career counseling report powered by AI — based on your interests, personality, and goals. Made for Class 8–12 students and their parents.',
      feature1: '10-minute assessment',
      feature2: 'Report delivered instantly by email',
      feature3: 'Expert-backed guidance',
      getFree: 'Get Free Report',
      getPremium: 'Get Premium Report — ₹499',
      socialProof: 'Join hundreds of students who discovered their perfect career path',
    },

    why: {
      tag: 'The Challenge',
      title: 'Why Career Counseling',
      titleHighlight: 'Matters More Than Ever',
      subtitle:
        'India has 93 million students — yet less than 1% receive proper career guidance before making life-altering decisions. That changes today.',
      reasons: [
        {
          title: 'Stop Guessing, Start Planning',
          desc: 'Most students choose a stream or college without proper understanding of their strengths. Our assessment removes that guesswork completely.',
        },
        {
          title: 'Map Your Strengths to Careers',
          desc: 'Everyone has unique aptitudes. We analyze your interests, personality, and academic profile to suggest careers where you will genuinely thrive.',
        },
        {
          title: 'Guidance Parents Trust',
          desc: 'Parents often struggle to guide their children beyond traditional paths. Our structured report gives families a common language to discuss the future.',
        },
        {
          title: 'Right Stream, Right Future',
          desc: 'Choosing Science, Commerce, or Arts is one of the most critical decisions. Our counseling ensures that decision is data-backed, not pressure-driven.',
        },
        {
          title: 'Discover Hidden Passions',
          desc: "Sometimes students don't know their own potential. Our questions are designed to surface passions and strengths that haven't been explored yet.",
        },
        {
          title: 'Avoid Costly Mistakes',
          desc: 'Switching streams or courses mid-way is expensive and stressful. Early, informed counseling saves years of time and significant money.',
        },
      ],
      stats: [
        { value: '93M+', label: 'Students in India' },
        { value: '<1%', label: 'Receive proper counseling' },
        { value: '40%', label: 'Drop out due to wrong stream choice' },
        { value: '10 min', label: 'To get your personalized report' },
      ],
    },

    pricing: {
      tag: 'Pricing',
      title: 'Choose Your Path',
      subtitle: 'Whether you\'re just exploring or ready for a deep dive, we have the right plan for you.',
      mostPopular: 'MOST POPULAR',
      free: {
        label: 'Free',
        forever: 'forever free',
        desc: 'Perfect for students who want to explore their career options without any commitment.',
        cta: "Let's Start — Free",
        features: [
          '10-question personalized assessment',
          'Preliminary career overview',
          'Top 3 career path suggestions',
          'Key strengths summary',
          'Basic next steps guidance',
          'PDF report delivered by email',
        ],
      },
      paid: {
        label: 'Premium',
        period: 'one-time',
        desc: 'The complete career counseling experience with deep personalization and expert-level analysis.',
        cta: "Let's Start — ₹499",
        secure: 'Secure payment via Razorpay. 100% satisfaction guaranteed.',
        features: [
          '20-question deep-dive assessment',
          'AI-powered comprehensive analysis',
          '6+ personalized career paths with fit scores',
          'Personality & interest pattern analysis',
          'Strengths & development areas report',
          'Detailed academic roadmap & entrance exam guide',
          'Step-by-step action plan',
          'Motivational coaching message',
          'Premium branded PDF report',
          'Priority email delivery',
        ],
      },
    },

    testimonials: {
      tag: 'Student Stories',
      title: 'Real Students, Real Results',
      subtitle: 'See what students across India say about their career counseling experience.',
      items: [
        {
          text: "I was completely confused between Engineering and Medicine. The premium report helped me realize I'm better suited for Biomedical Engineering — something I had never even considered! The analysis was incredibly detailed.",
        },
        {
          text: "My parents wanted me to become a CA, but the report showed my strengths lie in entrepreneurship and marketing. It gave me the courage to have an honest conversation with my family. Best ₹499 I ever spent!",
        },
        {
          text: "The free report gave me a good idea of my interests, and I immediately upgraded. The paid report had a step-by-step roadmap for becoming a UX Designer — complete with which colleges and courses to target!",
        },
        {
          text: "I was embarrassed about being an Arts student until this report showed me the amazing careers possible — journalism, civil services, psychology, law. It completely changed my perspective. Thank you!",
        },
      ],
    },

    faq: {
      tag: 'FAQ',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know before getting started.',
      items: [
        {
          q: 'Who is this for?',
          a: 'This service is designed for students in Class 8 through 12 (ages 12–18) who are trying to choose the right stream, course, or career path. Parents who want guidance for their children will also find the report very valuable.',
        },
        {
          q: 'How does the AI-powered assessment work?',
          a: 'After you provide your basic information, our system generates a personalized set of questions based on your profile. These cover your academic interests, personality, skills, and goals. Your answers are then analyzed to produce a tailored career counseling report.',
        },
        {
          q: 'What is the difference between the Free and Paid report?',
          a: 'The Free report gives you a 10-question assessment with a preliminary overview, top 3 career suggestions, and key strengths. The Premium (₹499) report includes a 20-question deep-dive, 6+ career paths with detailed pathways, personality analysis, academic roadmap, and a complete action plan.',
        },
        {
          q: 'Is my data safe?',
          a: 'Yes. We store your information securely in an encrypted database. We never sell your data to third parties. Your email is only used to send you your report and any replies you request.',
        },
        {
          q: 'How do I receive my report?',
          a: 'Once the assessment is complete and payment is verified (for paid reports), your PDF report will be generated and emailed to the address you provided within a few minutes.',
        },
        {
          q: "What if I don't receive my email?",
          a: 'Please check your spam/junk folder first. If you still don\'t find it, scroll to the footer of this page and use the "Already took the test?" feature to resend the report to your email.',
        },
        {
          q: 'Can I upgrade from a Free to a Paid report?',
          a: 'Yes! Your free PDF report includes a special upgrade link. Clicking it will take you directly to the payment page where you can upgrade for ₹499 and receive a comprehensive premium report.',
        },
        {
          q: 'Is the ₹499 payment secure?',
          a: "Absolutely. Payment is processed through Razorpay, one of India's most trusted payment gateways. We accept UPI, cards, net banking, and wallets. We never store your card details.",
        },
        {
          q: 'What if I\'m still confused after reading the report?',
          a: 'The report is designed to be a starting point for deeper exploration. For personalised 1-on-1 counseling, please reach out to us at contact@cadgurukul.com and we will be happy to schedule a session.',
        },
      ],
    },

    footer: {
      brand: 'CAD Gurukul',
      brandDesc:
        'Helping students in India discover their true career potential through intelligent assessments, expert counseling, and personalised guidance.',
      contactTitle: 'Contact Us',
      location: 'India',
      resendTitle: 'Already Took the Test?',
      resendDesc: 'Enter your email below to receive your report again.',
      resendPlaceholder: 'your@email.com',
      resendBtn: 'Resend Report',
      resendSuccess: 'If your email is in our system, your report has been resent!',
      rights: (year, name) => `© ${year} ${name}. All rights reserved.`,
    },

    sticky: {
      startBtn: 'Start Free Assessment',
      copied: 'Copied!',
    },

    intake: {
      title: "Let's Get Started",
      paidLabel: 'Premium Report — ₹499',
      freeLabel: 'Free Report',
      description: 'Fill in your details below. Your report will be sent to your email',
      descriptionPaid: ' after payment is confirmed.',
      descriptionFree: '.',
      nameLbl: 'Full Name',
      namePlaceholder: 'e.g. Rahul Sharma',
      emailLbl: 'Email Address',
      emailPlaceholder: 'you@example.com',
      emailHelper: 'Your report will be sent here',
      ageLbl: 'Age',
      agePlaceholder: 'e.g. 16',
      standardLbl: 'Current Standard / Class',
      standardPlaceholder: 'Select your class',
      phoneLbl: 'Phone Number (optional)',
      phonePlaceholder: 'e.g. 98765 43210',
      phoneHelper: 'Optional — we may send a WhatsApp summary',
      submitBtn: 'Start My Assessment',
      submittingBtn: 'Starting...',
      standards: [
        '8th', '9th', '10th',
        '11th Science', '11th Commerce', '11th Arts/Humanities',
        '12th Science', '12th Commerce', '12th Arts/Humanities',
        'Graduated (Class 12 done)',
      ],
      errors: {
        nameRequired: 'Full name is required',
        nameMin: 'Name must be at least 2 characters',
        nameMax: 'Name must be 60 characters or fewer',
        nameBlank: 'Name cannot be blank or only spaces',
        nameNumbers: 'Name should not contain numbers',
        nameChars: 'Name can only contain letters, spaces, or hyphens',
        emailRequired: 'Email address is required',
        emailMax: 'Email address is too long',
        emailInvalid: 'Enter a valid email address (e.g. name@gmail.com)',
        ageRequired: 'Age is required',
        ageMin: 'Age must be at least 10',
        ageMax: 'Age must be 25 or less',
        standardRequired: 'Please select your class',
        phoneInvalid: 'Enter a valid 10-digit phone number',
      },
    },

    question: {
      selectAll: 'Select all that apply',
      writeAnswer: 'Write your answer here...',
      next: 'Next',
      submit: 'Submit & Get My Report',
      submitting: 'Submitting...',
    },

    progress: {
      label: (current, total) => `Question ${current} of ${total}`,
    },

    questionnairePage: {
      header: 'Career Assessment',
      premium: '★ Premium',
      free: 'Free',
      loadingQuestions: 'Preparing your personalized questions...',
      submitting: 'Submitting your answers...',
      generatingReport: 'Generating your career report...',
      errorPrefix: '',
    },

    thankYou: {
      title: "You're All Done! 🎉",
      subtitle: 'Your Report is on its way.',
      sentTo: 'Report sent to',
      premiumBadge: 'Premium Career Report',
      freeBadge: 'Free Career Report',
      whatNext: 'What happens next:',
      step1: '✅ Check your inbox (and spam folder) for the PDF report',
      step2: '✅ Review the career suggestions with your parents',
      step3: '✅ Follow the action plan provided in the report',
      upgradeHint: '⭐ Want deeper guidance? Upgrade to Premium for only ₹499!',
      noEmail: "Didn't receive the email? Check spam or",
      resendLink: 'request resend at the footer',
      downloadReport: 'Download Your Report Here',
      backHome: 'Back to Home',
      upgradePremium: 'Upgrade to Premium',
      footerNote: 'Questions? Email us at',
    },

    payment: {
      title: 'Complete Your Payment',
      subtitle: 'One-time payment for lifetime access to your premium report',
      amount: '₹499',
      secureNote: 'Secure · Encrypted · Powered by Razorpay',
      payBtn: 'Pay ₹499 Securely',
      processing: 'Processing...',
      features: [
        '20-question deep analysis',
        '6+ career paths with fit scores',
        'Personality & academic insights',
        'Detailed action plan',
      ],
      errorRetry: 'Try Again',
      goHome: 'Go to Home',
    },

    paymentFailure: {
      title: 'Payment Unsuccessful',
      desc: "Don't worry — your progress has been saved and",
      noCharge: 'no money was charged',
      hint: 'This can happen due to a network issue, insufficient balance, or a bank decline. You can safely try again.',
      retry: 'Try Payment Again',
      backHome: 'Back to Home',
      needHelp: 'Need help?',
      contactSupport: 'Contact Support',
    },

    upgrade: {
      title: 'Upgrade to Premium',
      subtitle: 'Complete your upgrade and unlock your full report',
      amount: '₹499',
      payBtn: 'Upgrade Now — ₹499',
      processing: 'Processing...',
      generating: 'Generating your premium report...',
      invalidToken: 'Invalid upgrade link',
      timeoutMsg: 'Server temporarily unavailable. Please try again.',
      goHome: 'Go to Home',
      tryAgain: 'Try Again',
    },
  },

  /* ─────────────────── HINDI ─────────────────── */
  hi: {
    lang: 'hi',
    langLabel: 'हिंदी',
    switchLabel: 'English',

    nav: {
      whyCounseling: 'काउंसलिंग क्यों?',
      plans: 'प्लान्स',
      stories: 'कहानियाँ',
      faq: 'सवाल-जवाब',
      startFree: 'मुफ्त शुरू करें',
    },

    hero: {
      badge: 'पूरे भारत के students का भरोसा',
      title: 'अपना Dream Career',
      titleHighlight: 'Clarity के साथ ढूंढो',
      subtitle:
        'AI की मदद से personalized career counseling report पाओ — अपनी interests, personality और goals के आधार पर। Class 8–12 के students और उनके parents के लिए बनाया गया।',
      feature1: '10 मिनट का assessment',
      feature2: 'Report सीधे email पर मिलेगी',
      feature3: 'Experts की guidance',
      getFree: 'Free Report पाओ',
      getPremium: 'Premium Report पाओ — ₹499',
      socialProof: 'हजारों students की तरह तुम भी अपना perfect career path खोजो',
    },

    why: {
      tag: 'समस्या क्या है?',
      title: 'Career Counseling आज',
      titleHighlight: 'इतनी जरूरी क्यों है',
      subtitle:
        'India में 9.3 करोड़ students हैं — पर 1% से भी कम को जिंदगी बदलने वाले फैसलों से पहले सही career guidance मिलती है। आज यह बदलेगा।',
      reasons: [
        {
          title: 'अंदाजे बंद, Planning शुरू',
          desc: 'ज़्यादातर students बिना अपनी strengths जाने stream या college चुन लेते हैं। हमारा assessment वो guesswork पूरी तरह खत्म कर देता है।',
        },
        {
          title: 'Strengths को Career से जोड़ो',
          desc: 'हर किसी के अलग-अलग talents होते हैं। हम तुम्हारी interests, personality और academics को analyze करके वो careers suggest करते हैं जहाँ तुम सच में आगे बढ़ोगे।',
        },
        {
          title: 'Parents को भरोसेमंद Guidance',
          desc: 'Parents को अक्सर traditional paths से आगे guide करना मुश्किल लगता है। हमारी report family को भविष्य की बात करने का एक साझा जरिया देती है।',
        },
        {
          title: 'सही Stream, सही Future',
          desc: 'Science, Commerce या Arts — यह एक बड़ा फैसला है। हमारी counseling इस फैसले को data पर आधारित बनाती है, दबाव पर नहीं।',
        },
        {
          title: 'छुपे हुए Passions खोजो',
          desc: 'कभी-कभी students खुद नहीं जानते कि उनमें कितना talent है। हमारे सवाल उन passions और strengths को सामने लाते हैं जो अब तक explore नहीं हुए।',
        },
        {
          title: 'बड़ी गलतियों से बचो',
          desc: 'बीच में stream या course बदलना महंगा और stressful होता है। सही समय पर सही counseling सालों का वक्त और पैसा बचाती है।',
        },
      ],
      stats: [
        { value: '9.3 करोड़+', label: 'India में Students' },
        { value: '<1%', label: 'को सही counseling मिलती है' },
        { value: '40%', label: 'गलत stream चुनने से छोड़ते हैं' },
        { value: '10 मिनट', label: 'में personalized report मिलेगी' },
      ],
    },

    pricing: {
      tag: 'कीमत',
      title: 'अपना रास्ता चुनो',
      subtitle: 'बस देख रहे हो या पूरा deep dive लेना चाहते हो — दोनों के लिए सही plan है।',
      mostPopular: 'सबसे पसंदीदा',
      free: {
        label: 'मुफ्त',
        forever: 'हमेशा के लिए',
        desc: 'उन students के लिए जो बिना कोई पैसा दिए अपने career options explore करना चाहते हैं।',
        cta: 'शुरू करें — बिल्कुल Free',
        features: [
          '10 personalized सवालों का assessment',
          'Career का preliminary overview',
          'Top 3 career path suggestions',
          'Key strengths की summary',
          'Basic next steps की guidance',
          'Email पर PDF report',
        ],
      },
      paid: {
        label: 'प्रीमियम',
        period: 'एक बार की payment',
        desc: 'Deep personalization और expert-level analysis के साथ complete career counseling experience।',
        cta: 'शुरू करें — ₹499',
        secure: 'Razorpay के जरिए secure payment। 100% satisfaction की guarantee।',
        features: [
          '20 questions का deep-dive assessment',
          'AI-powered comprehensive analysis',
          '6+ personalized career paths with fit scores',
          'Personality & interest pattern analysis',
          'Strengths & development areas की report',
          'Academic roadmap & entrance exam guide',
          'Step-by-step action plan',
          'Motivational coaching message',
          'Premium branded PDF report',
          'Priority email delivery',
        ],
      },
    },

    testimonials: {
      tag: 'Students की कहानियाँ',
      title: 'असली Students, असली Results',
      subtitle: 'भारत भर के students अपने career counseling experience के बारे में क्या कहते हैं, देखो।',
      items: [
        {
          text: "मैं Engineering और Medicine के बीच पूरी तरह confused थी। Premium report ने मुझे realize कराया कि मेरे लिए Biomedical Engineering सबसे सही है — जिसके बारे में मैंने कभी सोचा ही नहीं था! Analysis बहुत detailed थी।",
        },
        {
          text: "मेरे parents चाहते थे कि मैं CA बनूँ, लेकिन report ने दिखाया कि मेरी strengths entrepreneurship और marketing में हैं। इसने मुझे family से honest बात करने की हिम्मत दी। ₹499 की सबसे अच्छी investment!",
        },
        {
          text: "Free report से मुझे अपनी interests का अंदाजा हुआ, और मैंने तुरंत upgrade लिया। Paid report में UX Designer बनने का step-by-step roadmap था — कौन सा college, कौन सा course, सब कुछ!",
        },
        {
          text: "Arts student होने पर मुझे शर्म आती थी, लेकिन इस report ने दिखाया कितने अच्छे careers possible हैं — journalism, civil services, psychology, law। मेरा पूरा perspective बदल गया। शुक्रिया!",
        },
      ],
    },

    faq: {
      tag: 'सवाल-जवाब',
      title: 'अक्सर पूछे जाने वाले सवाल',
      subtitle: 'शुरू करने से पहले जो भी जानना चाहते हो, वो सब यहाँ है।',
      items: [
        {
          q: 'यह किसके लिए है?',
          a: 'यह service Class 8 से 12 (उम्र 12–18) के उन students के लिए है जो सही stream, course या career path चुनने की कोशिश कर रहे हैं। जो parents अपने बच्चों को guide करना चाहते हैं, उनके लिए भी यह report बहुत काम की है।',
        },
        {
          q: 'AI-powered assessment कैसे काम करता है?',
          a: 'तुम्हारी basic जानकारी देने के बाद, हमारा system तुम्हारे profile के आधार पर personalized सवाल तैयार करता है। ये academic interests, personality, skills और goals को cover करते हैं। तुम्हारे जवाबों को analyze करके एक tailored career counseling report बनाई जाती है।',
        },
        {
          q: 'Free और Paid report में क्या फर्क है?',
          a: 'Free report में 10 सवालों का assessment, preliminary overview, top 3 career suggestions और key strengths मिलती हैं। Premium (₹499) report में 20 questions का deep-dive, 6+ career paths with detailed pathways, personality analysis, academic roadmap और complete action plan मिलता है।',
        },
        {
          q: 'क्या मेरा data safe है?',
          a: 'हाँ। हम तुम्हारी जानकारी encrypted database में securely store करते हैं। हम कभी भी तुम्हारा data third parties को नहीं बेचते। तुम्हारा email सिर्फ report भेजने के लिए use होता है।',
        },
        {
          q: 'मुझे मेरी report कैसे मिलेगी?',
          a: 'Assessment complete होने के बाद (और paid reports के लिए payment verify होने के बाद), तुम्हारी PDF report कुछ ही मिनटों में generate होकर तुम्हारे email पर आ जाएगी।',
        },
        {
          q: 'अगर email नहीं मिली तो?',
          a: 'पहले अपना spam/junk folder check करो। फिर भी न मिले तो page के footer में "Already Took the Test?" feature से अपनी email पर report दोबारा भेज सकते हो।',
        },
        {
          q: 'क्या Free से Paid report में upgrade हो सकता है?',
          a: 'हाँ! तुम्हारी free PDF report में एक special upgrade link होता है। उस पर click करने से payment page खुलेगा जहाँ ₹499 में upgrade करके comprehensive premium report मिल सकती है।',
        },
        {
          q: '₹499 की payment secure है?',
          a: 'बिल्कुल। Payment India के सबसे trusted payment gateway Razorpay के जरिए होती है। हम UPI, cards, net banking और wallets accept करते हैं। हम card details कभी store नहीं करते।',
        },
        {
          q: 'Report पढ़ने के बाद भी confused रहूँ तो?',
          a: 'Report deeper exploration के लिए एक starting point है। Personalized 1-on-1 counseling के लिए contact@cadgurukul.com पर पहुँचो, हम खुशी से session schedule करेंगे।',
        },
      ],
    },

    footer: {
      brand: 'CAD Gurukul',
      brandDesc:
        'India के students को intelligent assessments, expert counseling और personalized guidance के जरिए उनकी असली career potential खोजने में मदद करना।',
      contactTitle: 'हमसे संपर्क करें',
      location: 'भारत',
      resendTitle: 'Test दे चुके हो?',
      resendDesc: 'नीचे अपना email डालो और अपनी report फिर से पाओ।',
      resendPlaceholder: 'your@email.com',
      resendBtn: 'Report भेजो',
      resendSuccess: 'अगर तुम्हारा email हमारे system में है, तो report फिर से भेज दी गई है!',
      rights: (year, name) => `© ${year} ${name}. सर्वाधिकार सुरक्षित।`,
    },

    sticky: {
      startBtn: 'Free Assessment शुरू करें',
      copied: 'Copy हो गया!',
    },

    intake: {
      title: 'चलो शुरू करते हैं',
      paidLabel: 'Premium Report — ₹499',
      freeLabel: 'Free Report',
      description: 'नीचे अपनी details भरो। तुम्हारी report तुम्हारे email पर भेजी जाएगी',
      descriptionPaid: ' payment confirm होने के बाद।',
      descriptionFree: '।',
      nameLbl: 'पूरा नाम',
      namePlaceholder: 'जैसे: Rahul Sharma',
      emailLbl: 'Email पता',
      emailPlaceholder: 'you@example.com',
      emailHelper: 'तुम्हारी report यहाँ भेजी जाएगी',
      ageLbl: 'उम्र',
      agePlaceholder: 'जैसे: 16',
      standardLbl: 'मौजूदा Class',
      standardPlaceholder: 'अपनी class चुनो',
      phoneLbl: 'Phone नंबर (optional)',
      phonePlaceholder: 'जैसे: 98765 43210',
      phoneHelper: 'Optional — WhatsApp summary के लिए',
      submitBtn: 'Assessment शुरू करें',
      submittingBtn: 'शुरू हो रहा है...',
      standards: [
        '8th', '9th', '10th',
        '11th Science', '11th Commerce', '11th Arts/Humanities',
        '12th Science', '12th Commerce', '12th Arts/Humanities',
        'Graduated (Class 12 done)',
      ],
      errors: {
        nameRequired: 'पूरा नाम जरूरी है',
        nameMin: 'नाम कम से कम 2 characters का होना चाहिए',
        nameMax: 'नाम 60 characters से ज़्यादा नहीं होना चाहिए',
        nameBlank: 'नाम blank या सिर्फ spaces नहीं हो सकता',
        nameNumbers: 'नाम में numbers नहीं होने चाहिए',
        nameChars: 'नाम में सिर्फ letters, spaces या hyphens होने चाहिए',
        emailRequired: 'Email address जरूरी है',
        emailMax: 'Email address बहुत लंबा है',
        emailInvalid: 'Valid email address डालो (जैसे: name@gmail.com)',
        ageRequired: 'उम्र जरूरी है',
        ageMin: 'उम्र कम से कम 10 होनी चाहिए',
        ageMax: 'उम्र 25 या उससे कम होनी चाहिए',
        standardRequired: 'कृपया अपनी class चुनो',
        phoneInvalid: 'Valid 10-digit phone number डालो',
      },
    },

    question: {
      selectAll: 'जो भी लागू हो वो सब चुनो',
      writeAnswer: 'अपना जवाब यहाँ लिखो...',
      next: 'आगे',
      submit: 'Submit करें और Report पाओ',
      submitting: 'Submit हो रहा है...',
    },

    progress: {
      label: (current, total) => `सवाल ${current} / ${total}`,
    },

    questionnairePage: {
      header: 'Career Assessment',
      premium: '★ Premium',
      free: 'Free',
      loadingQuestions: 'तुम्हारे personalized सवाल तैयार हो रहे हैं...',
      submitting: 'तुम्हारे जवाब submit हो रहे हैं...',
      generatingReport: 'तुम्हारी career report बन रही है...',
      errorPrefix: '',
    },

    thankYou: {
      title: 'बहुत बढ़िया! 🎉',
      subtitle: 'तुम्हारी Report आ रही है।',
      sentTo: 'Report भेज दी गई',
      premiumBadge: 'Premium Career Report',
      freeBadge: 'Free Career Report',
      whatNext: 'आगे क्या होगा:',
      step1: '✅ Inbox (और spam folder) में PDF report check करो',
      step2: '✅ Career suggestions अपने parents के साथ review करो',
      step3: '✅ Report में दिए गए action plan को follow करो',
      upgradeHint: '⭐ और गहरी guidance चाहते हो? सिर्फ ₹499 में Premium में Upgrade करो!',
      noEmail: 'Email नहीं मिली? Spam check करो या',
      resendLink: 'footer पर जाकर दोबारा भेजो',
      downloadReport: 'अपनी Report यहाँ Download करें',
      backHome: 'वापस Home पर',
      upgradePremium: 'Premium में Upgrade करें',
      footerNote: 'कोई सवाल? हमें email करो',
    },

    payment: {
      title: 'Payment पूरी करो',
      subtitle: 'Premium report के लिए एक बार की payment',
      amount: '₹499',
      secureNote: 'Secure · Encrypted · Razorpay द्वारा',
      payBtn: '₹499 Securely Pay करें',
      processing: 'Process हो रहा है...',
      features: [
        '20-question deep analysis',
        '6+ career paths with fit scores',
        'Personality & academic insights',
        'Detailed action plan',
      ],
      errorRetry: 'फिर कोशिश करें',
      goHome: 'Home पर जाएँ',
    },

    paymentFailure: {
      title: 'Payment नहीं हुई',
      desc: 'घबराओ नहीं — तुम्हारा progress save है और',
      noCharge: 'कोई पैसा नहीं कटा',
      hint: 'यह network issue, कम balance या bank decline की वजह से हो सकता है। तुम safely दोबारा try कर सकते हो।',
      retry: 'दोबारा Payment करें',
      backHome: 'वापस Home पर',
      needHelp: 'Help चाहिए?',
      contactSupport: 'Support से संपर्क करें',
    },

    upgrade: {
      title: 'Premium में Upgrade करो',
      subtitle: 'Upgrade complete करो और अपनी full report unlock करो',
      amount: '₹499',
      payBtn: 'अभी Upgrade करें — ₹499',
      processing: 'Process हो रहा है...',
      generating: 'तुम्हारी premium report बन रही है...',
      invalidToken: 'Invalid upgrade link',
      timeoutMsg: 'Server अभी unavailable है। थोड़ी देर बाद try करो।',
      goHome: 'Home पर जाएँ',
      tryAgain: 'फिर try करें',
    },
  },
};

export default translations;
