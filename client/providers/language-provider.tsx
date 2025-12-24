"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type Language = "ar" | "fr"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (key: string, lang?: Language) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<Language, string>> = {
  "nav.home": { ar: "الرئيسية", fr: "Accueil" },
  "nav.services": { ar: "الخدمات", fr: "Services" },
  "nav.doctors": { ar: "الأطباء", fr: "Médecins" },
  "nav.wilayas": { ar: "الولايات", fr: "Wilayas" },
  "nav.ai_assistant": { ar: "المساعد الطبي", fr: "Assistant Médical" },
  "nav.blog": { ar: "المدونة", fr: "Blog" },
  "nav.about": { ar: "عن المنصة", fr: "À Propos" },
  "nav.contact": { ar: "اتصل بنا", fr: "Contact" },
  "nav.login": { ar: "دخول", fr: "Connexion" },
  "nav.register": { ar: "تسجيل", fr: "Inscription" },
  "header.logo_text": { ar: "SL", fr: "SL" },
  "header.brand_name": { ar: "SahaLink", fr: "SahaLink" },
  "hero.title": { ar: "استشارة طبية بلمسة زر واحدة", fr: "Consultations Médicales au Bout de Vos Doigts" },
  "hero.subtitle": {
    ar: "تواصل مع أفضل الأطباء المتخصصين في بلدك وحصل على الاستشارة التي تحتاجها",
    fr: "Connectez-vous avec les meilleurs spécialistes et obtenez les conseils dont vous avez besoin",
  },
  "hero.diagnose": { ar: "تشخيص الآن", fr: "Diagnostic Gratuit" },
  "hero.book": { ar: "حجز موعد", fr: "Réserver une Consultation" },
  "hero.trust_text": { ar: "+5000 مريض يثقون بنا", fr: "+5000 patients nous font confiance" },
  "stats.patients": { ar: "مريض راضٍ", fr: "Patients Satisfaits" },
  "stats.consultations": { ar: "استشارة نجاح", fr: "Consultations Réussies" },
  "stats.doctors": { ar: "طبيب متخصص", fr: "Médecins Spécialistes" },
  "stats.partners": { ar: "مؤسسة طبية", fr: "Partenaires Médicaux" },
  "services.title": { ar: "حلول طبية متكاملة", fr: "Solutions Médicales Complètes" },
  "services.subtitle": {
    ar: "نوفر لك مجموعة شاملة من الحلول الطبية الموثوقة والآمنة",
    fr: "Nous vous proposons une gamme complète de solutions médicales fiables et sûres",
  },
  "services.consultation": { ar: "استشارة عن بعد", fr: "Consultation à Distance" },
  "services.consultation_desc": {
    ar: "استشر طبيبك المتخصص من راحة منزلك",
    fr: "Consultez votre spécialiste depuis le confort de votre domicile",
  },
  "services.appointment": { ar: "حجز المواعيد", fr: "Prise de Rendez-vous" },
  "services.appointment_desc": {
    ar: "احجز موعدك في أسهل وأسرع وقت",
    fr: "Réservez votre rendez-vous facilement et rapidement",
  },
  "services.ai": { ar: "المساعد الذكي", fr: "Assistant IA" },
  "services.ai_desc": {
    ar: "احصل على تشخيص أولي ذكي من الذكاء الاصطناعي",
    fr: "Obtenez un diagnostic initial intelligent grâce à l'IA",
  },
  "services.records": { ar: "السجل الطبي الإلكتروني", fr: "Dossier Médical Électronique" },
  "services.records_desc": {
    ar: "احفظ وأدر سجلك الطبي الكامل بأمان",
    fr: "Stockez et gérez votre dossier médical complet en toute sécurité",
  },
  "specialties.title": { ar: "تصفح حسب التخصص", fr: "Parcourir par Spécialité" },
  "specialties.subtitle": { ar: "اختر التخصص الذي تحتاج إليه", fr: "Choisissez la spécialité dont vous avez besoin" },
  "specialties.doctor_count": { ar: "طبيب", fr: "Médecins" },
  "featured.title": { ar: "أطباؤنا المميزون", fr: "Nos Médecins en Vedette" },
  "featured.subtitle": { ar: "أفضل الأطباء المتخصصين في المنصة", fr: "Les meilleurs spécialistes sur la plateforme" },
  "featured.view_all": { ar: "عرض الكل", fr: "Voir Tout" },
  "featured.loading": { ar: "جاري التحميل...", fr: "Chargement..." },
  "featured.reviews": { ar: "تقييم", fr: "Avis" },
  "featured.currency": { ar: "دج", fr: "DA" },
  "featured.book_now": { ar: "حجز الآن", fr: "Réserver" },
  "footer.about_title": { ar: "SahaLink", fr: "SahaLink" },
  "footer.about_desc": {
    ar: "منصة تجمع المرضى بأفضل الأطباء المتخصصين لتوفير استشارات طبية سهلة وآمنة.",
    fr: "Une plateforme connectant les patients aux meilleurs spécialistes pour des consultations médicales faciles et sécurisées.",
  },
  "footer.quick_links": { ar: "الروابط السريعة", fr: "Liens Rapides" },
  "footer.legal": { ar: "قانوني", fr: "Légal" },
  "footer.privacy": { ar: "سياسة الخصوصية", fr: "Politique de Confidentialité" },
  "footer.terms": { ar: "شروط الاستخدام", fr: "Conditions d'Utilisation" },
  "footer.disclaimer": { ar: "إخلاء المسؤولية", fr: "Avis de Non-responsabilité" },
  "footer.contact_title": { ar: "التواصل", fr: "Contact" },
  "footer.address": { ar: "الجزائر", fr: "Algérie" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", fr: "Tous droits réservés" },
  "footer.made_with": { ar: "صُنع بـ ♥ من أجل صحتك", fr: "Fait avec ♥ pour votre santé" },
  "cta.title": { ar: "هل أنت طبيب أو أخصائي؟", fr: "Êtes-vous médecin ou spécialiste ?" },
  "cta.desc": {
    ar: "انضم إلى آلاف الأطباء المتخصصين وطور ممارستك الطبية الرقمية",
    fr: "Rejoignez des milliers de spécialistes et développez votre pratique médicale numérique",
  },
  "cta.btn": { ar: "سجل كطبيب الآن", fr: "Inscrivez-vous comme médecin" },
  "cta.benefit1": { ar: "تطوير ممارستك الطبية", fr: "Développez votre pratique médicale" },
  "cta.benefit2": { ar: "الوصول إلى مرضى جدد", fr: "Accédez à de nouveaux patients" },
  "cta.benefit3": { ar: "إدارة تسهيلية لمواعيدك", fr: "Gestion simplifiée de vos rendez-vous" },
  "cta.benefit4": { ar: "دعم فني متواصل", fr: "Support technique continu" },
  "blog.title": { ar: "آخر المقالات", fr: "Derniers Articles" },
  "blog.subtitle": { ar: "نصائح صحية واستشارات طبية موثوقة", fr: "Conseils santé et avis médicaux fiables" },
  "blog.read_more": { ar: "اقرأ المزيد", fr: "Lire la suite" },
  "testimonials.title": { ar: "آراء عملائنا", fr: "Avis de nos clients" },
  "testimonials.subtitle": { ar: "آلاف المرضى الراضين عن خدماتنا", fr: "Des milliers de patients satisfaits" },
  "faq.title": { ar: "الأسئلة الشائعة", fr: "Foire Aux Questions" },
  "faq.subtitle": { ar: "إجابات على أكثر الأسئلة شيوعاً", fr: "Réponses aux questions les plus fréquentes" },
  "about.hero_title": { ar: "من نحن", fr: "À propos de nous" },
  "about.hero_subtitle": { ar: "نغير وجه الرعاية الصحية في الجزائر من خلال التكنولوجيا والابتكار", fr: "Redéfinir l'accès aux soins de santé en Algérie grâce à l'innovation numérique." },
  "about.mission_title": { ar: "رسالتنا", fr: "Notre Mission" },
  "about.mission_desc": { ar: "تتمثل مهمتنا في ربط كل مريض في الجزائر بأفضل الرعاية الطبية، بغض النظر عن موقعه الجغرافي، من خلال حلول تكنولوجية بسيطة، آمنة وموثوقة.", fr: "Notre mission est de connecter chaque patient en Algérie aux meilleurs soins médicaux, peu importe sa position géographique, grâce à des solutions technologiques simples, sécurisées et fiables." },
  "about.vision_title": { ar: "رؤيتنا", fr: "Notre Vision" },
  "about.vision_desc": { ar: "أن نصبح المنظومة الصحية الرقمية الأكثر ثقة في الجزائر، ونقود التحول نحو رعاية صحية ذكية، استباقية ومتاحة للجميع.", fr: "Devenir l'écosystème de santé numérique le plus fiable d'Algérie, en menant la transition vers des soins intelligents, proactifs et accessibles à tous." },
  "about.stats_doctors": { ar: "طبيب معتمد", fr: "Spécialistes" },
  "about.stats_patients": { ar: "مريض يثق بنا", fr: "Patients" },
  "about.stats_consultations": { ar: "استشارة رقمية", fr: "Consultations" },
  "about.stats_experience": { ar: "سنة من الابتكار", fr: "Années d'Excellence" },
  "about.values_title": { ar: "قيمنا الأساسية", fr: "Nos Valeurs Fondamentales" },
  "about.values_subtitle": { ar: "المبادئ التي تقود كل قرار نتخذه في SahaLink", fr: "Les principes qui guident chaque décision que nous prenons chez SahaLink." },
  "about.value1_title": { ar: "الإنسان أولاً", fr: "L'Humain au Cœur" },
  "about.value1_desc": { ar: "نضع صحة وراحة المريض في قمة أولوياتنا، مع تعزيز الروابط الإنسانية بين الطبيب والمريض.", fr: "Nous plaçons la santé et le confort du patient au sommet de nos priorités, tout en renforçant le lien humain médecin-patient." },
  "about.value2_title": { ar: "الابتكار المستدام", fr: "Innovation Durable" },
  "about.value2_desc": { ar: "نستخدم أحدث التقنيات لتبسيط الإجراءات الطبية وجعلها أكثر فعالية وأماناً.", fr: "Nous utilisons les dernières technologies pour simplifier les procédures médicales et les rendre plus efficaces et sûres." },
  "about.value3_title": { ar: "الشفافية الكاملة", fr: "Transparence Totale" },
  "about.value3_desc": { ar: "نؤمن بالوضوح في التعاملات والسرية التامة للبيانات الطبية لتعزيز الثقة المتبادلة.", fr: "Nous croyons en la clarté des échanges et la confidentialité absolue des données pour renforcer la confiance mutuelle." },
  "about.value4_title": { ar: "التميز الطبي", fr: "Excellence Médicale" },
  "about.value4_desc": { ar: "نتعاون فقط مع نخبة الأطباء المتخصصين لضمان أعلى مستويات الرعاية والتشخيص.", fr: "Nous collaborons uniquement avec l'élite des médecins pour garantir les plus hauts standards de soins et de diagnostic." },
  "about.story_title": { ar: "رحلة SahaLink", fr: "L'Odyssée SahaLink" },
  "about.story_p1": { ar: "ولدت SahaLink من رؤية طموحة لمواجهة التحديات الصحية في الجزائر. بدأت الفكرة عندما رأينا الصعوبات التي يواجهها المرضى في المناطق البعيدة للوصول إلى متخصصين في العاصمة أو المدن الكبرى.", fr: "SahaLink est née d'une vision ambitieuse pour relever les défis de santé en Algérie. L'idée a germé en observant les difficultés des patients en zones reculées pour accéder aux spécialistes des grandes villes." },
  "about.story_p2": { ar: "منذ تأسيسنا، عملنا بلا كلل لبناء منصة ليست مجرد أداة حجز، بل جسر حقيقي يربط الخبرة الطبية بالاحتياج الإنساني، مع الالتزام بأحدث معايير الأمان الرقمي.", fr: "Depuis notre création, nous avons travaillé sans relâche pour bâtir une plateforme qui n'est pas qu'un simple outil de prise de rendez-vous, mais un véritable pont reliant l'expertise médicale au besoin humain." },
  "about.story_p3": { ar: "اليوم، نخدم آلاف الجزائريين ونواصل الابتكار لنكون رفيقكم الصحي الرقمي الأول، ملتزمين ببناء مستقبل تكون فيه الصحة حقاً متاحاً للجميع بضغطة زر.", fr: "Aujourd'hui, nous servons des milliers d'Algériens et continuons d'innover pour être votre premier compagnon de santé numérique, bâtissant un futur où la santé est accessible à tous." },
  "about.team_title": { ar: "فريق القيادة", fr: "Équipe Dirigeante" },
  "about.team_subtitle": { ar: "خبراء يجمعون بين الطب والتكنولوجيا لخدمتكم", fr: "Des experts unissant médecine et technologie pour votre bien-être." },
  "about.cta_title": { ar: "انضم إلينا اليوم", fr: "Rejoignez-nous aujourd'hui" },
  "about.cta_desc": { ar: "ابدأ رحلتك الصحية معنا واحصل على أفضل رعاية طبية", fr: "Commencez votre voyage santé avec nous et obtenez les meilleurs soins" },
  "about.cta_register": { ar: "إنشاء حساب", fr: "Créer un compte" },
  "about.cta_find_doctor": { ar: "ابحث عن طبيب", fr: "Trouver un médecin" },
  "contact.hero_title": { ar: "اتصل بنا", fr: "Contactez-nous" },
  "contact.hero_subtitle": { ar: "نحن هنا للإجابة على أسئلتك ومساعدتك", fr: "Nous sommes là pour répondre à vos questions et vous aider" },
  "contact.info_title": { ar: "معلومات الاتصال", fr: "Coordonnées" },
  "contact.phone": { ar: "الهاتف", fr: "Téléphone" },
  "contact.email": { ar: "البريد الإلكتروني", fr: "E-mail" },
  "contact.address": { ar: "العنوان", fr: "Adresse" },
  "contact.address_desc": { ar: "شارع ديدوش مراد، الجزائر العاصمة\nالجزائر 16000", fr: "Rue Didouche Mourad, Alger Centre\nAlger 16000" },
  "contact.working_hours": { ar: "ساعات العمل", fr: "Heures de travail" },
  "contact.working_hours_desc1": { ar: "الأحد - الخميس: 8:00 - 18:00", fr: "Dimanche - Jeudi : 8h00 - 18h00" },
  "contact.working_hours_desc2": { ar: "الجمعة - السبت: مغلق", fr: "Vendredi - Samedi : Fermé" },
  "contact.form_title": { ar: "أرسل لنا رسالة", fr: "Envoyez-nous un message" },
  "contact.name_label": { ar: "الاسم الكامل", fr: "Nom Complet" },
  "contact.email_label": { ar: "البريد الإلكتروني", fr: "E-mail" },
  "contact.phone_label": { ar: "رقم الهاتف", fr: "Numéro de Téléphone" },
  "contact.subject_label": { ar: "الموضوع", fr: "Sujet" },
  "contact.message_label": { ar: "الرسالة", fr: "Message" },
  "contact.send_btn": { ar: "إرسال الرسالة", fr: "Envoyer le message" },
  "contact.sending": { ar: "جاري الإرسال...", fr: "Envoi en cours..." },
  "contact.map_title": { ar: "موقعنا", fr: "Notre Emplacement" },
  "contact.map_placeholder": { ar: "خريطة الموقع", fr: "Carte du site" },
  "services.hero_title": { ar: "خدماتنا الطبية", fr: "Nos Services Médicaux" },
  "services.hero_subtitle": { ar: "نقدم مجموعة شاملة من الخدمات الطبية الحديثة لضمان صحتك وراحتك", fr: "Nous offrons une gamme complète de services médicaux modernes pour assurer votre santé et votre confort." },
  "services.main_title": { ar: "خدماتنا الرئيسية", fr: "Nos Services Principaux" },
  "services.main_subtitle": { ar: "نوفر لك أحدث التقنيات الطبية والخدمات المتطورة", fr: "Nous mettons à votre disposition les dernières technologies médicales et des services de pointe." },
  "services.specialties_title": { ar: "التخصصات الطبية", fr: "Spécialités Médicales" },
  "services.specialties_subtitle": { ar: "نغطي جميع التخصصات الطبية بفريق من الأطباء المتميزين", fr: "Nous couvrons toutes les spécialités médicales avec une équipe de médecins distingués." },
  "services.consultation_title": { ar: "استشارات طبية عن بعد", fr: "Consultations en ligne" },
  "services.appointment_title": { ar: "حجز مواعيد عيادة", fr: "Prise de rendez-vous" },
  "services.records_title": { ar: "سجل طبي ذكي", fr: "Dossier médical électronique" },
  "services.cta_find_doctor": { ar: "ابحث عن طبيبك الآن", fr: "Trouver un médecin maintenant" },
  "services.cta_title": { ar: "هل أنت مستعد للبدء؟", fr: "Êtes-vous prêt à commencer ?" },
  "services.cta_desc": { ar: "احجز موعدك الآن واحصل على أفضل رعاية طبية", fr: "Réservez votre rendez-vous maintenant et obtenez les meilleurs soins médicaux." },
  "services.why_title": { ar: "لماذا تختارنا؟", fr: "Pourquoi nous choisir ?" },
  "services.why_subtitle": { ar: "نحن ملتزمون بتقديم أفضل رعاية صحية لك ولعائلتك", fr: "Nous nous engageons à fournir les meilleurs soins de santé pour vous et votre famille." },
  "ai.hero_title": { ar: "المساعد الطبي الذكي", fr: "Assistant Médical Intelligent" },
  "ai.hero_subtitle": { ar: "احصل على استشارة أولية ذكية وتوجيهات طبية من الذكاء الاصطناعي", fr: "Obtenez une première consultation intelligente et des conseils médicaux de l'IA" },
  "ai.disclaimer_title": { ar: "تنويه هام:", fr: "Avis important :" },
  "ai.disclaimer_desc": { ar: "المساعد الذكي يقدم استشارات تثقيفية فقط ولا يغني عن استشارة الطبيب المختص. في حالة الطوارئ، توجه فوراً إلى أقرب مستشفى أو اتصل برقم الطوارئ.", fr: "L'assistant intelligent fournit des conseils éducatifs uniquement et ne remplace pas une consultation avec un médecin spécialiste. En cas d'urgence, rendez-vous immédiatement à l'hôpital le plus proche ou appelez les services d'urgence." },
  "ai.step1_title": { ar: "قدم الأعراض", fr: "Décrivez les symptômes" },
  "ai.step1_desc": { ar: "اشرح الأعراض التي تشعر بها بالتفصيل", fr: "Expliquez les symptômes que vous ressentez en détail" },
  "ai.step2_title": { ar: "احصل على توجيهات", fr: "Obtenez des conseils" },
  "ai.step2_desc": { ar: "سيقدم الذكاء الاصطناعي توصيات أولية", fr: "L'intelligence artificielle fournira des recommandations initiales" },
  "ai.step3_title": { ar: "احجز مع متخصص", fr: "Réservez avec un spécialiste" },
  "ai.step3_desc": { ar: "إن أردت، احجز استشارة مع طبيب", fr: "Si vous le souhaitez, réservez une consultation avec un médecin" },
  "auth.login_title": { ar: "دخول المريض", fr: "Connexion Patient" },
  "auth.login_desc": { ar: "أدخل بريدك الإلكتروني وكلمة المرور للدخول إلى حسابك", fr: "Entrez votre email et votre mot de passe pour accéder à votre compte" },
  "auth.email_label": { ar: "البريد الإلكتروني", fr: "E-mail" },
  "auth.password_label": { ar: "كلمة المرور", fr: "Mot de passe" },
  "auth.forgot_password": { ar: "هل نسيت كلمة المرور؟", fr: "Mot de passe oublié ?" },
  "auth.login_btn": { ar: "دخول", fr: "Se connecter" },
  "auth.logging_in": { ar: "جاري الدخول...", fr: "Connexion en cours..." },
  "auth.no_account": { ar: "ليس لديك حساب؟", fr: "Vous n'avez pas de compte ?" },
  "auth.register_link": { ar: "إنشاء حساب جديد", fr: "Créer un nouveau compte" },
  "auth.empty_fields": { ar: "Veuillez remplir tous les champs", fr: "Veuillez remplir tous les champs" },
  "auth.login_failed": { ar: "Échec de la connexion", fr: "Échec de la connexion" },
  "doctors.title": { ar: "البحث عن الأطباء", fr: "Rechercher des médecins" },
  "doctors.subtitle": { ar: "اختر من قائمتنا الشاملة من الأطباء المتخصصين", fr: "Choisissez parmi notre liste complète de médecins spécialistes" },
  "doctors.search_placeholder": { ar: "ابحث عن طبيب أو ولاية...", fr: "Rechercher un médecin ou une wilaya..." },
  "doctors.all_specialties": { ar: "كل التخصصات", fr: "Toutes les spécialités" },
  "doctors.more_filters": { ar: "المزيد من الفلاتر", fr: "Plus de filtres" },
  "doctors.experience_label": { ar: "خبرة:", fr: "Expérience :" },
  "doctors.years": { ar: "سنة", fr: "ans" },
  "doctors.clinic_fee": { ar: "عيادة:", fr: "Clinique :" },
  "doctors.online_fee": { ar: "إنترنت:", fr: "En ligne :" },
  "doctors.no_results": { ar: "لا توجد نتائج تطابق البحث", fr: "Aucun résultat ne correspond à votre recherche" },
  "sidebar.dashboard": { ar: "لوحة التحكم", fr: "Tableau de bord" },
  "sidebar.appointments": { ar: "المواعيد", fr: "Rendez-vous" },
  "sidebar.medical_records": { ar: "السجل الطبي", fr: "Dossier Médical" },
  "sidebar.favorites": { ar: "المفضلة", fr: "Favoris" },
  "sidebar.settings": { ar: "الإعدادات", fr: "Paramètres" },
  "sidebar.home": { ar: "الصفحة الرئيسية", fr: "Accueil" },
  "sidebar.logout": { ar: "تسجيل الخروج", fr: "Déconnexion" },
  "sidebar.time_management": { ar: "إدارة الوقت", fr: "Gestion du temps" },
  "sidebar.patients": { ar: "المرضى", fr: "Patients" },
  "sidebar.reports": { ar: "التقارير", fr: "Rapports" },
  "common.loading": { ar: "جاري التحميل...", fr: "Chargement en cours..." },
  "common.search": { ar: "بحث", fr: "Rechercher" },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    localStorage.setItem("language", lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    const newLang = language === "ar" ? "fr" : "ar"
    setLanguage(newLang)
  }, [language, setLanguage])

  const t = useCallback(
    (key: string, lang?: Language): string => {
      const targetLang = lang || language
      return translations[key]?.[targetLang] || key
    },
    [language],
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
