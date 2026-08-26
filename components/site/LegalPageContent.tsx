import Link from "next/link";
import Icon from "@/components/icons";

type Locale = "ar" | "en" | "fr" | "tr";

// ── Helpers ───────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm sm:text-base leading-relaxed text-slate-600">{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 my-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
          <span className="text-sm sm:text-base text-slate-600 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactCTA({ locale, email, label }: { locale: string; email: string; label: string }) {
  const text: Record<string, string> = { ar: "تواصل معنا", en: "Contact Us", fr: "Nous Contacter", tr: "Bize Ulaşın" };
  return (
    <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-center text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10 max-w-lg mx-auto">
        <p className="font-extrabold text-base sm:text-lg mb-1 text-white">{label}</p>
        <p className="text-white/80 text-xs sm:text-sm mb-6 font-mono">{email}</p>
        <a aria-label={`Send email to ${email}`} href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-brand hover:opacity-90 active:scale-95 text-white font-bold rounded-xl px-7 py-3 text-xs sm:text-sm transition-all shadow-md">
          <Icon name="mail" size={16} />
          {text[locale] || text.en}
        </a>
      </div>
    </div>
  );
}

// ── Privacy Policy ────────────────────────────────────────────
function PrivacyContent({ locale }: { locale: string }) {
  if (locale === "en") return (
    <>
      <Section title="Privacy Policy & Data Protection (GDPR Compliant)">
        <P>For Relief Humanitarian Foundation is committed to protecting your privacy and safeguarding your personal data. This policy explains how we collect, use, store, and protect your information when you use our website, digital services, or donate through our platform. By using our website, you agree to the terms of this Privacy Policy.</P>
      </Section>
      <Section title="Data We Collect">
        <UL items={["Full name","Email address","Phone number","Country of residence","Donation and financial transaction data","Account information upon registration","Communication and inquiry data","Technical information: IP address, browser type, and cookies"]} />
      </Section>
      <Section title="How We Use Your Data">
        <UL items={["Process donations and payments","Create and manage user accounts","Communicate with donors, beneficiaries, and partners","Send receipts, reports, and updates","Improve our website and user experience","Comply with legal and regulatory requirements","Prevent fraud and enhance platform security"]} />
      </Section>
      <Section title="Data Protection">
        <P>We implement advanced technical and administrative measures including data encryption in transit and at rest, secure servers, strict access controls, and continuous security monitoring. We do not sell, rent, or trade your personal data.</P>
      </Section>
      <Section title="Your Rights Under GDPR">
        <UL items={["Access your personal data","Correct inaccurate data","Request data deletion where permitted by law","Restrict data processing","Object to certain types of processing","Withdraw consent at any time","Request data portability","Lodge a complaint with the competent supervisory authority"]} />
      </Section>
      <ContactCTA locale={locale} email="info@forrelief.org" label="Questions about your privacy? Our Data Protection Officer responds within 72 hours." />
    </>
  );
  if (locale === "fr") return (
    <>
      <Section title="Politique de Confidentialité et Protection des Données (RGPD)">
        <P>For Relief Humanitarian Foundation s'engage à protéger votre vie privée et à préserver la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre site web, nos services numériques ou que vous faites un don via notre plateforme.</P>
      </Section>
      <Section title="Données Collectées">
        <UL items={["Nom complet","Adresse e-mail","Numéro de téléphone","Pays de résidence","Données de dons et de transactions financières","Informations de compte lors de l'inscription","Données de communication","Informations techniques : adresse IP, navigateur, cookies"]} />
      </Section>
      <Section title="Vos Droits (RGPD)">
        <UL items={["Accéder à vos données personnelles","Corriger les données inexactes","Demander la suppression des données","Restreindre le traitement","Vous opposer à certains traitements","Retirer votre consentement à tout moment","Demander la portabilité des données","Déposer une plainte auprès de l'autorité compétente"]} />
      </Section>
      <ContactCTA locale={locale} email="info@forrelief.org" label="Questions sur votre vie privée ? Notre DPO répond sous 72 heures." />
    </>
  );
  if (locale === "tr") return (
    <>
      <Section title="Gizlilik Politikası ve Veri Koruma (GDPR Uyumlu)">
        <P>For Relief Humanitarian Foundation, gizliliğinizi koruma ve kişisel verilerinizin gizliliğini sağlama konusunda kararlıdır. Bu politika, web sitemizi kullandığınızda veya platformumuz aracılığıyla bağış yaptığınızda bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.</P>
      </Section>
      <Section title="Topladığımız Veriler">
        <UL items={["Ad soyad","E-posta adresi","Telefon numarası","İkamet ülkesi","Bağış ve finansal işlem verileri","Kayıt sırasında hesap bilgileri","İletişim verileri","Teknik bilgiler: IP adresi, tarayıcı türü, çerezler"]} />
      </Section>
      <Section title="GDPR Kapsamındaki Haklarınız">
        <UL items={["Kişisel verilerinize erişim","Yanlış verilerin düzeltilmesi","Verilerin silinmesini talep etme","Veri işlemeyi kısıtlama","Belirli işlemlere itiraz etme","İstediğiniz zaman onayı geri çekme","Veri taşınabilirliği talep etme","Yetkili denetim makamına şikayette bulunma"]} />
      </Section>
      <ContactCTA locale={locale} email="info@forrelief.org" label="Gizliliğiniz hakkında sorularınız mı var? Veri Koruma Yetkilimiz 72 saat içinde yanıt verir." />
    </>
  );
  return (
    <>
      <Section title="سياسة الخصوصية وحماية البيانات (متوافقة مع GDPR)">
        <P>ترحب بكم For Relief Humanitarian Foundation، ونلتزم بحماية خصوصيتكم والحفاظ على سرية بياناتكم الشخصية. توضح هذه السياسة كيفية جمع بياناتكم واستخدامها وتخزينها وحمايتها عند استخدام موقعنا الإلكتروني أو خدماتنا الرقمية أو التبرع عبر منصتنا.</P>
      </Section>
      <Section title="البيانات التي نجمعها">
        <UL items={["الاسم الكامل","عنوان البريد الإلكتروني","رقم الهاتف","عنوان الإقامة أو الدولة","بيانات التبرعات والمعاملات المالية","معلومات الحساب عند التسجيل","بيانات التواصل والاستفسارات","المعلومات التقنية: عنوان IP ونوع المتصفح وملفات تعريف الارتباط"]} />
      </Section>
      <Section title="كيفية استخدام البيانات">
        <UL items={["معالجة التبرعات والمدفوعات","إنشاء وإدارة حسابات المستخدمين","التواصل مع المتبرعين والمستفيدين والشركاء","إرسال الإيصالات والتقارير والتحديثات","تحسين خدمات الموقع وتجربة المستخدم","الامتثال للمتطلبات القانونية والتنظيمية","منع الاحتيال وتعزيز أمن المنصة"]} />
      </Section>
      <Section title="حماية البيانات">
        <P>نطبق تدابير تقنية وإدارية متقدمة تشمل تشفير البيانات أثناء النقل والتخزين، واستخدام خوادم آمنة، وضوابط صارمة للتحكم في الوصول، ومراقبة أمنية مستمرة. لا نقوم ببيع أو تأجير أو المتاجرة ببياناتكم الشخصية.</P>
      </Section>
      <Section title="حقوقكم وفقاً للائحة GDPR">
        <UL items={["الوصول إلى بياناتكم الشخصية","تصحيح البيانات غير الدقيقة","طلب حذف البيانات عندما يسمح القانون بذلك","تقييد معالجة البيانات","الاعتراض على بعض أنواع المعالجة","سحب الموافقة في أي وقت","طلب نقل البيانات إلى مزود آخر","تقديم شكوى إلى الجهة الرقابية المختصة"]} />
      </Section>
      <ContactCTA locale={locale} email="info@forrelief.org" label="أسئلة حول خصوصيتك؟ مسؤول حماية البيانات يرد خلال 72 ساعة." />
    </>
  );
}

// ── Terms ─────────────────────────────────────────────────────
function TermsContent({ locale }: { locale: string }) {
  const content: Record<string, { sections: { title: string; items: string[] }[] }> = {
    ar: { sections: [
      { title: "مرحباً بكم", items: ["هذه الشروط تُشكّل اتفاقاً قانونياً ملزماً بينكم وبين مؤسسة For Relief Humanitarian Foundation. باستخدامكم للمنصة أو إنشاء حساب أو تقديم تبرع، فإنكم تقرون بقراءة هذه الشروط وفهمها والموافقة على الالتزام بها."] },
      { title: "الإطار القانوني", items: ["تلتزم المنصة بتشريعات حماية المستهلك والتجارة الإلكترونية","متطلبات مكافحة غسل الأموال وتمويل الإرهاب","حماية البيانات الشخصية وفق المعايير الدولية","أفضل ممارسات الحوكمة للمؤسسات غير الربحية"] },
      { title: "أهلية الاستخدام", items: ["تكون مؤهلاً قانونياً لإبرام العقود وفق قوانين بلدك","تقدم معلومات صحيحة ودقيقة ومحدثة","تستخدم وسائل دفع قانونية ومصرحاً لك باستخدامها","تمتثل لجميع القوانين واللوائح المعمول بها"] },
      { title: "التبرعات", items: ["التبرع يتم بإرادتك الحرة والأموال مصدرها مشروع","قد تعيد المؤسسة توجيه التبرعات إلى مشروع مماثل إذا اكتمل تمويل المشروع المختار","لا يُعد التبرع عملية شراء أو استثماراً يضمن نتائج محددة"] },
      { title: "التزامات المؤسسة", items: ["إدارة التبرعات بمسؤولية ونزاهة","إصدار إيصالات إلكترونية فورية","نشر تقارير مالية وتقارير أثر دورية","حماية البيانات الشخصية وفق سياسة الخصوصية","تطبيق أعلى معايير الشفافية والمساءلة والحوكمة"] },
    ]},
    en: { sections: [
      { title: "Welcome", items: ["These terms form a legally binding agreement between you and For Relief Humanitarian Foundation. By using the platform, creating an account, or making a donation, you acknowledge reading, understanding, and agreeing to these terms."] },
      { title: "Legal Framework", items: ["Consumer protection and e-commerce legislation","Anti-money laundering and counter-terrorism financing requirements","Personal data protection per international standards","Best governance practices for non-profit organizations"] },
      { title: "Eligibility", items: ["You must be legally eligible to enter into contracts under your country's laws","Provide accurate, truthful, and up-to-date information","Use legally authorized payment methods","Comply with all applicable laws and regulations"] },
      { title: "Donations", items: ["Donations are made of your own free will from legitimate sources","The Foundation may redirect donations to a similar project if the chosen project is fully funded","A donation is not a purchase or investment guaranteeing specific outcomes"] },
      { title: "Foundation Obligations", items: ["Manage donations responsibly and with integrity","Issue instant electronic receipts","Publish periodic financial and impact reports","Protect personal data per our Privacy Policy","Apply highest standards of transparency, accountability, and governance"] },
    ]},
    fr: { sections: [
      { title: "Bienvenue", items: ["Ces conditions forment un accord juridiquement contraignant entre vous et For Relief Humanitarian Foundation. En utilisant la plateforme, vous acceptez d'être lié par ces conditions."] },
      { title: "Cadre Juridique", items: ["Législation sur la protection des consommateurs et le commerce électronique","Exigences anti-blanchiment et contre le financement du terrorisme","Protection des données personnelles selon les normes internationales","Meilleures pratiques de gouvernance pour les organisations à but non lucratif"] },
      { title: "Éligibilité", items: ["Être légalement habilité à conclure des contrats selon les lois de votre pays","Fournir des informations exactes, véridiques et à jour","Utiliser des moyens de paiement légalement autorisés","Se conformer à toutes les lois et réglementations applicables"] },
      { title: "Dons", items: ["Les dons sont effectués de votre plein gré à partir de sources légitimes","La Fondation peut réorienter les dons vers un projet similaire si le projet choisi est entièrement financé","Un don n'est pas un achat ou un investissement garantissant des résultats spécifiques"] },
      { title: "Obligations de la Fondation", items: ["Gérer les dons de manière responsable et intègre","Émettre des reçus électroniques instantanés","Publier des rapports financiers et d'impact périodiques","Protéger les données personnelles conformément à notre Politique de Confidentialité"] },
    ]},
    tr: { sections: [
      { title: "Hoş Geldiniz", items: ["Bu koşullar, sizinle For Relief Humanitarian Foundation arasında yasal olarak bağlayıcı bir anlaşma oluşturur. Platformu kullanarak, hesap oluşturarak veya bağış yaparak bu koşulları kabul etmiş olursunuz."] },
      { title: "Yasal Çerçeve", items: ["Tüketici koruma ve e-ticaret mevzuatı","Kara para aklamayla mücadele ve terörün finansmanını önleme gereksinimleri","Uluslararası standartlara göre kişisel veri koruması","Kâr amacı gütmeyen kuruluşlar için en iyi yönetişim uygulamaları"] },
      { title: "Uygunluk", items: ["Ülkenizin yasalarına göre sözleşme yapma ehliyetine sahip olmalısınız","Doğru, gerçek ve güncel bilgi sağlayın","Yasal olarak yetkilendirilmiş ödeme yöntemleri kullanın","Tüm geçerli yasa ve yönetmeliklere uyun"] },
      { title: "Bağışlar", items: ["Bağışlar kendi özgür iradenizle meşru kaynaklardan yapılır","Seçilen proje tam olarak finanse edilirse Vakıf bağışları benzer bir projeye yönlendirebilir","Bağış, belirli sonuçları garanti eden bir satın alma veya yatırım değildir"] },
      { title: "Vakfın Yükümlülükleri", items: ["Bağışları sorumlu ve dürüst bir şekilde yönetmek","Anında elektronik makbuz düzenlemek","Dönemsel finansal ve etki raporları yayınlamak","Kişisel verileri Gizlilik Politikamıza göre korumak"] },
    ]},
  };
  const loc = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof content;
  const d = content[loc];
  return (
    <>
      {d.sections.map(sec => (
        <Section key={sec.title} title={sec.title}>
          {sec.items.length === 1 ? <P>{sec.items[0]}</P> : <UL items={sec.items} />}
        </Section>
      ))}
      <ContactCTA aria-label={`Send email to ${"info@forrelief.org"}`} locale={locale} email="info@forrelief.org"
        label={locale === "ar" ? "لديك سؤال قانوني؟ فريقنا يرد خلال 48 ساعة." : locale === "fr" ? "Une question juridique ? Notre équipe répond sous 48 heures." : locale === "tr" ? "Hukuki sorularınız mı var? Ekibimiz 48 saat içinde yanıtlar." : "Legal questions? Our team responds within 48 hours."} />
    </>
  );
}

// ── Refund Policy ─────────────────────────────────────────────
function RefundContent({ locale }: { locale: string }) {
  const t = {
    ar: {
      s1t: "متى يمكن طلب الاسترداد؟",
      s1: ["حدوث خطأ في مبلغ التبرع أو تكرار عملية الدفع","تنفيذ عملية التبرع دون تفويض من صاحب وسيلة الدفع","وقوع خطأ تقني أدى إلى خصم غير مقصود"],
      s2t: "الحالات التي لا يشملها الاسترداد",
      s2: ["بعد تحويل التبرع إلى المشروع أو الجهة المنفذة","إذا كان التبرع قد استُخدم بالفعل في تنفيذ الأنشطة الإنسانية","إذا خالف طلب الاسترداد الأنظمة أو القوانين المعمول بها"],
      s3t: "آلية تقديم الطلب",
      s3: "يجب إرسال طلب الاسترداد خلال 14 يومًا من تاريخ التبرع عبر البريد الإلكتروني refunds@forrelief.org مع إرفاق رقم العملية أو الإيصال، واسم المتبرع، وسبب طلب الاسترداد. تتم مراجعة الطلب وإشعار مقدم الطلب بالقرار خلال 10 أيام عمل.",
      cta: "لديك طلب استرداد؟ فريقنا يرد خلال 48 ساعة ونلتزم بتسوية طلبك بعدالة.",
    },
    en: {
      s1t: "When Can You Request a Refund?",
      s1: ["An error in the donation amount or a duplicate payment","A transaction executed without authorization from the payment method owner","A technical error resulting in an unintended charge"],
      s2t: "Cases Not Eligible for Refund",
      s2: ["After the donation has been transferred to the implementing project or organization","If the donation has already been used in humanitarian activities","If the refund request violates applicable regulations or laws"],
      s3t: "How to Submit a Request",
      s3: "Refund requests must be submitted within 14 days of the donation date via email to refunds@forrelief.org, including: transaction number or receipt, donor name, and reason for the request. Requests are reviewed and the applicant notified within 10 business days.",
      cta: "Have a refund request? Our team responds within 48 business hours.",
    },
    fr: {
      s1t: "Quand Demander un Remboursement ?",
      s1: ["Une erreur dans le montant du don ou un paiement en double","Une transaction effectuée sans autorisation du titulaire du moyen de paiement","Une erreur technique ayant entraîné un prélèvement non intentionnel"],
      s2t: "Cas Non Éligibles au Remboursement",
      s2: ["Après le transfert du don au projet ou à l'organisation d'exécution","Si le don a déjà été utilisé dans des activités humanitaires","Si la demande de remboursement viole les réglementations ou lois applicables"],
      s3t: "Comment Soumettre une Demande",
      s3: "Les demandes doivent être soumises dans les 14 jours suivant la date du don à refunds@forrelief.org, en indiquant le numéro de transaction ou reçu, le nom du donateur et le motif. Les demandes sont examinées et le demandeur notifié dans les 10 jours ouvrables.",
      cta: "Vous avez une demande de remboursement ? Notre équipe répond sous 48 heures.",
    },
    tr: {
      s1t: "Ne Zaman İade Talep Edilebilir?",
      s1: ["Bağış tutarında hata veya mükerrer ödeme","Ödeme yöntemi sahibinin yetkisi olmadan gerçekleştirilen işlem","İstenmeyen bir kesintiye yol açan teknik hata"],
      s2t: "İade Kapsamı Dışındaki Durumlar",
      s2: ["Bağış uygulama projesine veya kuruluşuna aktarıldıktan sonra","Bağış zaten insani faaliyetlerde kullanılmışsa","İade talebi geçerli yönetmelik veya yasalara aykırıysa"],
      s3t: "Nasıl Başvurulur?",
      s3: "İade talepleri, bağış tarihinden itibaren 14 gün içinde refunds@forrelief.org adresine işlem numarası/makbuzu, bağışçı adı ve talep gerekçesiyle gönderilmelidir. Talepler 10 iş günü içinde incelenir ve başvuru sahibi bilgilendirilir.",
      cta: "İade talebiniz mi var? Ekibimiz 48 iş saati içinde yanıt verir.",
    },
  };
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof t;
  const d = t[l];
  return (
    <>
      <Section title={d.s1t}><UL items={d.s1} /></Section>
      <Section title={d.s2t}><UL items={d.s2} /></Section>
      <Section title={d.s3t}><P>{d.s3}</P></Section>
      <ContactCTA aria-label={`Send email to ${"refunds@forrelief.org"}`} locale={locale} email="refunds@forrelief.org" label={d.cta}  />
    </>
  );
}

// ── Cookie Policy ─────────────────────────────────────────────
function CookieContent({ locale }: { locale: string }) {
  const t = {
    ar: {
      s1t: "ما هي ملفات تعريف الارتباط؟",
      s1: "ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة الموقع. تساعدنا على تذكر تفضيلاتك وتحليل استخدام الموقع وتحسين الخدمات المقدمة دون الوصول إلى بياناتك الشخصية الحساسة.",
      s2t: "كيف نستخدمها؟",
      s2: ["تشغيل الوظائف الأساسية للموقع وضمان عمله بشكل صحيح","حفظ تفضيلات المستخدم وإعداداته لتحسين تجربة التصفح","تحليل أداء الموقع وقياس عدد الزيارات وسلوك المستخدمين","تعزيز أمن الموقع والكشف عن الأنشطة غير المشروعة","تحسين المحتوى والخدمات بما يتناسب مع احتياجات الزوار"],
      s3t: "إدارة ملفات تعريف الارتباط",
      s3: "يمكنك قبول أو رفض أو حذف ملفات تعريف الارتباط في أي وقت من خلال إعدادات متصفحك. تعطيل بعضها قد يؤثر في أداء بعض وظائف الموقع.",
      cta: "أسئلة حول الكوكيز؟ فريق الخصوصية جاهز للإجابة.",
    },
    en: {
      s1t: "What Are Cookies?",
      s1: "Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, analyze site usage, and improve services — without accessing your sensitive personal data.",
      s2t: "How We Use Cookies",
      s2: ["Operating essential website functions","Saving user preferences to improve browsing experience","Analyzing website performance and visitor behavior","Enhancing website security and detecting unauthorized activities","Improving content and services to match visitor needs"],
      s3t: "Managing Cookies",
      s3: "You can accept, reject, or delete cookies at any time through your browser settings. Disabling some cookies may affect the performance of certain website functions.",
      cta: "Questions about cookies? Our privacy team is ready to answer.",
    },
    fr: {
      s1t: "Qu'est-ce que les Cookies ?",
      s1: "Les cookies sont de petits fichiers texte stockés sur votre appareil lors de votre visite. Ils nous aident à mémoriser vos préférences et analyser l'utilisation du site sans accéder à vos données personnelles sensibles.",
      s2t: "Comment Utilisons-nous les Cookies ?",
      s2: ["Fonctionnement des fonctions essentielles du site","Sauvegarde des préférences utilisateur","Analyse des performances du site","Renforcement de la sécurité du site","Amélioration du contenu et des services"],
      s3t: "Gestion des Cookies",
      s3: "Vous pouvez accepter, refuser ou supprimer les cookies à tout moment via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter les fonctionnalités du site.",
      cta: "Questions sur les cookies ? Notre équipe de confidentialité est disponible.",
    },
    tr: {
      s1t: "Çerezler Nedir?",
      s1: "Çerezler, web sitemizi ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır. Tercihlerinizi hatırlamamıza ve site kullanımını analiz etmemize yardımcı olurlar.",
      s2t: "Çerezleri Nasıl Kullanıyoruz?",
      s2: ["Temel site işlevlerini çalıştırmak","Kullanıcı tercihlerini kaydetmek","Site performansını analiz etmek","Site güvenliğini artırmak","İçerik ve hizmetleri iyileştirmek"],
      s3t: "Çerezleri Yönetme",
      s3: "Tarayıcı ayarlarınızdan çerezleri istediğiniz zaman kabul edebilir, reddedebilir veya silebilirsiniz. Bazı çerezlerin devre dışı bırakılması site işlevlerini etkileyebilir.",
      cta: "Çerezler hakkında sorularınız mı var? Gizlilik ekibimiz hazır.",
    },
  };
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof t;
  const d = t[l];
  return (
    <>
      <Section title={d.s1t}><P>{d.s1}</P></Section>
      <Section title={d.s2t}><UL items={d.s2} /></Section>
      <Section title={d.s3t}><P>{d.s3}</P></Section>
      <ContactCTA aria-label={`Send email to ${"info@forrelief.org"}`} locale={locale} email="info@forrelief.org" label={d.cta} />
    </>
  );
}

// ── AML Policy ────────────────────────────────────────────────
function AMLContent({ locale }: { locale: string }) {
  const t = {
    ar: {
      intro: "تلتزم For Relief Humanitarian Foundation بأعلى معايير النزاهة والامتثال لحماية مواردها المالية ومنع استغلال منصتها في غسل الأموال أو تمويل الإرهاب أو الاحتيال أو أي أنشطة غير قانونية.",
      s1t: "التزاماتنا",
      s1: ["تطبيق إجراءات فعالة لمكافحة غسل الأموال وتمويل الإرهاب والاحتيال","حماية أموال المتبرعين وضمان استخدامها في الأغراض الإنسانية المخصصة لها","التحقق من هوية الشركاء والجهات المتعاملة عند الاقتضاء","مراقبة المعاملات المالية للكشف عن أي نشاط غير اعتيادي أو مشبوه","التعاون مع الجهات الرقابية والتنظيمية المختصة وفقاً للمتطلبات القانونية"],
      s2t: "الإطار المرجعي",
      s2: ["توصيات مجموعة العمل المالي (FATF)","متطلبات مكافحة غسل الأموال وتمويل الإرهاب (AML/CFT)","أنظمة العقوبات الدولية حيثما تنطبق","التشريعات الوطنية ذات الصلة في الدول التي تعمل فيها المؤسسة"],
      s3t: "مسؤوليات المستخدم",
      s3: ["الأموال المستخدمة في التبرعات مصدرها مشروع","المعلومات المقدمة صحيحة وكاملة","لا يستخدم المنصة لأي نشاط غير قانوني أو احتيالي","يلتزم بجميع القوانين والأنظمة السارية في دولة إقامته"],
      cta: "للإبلاغ عن نشاط مشبوه — تواصل مع فريق الامتثال فوراً، نرد خلال 24 ساعة.",
    },
    en: {
      intro: "For Relief Humanitarian Foundation is committed to the highest standards of integrity and compliance to protect its financial resources and prevent its platform from being exploited for money laundering, terrorist financing, fraud, or any illegal activities.",
      s1t: "Our Commitments",
      s1: ["Implementing effective AML/CFT and anti-fraud procedures","Protecting donor funds and ensuring they are used for designated humanitarian purposes","Verifying the identity of partners when required","Monitoring financial transactions to detect unusual or suspicious activity","Cooperating with competent regulatory authorities as required by law"],
      s2t: "Regulatory Framework",
      s2: ["Financial Action Task Force (FATF) Recommendations","Anti-Money Laundering and Counter-Terrorism Financing (AML/CFT)","International sanctions regimes where applicable","Relevant national legislation in countries where the Foundation operates"],
      s3t: "User Responsibilities",
      s3: ["Funds used for donations are from a legitimate source","Information provided is accurate and complete","The platform is not used for any illegal or fraudulent activity","Comply with all laws and regulations applicable in your country"],
      cta: "To report suspicious activity — contact our compliance team immediately. We respond within 24 hours.",
    },
    fr: {
      intro: "For Relief Humanitarian Foundation est engagée aux normes les plus élevées d'intégrité et de conformité pour protéger ses ressources financières et empêcher l'exploitation de sa plateforme.",
      s1t: "Nos Engagements",
      s1: ["Mettre en œuvre des procédures efficaces contre le blanchiment et le financement du terrorisme","Protéger les fonds des donateurs","Vérifier l'identité des partenaires si nécessaire","Surveiller les transactions pour détecter toute activité suspecte","Coopérer avec les autorités réglementaires compétentes"],
      s2t: "Cadre Réglementaire",
      s2: ["Recommandations du GAFI (FATF)","Exigences AML/CFT","Régimes de sanctions internationaux","Législation nationale applicable"],
      s3t: "Responsabilités de l'Utilisateur",
      s3: ["Les fonds proviennent d'une source légitime","Les informations fournies sont exactes et complètes","La plateforme n'est pas utilisée à des fins illégales","Conformité avec toutes les lois applicables"],
      cta: "Pour signaler une activité suspecte — contactez immédiatement notre équipe de conformité. Réponse sous 24 heures.",
    },
    tr: {
      intro: "For Relief Humanitarian Foundation, mali kaynaklarını korumak ve platformunun kara para aklaması, terörün finansmanı, dolandırıcılık veya yasa dışı faaliyetler için kullanılmasını önlemek amacıyla en yüksek bütünlük ve uyum standartlarına bağlıdır.",
      s1t: "Taahhütlerimiz",
      s1: ["Etkili AML/CFT ve dolandırıcılık önleme prosedürleri uygulamak","Bağışçı fonlarını korumak","Gerektiğinde ortakların kimliğini doğrulamak","Şüpheli faaliyetleri tespit etmek için işlemleri izlemek","Yetkili düzenleyici makamlarla iş birliği yapmak"],
      s2t: "Düzenleyici Çerçeve",
      s2: ["FATF Tavsiyeleri","AML/CFT gereksinimleri","Uluslararası yaptırım rejimleri","Uygulanabilir ulusal mevzuat"],
      s3t: "Kullanıcı Sorumlulukları",
      s3: ["Bağışlar için kullanılan fonlar meşru kaynaktan geliyor","Sağlanan bilgiler doğru ve eksiksiz","Platform yasa dışı faaliyetler için kullanılmıyor","İkamet edilen ülkedeki tüm yasalara uyum"],
      cta: "Şüpheli faaliyeti bildirmek için — uyum ekibimizle derhal iletişime geçin. 24 saat içinde yanıt veriyoruz.",
    },
  };
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof t;
  const d = t[l];
  return (
    <>
      <Section title={locale === "ar" ? "نظرة عامة" : locale === "fr" ? "Aperçu" : locale === "tr" ? "Genel Bakış" : "Overview"}>
        <P>{d.intro}</P>
      </Section>
      <Section title={d.s1t}><UL items={d.s1} /></Section>
      <Section title={d.s2t}><UL items={d.s2} /></Section>
      <Section title={d.s3t}><UL items={d.s3} /></Section>
      <ContactCTA aria-label={`Send email to ${"fraud@forrelief.org"}`} locale={locale} email="fraud@forrelief.org" label={d.cta} />
    </>
  );
}

// ── Complaints ────────────────────────────────────────────────
function ComplaintsContent({ locale }: { locale: string }) {
  const emails = [
    { label: { ar: "الاستفسارات العامة", en: "General Inquiries", fr: "Renseignements Généraux", tr: "Genel Sorular" }, email: "info@forrelief.org" },
    { label: { ar: "الشكاوى والملاحظات", en: "Complaints & Feedback", fr: "Réclamations", tr: "Şikayetler" }, email: "complaints@forrelief.org" },
    { label: { ar: "استرداد التبرعات", en: "Donation Refunds", fr: "Remboursements", tr: "İadeler" }, email: "refunds@forrelief.org" },
    { label: { ar: "الخصوصية وحماية البيانات", en: "Privacy & Data", fr: "Confidentialité", tr: "Gizlilik" }, email: "info@forrelief.org" },
    { label: { ar: "الإبلاغ عن الاحتيال", en: "Report Fraud", fr: "Signaler une Fraude", tr: "Dolandırıcılık Bildirimi" }, email: "fraud@forrelief.org" },
    { label: { ar: "الشؤون القانونية", en: "Legal Affairs", fr: "Affaires Juridiques", tr: "Hukuki Konular" }, email: "info@forrelief.org" },
    { label: { ar: "الشراكات", en: "Partnerships", fr: "Partenariats", tr: "Ortaklıklar" }, email: "partners@forrelief.org" },
    { label: { ar: "الإعلام", en: "Media", fr: "Médias", tr: "Medya" }, email: "media@forrelief.org" },
  ];

  const steps: Record<string, [string,string][]> = {
    ar: [["استلام الشكوى","يتم تسجيل الشكوى وإرسال إشعار بتأكيد استلامها خلال 48 ساعة عمل."],["المراجعة والتحقيق","يقوم الفريق المختص بمراجعة الشكوى وجمع المعلومات اللازمة."],["الرد والمعالجة","يتم تزويد مقدم الشكوى بنتيجة المراجعة والإجراءات المتخذة خلال 10 أيام عمل."],["التصعيد","إذا لم يكن مقدم الشكوى راضيًا، يمكنه طلب مراجعة إضافية عبر info@forrelief.org"]],
    en: [["Receipt","The complaint is registered and an acknowledgment sent within 48 business hours."],["Review & Investigation","The specialist team reviews the complaint and gathers necessary information."],["Response & Resolution","The complainant is informed of the review outcome within 10 business days."],["Escalation","If unsatisfied, the complainant may request further review via info@forrelief.org"]],
    fr: [["Réception","La plainte est enregistrée et un accusé de réception envoyé dans les 48 heures ouvrables."],["Examen","L'équipe spécialisée examine la plainte et recueille les informations nécessaires."],["Réponse","Le plaignant est informé du résultat dans les 10 jours ouvrables."],["Escalade","En cas d'insatisfaction, une révision supplémentaire peut être demandée via info@forrelief.org"]],
    tr: [["Alındı","Şikayet kaydedilir ve 48 iş saati içinde alındı bildirimi gönderilir."],["İnceleme","Uzman ekip şikayeti inceler ve gerekli bilgileri toplar."],["Yanıt","Başvuru sahibi 10 iş günü içinde inceleme sonucu hakkında bilgilendirilir."],["Eskalasyon","Tatmin olmayan başvuru sahibi info@forrelief.org aracılığıyla ek inceleme talep edebilir"]],
  };

  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof steps;
  const locSteps = steps[l];

  const titles: Record<string, {ch:string,at:string,p:string,c:string}> = {
    ar: { ch:"قنوات التواصل الرسمية", at:"أنواع الشكاوى", p:"آلية المعالجة", c:"التزامنا" },
    en: { ch:"Official Communication Channels", at:"Types of Complaints", p:"Handling Process", c:"Our Commitments" },
    fr: { ch:"Canaux de Communication Officiels", at:"Types de Réclamations", p:"Procédure de Traitement", c:"Nos Engagements" },
    tr: { ch:"Resmi İletişim Kanalları", at:"Şikayet Türleri", p:"İşleme Süreci", c:"Taahhütlerimiz" },
  };

  const types: Record<string, string[]> = {
    ar: ["التبرعات والمعاملات المالية","حماية البيانات والخصوصية","جودة الخدمات الرقمية","الشفافية وإدارة التبرعات","سلوك الموظفين أو الشركاء","الاحتيال أو إساءة استخدام اسم المؤسسة"],
    en: ["Donations and financial transactions","Data protection and privacy","Digital service quality","Transparency and donation management","Conduct of staff or partners","Fraud or misuse of the Foundation's name"],
    fr: ["Dons et transactions financières","Protection des données et vie privée","Qualité des services numériques","Transparence et gestion des dons","Conduite du personnel ou des partenaires","Fraude ou abus du nom de la Fondation"],
    tr: ["Bağışlar ve finansal işlemler","Veri koruma ve gizlilik","Dijital hizmet kalitesi","Şeffaflık ve bağış yönetimi","Personel veya ortak davranışı","Dolandırıcılık veya Vakıf adının kötüye kullanımı"],
  };

  const commitments: Record<string, string[]> = {
    ar: ["التعامل مع جميع الشكاوى بسرية تامة","احترام جميع مقدمي الشكاوى دون تمييز","عدم فرض أي رسوم مقابل تقديم أو معالجة الشكاوى","عدم اتخاذ أي إجراءات انتقامية بحق أي شخص يتقدم بشكوى بحسن نية"],
    en: ["Treating all complaints with complete confidentiality","Respecting all complainants without discrimination","No fees for submitting or processing complaints","No retaliatory actions against good-faith complainants"],
    fr: ["Traiter toutes les plaintes avec une confidentialité totale","Respecter tous les plaignants sans discrimination","Aucun frais pour le dépôt ou le traitement des plaintes","Aucune mesure de représailles contre les plaignants de bonne foi"],
    tr: ["Tüm şikayetleri tam gizlilikle ele almak","Tüm şikayet sahiplerine saygı göstermek","Şikayet başvurusu veya işlenmesi için ücret almamak","İyi niyetle başvuranlara karşı misilleme yapmamak"],
  };

  const ti = titles[l];

  return (
    <>
      <Section title={ti.ch}>
        <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
          {emails.map(e => (
            <div key={e.email} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Icon name="mail" size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-slate-500 font-semibold">{e.label[l as keyof typeof e.label]}</p>
                <a href={`mailto:${e.email}`} className="text-xs font-bold text-slate-900 hover:text-brand transition truncate block">{e.email}</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={ti.at}><UL items={types[l]} /></Section>

      <Section title={ti.p}>
        <ol className="space-y-4 pt-1">
          {locSteps.map(([title, desc], i) => (
            <li key={i} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">{i+1}</div>
              <div>
                <p className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">{title}</p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={ti.c}><UL items={commitments[l]} /></Section>
      <ContactCTA locale={locale} email="complaints@forrelief.org"
        label={locale === "ar" ? "لديك شكوى أو استفسار؟ فريقنا يرد خلال 48 ساعة." : locale === "fr" ? "Vous avez une réclamation ? Notre équipe répond sous 48 heures." : locale === "tr" ? "Şikayetiniz mi var? Ekibimiz 48 saat içinde yanıt verir." : "Have a complaint? Our team responds within 48 hours."} />
    </>
  );
}

// ── Financial Transparency ────────────────────────────────────
function FinancialTransparencyContent({ locale }: { locale: string }) {
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as "ar"|"en"|"fr"|"tr";
  const d = {
    ar: {
      intro: "تلتزم مؤسسة 4Relief الإنسانية بأعلى معايير الشفافية المالية وتعزيز الثقة مع المتبرعين وشركاء العمل الإنساني.",
      s1_title: "كيف نستخدم التبرعات",
      s1: ["80% كحد أدنى يذهب مباشرة للمستفيدين","تكاليف التشغيل والإدارة لا تتجاوز 20%","تقارير مالية ربع سنوية منشورة للعموم","حسابات مدققة من مدققين خارجيين مستقلين"],
      s2_title: "الرقابة والمحاسبة",
      s2: ["مجلس إدارة مستقل يراجع كل القرارات المالية","آلية واضحة للإبلاغ عن المخالفات","الامتثال لقوانين الجمعيات الخيرية المحلية والدولية","نشر تقارير الأثر السنوية مع التفاصيل المالية الكاملة"],
      cta: "للاستفسار عن تقاريرنا المالية تواصل معنا"
    },
    en: {
      intro: "4Relief Humanitarian Foundation is committed to the highest standards of financial transparency and building trust with donors and humanitarian partners.",
      s1_title: "How We Use Donations",
      s1: ["Minimum 80% goes directly to beneficiaries","Operational and administrative costs do not exceed 20%","Quarterly financial reports published publicly","Accounts audited by independent external auditors"],
      s2_title: "Oversight & Accountability",
      s2: ["Independent board reviews all financial decisions","Clear mechanism for reporting violations","Compliance with local and international charity laws","Annual impact reports with full financial details"],
      cta: "For inquiries about our financial reports, contact us"
    },
    fr: {
      intro: "La Fondation humanitaire 4Relief s'engage aux plus hauts standards de transparence financière et à renforcer la confiance avec les donateurs et partenaires humanitaires.",
      s1_title: "Comment Nous Utilisons les Dons",
      s1: ["Au moins 80% va directement aux bénéficiaires","Les coûts opérationnels et administratifs ne dépassent pas 20%","Rapports financiers trimestriels publiés publiquement","Comptes audités par des auditeurs externes indépendants"],
      s2_title: "Contrôle et Responsabilité",
      s2: ["Un conseil d'administration indépendant examine toutes les décisions financières","Mécanisme clair de signalement des violations","Conformité aux lois locales et internationales sur les associations caritatives","Rapports d'impact annuels avec tous les détails financiers"],
      cta: "Pour toute question sur nos rapports financiers, contactez-nous"
    },
    tr: {
      intro: "4Relief İnsani Yardım Vakfı, en yüksek mali şeffaflık standartlarına ve bağışçılar ile insani yardım ortaklarıyla güven oluşturmaya bağlıdır.",
      s1_title: "Bağışları Nasıl Kullanıyoruz",
      s1: ["Minimum %80 doğrudan yararlanıcılara gider","İşletme ve idari maliyetler %20'yi geçmez","Üç ayda bir kamuya açıklanan mali raporlar","Bağımsız harici denetçiler tarafından denetlenen hesaplar"],
      s2_title: "Denetim ve Hesap Verebilirlik",
      s2: ["Bağımsız yönetim kurulu tüm mali kararları inceler","İhlallerin bildirilmesi için net mekanizma","Yerel ve uluslararası hayır kurumu yasalarına uygunluk","Tam mali ayrıntılarla yıllık etki raporları"],
      cta: "Mali raporlarımız hakkında sorularınız için bize ulaşın"
    },
  };
  const t = d[l];
  return (
    <>
      <Section title={l === "ar" ? "الشفافية المالية" : l === "fr" ? "Transparence Financière" : l === "tr" ? "Mali Şeffaflık" : "Financial Transparency"}>
        <P>{t.intro}</P>
      </Section>
      <Section title={t.s1_title}><UL items={t.s1} /></Section>
      <Section title={t.s2_title}><UL items={t.s2} /></Section>
      <ContactCTA locale={locale} aria-label="Send email to finance@forrelief.org" email="finance@forrelief.org" label={t.cta} />
    </>
  );
}

// ── License ───────────────────────────────────────────────────
function LicenseContent({ locale }: { locale: string }) {
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as Locale;

  const stats = [
    { n: "200+",  ar: "موقع ومنصة رقمية",          en: "Websites & Platforms",        fr: "Sites & Plateformes",           tr: "Web Sitesi & Platform"       },
    { n: "1M+",   ar: "سطر كود برمجي",              en: "Lines of Code",               fr: "Lignes de Code",                tr: "Satır Kod"                   },
    { n: "10+",   ar: "سنوات خبرة في البرمجة",      en: "Years of Development",        fr: "Ans d'Expérience",              tr: "Yıl Geliştirme Deneyimi"     },
    { n: "100%",  ar: "مفتوح المصدر داخلياً",       en: "Internally Open Source",      fr: "Open Source Interne",           tr: "Dahili Açık Kaynak"          },
  ];

  const t = {
    ar: {
      badge:       "ترخيص المنصة وشروط الاستخدام",
      intro:       "هذه الصفحة تُحدد الشروط القانونية الكاملة لاستخدام منصة 4Relief الإنسانية، وتوضح حقوق الملكية الفكرية، وشروط الترخيص، وحدود المسؤولية، والقيود المفروضة على الاستخدام. يُرجى قراءة هذه الشروط بعناية قبل استخدام المنصة.",
      updated:     "آخر تحديث",
      s1:          "1. المنصة والمطوّر",
      s1p1:        "منصة 4Relief الإنسانية مملوكة لمؤسسة 4Relief الإنسانية، وقد تم تصميمها وتطويرها وبناؤها من الصفر بواسطة شركة WEBEK LTD (webek.org)، وهي شركة متخصصة في تطوير البرمجيات والمنصات الرقمية على نطاق واسع.",
      s1p2:        "WEBEK LTD شركة لها باع طويل في الصناعة الرقمية، نفّذت أكثر من 200 موقع ومنصة رقمية متكاملة لعملاء في مختلف القطاعات حول العالم، وكتبت ما يزيد على مليون سطر كود برمجي عالي الجودة.",
      s1stats:     "إنجازات WEBEK LTD",
      s2:          "2. حقوق الملكية الفكرية",
      s2p1:        "جميع حقوق التصميم الجرافيكي، وواجهات المستخدم (UI/UX)، والكود البرمجي بكافة طبقاته، والبنية التقنية للمنصة هي ملك حصري لشركة WEBEK LTD ومحمية بموجب قوانين حقوق الملكية الفكرية الدولية والمحلية المعمول بها.",
      s2p2:        "محتوى المنصة من نصوص ومقالات وصور وشعارات وعلامات تجارية وهوية بصرية خاصة بمؤسسة 4Relief الإنسانية محمية ومحفوظة لها وحدها دون سواها.",
      s2items:     ["يُمنع منعاً باتاً نسخ أو تعديل أو توزيع أو إعادة نشر أي جزء من تصميم المنصة أو كودها البرمجي أو محتواها دون الحصول على إذن كتابي مسبق صريح من أصحاب الحقوق", "جميع الشعارات والعلامات التجارية وأسماء المنتجات المذكورة هي ملك أصحابها المعنيين", "أي استخدام غير مرخص يُعرّض مرتكبه للمساءلة القانونية وفق القوانين المعمول بها"],
      s3:          "3. ترخيص الاستخدام الممنوح للمستخدمين",
      s3p1:        "تمنح مؤسسة 4Relief الإنسانية المستخدمين ترخيصاً محدوداً وغير حصري وغير قابل للنقل وغير قابل للترخيص من الباطن، لاستخدام المنصة حصراً لأغراض التبرع، ومتابعة الحملات الإنسانية، والتواصل مع المؤسسة.",
      s3allowed:   "الاستخدامات المسموح بها",
      s3a:         ["الاطلاع على محتوى المنصة وقراءة المقالات والتقارير", "تقديم التبرعات لدعم الحملات الإنسانية", "إنشاء حساب شخصي ومتابعة تاريخ التبرعات", "التواصل مع فريق المؤسسة عبر قنوات التواصل المتاحة", "مشاركة روابط الحملات على وسائل التواصل الاجتماعي"],
      s3banned:    "الاستخدامات المحظورة",
      s3b:         ["استخدام المنصة أو أي جزء منها لأغراض تجارية أو إعادة بيعها بأي شكل", "نسخ التصميم أو الكود أو قاعدة البيانات لإنشاء منصات مشابهة", "استخدام برامج الزحف أو السكريبتات الآلية لاستخراج بيانات المنصة", "محاولة اختراق أو تعطيل أنظمة المنصة أو قواعد بياناتها", "انتحال صفة المؤسسة أو موظفيها أو شركائها", "نشر أي محتوى مضلل أو مسيء أو يخالف القوانين النافذة"],
      s4:          "4. إخلاء المسؤولية وحدود الضمانات",
      s4p1:        "تُقدَّم المنصة وجميع خدماتها بحالتها الراهنة دون أي ضمانات صريحة أو ضمنية من أي نوع.",
      s4p2:        "لا تتحمل مؤسسة 4Relief ولا شركة WEBEK LTD أي مسؤولية عن الأضرار المباشرة أو غير المباشرة أو العرضية أو التبعية الناتجة عن استخدام المنصة.",
      s4p3:        "في حالة حدوث خلل تقني يؤثر على عمليات التبرع، يتعهد الفريق التقني بمعالجته في أسرع وقت ممكن.",
      s5:          "5. الخدمات الخارجية وبوابات الدفع",
      s5p1:        "تعتمد المنصة على خدمات دفع خارجية موثوقة وهي Stripe وPayPal لمعالجة التبرعات بأمان.",
      s5items:     ["لا تقوم مؤسسة 4Relief ولا WEBEK LTD بتخزين أرقام بطاقات الائتمان أو البيانات المالية الحساسة على خوادمها", "جميع المعاملات المالية تتم عبر بوابات دفع معتمدة ومشفرة بتقنية SSL/TLS", "في حالة أي نزاع أو إشكالية متعلقة بعمليات الدفع، يُرجى التواصل مع فريق الدعم فوراً", "تطبّق المنصة معايير PCI DSS الدولية لأمان بيانات بطاقات الدفع"],
      s6:          "6. التعديلات على هذا الترخيص",
      s6p1:        "تحتفظ مؤسسة 4Relief بالحق الكامل في تعديل أو تحديث أو استبدال شروط هذا الترخيص في أي وقت تشاء.",
      s6p2:        "استمرارك في استخدام المنصة بعد نشر أي تعديلات يُعدّ موافقة ضمنية وكاملة منك على الشروط المعدّلة.",
      s7:          "7. القانون الحاكم والاختصاص القضائي",
      s7p1:        "تخضع هذه الشروط وتُفسَّر وفقاً للقوانين المعمول بها في نطاق عمل مؤسسة 4Relief الإنسانية.",
      s7p2:        "في حالة اعتبار أي بند من بنود هذه الشروط غير ساري، يظل سريان وصحة باقي البنود محفوظَين بالكامل.",
      s8:          "8. التواصل بشأن الترخيص",
      cta1:        "للاستفسارات العامة والقانونية — مؤسسة 4Relief الإنسانية",
      cta2:        "للاستفسارات التقنية المتعلقة بالمنصة والكود — WEBEK LTD",
    },
    en: {
      badge:       "Platform License & Terms of Use",
      intro:       "This page sets out the complete legal terms for using the 4Relief Humanitarian Platform, clarifying intellectual property rights, licensing terms, limitations of liability, and usage restrictions.",
      updated:     "Last Updated",
      s1:          "1. The Platform & Developer",
      s1p1:        "The 4Relief Humanitarian Platform is owned by 4Relief Humanitarian Foundation and was designed, developed, and built from scratch by WEBEK LTD (webek.org).",
      s1p2:        "WEBEK LTD has an extensive and proven track record in the digital industry, having delivered over 200 complete websites and digital platforms worldwide.",
      s1stats:     "WEBEK LTD Achievements",
      s2:          "2. Intellectual Property Rights",
      s2p1:        "All rights to the graphic design, UI/UX, source code, and technical architecture are the exclusive property of WEBEK LTD.",
      s2p2:        "The Platform's content belonging to 4Relief Humanitarian Foundation is protected and reserved exclusively to it.",
      s2items:     ["Copying, modifying, or distributing any part of the Platform without permission is prohibited", "All trademarks belong to their respective owners", "Unauthorized use exposes the perpetrator to legal liability"],
      s3:          "3. License Granted to Users",
      s3p1:        "4Relief Foundation grants users a limited, non-exclusive license to use the Platform exclusively for donating and following campaigns.",
      s3allowed:   "Permitted Uses",
      s3a:         ["Viewing Platform content", "Making donations", "Creating a personal account", "Communicating with the Foundation", "Sharing campaign links"],
      s3banned:    "Prohibited Uses",
      s3b:         ["Commercial use or reselling", "Copying design or code", "Using automated scripts", "Hacking attempts", "Impersonation", "Publishing illegal content"],
      s4:          "4. Disclaimer & Warranties",
      s4p1:        "The Platform is provided as-is without warranties.",
      s4p2:        "Neither 4Relief nor WEBEK LTD shall be liable for indirect damages.",
      s4p3:        "Technical team commits to resolving issues promptly.",
      s5:          "5. Third-Party Services",
      s5p1:        "The Platform relies on Stripe and PayPal for payment processing.",
      s5items:     ["No credit card data is stored on our servers", "Transactions are encrypted via SSL/TLS", "Contact support for payment disputes", "PCI DSS standards are applied"],
      s6:          "6. Amendments",
      s6p1:        "4Relief reserves the right to amend these terms.",
      s6p2:        "Continued use constitutes acceptance of amendments.",
      s7:          "7. Governing Law",
      s7p1:        "Governed by applicable laws of 4Relief Foundation's jurisdiction.",
      s7p2:        "Invalidity of one provision does not affect others.",
      s8:          "8. Contact",
      cta1:        "General & legal inquiries — 4Relief Humanitarian Foundation",
      cta2:        "Technical inquiries — WEBEK LTD",
    },
    fr: {
      badge:       "Licence de Plateforme et Conditions d'Utilisation",
      intro:       "Cette page définit les conditions juridiques complètes d'utilisation de la plateforme humanitaire 4Relief.",
      updated:     "Dernière mise à jour",
      s1:          "1. La Plateforme et le Développeur",
      s1p1:        "La plateforme appartient à la Fondation 4Relief et a été développée par WEBEK LTD (webek.org).",
      s1p2:        "WEBEK LTD possède une solide expérience avec plus de 200 projets livrés.",
      s1stats:     "Réalisations de WEBEK LTD",
      s2:          "2. Droits de Propriété Intellectuelle",
      s2p1:        "Tous les droits sur la conception et le code appartiennent à WEBEK LTD.",
      s2p2:        "Le contenu appartient exclusivement à la Fondation 4Relief.",
      s2items:     ["Reproduction interdite sans autorisation", "Les marques appartiennent à leurs propriétaires", "Utilisation non autorisée passible de poursuites"],
      s3:          "3. Licence Utilisateur",
      s3p1:        "Licence limitée accordée pour effectuer des dons et suivre les activités.",
      s3allowed:   "Utilisations Autorisées",
      s3a:         ["Consulter le contenu", "Effectuer des dons", "Gérer son compte", "Contacter l'équipe", "Partager des liens"],
      s3banned:    "Utilisations Interdites",
      s3b:         ["Usage commercial", "Copier le code", "Bots automatiques", "Piratage", "Usurpation d'identité", "Contenu illégal"],
      s4:          "4. Responsabilité",
      s4p1:        "Service fourni tel quel.",
      s4p2:        "Pas de responsabilité pour dommages indirects.",
      s4p3:        "Résolution rapide des erreurs techniques.",
      s5:          "5. Paiements Tiers",
      s5p1:        "Paiements sécurisés via Stripe et PayPal.",
      s5items:     ["Pas de stockage de données bancaires", "Cryptage SSL/TLS", "Support disponible pour litiges", "Normes PCI DSS"],
      s6:          "6. Modifications",
      s6p1:        "Droits de modification réservés.",
      s6p2:        "Acceptation tacite lors de l'utilisation continue.",
      s7:          "7. Droit Applicable",
      s7p1:        "Régi par le droit applicable de la Fondation.",
      s7p2:        "Maintien des clauses valides.",
      s8:          "8. Contact",
      cta1:        "Demandes générales — Fondation 4Relief",
      cta2:        "Demandes techniques — WEBEK LTD",
    },
    tr: {
      badge:       "Platform Lisansı ve Kullanım Koşulları",
      intro:       "Bu sayfa, 4Relief Platformunu kullanmaya ilişkin yasal koşulları açıklamaktadır.",
      updated:     "Son Güncelleme",
      s1:          "1. Platform ve Geliştirici",
      s1p1:        "4Relief Platformu, 4Relief Vakfı'na aittir ve WEBEK LTD (webek.org) tarafından geliştirilmiştir.",
      s1p2:        "WEBEK LTD, 200'den fazla başarılı dijital proje teslim etmiştir.",
      s1stats:     "WEBEK LTD Başarıları",
      s2:          "2. Fikri Mülkiyet Hakları",
      s2p1:        "Tasarım ve kod hakları WEBEK LTD'ye aittir.",
      s2p2:        "İçerik hakları 4Relief Vakfı'na aittir.",
      s2items:     ["İzinsiz kopyalama yasaktır", "Markalar sahiplerine aittir", "İzinsiz kullanım yasal yaptırım gerektirir"],
      s3:          "3. Kullanıcı Lisansı",
      s3p1:        "Sadece bağış yapma ve takip amacıyla sınırlı lisans verilmiştir.",
      s3allowed:   "İzin Verilen Kullanımlar",
      s3a:         ["İçerik görüntüleme", "Bağış yapma", "Hesap oluşturma", "İletişime geçme", "Paylaşım yapma"],
      s3banned:    "Yasaklanan Kullanımlar",
      s3b:         ["Ticari kullanım", "Kod kopyalama", "Bot kullanımı", "Saldırı girişimleri", "Kimlik bürünme", "Yasadışı içerik"],
      s4:          "4. Sorumluluk Reddi",
      s4p1:        "Platform olduğu gibi sunulmaktadır.",
      s4p2:        "Dolaylı zararlardan sorumluluk kabul edilmez.",
      s4p3:        "Teknik sorunlar hızla çözülür.",
      s5:          "5. Üçüncü Taraf Ödemeler",
      s5p1:        "Stripe ve PayPal altyapısı kullanılmaktadır.",
      s5items:     ["Kart bilgisi saklanmaz", "SSL/TLS şifreleme", "Destek ekibi hazır", "PCI DSS standartları"],
      s6:          "6. Değişiklikler",
      s6p1:        "Koşulları değiştirme hakkı saklıdır.",
      s6p2:        "Kullanıma devam edilmesi kabul anlamına gelir.",
      s7:          "7. Uygulanacak Hukuk",
      s7p1:        "İlgili yargı bölgesi yasaları geçerlidir.",
      s7p2:        "Diğer maddelerin geçerliliği korunur.",
      s8:          "8. İletişim",
      cta1:        "Genel sorular — 4Relief Vakfı",
      cta2:        "Teknik sorular — WEBEK LTD",
    },
  }[l];

  return (
    <>
      <div className="mb-8 p-6 rounded-3xl bg-slate-50 border border-slate-100">
        <span className="inline-block text-[11px] font-extrabold text-brand uppercase tracking-widest mb-3 bg-brand/10 px-3 py-1 rounded-full">
          {t.badge}
        </span>
        <p className="text-sm leading-relaxed text-slate-600">{t.intro}</p>
        <p className="mt-3 text-xs text-slate-500 font-semibold">{t.updated}: <span className="text-slate-700">12 / 07 / 2026</span></p>
      </div>

      <div className="mb-8">
        <Section title={t.s1}>
          <P>{t.s1p1}</P>
          <P>{t.s1p2}</P>
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.s1stats}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <div className="font-display text-2xl sm:text-3xl font-black text-brand mb-1">{s.n}</div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">{s[l]}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Section title={t.s2}>
        <P>{t.s2p1}</P>
        <P>{t.s2p2}</P>
        <UL items={t.s2items} />
      </Section>

      <div className="mb-8">
        <Section title={t.s3}>
          <P>{t.s3p1}</P>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t.s3allowed}</span>
              </div>
              <ul className="space-y-2">
                {t.s3a.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">{t.s3banned}</span>
              </div>
              <ul className="space-y-2">
                {t.s3b.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-rose-600 font-bold shrink-0">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>

      <Section title={t.s4}>
        <P>{t.s4p1}</P>
        <P>{t.s4p2}</P>
        <P>{t.s4p3}</P>
      </Section>

      <Section title={t.s5}>
        <P>{t.s5p1}</P>
        <UL items={t.s5items} />
      </Section>

      <Section title={t.s6}>
        <P>{t.s6p1}</P>
        <P>{t.s6p2}</P>
      </Section>

      <Section title={t.s7}>
        <P>{t.s7p1}</P>
        <P>{t.s7p2}</P>
      </Section>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900 text-white p-6 text-center">
          <p className="font-bold text-sm mb-1">{t.cta1}</p>
          <p className="text-white/80 text-xs mb-4 font-mono">info@forrelief.org</p>
          <a href="mailto:info@forrelief.org" className="inline-flex items-center gap-2 bg-brand hover:opacity-90 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition">
            {l === "ar" ? "تواصل معنا" : l === "fr" ? "Nous Contacter" : l === "tr" ? "İletişim" : "Contact Us"}
          </a>
        </div>
        <div className="rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 p-6 text-center">
          <p className="font-bold text-sm mb-1">{t.cta2}</p>
          <p className="text-slate-500 text-xs mb-4 font-mono">info@webek.org</p>
          <a href="mailto:info@webek.org" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition hover:bg-slate-800">
            WEBEK LTD
          </a>
        </div>
      </div>
    </>
  );
}

// ── How We Use Donations ──────────────────────────────────────
function HowWeUseDonationsContent({ locale }: { locale: string }) {
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as "ar"|"en"|"fr"|"tr";
  const content = {
    ar: {
      intro: "نؤمن في مؤسسة 4Relief أن المتبرع يستحق أن يعرف بالضبط كيف يُستخدم تبرعه. إليك صورة واضحة وشفافة.",
      s1_title: "توزيع التبرعات",
      s1: ["80% أو أكثر يذهب مباشرة للمستفيدين على الأرض","تكاليف التشغيل (إدارة، تكنولوجيا، اتصالات) لا تتجاوز 20%","لا توجد رسوم مخفية أو تكاليف غير معلنة","كل تبرع له رقم إيصال فريد وإمكانية التتبع"],
      s2_title: "مجالات الصرف",
      s2: ["الغذاء والمياه والمستلزمات الأساسية","الرعاية الطبية والأدوية والمعدات","المأوى ومواد البناء الطارئة","التعليم ومستلزمات المدارس","دعم الأسر المهجرة وإعادة التأهيل"],
      s3_title: "الرقابة والمتابعة",
      s3: ["تقارير ميدانية منتظمة من شركاء التنفيذ","صور وفيديوهات من مواقع التوزيع","تقارير مالية ربع سنوية منشورة","تدقيق مستقل سنوي من شركة محاسبة خارجية"],
      cta: "أسئلة حول كيفية استخدام تبرعك؟ نحن هنا للإجابة"
    },
    en: {
      intro: "At 4Relief, we believe donors deserve to know exactly how their donation is used. Here is a clear and transparent picture.",
      s1_title: "Donation Distribution",
      s1: ["80% or more goes directly to beneficiaries on the ground","Operational costs (admin, technology, communications) do not exceed 20%","No hidden fees or undisclosed costs","Every donation has a unique receipt number and tracking capability"],
      s2_title: "Areas of Expenditure",
      s2: ["Food, water, and essential supplies","Medical care, medicines, and equipment","Emergency shelter and construction materials","Education and school supplies","Support for displaced families and rehabilitation"],
      s3_title: "Oversight & Follow-up",
      s3: ["Regular field reports from implementing partners","Photos and videos from distribution sites","Quarterly financial reports published","Annual independent audit by external accounting firm"],
      cta: "Questions about how your donation is used? We are here to answer"
    },
    fr: {
      intro: "Chez 4Relief, nous croyons que les donateurs méritent de savoir exactement comment leur don est utilisé. Voici une image claire et transparente.",
      s1_title: "Distribution des Dons",
      s1: ["80% ou plus va directement aux bénéficiaires sur le terrain","Les coûts opérationnels ne dépassent pas 20%","Aucun frais caché ou coût non divulgué","Chaque don a un numéro de reçu unique et une capacité de suivi"],
      s2_title: "Domaines de Dépenses",
      s2: ["Nourriture, eau et fournitures essentielles","Soins médicaux, médicaments et équipements","Abris d'urgence et matériaux de construction","Éducation et fournitures scolaires","Soutien aux familles déplacées et réhabilitation"],
      s3_title: "Contrôle et Suivi",
      s3: ["Rapports de terrain réguliers des partenaires d'exécution","Photos et vidéos des sites de distribution","Rapports financiers trimestriels publiés","Audit indépendant annuel par un cabinet comptable externe"],
      cta: "Des questions sur l'utilisation de votre don? Nous sommes là pour répondre"
    },
    tr: {
      intro: "4Relief olarak bağışçıların bağışlarının tam olarak nasıl kullanıldığını bilmeyi hak ettiğine inanıyoruz. İşte net ve şeffaf bir tablo.",
      s1_title: "Bağış Dağılımı",
      s1: ["%80 veya daha fazlası doğrudan sahadaki yararlanıcılara gider","Operasyonel maliyetler %20'yi geçmez","Gizli ücret veya açıklanmamış maliyet yoktur","Her bağışın benzersiz bir makbuz numarası ve takip imkanı vardır"],
      s2_title: "Harcama Alanları",
      s2: ["Gıda, su ve temel malzemeler","Tıbbi bakım, ilaçlar ve ekipman","Acil barınak ve inşaat malzemeleri","Eğitim ve okul malzemeleri","Yerinden edilmiş ailelere destek ve rehabilitasyon"],
      s3_title: "Denetim ve Takip",
      s3: ["Uygulama ortaklarından düzenli saha raporları","Dağıtım noktalarından fotoğraf ve videolar","Üç ayda bir yayımlanan mali raporlar","Harici muhasebe firması tarafından yıllık bağımsız denetim"],
      cta: "Bağışınızın nasıl kullanıldığına dair sorularınız mı var? Cevaplamak için buradayız"
    },
  };
  const t = content[l];
  return (
    <>
      <Section title={l === "ar" ? "كيف نستخدم التبرعات" : l === "fr" ? "Utilisation des Dons" : l === "tr" ? "Bağışları Nasıl Kullanıyoruz" : "How We Use Donations"}>
        <P>{t.intro}</P>
      </Section>
      <Section title={t.s1_title}><UL items={t.s1} /></Section>
      <Section title={t.s2_title}><UL items={t.s2} /></Section>
      <Section title={t.s3_title}><UL items={t.s3} /></Section>
      <ContactCTA locale={locale} email="transparency@forrelief.org" label={t.cta} />
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
const COMPONENTS: Record<string, React.ComponentType<{locale: string}>> = {
  privacy: PrivacyContent,
  terms: TermsContent,
  "refund-policy": RefundContent,
  "cookie-policy": CookieContent,
  "aml-policy": AMLContent,
  complaints: ComplaintsContent,
  "financial-transparency": FinancialTransparencyContent,
  "license": LicenseContent,
  "how-we-use-donations": HowWeUseDonationsContent,
};

export default function LegalPageContent({ slug, locale }: { slug: string; locale: string }) {
  const Component = COMPONENTS[slug];
  if (!Component) return null;
  return (
    <div className="bg-slate-50/50 min-h-screen py-12 border-t border-slate-100">
      <div className="max-w-screen-xl mx-auto px-6">
        <Component locale={locale} />
      </div>
    </div>
  );
}