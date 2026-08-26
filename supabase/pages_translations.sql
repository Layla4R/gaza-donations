-- ══════════════════════════════════════════════════════════════════
-- Page Translations (EN / FR / TR) for all legal + about pages
-- Run AFTER pages_content_update.sql
-- ══════════════════════════════════════════════════════════════════

-- Helper: insert or update translation
-- Usage: call after getting page IDs

-- ── ENGLISH TRANSLATIONS ──────────────────────────────────────

-- About Us — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'About Us',
'[
  {"id":"about-en-1","type":"text","props":{"title":"About Us","body":"We are For Relief Humanitarian Foundation — a pioneering digital humanitarian platform established to bridge the gap between giving and need. We combine rigorous humanitarian standards with modern financial technology to deliver trusted, transparent donations from donors to those who need them most, in crisis areas around the world.\n\nWe aim to build an integrated digital ecosystem connecting donors, partners, and humanitarian organizations with beneficiaries, providing advanced tools for campaign management, project verification, donation impact tracking, and reporting — ensuring aid reaches its intended recipients according to the highest international standards.","align":"left"}},
  {"id":"about-en-2","type":"image_text","props":{"title":"Why Us?","body":"The world is witnessing an unprecedented surge in humanitarian needs, with hundreds of millions of people requiring life-saving assistance due to conflicts, disasters, economic crises, and climate change.\n\nFor Relief was founded to harness technology for humanitarian action — converting every contribution into a documented, measurable humanitarian impact, while ensuring the highest standards of transparency and accountability at every stage of project implementation.","image":"","imagePosition":"right"}},
  {"id":"about-en-3","type":"text","props":{"title":"Our Vision","body":"A world where humanitarian needs are met efficiently and equitably, through a trusted digital ecosystem that promotes transparency, builds trust, and achieves sustainable humanitarian impact.","align":"center"}},
  {"id":"about-en-4","type":"text","props":{"title":"Our Mission","body":"To empower individuals and institutions to create sustainable humanitarian impact through a trusted digital platform connecting donors, partners, and communities in greatest need — providing innovative solutions for managing and implementing humanitarian initiatives in accordance with the highest standards of transparency, accountability, and international best practices.","align":"center"}},
  {"id":"about-en-5","type":"text","props":{"title":"Our Values","body":"Our work is anchored in a set of values that guide all our programs and partnerships:\n\n• Humanity: Respecting human dignity and placing human needs at the heart of all interventions\n• Transparency: Managing donations and resources with the highest levels of clarity and disclosure\n• Accountability: Maintaining responsibility to donors, partners, and beneficiaries\n• Innovation: Leveraging digital solutions and modern technologies to advance humanitarian work\n• Partnership: Building strategic relationships with institutions and humanitarian organizations","align":"left"}},
  {"id":"about-en-6","type":"text","props":{"title":"Our Commitment to International Standards","body":"Our platform is committed to implementing the best humanitarian practices and global standards, including:\n\n• Core Humanitarian Standard (CHS)\n• Sphere Standards\n• UN Sustainable Development Goals (SDGs)\n• Anti-Money Laundering and Counter-Terrorism Financing requirements (AML/FATF)\n• International Quality and Governance Standards (ISO)","align":"left"}},
  {"id":"about-en-7","type":"cta","props":{"title":"Be Part of the Story","subtitle":"Your donation today makes a real difference in the life of an entire family","buttonText":"Donate Now","buttonLink":"/en/donate","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'about' OR p.slug = 'about-us' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Privacy Policy — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Privacy Policy',
'[
  {"id":"priv-en-1","type":"text","props":{"title":"Privacy Policy & Data Protection","body":"For Relief Humanitarian Foundation is committed to protecting your privacy and safeguarding your personal data. This policy explains how we collect, use, store, and protect your information when you use our website, digital services, or donate through our platform.\n\nBy using our website, you agree to the terms of this Privacy Policy.","align":"left"}},
  {"id":"priv-en-2","type":"text","props":{"title":"Data We Collect","body":"We may collect the following data:\n\n• Full name\n• Email address\n• Phone number\n• Country of residence\n• Donation and financial transaction data\n• Account information upon registration\n• Communication and inquiry data\n• Technical information such as IP address, browser type, and cookies\n\nWe only collect personal data when voluntarily provided or when necessary to deliver our services.","align":"left"}},
  {"id":"priv-en-3","type":"text","props":{"title":"How We Use Your Data","body":"We use your data to:\n\n• Process donations and payments\n• Create and manage user accounts\n• Communicate with donors, beneficiaries, and partners\n• Send receipts, reports, and updates\n• Improve our website services and user experience\n• Comply with legal and regulatory requirements\n• Prevent fraud and enhance platform security","align":"left"}},
  {"id":"priv-en-4","type":"text","props":{"title":"Data Protection","body":"We implement advanced technical and administrative measures to protect personal data, including:\n\n• Data encryption in transit and at rest\n• Secure servers\n• Strict access controls\n• Continuous security monitoring\n• Regular cybersecurity procedure reviews\n\nWe do not sell, rent, or trade your personal data. Data may only be shared with: authorized payment service providers, implementation partners when necessary, government authorities when required by law, and technical service providers who assist in operating the platform under confidentiality agreements.","align":"left"}},
  {"id":"priv-en-5","type":"text","props":{"title":"Your Rights Under GDPR","body":"Under the General Data Protection Regulation (GDPR), you have the right to:\n\n• Access your personal data\n• Correct inaccurate data\n• Request data deletion where permitted by law\n• Restrict data processing\n• Object to certain types of processing\n• Withdraw consent at any time\n• Request data portability to another service provider\n• Lodge a complaint with the competent supervisory authority\n\nWe retain personal data only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations.","align":"left"}},
  {"id":"priv-en-6","type":"cta","props":{"title":"Questions About Your Privacy?","subtitle":"Our Data Protection Officer is ready to respond — within 72 hours","buttonText":"Contact Privacy Officer","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'privacy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Terms & Conditions — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Terms & Conditions',
'[
  {"id":"terms-en-1","type":"text","props":{"title":"Terms & Conditions","body":"Welcome to For Relief Humanitarian Foundation. These Terms & Conditions govern your use of our website, digital platform, and related services, forming a legally binding agreement between you and the Foundation.\n\nBy using the platform, creating an account, making a donation, or benefiting from any of our services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you disagree with any part of them, please refrain from using the platform.","align":"left"}},
  {"id":"terms-en-2","type":"text","props":{"title":"Legal Framework","body":"The platform complies with internationally applicable compliance principles and rules, including:\n\n• Consumer protection and e-commerce legislation\n• Personal data protection\n• Anti-money laundering and counter-terrorism financing requirements\n• Best governance practices for non-profit organizations","align":"left"}},
  {"id":"terms-en-3","type":"text","props":{"title":"Eligibility","body":"To use the platform you must:\n\n• Be legally eligible to enter into contracts under the laws of your country\n• Provide accurate, truthful, and up-to-date information\n• Use legally authorized payment methods\n• Comply with all applicable laws and regulations\n\nThe Foundation may refuse or suspend any account or transaction if a violation of these terms or legal regulations is identified.","align":"left"}},
  {"id":"terms-en-4","type":"text","props":{"title":"Donations","body":"Donations are used to support humanitarian programs and projects in accordance with Foundation policies. The donor acknowledges that:\n\n• The donation is made of their own free will\n• The donated funds are from a legitimate source\n• The Foundation may redirect donations to a similar project if the chosen project is fully funded or cannot be implemented, achieving the same humanitarian purpose\n\nA donation does not constitute a purchase, investment, or contract guaranteeing specific outcomes.","align":"left"}},
  {"id":"terms-en-5","type":"text","props":{"title":"Foundation Obligations","body":"The Foundation commits to:\n\n• Managing donations responsibly and with integrity\n• Issuing electronic receipts to donors\n• Publishing financial and impact reports periodically\n• Protecting personal data per our Privacy Policy\n• Applying the highest standards of transparency, accountability, and governance","align":"left"}},
  {"id":"terms-en-6","type":"cta","props":{"title":"Legal Questions?","subtitle":"Our legal team responds to your inquiries within 48 hours","buttonText":"Contact Us","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'terms' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Refund Policy — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Refund Policy',
'[
  {"id":"ref-en-1","type":"text","props":{"title":"Refund Policy","body":"For Relief Humanitarian Foundation is committed to managing donations with the highest levels of transparency and responsibility. We understand that some situations may require requesting a donation refund.","align":"left"}},
  {"id":"ref-en-2","type":"text","props":{"title":"When Can You Request a Refund?","body":"A donor may submit a refund request in the following cases:\n\n• An error in the donation amount or duplicate payment\n• A transaction made without authorization from the payment method owner\n• A technical error that led to an unintended charge","align":"left"}},
  {"id":"ref-en-3","type":"text","props":{"title":"Cases Not Eligible for Refund","body":"Refunds may not be possible in the following cases:\n\n• After the donation has been transferred to the project or implementing organization\n• If the donation has already been used in humanitarian activities\n• If the refund request violates applicable regulations or laws","align":"left"}},
  {"id":"ref-en-4","type":"text","props":{"title":"How to Submit a Request","body":"Refund requests must be sent within 14 days of the donation date via email, including:\n\n• Transaction number or receipt\n• Donor name\n• Reason for the refund request\n\nThe request will be reviewed and the applicant notified of the decision within 10 business days.","align":"left"}},
  {"id":"ref-en-5","type":"cta","props":{"title":"Have a Refund Request?","subtitle":"Our team responds within 48 business hours — we commit to resolving your request fairly","buttonText":"Submit Request","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'refund-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Cookie Policy — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Cookie Policy',
'[
  {"id":"cook-en-1","type":"text","props":{"title":"Cookie Policy","body":"For Relief Humanitarian Foundation uses cookies and similar technologies to improve website performance, enhance user experience, and ensure our services operate efficiently and securely.","align":"left"}},
  {"id":"cook-en-2","type":"text","props":{"title":"What Are Cookies?","body":"Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, analyze site usage, and improve the services we offer, without accessing your sensitive personal data.","align":"left"}},
  {"id":"cook-en-3","type":"text","props":{"title":"How We Use Cookies","body":"We use cookies for the following purposes:\n\n• Operating essential website functions and ensuring it works correctly\n• Saving user preferences and settings to improve browsing experience\n• Analyzing website performance and measuring visits and user behavior to improve services\n• Enhancing website security and detecting unauthorized activities\n• Improving content and services provided to match visitor needs","align":"left"}},
  {"id":"cook-en-4","type":"text","props":{"title":"Managing Cookies","body":"You can accept, reject, or delete cookies at any time through your browser settings. However, disabling some cookies may affect the performance of certain website functions or limit your ability to fully benefit from our services.\n\nWe may update this policy from time to time to keep up with legal or technical requirements. Any amendments will be published on this page with the date of last update.","align":"left"}},
  {"id":"cook-en-5","type":"cta","props":{"title":"Questions About Cookies?","subtitle":"Our privacy team is ready to answer your inquiries","buttonText":"Contact Us","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'cookie-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- AML Policy — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Anti-Fraud & AML Policy',
'[
  {"id":"aml-en-1","type":"text","props":{"title":"Anti-Money Laundering & Anti-Fraud Policy","body":"For Relief Humanitarian Foundation is committed to the highest standards of integrity and compliance to protect its financial resources and prevent its platform from being exploited for money laundering, terrorist financing, fraud, or any illegal activities. The Foundation adopts a risk-based approach, in line with international best practices and applicable legislation.","align":"left"}},
  {"id":"aml-en-2","type":"text","props":{"title":"Our Commitments","body":"The Foundation commits to:\n\n• Implementing effective procedures to combat money laundering, terrorist financing, and fraud\n• Protecting donor funds and ensuring they are used for designated humanitarian purposes\n• Verifying the identity of partners and dealing parties when required\n• Monitoring financial transactions to detect any unusual or suspicious activity\n• Cooperating with competent regulatory and supervisory authorities in accordance with legal requirements","align":"left"}},
  {"id":"aml-en-3","type":"text","props":{"title":"Regulatory Framework","body":"The Foundation is guided by international best practices and standards, including:\n\n• Financial Action Task Force (FATF) Recommendations\n• Anti-Money Laundering and Counter-Terrorism Financing requirements (AML/CFT)\n• International sanctions regimes where applicable\n• Relevant national legislation in the countries where the Foundation operates","align":"left"}},
  {"id":"aml-en-4","type":"text","props":{"title":"Know Your Customer (KYC)","body":"The Foundation applies verification procedures proportional to risk levels, including when necessary:\n\n• Verifying the identity of donors or partners\n• Reviewing payment data and transactions\n• Checking compliance with international sanctions lists\n• Requesting additional information or supporting documents in cases that warrant it\n\nEnhanced due diligence procedures may be applied to high-risk transactions or parties.","align":"left"}},
  {"id":"aml-en-5","type":"text","props":{"title":"User Responsibilities","body":"By using the platform, the user acknowledges that:\n\n• Funds used for donations are from a legitimate source\n• Information provided is accurate and complete\n• The platform is not being used for any illegal or fraudulent activity\n• They comply with all laws and regulations applicable in their country of residence","align":"left"}},
  {"id":"aml-en-6","type":"cta","props":{"title":"Report Suspicious Activity","subtitle":"Contact our compliance team immediately — we respond within 24 hours","buttonText":"Report Now","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'aml-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Complaints Policy — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Complaints Policy',
'[
  {"id":"comp-en-1","type":"text","props":{"title":"Communication & Complaints Policy","body":"At For Relief Humanitarian Foundation, we believe that effective communication and listening to feedback and complaints are fundamental to our commitment to transparency, accountability, and continuous improvement. We provide clear communication channels and a fair mechanism for handling all inquiries and complaints with confidentiality, professionalism, and in a timely manner.","align":"left"}},
  {"id":"comp-en-2","type":"text","props":{"title":"Official Communication Channels","body":"You can contact us through the following channels:\n\n• info@forrelief.org — General inquiries\n• complaints@forrelief.org — Complaints and feedback\n• refunds@forrelief.org — Donation refunds\n• info@forrelief.org — Privacy and data protection\n• fraud@forrelief.org — Reporting fraud\n• legal@forrelief.org — Legal matters\n• partners@forrelief.org — Partnerships\n• media@forrelief.org — Media inquiries\n\nYou can also use the contact form available on our website at any time.","align":"left"}},
  {"id":"comp-en-3","type":"text","props":{"title":"Types of Complaints","body":"We handle all complaints related to Foundation services, including:\n\n• Donations and financial transactions\n• Data protection and privacy\n• Digital service quality\n• Transparency and donation management\n• Conduct of staff or partners\n• Fraud or misuse of the Foundation name\n• Any feedback related to Foundation programs or services","align":"left"}},
  {"id":"comp-en-4","type":"text","props":{"title":"Complaint Handling Process","body":"All complaints go through the following stages:\n\n1. Receipt: The complaint is registered and an acknowledgment is sent within 48 business hours.\n\n2. Review & Investigation: The specialist team reviews the complaint and gathers necessary information.\n\n3. Response & Resolution: The complainant is informed of the review outcome and actions taken within 10 business days.\n\n4. Escalation: If unsatisfied, the complainant may request further review from senior management via legal@forrelief.org","align":"left"}},
  {"id":"comp-en-5","type":"text","props":{"title":"Our Commitments","body":"We commit to:\n\n• Treating all complaints with complete confidentiality\n• Respecting all complainants without discrimination\n• Not charging any fees for submitting or processing complaints\n• Not taking any retaliatory actions against anyone who submits a complaint in good faith\n• Using complaint outcomes to improve our services and enhance the quality of our work","align":"left"}},
  {"id":"comp-en-6","type":"cta","props":{"title":"Have a Complaint or Inquiry?","subtitle":"Our team responds within 48 hours and we commit to resolving your issue","buttonText":"Submit Complaint","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'complaints' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- Transparency — EN
INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'en', 'Financial Transparency',
'[
  {"id":"trans-en-1","type":"text","props":{"title":"Our Commitment to Transparency & Accountability","body":"At For Relief Humanitarian Foundation, we believe that transparency and accountability form the foundation upon which the trust of donors, partners, and beneficiary communities is built. We are therefore committed to managing all donations according to the highest standards of governance, integrity, and financial disclosure, while ensuring the optimal use of resources to achieve the greatest possible humanitarian impact.","align":"left"}},
  {"id":"trans-en-2","type":"text","props":{"title":"How We Manage Donations","body":"All donations pass through an integrated financial and digital system that ensures:\n\n• Receiving donations through secure, accredited payment methods\n• Recording and tracking all financial transactions electronically\n• Allocating donations according to donor preferences when available\n• Monitoring disbursement and implementation operations according to clear financial and administrative controls\n• Issuing financial and impact reports on a regular basis\n\nWe strive to direct the largest possible proportion of donations to implementing humanitarian programs and projects, while maintaining the minimum operational and administrative costs necessary to ensure quality implementation and sustainability.","align":"left"}},
  {"id":"trans-en-3","type":"text","props":{"title":"Financial Reports","body":"We publish periodic financial reports that include:\n\n• Total donations received\n• Revenue sources\n• Expenditure breakdown by sector and project\n• Operational and administrative expenses\n• Annual budgets\n• Audited financial statements (when available)\n\nFinancial operations are managed according to institutional policies and procedures that ensure compliance with international best practices, including AML/CFT standards and FATF recommendations.","align":"left"}},
  {"id":"trans-en-4","type":"text","props":{"title":"Our Commitment to Donors","body":"We commit to providing every donor with clear information about their contribution, and to providing accurate, verifiable reports reflecting project progress and outcomes — building trust and ensuring the responsible use of every donation.\n\nWe view transparency as an ongoing responsibility, not merely a legal obligation. We continuously develop our financial and digital systems to ensure the highest levels of integrity and disclosure, converting every contribution into a documented, measurable humanitarian impact.","align":"left"}},
  {"id":"trans-en-5","type":"cta","props":{"title":"Partner in Transparency","subtitle":"Contact us to access our latest financial reports","buttonText":"Contact Us","buttonLink":"/en/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'transparency' OR p.slug = 'financial-transparency' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- ── FRENCH TRANSLATIONS ───────────────────────────────────────

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'À Propos de Nous',
'[
  {"id":"about-fr-1","type":"text","props":{"title":"À Propos de Nous","body":"Nous sommes For Relief Humanitarian Foundation — une plateforme humanitaire numérique pionnière, créée pour combler le fossé entre la générosité et le besoin. Nous combinons des normes humanitaires rigoureuses et des technologies financières modernes pour acheminer des dons fiables et transparents des donateurs vers ceux qui en ont le plus besoin, dans les zones de crise à travers le monde.","align":"left"}},
  {"id":"about-fr-2","type":"text","props":{"title":"Notre Vision","body":"Un monde où les besoins humanitaires sont satisfaits avec efficacité et équité, grâce à un écosystème numérique de confiance qui favorise la transparence, renforce la confiance et réalise un impact humanitaire durable.","align":"center"}},
  {"id":"about-fr-3","type":"text","props":{"title":"Notre Mission","body":"Permettre aux individus et aux institutions de créer un impact humanitaire durable grâce à une plateforme numérique de confiance qui connecte les donateurs, les partenaires et les communautés les plus nécessiteuses, en fournissant des solutions innovantes pour la gestion et la mise en œuvre des initiatives humanitaires selon les normes les plus élevées de transparence et de responsabilité.","align":"center"}},
  {"id":"about-fr-4","type":"text","props":{"title":"Nos Valeurs","body":"• Humanité : Respecter la dignité humaine et placer les besoins humains au cœur de toutes nos interventions\n• Transparence : Gérer les dons et les ressources avec les niveaux de clarté et de divulgation les plus élevés\n• Responsabilité : Maintenir la responsabilité envers les donateurs, les partenaires et les bénéficiaires\n• Innovation : Exploiter les solutions numériques et les technologies modernes pour faire avancer le travail humanitaire\n• Partenariat : Établir des relations stratégiques avec les institutions et les organisations humanitaires","align":"left"}},
  {"id":"about-fr-5","type":"cta","props":{"title":"Faites Partie de l''Histoire","subtitle":"Votre don fait une vraie différence dans la vie d''une famille entière","buttonText":"Faire un Don","buttonLink":"/fr/donate","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'about' OR p.slug = 'about-us' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Politique de Confidentialité',
'[
  {"id":"priv-fr-1","type":"text","props":{"title":"Politique de Confidentialité et Protection des Données","body":"For Relief Humanitarian Foundation s''engage à protéger votre vie privée et à préserver la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre site web ou nos services numériques, ou que vous faites un don via notre plateforme.","align":"left"}},
  {"id":"priv-fr-2","type":"text","props":{"title":"Données Collectées","body":"Nous pouvons collecter les données suivantes :\n\n• Nom complet\n• Adresse e-mail\n• Numéro de téléphone\n• Pays de résidence\n• Données de dons et de transactions financières\n• Informations de compte lors de l''inscription\n• Données de communication et de demandes de renseignements\n• Informations techniques telles que l''adresse IP, le type de navigateur et les cookies","align":"left"}},
  {"id":"priv-fr-3","type":"text","props":{"title":"Vos Droits (RGPD)","body":"Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez le droit de :\n\n• Accéder à vos données personnelles\n• Corriger les données inexactes\n• Demander la suppression des données lorsque la loi le permet\n• Restreindre le traitement des données\n• Vous opposer à certains types de traitement\n• Retirer votre consentement à tout moment\n• Déposer une plainte auprès de l''autorité de contrôle compétente","align":"left"}},
  {"id":"priv-fr-4","type":"cta","props":{"title":"Questions sur votre vie privée ?","subtitle":"Notre délégué à la protection des données est prêt à répondre sous 72 heures","buttonText":"Contacter le DPO","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'privacy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Conditions Générales',
'[
  {"id":"terms-fr-1","type":"text","props":{"title":"Conditions Générales d''Utilisation","body":"Bienvenue sur For Relief Humanitarian Foundation. Les présentes Conditions Générales régissent votre utilisation de notre site web, de notre plateforme numérique et des services associés, formant un accord juridiquement contraignant entre vous et la Fondation.\n\nEn utilisant la plateforme, en créant un compte, en effectuant un don ou en bénéficiant de l''un de nos services, vous reconnaissez avoir lu, compris et accepté d''être lié par ces conditions.","align":"left"}},
  {"id":"terms-fr-2","type":"text","props":{"title":"Dons","body":"Les dons sont utilisés pour soutenir des programmes et projets humanitaires conformément aux politiques de la Fondation. Le donateur reconnaît que :\n\n• Le don est effectué de sa propre volonté\n• Les fonds donnés proviennent d''une source légitime\n• La Fondation peut réorienter les dons vers un projet similaire si le projet choisi est entièrement financé ou ne peut être mis en œuvre\n\nUn don ne constitue pas un achat, un investissement ou un contrat garantissant des résultats spécifiques.","align":"left"}},
  {"id":"terms-fr-3","type":"cta","props":{"title":"Questions Juridiques ?","subtitle":"Notre équipe juridique répond à vos demandes sous 48 heures","buttonText":"Nous Contacter","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'terms' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Politique de Remboursement',
'[
  {"id":"ref-fr-1","type":"text","props":{"title":"Politique de Remboursement des Dons","body":"For Relief Humanitarian Foundation s''engage à gérer les dons avec les niveaux les plus élevés de transparence et de responsabilité. Nous comprenons que certaines situations peuvent nécessiter une demande de remboursement de don.","align":"left"}},
  {"id":"ref-fr-2","type":"text","props":{"title":"Quand Peut-on Demander un Remboursement ?","body":"Un donateur peut soumettre une demande de remboursement dans les cas suivants :\n\n• Une erreur dans le montant du don ou un paiement en double\n• Une transaction effectuée sans autorisation du titulaire du moyen de paiement\n• Une erreur technique ayant entraîné un prélèvement non intentionnel","align":"left"}},
  {"id":"ref-fr-3","type":"text","props":{"title":"Procédure","body":"Les demandes de remboursement doivent être envoyées dans les 14 jours suivant la date du don par e-mail, en incluant :\n\n• Numéro de transaction ou reçu\n• Nom du donateur\n• Motif de la demande de remboursement\n\nLa demande sera examinée et le demandeur informé de la décision dans un délai maximum de 10 jours ouvrables.","align":"left"}},
  {"id":"ref-fr-4","type":"cta","props":{"title":"Vous avez une demande de remboursement ?","subtitle":"Notre équipe répond sous 48 heures ouvrables","buttonText":"Soumettre une Demande","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'refund-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Politique de Cookies',
'[
  {"id":"cook-fr-1","type":"text","props":{"title":"Politique relative aux Cookies","body":"For Relief Humanitarian Foundation utilise des cookies et des technologies similaires pour améliorer les performances du site, enrichir l''expérience utilisateur et garantir le bon fonctionnement de nos services de manière efficace et sécurisée.\n\nLes cookies sont de petits fichiers texte stockés sur votre appareil lors de votre visite sur notre site. Ils nous aident à mémoriser vos préférences, analyser l''utilisation du site et améliorer les services proposés, sans accéder à vos données personnelles sensibles.","align":"left"}},
  {"id":"cook-fr-2","type":"text","props":{"title":"Gestion des Cookies","body":"Vous pouvez accepter, refuser ou supprimer les cookies à tout moment via les paramètres de votre navigateur. Cependant, la désactivation de certains cookies peut affecter les performances de certaines fonctions du site.\n\nNous pouvons mettre à jour cette politique de temps à autre pour suivre les exigences légales ou techniques. Toute modification sera publiée sur cette page avec la date de dernière mise à jour.","align":"left"}},
  {"id":"cook-fr-3","type":"cta","props":{"title":"Questions sur les Cookies ?","subtitle":"Notre équipe de confidentialité est prête à répondre à vos questions","buttonText":"Nous Contacter","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'cookie-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Politique Anti-Fraude',
'[
  {"id":"aml-fr-1","type":"text","props":{"title":"Politique Anti-Blanchiment et Anti-Fraude","body":"For Relief Humanitarian Foundation est engagée aux normes les plus élevées d''intégrité et de conformité pour protéger ses ressources financières et empêcher l''exploitation de sa plateforme à des fins de blanchiment d''argent, de financement du terrorisme, de fraude ou de toute activité illégale.","align":"left"}},
  {"id":"aml-fr-2","type":"text","props":{"title":"Nos Engagements","body":"La Fondation s''engage à :\n\n• Mettre en œuvre des procédures efficaces contre le blanchiment d''argent et le financement du terrorisme\n• Protéger les fonds des donateurs et garantir leur utilisation aux fins humanitaires désignées\n• Surveiller les transactions financières pour détecter toute activité inhabituelle ou suspecte\n• Coopérer avec les autorités réglementaires et de surveillance compétentes","align":"left"}},
  {"id":"aml-fr-3","type":"cta","props":{"title":"Signaler une Activité Suspecte","subtitle":"Contactez notre équipe de conformité immédiatement — nous répondons sous 24 heures","buttonText":"Signaler Maintenant","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'aml-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Politique de Réclamations',
'[
  {"id":"comp-fr-1","type":"text","props":{"title":"Politique de Communication et de Réclamations","body":"Chez For Relief Humanitarian Foundation, nous croyons que la communication efficace et l''écoute des retours et des réclamations font partie intégrante de notre engagement envers la transparence, la responsabilité et l''amélioration continue.","align":"left"}},
  {"id":"comp-fr-2","type":"text","props":{"title":"Canaux de Communication Officiels","body":"Vous pouvez nous contacter via les canaux suivants :\n\n• info@forrelief.org — Renseignements généraux\n• complaints@forrelief.org — Réclamations et commentaires\n• refunds@forrelief.org — Remboursements de dons\n• info@forrelief.org — Confidentialité et protection des données\n• fraud@forrelief.org — Signalement de fraude\n• legal@forrelief.org — Affaires juridiques","align":"left"}},
  {"id":"comp-fr-3","type":"text","props":{"title":"Nos Engagements","body":"Nous nous engageons à :\n\n• Traiter toutes les réclamations avec une confidentialité totale\n• Respecter tous les plaignants sans discrimination\n• Ne facturer aucun frais pour le dépôt ou le traitement des réclamations\n• Ne prendre aucune mesure de représailles contre quiconque soumet une réclamation de bonne foi","align":"left"}},
  {"id":"comp-fr-4","type":"cta","props":{"title":"Vous avez une Réclamation ?","subtitle":"Notre équipe répond sous 48 heures","buttonText":"Soumettre une Réclamation","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'complaints' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'fr', 'Transparence Financière',
'[
  {"id":"trans-fr-1","type":"text","props":{"title":"Notre Engagement envers la Transparence","body":"Chez For Relief Humanitarian Foundation, nous croyons que la transparence et la responsabilité constituent le fondement sur lequel repose la confiance des donateurs, des partenaires et des communautés bénéficiaires. Nous nous engageons donc à gérer tous les dons selon les normes les plus élevées de gouvernance, d''intégrité et de divulgation financière.","align":"left"}},
  {"id":"trans-fr-2","type":"text","props":{"title":"Comment Nous Gérons les Dons","body":"Tous les dons transitent par un système financier et numérique intégré garantissant :\n\n• La réception des dons via des moyens de paiement sécurisés et accrédités\n• L''enregistrement et le suivi électroniques de toutes les opérations financières\n• L''affectation des dons selon les préférences du donateur lorsque disponibles\n• La surveillance des opérations de décaissement et de mise en œuvre\n• L''émission de rapports financiers et d''impact réguliers","align":"left"}},
  {"id":"trans-fr-3","type":"cta","props":{"title":"Partenaire en Transparence","subtitle":"Contactez-nous pour accéder à nos derniers rapports financiers","buttonText":"Nous Contacter","buttonLink":"/fr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'transparency' OR p.slug = 'financial-transparency' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

-- ── TURKISH TRANSLATIONS ─────────────────────────────────────

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Hakkımızda',
'[
  {"id":"about-tr-1","type":"text","props":{"title":"Hakkımızda","body":"Biz For Relief Humanitarian Foundation — verme ile ihtiyaç arasındaki uçurumu kapatmak için kurulan öncü bir dijital insani yardım platformuyuz. Dünya genelindeki kriz bölgelerinde en çok ihtiyacı olanlara güvenilir ve şeffaf bağışlar iletmek için katı insani standartları modern finansal teknolojilerle bir araya getiriyoruz.","align":"left"}},
  {"id":"about-tr-2","type":"text","props":{"title":"Vizyonumuz","body":"Şeffaflığı teşvik eden, güveni inşa eden ve sürdürülebilir insani etki yaratan güvenilir bir dijital ekosistem aracılığıyla insani ihtiyaçların verimli ve adil bir şekilde karşılandığı bir dünya.","align":"center"}},
  {"id":"about-tr-3","type":"text","props":{"title":"Misyonumuz","body":"En yüksek şeffaflık, hesap verebilirlik standartlarına ve uluslararası en iyi uygulamalara göre insani girişimlerin yönetimi ve uygulanması için yenilikçi çözümler sağlayan güvenilir bir dijital platform aracılığıyla bireylerin ve kurumların sürdürülebilir insani etki yaratmalarını sağlamak.","align":"center"}},
  {"id":"about-tr-4","type":"text","props":{"title":"Değerlerimiz","body":"• İnsaniyet: İnsan onuruna saygı göstermek ve insan ihtiyaçlarını tüm müdahalelerin merkezine koymak\n• Şeffaflık: Bağışları ve kaynakları en yüksek netlik ve ifşa düzeylerinde yönetmek\n• Hesap Verebilirlik: Bağışçılara, ortaklara ve yararlanıcılara karşı sorumluluğu korumak\n• İnovasyon: İnsani çalışmayı ilerletmek için dijital çözümleri ve modern teknolojileri kullanmak\n• Ortaklık: Kurumlar ve insani kuruluşlarla stratejik ilişkiler kurmak","align":"left"}},
  {"id":"about-tr-5","type":"cta","props":{"title":"Hikayenin Bir Parçası Olun","subtitle":"Bugünkü bağışınız bir ailenin hayatında gerçek bir fark yaratır","buttonText":"Bağış Yap","buttonLink":"/tr/donate","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'about' OR p.slug = 'about-us' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Gizlilik Politikası',
'[
  {"id":"priv-tr-1","type":"text","props":{"title":"Gizlilik Politikası ve Veri Koruma","body":"For Relief Humanitarian Foundation, gizliliğinizi koruma ve kişisel verilerinizin gizliliğini sağlama konusunda kararlıdır. Bu politika, web sitemizi, dijital hizmetlerimizi kullandığınızda veya platformumuz aracılığıyla bağış yaptığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı ve koruduğumuzu açıklamaktadır.","align":"left"}},
  {"id":"priv-tr-2","type":"text","props":{"title":"GDPR Kapsamındaki Haklarınız","body":"Genel Veri Koruma Yönetmeliği (GDPR) uyarınca aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinize erişim\n• Yanlış verilerin düzeltilmesi\n• Yasanın izin verdiği durumlarda verilerin silinmesini talep etme\n• Veri işlemeyi kısıtlama\n• Belirli işleme türlerine itiraz etme\n• İstediğiniz zaman onayı geri çekme\n• Yetkili denetleyici otoriteye şikayette bulunma","align":"left"}},
  {"id":"priv-tr-3","type":"cta","props":{"title":"Gizliliğiniz Hakkında Sorularınız mı Var?","subtitle":"Veri Koruma Yetkilimiz 72 saat içinde yanıt vermeye hazır","buttonText":"DKY ile İletişime Geç","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'privacy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Kullanım Koşulları',
'[
  {"id":"terms-tr-1","type":"text","props":{"title":"Kullanım Koşulları","body":"For Relief Humanitarian Foundation''a hoş geldiniz. Bu Kullanım Koşulları, web sitemizi, dijital platformumuzu ve ilgili hizmetleri kullanımınızı düzenlemekte olup sizinle Vakıf arasında yasal olarak bağlayıcı bir anlaşma oluşturmaktadır.\n\nPlatformu kullanarak, hesap oluşturarak, bağış yaparak veya hizmetlerimizden yararlanarak bu koşulları okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi onaylamış olursunuz.","align":"left"}},
  {"id":"terms-tr-2","type":"text","props":{"title":"Bağışlar","body":"Bağışlar, Vakfın politikalarına uygun olarak insani programları ve projeleri desteklemek için kullanılır. Bağışçı şunu kabul eder:\n\n• Bağış kendi özgür iradesiyle yapılmaktadır\n• Bağışlanan fonlar meşru bir kaynaktan gelmektedir\n• Vakıf, seçilen proje tamamen finanse edildiğinde veya uygulanamadığında bağışları benzer bir projeye yönlendirebilir\n\nBir bağış, belirli sonuçları garanti eden bir satın alma, yatırım veya sözleşme değildir.","align":"left"}},
  {"id":"terms-tr-3","type":"cta","props":{"title":"Hukuki Sorularınız mı Var?","subtitle":"Hukuk ekibimiz sorularınızı 48 saat içinde yanıtlar","buttonText":"Bize Ulaşın","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'terms' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'İade Politikası',
'[
  {"id":"ref-tr-1","type":"text","props":{"title":"Bağış İade Politikası","body":"For Relief Humanitarian Foundation, bağışları en yüksek şeffaflık ve sorumluluk standartlarıyla yönetmeyi taahhüt eder. Bazı durumlarda bağış iadesi talep edilmesi gerekebileceğinin farkındayız.","align":"left"}},
  {"id":"ref-tr-2","type":"text","props":{"title":"İade Talep Koşulları","body":"Bağışçı aşağıdaki durumlarda iade talebinde bulunabilir:\n\n• Bağış miktarında hata veya mükerrer ödeme\n• Ödeme yöntemi sahibinin yetkisi olmadan gerçekleştirilen işlem\n• İstemeden yapılan kesintiye yol açan teknik hata\n\nİade talepleri bağış tarihinden itibaren 14 gün içinde e-posta ile gönderilmelidir. Talep, 10 iş günü içinde incelenip sonuç bildirilir.","align":"left"}},
  {"id":"ref-tr-3","type":"cta","props":{"title":"İade Talebiniz mi Var?","subtitle":"Ekibimiz 48 iş saati içinde yanıt verir","buttonText":"Talep Gönder","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'refund-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Çerez Politikası',
'[
  {"id":"cook-tr-1","type":"text","props":{"title":"Çerez Politikası","body":"For Relief Humanitarian Foundation, web sitesi performansını iyileştirmek, kullanıcı deneyimini geliştirmek ve hizmetlerimizin verimli ve güvenli şekilde çalışmasını sağlamak için çerezler ve benzeri teknolojiler kullanmaktadır.\n\nÇerezler, web sitemizi ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır. Tercihlerinizi hatırlamamıza, site kullanımını analiz etmemize ve sunulan hizmetleri geliştirmemize yardımcı olurlar.","align":"left"}},
  {"id":"cook-tr-2","type":"text","props":{"title":"Çerezleri Yönetme","body":"Tarayıcı ayarlarınız aracılığıyla çerezleri istediğiniz zaman kabul edebilir, reddedebilir veya silebilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması, sitenin bazı işlevlerinin performansını etkileyebilir.\n\nYasal veya teknik gerekliliklerle güncel kalmak için bu politikayı zaman zaman güncelleyebiliriz.","align":"left"}},
  {"id":"cook-tr-3","type":"cta","props":{"title":"Çerezler Hakkında Sorularınız mı Var?","subtitle":"Gizlilik ekibimiz sorularınızı yanıtlamaya hazır","buttonText":"Bize Ulaşın","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'cookie-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Dolandırıcılık Önleme Politikası',
'[
  {"id":"aml-tr-1","type":"text","props":{"title":"Kara Para Aklamayla Mücadele ve Dolandırıcılık Önleme Politikası","body":"For Relief Humanitarian Foundation, finansal kaynaklarını korumak ve platformunun kara para aklaması, terörün finansmanı, dolandırıcılık veya herhangi bir yasa dışı faaliyet için kullanılmasını önlemek amacıyla en yüksek bütünlük ve uyum standartlarına bağlıdır.","align":"left"}},
  {"id":"aml-tr-2","type":"text","props":{"title":"Taahhütlerimiz","body":"Vakıf şunları taahhüt eder:\n\n• Kara para aklamayla, terörün finansmanıyla ve dolandırıcılıkla mücadele için etkili prosedürler uygulamak\n• Bağışçı fonlarını korumak ve belirlenen insani amaçlar için kullanılmasını sağlamak\n• Olağandışı veya şüpheli faaliyetleri tespit etmek için finansal işlemleri izlemek\n• Yasal gereklilikler çerçevesinde yetkili düzenleyici ve denetleyici makamlarla iş birliği yapmak","align":"left"}},
  {"id":"aml-tr-3","type":"cta","props":{"title":"Şüpheli Faaliyeti Bildirin","subtitle":"Uyum ekibimizle hemen iletişime geçin — 24 saat içinde yanıt veriyoruz","buttonText":"Şimdi Bildir","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'aml-policy' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Şikayet Politikası',
'[
  {"id":"comp-tr-1","type":"text","props":{"title":"İletişim ve Şikayet Politikası","body":"For Relief Humanitarian Foundation olarak, etkili iletişimin ve geri bildirim ile şikayetleri dinlemenin, şeffaflık, hesap verebilirlik ve sürekli iyileştirme taahhüdümüzün temel bir parçası olduğuna inanıyoruz.","align":"left"}},
  {"id":"comp-tr-2","type":"text","props":{"title":"Resmi İletişim Kanalları","body":"Aşağıdaki kanallar aracılığıyla bizimle iletişime geçebilirsiniz:\n\n• info@forrelief.org — Genel sorular\n• complaints@forrelief.org — Şikayetler ve geri bildirimler\n• refunds@forrelief.org — Bağış iadeleri\n• info@forrelief.org — Gizlilik ve veri koruma\n• fraud@forrelief.org — Dolandırıcılık bildirimi\n• legal@forrelief.org — Hukuki konular","align":"left"}},
  {"id":"comp-tr-3","type":"text","props":{"title":"Taahhütlerimiz","body":"Şunları taahhüt ediyoruz:\n\n• Tüm şikayetleri tam gizlilikle ele almak\n• Tüm şikayet sahiplerine ayrım gözetmeksizin saygı göstermek\n• Şikayet başvurusu veya işlenmesi için herhangi bir ücret talep etmemek\n• İyi niyetle şikayette bulunan kişilere karşı misilleme yapmamak","align":"left"}},
  {"id":"comp-tr-4","type":"cta","props":{"title":"Şikayetiniz veya Sorunuz mu Var?","subtitle":"Ekibimiz 48 saat içinde yanıt verir","buttonText":"Şikayet Gönder","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'complaints' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

INSERT INTO "PageTranslation" ("pageId","locale","title","sections","updatedAt")
SELECT p.id, 'tr', 'Mali Şeffaflık',
'[
  {"id":"trans-tr-1","type":"text","props":{"title":"Şeffaflık ve Hesap Verebilirlik Taahhüdümüz","body":"For Relief Humanitarian Foundation olarak, şeffaflık ve hesap verebilirliğin bağışçıların, ortakların ve yararlanıcı toplulukların güveninin inşa edildiği temel olduğuna inanıyoruz. Bu nedenle tüm bağışları en yüksek yönetişim, bütünlük ve finansal ifşa standartlarına göre yönetmeyi taahhüt ediyoruz.","align":"left"}},
  {"id":"trans-tr-2","type":"text","props":{"title":"Bağışları Nasıl Yönetiyoruz?","body":"Tüm bağışlar aşağıdakileri garanti eden entegre bir finansal ve dijital sistemden geçer:\n\n• Güvenli, akredite ödeme yöntemleriyle bağış kabul etmek\n• Tüm finansal işlemleri elektronik olarak kaydetmek ve takip etmek\n• Mevcut olduğunda bağışçı tercihlerine göre bağış tahsisi yapmak\n• Düzenli finansal ve etki raporları yayınlamak","align":"left"}},
  {"id":"trans-tr-3","type":"cta","props":{"title":"Şeffaflıkta Ortak","subtitle":"En son finansal raporlarımıza erişmek için bizimle iletişime geçin","buttonText":"Bize Ulaşın","buttonLink":"/tr/contact","style":"brand"}}
]'::jsonb, now()
FROM "Page" p WHERE p.slug = 'transparency' OR p.slug = 'financial-transparency' LIMIT 1
ON CONFLICT ("pageId","locale") DO UPDATE SET "title"=EXCLUDED."title","sections"=EXCLUDED."sections","updatedAt"=now();

