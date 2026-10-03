const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const yearEl = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const languageButtons = document.querySelectorAll('.lang-btn');
const cookieBanner = document.getElementById('cookie-banner');
const cookieButtons = document.querySelectorAll('[data-cookie-choice]');
const brandForm = document.getElementById('brand-settings-form');
const brandResetButton = document.getElementById('brand-reset-button');
const revealElements = document.querySelectorAll('[data-reveal]');

const safeStorage = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      return false;
    }
  },
  getJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  },
};

const sanitizeText = (value, fallback = '') => {
  const text = String(value ?? '').trim().replace(/[<>]/g, '');
  return text.length ? text.slice(0, 120) : fallback;
};

const sanitizeUrl = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^(https?:\/\/|\/|\.\/|data:image\/)/i.test(raw)) {
    return raw.slice(0, 300);
  }
  return '';
};

const defaultBrand = {
  clubName: 'ASKÖ',
  clubSubName: 'Swimclub Neusiedl',
  logoUrl: '',
};

const normalizeBrandSettings = (raw = {}) => ({
  clubName: sanitizeText(raw.clubName, defaultBrand.clubName),
  clubSubName: sanitizeText(raw.clubSubName, defaultBrand.clubSubName),
  logoUrl: sanitizeUrl(raw.logoUrl),
});

const getStoredBrand = () => {
  const storedBrand = safeStorage.getJSON('marc-brand-config', null);
  if (!storedBrand) {
    return { ...defaultBrand };
  }

  return normalizeBrandSettings({ ...defaultBrand, ...storedBrand });
};

const applyBrandConfig = () => {
  const brandConfig = getStoredBrand();
  const brandLink = document.querySelector('.brand');
  const brandName = document.querySelector('.brand-text strong');
  const brandTagline = document.querySelector('.brand-text small');
  const brandLogo = document.querySelector('.brand-logo');

  if (brandName) {
    brandName.textContent = brandConfig.clubName;
  }

  if (brandTagline) {
    brandTagline.textContent = brandConfig.clubSubName;
  }

  if (brandLink) {
    brandLink.setAttribute('aria-label', `${brandConfig.clubName} ${brandConfig.clubSubName} home`);
  }

  if (brandLogo) {
    brandLogo.innerHTML = '';

    if (brandConfig.logoUrl) {
      const img = document.createElement('img');
      img.src = brandConfig.logoUrl;
      img.alt = brandConfig.clubName;
      img.loading = 'eager';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      brandLogo.appendChild(img);
    } else {
      const fallbackMark = document.createElement('span');
      fallbackMark.className = 'brand-mark';
      fallbackMark.textContent = brandConfig.clubName.charAt(0).toUpperCase() || 'A';
      brandLogo.appendChild(fallbackMark);
    }
  }

  document.title = `${brandConfig.clubName} ${brandConfig.clubSubName} | Swim with Purpose`;
};

const translations = {
  en: {
    nav: ['About', 'Programs', 'Schedule', 'Events', 'Gallery', 'Contact'],
    signin: 'Sign in',
    join: 'Join now',
    heroEyebrow: 'Built for speed. Built for community.',
    heroTitle: 'Swim with purpose. Grow beyond limits.',
    heroText: 'ASKÖ Swimclub Neusiedl brings together competitive swimmers, rising talents, and active adults in a club culture built on energy, discipline, and belonging.',
    heroPrimary: 'Explore programs',
    heroSecondary: 'Why our club',
    metricYears: 'Years coaching',
    metricMembers: 'Members active',
    metricRetention: 'Member retention',
    featureSwimSchool: 'Swim school',
    featureLearn: 'Learn to swim',
    featurePerformance: 'Performance',
    featureSquads: 'Competitive squads',
    featureFitness: 'Fitness',
    featureMasters: 'Masters & adult lanes',
    featureCommunity: 'Community',
    featureEvents: 'Events & culture',
    aboutLabel: 'About the club',
    aboutTitle: 'A new generation of swim club energy.',
    aboutText1: 'We combine technical coaching, inclusive community, and a strong athlete mindset to help every swimmer move forward — whether they are taking their first strokes or chasing podium performances.',
    aboutText2: 'Every lane is built around progression, confidence, and belonging. Our coaches help swimmers improve with purpose and enjoy the process along the way.',
    mini1Title: 'Structured progression',
    mini1Text: 'Clear training pathways for age groups, adults, and performance squads.',
    mini2Title: 'Expert coaches',
    mini2Text: 'Technical feedback, race preparation, and confidence-focused development.',
    mini3Title: 'Club spirit',
    mini3Text: 'Friendly, motivating, and energizing environment for every member.',
    trustLabel: 'Safety & trust',
    trustTitle: 'Clear structure. Safe coaching. Real club support.',
    trust1Title: 'Structured coaching',
    trust1Text: 'Every session is built around technique, progression, and confidence — with clear goals for beginners and performance swimmers alike.',
    trust2Title: 'Safe environment',
    trust2Text: 'Our training culture is supervised, supportive, and built around responsible pool safety, communication, and athlete wellbeing.',
    trust3Title: 'Transparent communication',
    trust3Text: 'Members get clear schedules, direct contact, and practical guidance before joining — no guesswork, no confusion.',
    trust4Title: 'Trusted by families',
    trust4Text: 'With more than 450 active members and a 95% retention rate, the club is built around long-term trust and community.',
    programsLabel: 'Programs',
    programsTitle: 'Choose your lane.',
    programJunior: 'Junior Academy',
    programJuniorText: 'Fun, confident, and technique-led sessions for children learning to swim and progress fast.',
    programJuniorList: ['Age 5–12', 'Small groups', 'Skills + confidence'],
    programPerformance: 'Performance Squad',
    programPerformanceText: 'For ambitious swimmers focused on race development, technique, and competition.',
    programPerformanceList: ['Technique blocks', 'Competition prep', 'High-performance culture'],
    programMasters: 'Masters Swimming',
    programMastersText: 'Structured sessions for adults who want stronger fitness, better form, and social energy.',
    programMastersList: ['Adult training', 'Endurance focus', 'Balanced pacing'],
    programEvents: 'Open Water & Events',
    programEventsText: 'Seasonal club events and open-water experiences that build confidence and community.',
    programEventsList: ['Club events', 'Team challenge days', 'Social training'],
    scheduleLabel: 'Training schedule',
    scheduleTitle: 'Train when it fits your rhythm.',
    scheduleText: 'Flexible sessions across morning, midday, and evening windows to match school, work, and recovery needs.',
    schedulePrimary: 'Book a trial',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    performanceSquad: 'Performance squad',
    juniorAcademy: 'Junior academy',
    mastersEndurance: 'Masters endurance',
    techniqueClinic: 'Technique clinic',
    familySwim: 'Family swim',
    clubRacePrep: 'Club race prep',
    galleryLabel: 'Club life',
    galleryTitle: 'Real moments. Real momentum.',
    storiesLabel: 'Member stories',
    storiesTitle: 'What swimmers love about the club.',
    story1: 'The coaching is exceptional, and the club culture makes every session feel motivating and welcoming.',
    story1Author: 'Elena, Junior athlete',
    story2: 'I joined for fitness and stayed for the energy. It feels like a team that genuinely supports everyone.',
    story2Author: 'Martin, Masters swimmer',
    story3: 'Our kids have more confidence, better technique, and they love training here.',
    story3Author: 'Sofia, parent',
    ctaLabel: 'Ready to begin?',
    ctaTitle: 'Make your next swim your strongest one.',
    ctaEmail: 'info@askoswimclubneusiedl.at',
    ctaPhone: '+43 664 123 4567',
    footerText: '© {year} ASKÖ Swimclub Neusiedl. Website by Loki Petter, Web Developer. Swim stronger together.'
  },
  de: {
    nav: ['Über uns', 'Programme', 'Zeitplan', 'Veranstaltungen', 'Galerie', 'Kontakt'],
    signin: 'Anmelden',
    join: 'Jetzt beitreten',
    heroEyebrow: 'Für Geschwindigkeit. Für Gemeinschaft.',
    heroTitle: 'Schwimm mit Sinn. Werde stärker als du denkst.',
    heroText: 'ASKÖ Swimclub Neusiedl vereint ambitionierte Schwimmerinnen und Schwimmer, aufstrebende Talente und aktive Erwachsene in einer Vereinskultur aus Energie, Disziplin und Zugehörigkeit.',
    heroPrimary: 'Programme entdecken',
    heroSecondary: 'Warum wir?',
    metricYears: 'Jahre Training',
    metricMembers: 'Mitglieder aktiv',
    metricRetention: 'Mitgliederbindung',
    featureSwimSchool: 'Schwimmschule',
    featureLearn: 'Schwimmen lernen',
    featurePerformance: 'Leistung',
    featureSquads: 'Leistungsteams',
    featureFitness: 'Fitness',
    featureMasters: 'Masters & Erwachsenenkurse',
    featureCommunity: 'Gemeinschaft',
    featureEvents: 'Events & Kultur',
    aboutLabel: 'Über den Verein',
    aboutTitle: 'Eine neue Generation von Schwimmverein-Energie.',
    aboutText1: 'Wir verbinden technisches Training, inklusive Gemeinschaft und eine starke Athletenmentalität, damit jede Schwimmerin und jeder Schwimmer weiterkommt — egal, ob sie die ersten Züge machen oder auf das Podium zielen.',
    aboutText2: 'Jede Bahn ist auf Fortschritt, Selbstvertrauen und Zugehörigkeit ausgerichtet. Unsere Trainerinnen und Trainer helfen den Schwimmern mit Zielstrebigkeit und Freude am Prozess weiter.',
    mini1Title: 'Strukturierter Fortschritt',
    mini1Text: 'Klare Trainingspfade für Altersgruppen, Erwachsene und Leistungsteams.',
    mini2Title: 'Expertentraining',
    mini2Text: 'Technisches Feedback, Rennvorbereitung und selbstvertrauensorientierte Entwicklung.',
    mini3Title: 'Vereinsgefühl',
    mini3Text: 'Freundliche, motivierende und energiegeladene Umgebung für jedes Mitglied.',
    trustLabel: 'Sicherheit & Vertrauen',
    trustTitle: 'Klare Struktur. Sicheres Training. Echte Vereinsunterstützung.',
    trust1Title: 'Strukturiertes Training',
    trust1Text: 'Jede Einheit baut auf Technik, Fortschritt und Selbstvertrauen auf — mit klaren Zielen für Anfängerinnen und Leistungsschwimmer.',
    trust2Title: 'Sichere Umgebung',
    trust2Text: 'Unsere Trainingskultur ist begleitet, unterstützend und auf verantwortungsvolle Pool-Sicherheit, Kommunikation und das Wohl der Athletinnen und Athleten ausgerichtet.',
    trust3Title: 'Transparente Kommunikation',
    trust3Text: 'Mitglieder erhalten klare Zeitpläne, direkten Kontakt und praktische Hinweise vor dem Beitritt — ohne Rätselraten, ohne Verwirrung.',
    trust4Title: 'Vertrauen bei Familien',
    trust4Text: 'Mit über 450 aktiven Mitgliedern und einer Bindungsrate von 95 % basiert der Verein auf langjährigem Vertrauen und Gemeinschaft.',
    programsLabel: 'Programme',
    programsTitle: 'Wähle deine Bahn.',
    programJunior: 'Junioren-Akademie',
    programJuniorText: 'Spaß, Selbstvertrauen und technikorientierte Einheiten für Kinder, die Schwimmen lernen und schnell vorankommen.',
    programJuniorList: ['Alter 5–12', 'Kleine Gruppen', 'Technik + Selbstvertrauen'],
    programPerformance: 'Leistungsteam',
    programPerformanceText: 'Für ambitionierte Schwimmer mit Fokus auf Rennentwicklung, Technik und Wettkampf.',
    programPerformanceList: ['Technikblöcke', 'Wettkampfvorbereitung', 'Leistungsorientierte Kultur'],
    programMasters: 'Masters Schwimmen',
    programMastersText: 'Strukturierte Einheiten für Erwachsene, die mehr Fitness, bessere Technik und sozialen Zusammenhalt wollen.',
    programMastersList: ['Erwachsenen-Training', 'Ausdauerfokus', 'Ausgewogenes Tempo'],
    programEvents: 'Offenes Wasser & Events',
    programEventsText: 'Saisonale Vereinsveranstaltungen und Open-Water-Erlebnisse, die Selbstvertrauen und Gemeinschaft stärken.',
    programEventsList: ['Vereins-Events', 'Team-Challenge-Tage', 'Soziales Training'],
    scheduleLabel: 'Trainingsplan',
    scheduleTitle: 'Trainiere, wenn es zu dir passt.',
    scheduleText: 'Flexible Einheiten am Vormittag, Mittags- und Abendfenster passend zu Schule, Arbeit und Erholung.',
    schedulePrimary: 'Probetraining buchen',
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    performanceSquad: 'Leistungsteam',
    juniorAcademy: 'Junioren-Akademie',
    mastersEndurance: 'Masters-Ausdauer',
    techniqueClinic: 'Technik-Clinic',
    familySwim: 'Familien-Schwimmen',
    clubRacePrep: 'Vereins-Rennenvorbereitung',
    galleryLabel: 'Vereinsleben',
    galleryTitle: 'Echte Momente. Echte Dynamik.',
    storiesLabel: 'Mitgliedergeschichten',
    storiesTitle: 'Was Schwimmer am Verein lieben.',
    story1: 'Das Training ist herausragend, und die Vereinskultur macht jede Einheit motivierend und welcoming.',
    story1Author: 'Elena, Juniorathletin',
    story2: 'Ich bin aus Fitness eingestiegen und blieb wegen der Energie. Es fühlt sich wie ein Team an, das wirklich jeden unterstützt.',
    story2Author: 'Martin, Masters-Schwimmer',
    story3: 'Unsere Kinder haben mehr Selbstvertrauen, bessere Technik und lieben das Training hier.',
    story3Author: 'Sofia, Elternteil',
    ctaLabel: 'Bereit loszulegen?',
    ctaTitle: 'Mach deinen nächsten Schwimmgang zu deinem stärksten.',
    ctaEmail: 'info@askoswimclubneusiedl.at',
    ctaPhone: '+43 664 123 4567',
    footerText: '© {year} ASKÖ Swimclub Neusiedl. Website von Loki Petter, Web Developer. Schwimm stärker zusammen.'
  }
};

const initializeRevealAnimations = () => {
  if (!revealElements.length) {
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
    return;
  }

  revealElements.forEach((element) => element.classList.add('is-visible'));
};

const setLanguage = (lang) => {
  const labels = translations[lang] || translations.de;
  document.documentElement.lang = lang;

  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach((link, index) => {
    if (labels.nav[index]) {
      link.textContent = labels.nav[index];
    }
  });

  const signin = document.querySelector('.nav-signin');
  if (signin) signin.textContent = labels.signin;

  const join = document.querySelector('.nav-cta');
  if (join) join.textContent = labels.join;

  const textNodes = document.querySelectorAll('[data-i18n]');
  textNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (typeof labels[key] !== 'undefined') {
      node.textContent = labels[key];
    }
  });

  document.querySelectorAll('[data-i18n-list]').forEach((node) => {
    const key = node.dataset.i18nList;
    if (Array.isArray(labels[key])) {
      node.innerHTML = labels[key].map((item) => `<li>${item}</li>`).join('');
    }
  });

  const footerText = document.querySelector('.site-footer p');
  if (footerText) {
    const year = document.getElementById('year')?.textContent || new Date().getFullYear();
    footerText.innerHTML = labels.footerText.replace('{year}', `<span id="year">${year}</span>`);
  }

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  safeStorage.setItem('marc-language', lang);
};

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const storedTheme = safeStorage.getItem('marc-theme');
if (storedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

const storedLanguage = safeStorage.getItem('marc-language') || 'de';
setLanguage(storedLanguage);
applyBrandConfig();
initializeRevealAnimations();

if (themeToggle) {
  const applyThemeLabel = () => {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };

  applyThemeLabel();

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    safeStorage.setItem('marc-theme', isDark ? 'dark' : 'light');
    applyThemeLabel();
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
  });
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (cookieBanner) {
  const cookieChoice = safeStorage.getItem('marc-cookie-choice');
  if (cookieChoice) {
    cookieBanner.classList.add('hidden');
  }

  cookieButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.cookieChoice;
      if (choice === 'accept' || choice === 'essential') {
        safeStorage.setItem('marc-cookie-choice', choice);
        cookieBanner.classList.add('hidden');
      }
    });
  });
}

if (brandForm) {
  const formInputs = brandForm.querySelectorAll('input');
  const storedBrand = getStoredBrand();
  formInputs.forEach((input) => {
    if (input.name in storedBrand) {
      input.value = storedBrand[input.name] || '';
    }
  });

  const syncFormValues = (nextBrand) => {
    formInputs.forEach((input) => {
      if (input.name in nextBrand) {
        input.value = nextBrand[input.name] || '';
      }
    });
  };

  brandForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(brandForm);
    const nextBrand = normalizeBrandSettings({
      clubName: formData.get('clubName'),
      clubSubName: formData.get('clubSubName'),
      logoUrl: formData.get('logoUrl'),
    });

    safeStorage.setItem('marc-brand-config', JSON.stringify(nextBrand));
    applyBrandConfig();
    brandForm.reset();
    syncFormValues(nextBrand);
  });

  if (brandResetButton) {
    brandResetButton.addEventListener('click', () => {
      safeStorage.setItem('marc-brand-config', JSON.stringify({ ...defaultBrand, logoUrl: '' }));
      applyBrandConfig();
      brandForm.reset();
      syncFormValues({ ...defaultBrand, logoUrl: '' });
    });
  }
}
