import Link from "next/link";

type Locale = "ar" | "en" | "fr" | "tr";

// ── Helpers ───────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">{title}</h2>
      <div className="space-y-3 text-muted leading-relaxed">{children}</div>
    </div>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-loose">{children}</p>;
}
function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mr-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2.5 shrink-0" />
          <span className="text-[15px] leading-loose">{item}</span>
        </li>
      ))}
    </ul>
  );
}
function ContactCTA({ locale, email, label }: { locale: string; email: string; label: string }) {
  const text: Record<string, string> = { ar: "تواصل معنا", en: "Contact Us", fr: "Nous Contacter", tr: "Bize Ulaşın" };
  return (
    <div className="mt-10 rounded-2xl bg-brand/5 border border-brand/15 p-6 text-center">
      <p className="font-semibold text-ink mb-1">{label}</p>
      <p className="text-muted text-sm mb-4">{email}</p>
      <a href={`mailto:${email}`} className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 text-sm transition">
        {text[locale] || text.en}
      </a>
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
      <ContactCTA locale={locale} email="privacy@forrelief.org" label="Questions about your privacy? Our Data Protection Officer responds within 72 hours." />
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
      <ContactCTA locale={locale} email="privacy@forrelief.org" label="Questions sur votre vie privée ? Notre DPO répond sous 72 heures." />
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
      <ContactCTA locale={locale} email="privacy@forrelief.org" label="Gizliliğiniz hakkında sorularınız mı var? Veri Koruma Yetkilimiz 72 saat içinde yanıt verir." />
    </>
  );
  // Default: Arabic
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
      <ContactCTA locale={locale} email="privacy@forrelief.org" label="أسئلة حول خصوصيتك؟ مسؤول حماية البيانات يرد خلال 72 ساعة." />
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
      <ContactCTA locale={locale} email="info@forrelief.org"
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
      <ContactCTA locale={locale} email="refunds@forrelief.org" label={d.cta} />
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
      <ContactCTA locale={locale} email="privacy@forrelief.org" label={d.cta} />
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
      <ContactCTA locale={locale} email="fraud@forrelief.org" label={d.cta} />
    </>
  );
}

// ── Complaints ────────────────────────────────────────────────
function ComplaintsContent({ locale }: { locale: string }) {
  const emails = [
    { label: { ar: "الاستفسارات العامة", en: "General Inquiries", fr: "Renseignements Généraux", tr: "Genel Sorular" }, email: "info@forrelief.org" },
    { label: { ar: "الشكاوى والملاحظات", en: "Complaints & Feedback", fr: "Réclamations", tr: "Şikayetler" }, email: "complaints@forrelief.org" },
    { label: { ar: "استرداد التبرعات", en: "Donation Refunds", fr: "Remboursements", tr: "İadeler" }, email: "refunds@forrelief.org" },
    { label: { ar: "الخصوصية وحماية البيانات", en: "Privacy & Data", fr: "Confidentialité", tr: "Gizlilik" }, email: "privacy@forrelief.org" },
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
        <div className="grid sm:grid-cols-2 gap-3">
          {emails.map(e => (
            <div key={e.email} className="flex items-center gap-3 p-3 rounded-xl bg-[#F4F7FD] border border-line">
              <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <p className="text-xs text-muted">{e.label[l as keyof typeof e.label]}</p>
                <a href={`mailto:${e.email}`} className="text-sm font-semibold text-brand hover:underline">{e.email}</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={ti.at}><UL items={types[l]} /></Section>

      <Section title={ti.p}>
        <ol className="space-y-4">
          {locSteps.map(([title, desc], i) => (
            <li key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0">{i+1}</div>
              <div><p className="font-semibold text-ink mb-0.5">{title}</p><p className="text-muted text-sm leading-relaxed">{desc}</p></div>
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
      <ContactCTA locale={locale} email="finance@forrelief.org" label={t.cta} />
    </>
  );
}

// ── License ───────────────────────────────────────────────────
function LicenseContent({ locale }: { locale: string }) {
  const l = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as Locale;

  const updated = "12 يوليو 2026 | July 12, 2026 | 12 juillet 2026 | 12 Temmuz 2026";

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
      s1p2:        "WEBEK LTD شركة لها باع طويل في الصناعة الرقمية، نفّذت أكثر من 200 موقع ومنصة رقمية متكاملة لعملاء في مختلف القطاعات حول العالم، وكتبت ما يزيد على مليون سطر كود برمجي عالي الجودة. تمتلك خبرة موثّقة ومتخصصة في بناء منصات التبرع الإنسانية، ومنصات التجارة الإلكترونية، وأنظمة إدارة المحتوى، وتطبيقات SaaS المتقدمة.",
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
      s4p1:        "تُقدَّم المنصة وجميع خدماتها بحالتها الراهنة دون أي ضمانات صريحة أو ضمنية من أي نوع. لا تضمن مؤسسة 4Relief أن المنصة ستكون متاحة بشكل مستمر وخالية من الأخطاء والانقطاعات في جميع الأوقات.",
      s4p2:        "لا تتحمل مؤسسة 4Relief ولا شركة WEBEK LTD أي مسؤولية عن الأضرار المباشرة أو غير المباشرة أو العرضية أو التبعية الناتجة عن استخدام المنصة أو عدم القدرة على استخدامها لأي سبب كان.",
      s4p3:        "في حالة حدوث خلل تقني يؤثر على عمليات التبرع، يتعهد الفريق التقني بمعالجته في أسرع وقت ممكن وإعلام المتبرعين المتأثرين بالإجراءات والحلول المتاحة.",
      s5:          "5. الخدمات الخارجية وبوابات الدفع",
      s5p1:        "تعتمد المنصة على خدمات دفع خارجية موثوقة وهي Stripe وPayPal لمعالجة التبرعات بأمان. هذه الخدمات مستقلة تماماً عن مؤسسة 4Relief وتخضع لشروط استخدامها وسياسات خصوصيتها الخاصة.",
      s5items:     ["لا تقوم مؤسسة 4Relief ولا WEBEK LTD بتخزين أرقام بطاقات الائتمان أو البيانات المالية الحساسة على خوادمها", "جميع المعاملات المالية تتم عبر بوابات دفع معتمدة ومشفرة بتقنية SSL/TLS", "في حالة أي نزاع أو إشكالية متعلقة بعمليات الدفع، يُرجى التواصل مع فريق الدعم فوراً", "تطبّق المنصة معايير PCI DSS الدولية لأمان بيانات بطاقات الدفع"],
      s6:          "6. التعديلات على هذا الترخيص",
      s6p1:        "تحتفظ مؤسسة 4Relief بالحق الكامل في تعديل أو تحديث أو استبدال شروط هذا الترخيص في أي وقت تشاء. سيتم إخطار المستخدمين المسجلين بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار واضح على المنصة.",
      s6p2:        "استمرارك في استخدام المنصة بعد نشر أي تعديلات يُعدّ موافقة ضمنية وكاملة منك على الشروط المعدّلة. إن لم توافق على الشروط المعدّلة، عليك التوقف فوراً عن استخدام المنصة.",
      s7:          "7. القانون الحاكم والاختصاص القضائي",
      s7p1:        "تخضع هذه الشروط وتُفسَّر وفقاً للقوانين المعمول بها في نطاق عمل مؤسسة 4Relief الإنسانية. أي نزاع ينشأ عن أو يتعلق بهذه الشروط أو باستخدام المنصة يخضع للاختصاص القضائي الحصري للمحاكم المختصة.",
      s7p2:        "في حالة اعتبار أي بند من بنود هذه الشروط غير ساري أو غير قابل للتطبيق لأي سبب، يظل سريان وصحة باقي البنود محفوظَين بالكامل دون أي تأثير.",
      s8:          "8. التواصل بشأن الترخيص",
      cta1:        "للاستفسارات العامة والقانونية — مؤسسة 4Relief الإنسانية",
      cta2:        "للاستفسارات التقنية المتعلقة بالمنصة والكود — WEBEK LTD",
    },
    en: {
      badge:       "Platform License & Terms of Use",
      intro:       "This page sets out the complete legal terms for using the 4Relief Humanitarian Platform, clarifying intellectual property rights, licensing terms, limitations of liability, and usage restrictions. Please read these terms carefully before using the platform.",
      updated:     "Last Updated",
      s1:          "1. The Platform & Developer",
      s1p1:        "The 4Relief Humanitarian Platform is owned by the 4Relief Humanitarian Foundation and was designed, developed, and built from scratch by WEBEK LTD (webek.org), a company specializing in large-scale software and digital platform development.",
      s1p2:        "WEBEK LTD has an extensive and proven track record in the digital industry, having delivered over 200 complete websites and digital platforms to clients across various sectors worldwide, writing more than one million lines of high-quality code. The company holds documented and specialized expertise in humanitarian donation platforms, e-commerce systems, content management systems, and advanced SaaS applications.",
      s1stats:     "WEBEK LTD Achievements",
      s2:          "2. Intellectual Property Rights",
      s2p1:        "All rights to the graphic design, user interfaces (UI/UX), source code at all levels, and technical architecture of the Platform are the exclusive property of WEBEK LTD and are protected under applicable international and local intellectual property laws.",
      s2p2:        "The Platform's content including texts, articles, images, logos, trademarks, and visual identity belonging to 4Relief Humanitarian Foundation are protected and reserved exclusively and solely to it.",
      s2items:     ["Copying, modifying, distributing, or republishing any part of the Platform's design, code, or content without explicit prior written permission from rights holders is strictly prohibited", "All logos, trademarks, and product names mentioned are the property of their respective owners", "Any unauthorized use exposes the perpetrator to legal liability under applicable laws"],
      s3:          "3. License Granted to Users",
      s3p1:        "4Relief Humanitarian Foundation grants users a limited, non-exclusive, non-transferable, non-sublicensable license to use the Platform exclusively for the purposes of donating, following humanitarian campaigns, and communicating with the Foundation.",
      s3allowed:   "Permitted Uses",
      s3a:         ["Viewing Platform content and reading articles and reports", "Making donations to support humanitarian campaigns", "Creating a personal account and monitoring donation history", "Communicating with the Foundation team through available channels", "Sharing campaign links on social media"],
      s3banned:    "Prohibited Uses",
      s3b:         ["Using the Platform or any part thereof for commercial purposes or reselling it in any form", "Copying the design, code, or database to create similar platforms", "Using crawlers or automated scripts to extract Platform data", "Attempting to hack or disrupt the Platform's systems or databases", "Impersonating the Foundation, its staff, or partners", "Publishing misleading, abusive, or legally non-compliant content"],
      s4:          "4. Disclaimer & Limitation of Warranties",
      s4p1:        "The Platform and all its services are provided as-is without warranties of any kind, express or implied. 4Relief Foundation does not guarantee that the Platform will be available continuously and free from errors or interruptions at all times.",
      s4p2:        "Neither 4Relief Foundation nor WEBEK LTD shall be liable for any direct, indirect, incidental, or consequential damages resulting from the use of or inability to use the Platform for any reason whatsoever.",
      s4p3:        "In the event of a technical fault affecting donation operations, the technical team commits to resolving it as quickly as possible and informing affected donors of available procedures and solutions.",
      s5:          "5. Third-Party Services & Payment Gateways",
      s5p1:        "The Platform relies on trusted third-party payment services — Stripe and PayPal — to securely process donations. These services are entirely independent of 4Relief Foundation and are governed by their own terms of use and privacy policies.",
      s5items:     ["Neither 4Relief Foundation nor WEBEK LTD stores credit card numbers or sensitive financial data on their servers", "All financial transactions are processed through certified, SSL/TLS-encrypted payment gateways", "In the event of any dispute or issue related to payment transactions, please contact the support team immediately", "The Platform applies PCI DSS international standards for payment card data security"],
      s6:          "6. Amendments to This License",
      s6p1:        "4Relief Foundation reserves the full right to amend, update, or replace these license terms at any time. Registered users will be notified of any material changes by email or through a clear notice on the Platform.",
      s6p2:        "Your continued use of the Platform after any amendments are published constitutes your implicit and complete acceptance of the amended terms. If you do not agree to the amended terms, you must immediately cease using the Platform.",
      s7:          "7. Governing Law & Jurisdiction",
      s7p1:        "These terms are governed by and interpreted in accordance with the laws applicable in the jurisdiction where 4Relief Humanitarian Foundation operates. Any dispute arising from or related to these terms or Platform use is subject to the exclusive jurisdiction of the competent courts.",
      s7p2:        "If any provision of these terms is found to be invalid or unenforceable for any reason, the validity and enforceability of the remaining provisions shall be fully preserved without any effect.",
      s8:          "8. Contact Regarding This License",
      cta1:        "General & legal inquiries — 4Relief Humanitarian Foundation",
      cta2:        "Technical platform & code inquiries — WEBEK LTD",
    },
    fr: {
      badge:       "Licence de Plateforme et Conditions d'Utilisation",
      intro:       "Cette page définit les conditions juridiques complètes d'utilisation de la plateforme humanitaire 4Relief, clarifiant les droits de propriété intellectuelle, les conditions de licence, les limitations de responsabilité et les restrictions d'utilisation.",
      updated:     "Dernière mise à jour",
      s1:          "1. La Plateforme et le Développeur",
      s1p1:        "La plateforme humanitaire 4Relief appartient à la Fondation humanitaire 4Relief et a été conçue, développée et construite de zéro par WEBEK LTD (webek.org), une société spécialisée dans le développement de logiciels et de plateformes numériques à grande échelle.",
      s1p2:        "WEBEK LTD possède un bilan solide et avéré dans l'industrie numérique, ayant livré plus de 200 sites web et plateformes numériques complets à des clients dans divers secteurs, rédigé plus d'un million de lignes de code de haute qualité, avec une expertise documentée dans les plateformes de dons humanitaires et les applications SaaS avancées.",
      s1stats:     "Réalisations de WEBEK LTD",
      s2:          "2. Droits de Propriété Intellectuelle",
      s2p1:        "Tous les droits sur la conception graphique, les interfaces utilisateur, le code source et l'architecture technique de la Plateforme sont la propriété exclusive de WEBEK LTD et sont protégés par les lois applicables sur la propriété intellectuelle.",
      s2p2:        "Le contenu de la Plateforme appartenant à la Fondation humanitaire 4Relief est protégé et réservé exclusivement à celle-ci.",
      s2items:     ["La copie, modification ou distribution de toute partie de la Plateforme sans autorisation écrite préalable est strictement interdite", "Tous les logos et marques déposées mentionnés appartiennent à leurs propriétaires respectifs", "Toute utilisation non autorisée expose son auteur à des poursuites judiciaires"],
      s3:          "3. Licence Accordée aux Utilisateurs",
      s3p1:        "La Fondation 4Relief accorde aux utilisateurs une licence limitée, non exclusive, non transférable pour utiliser la Plateforme uniquement à des fins de dons et de suivi des campagnes humanitaires.",
      s3allowed:   "Utilisations Autorisées",
      s3a:         ["Consulter le contenu de la Plateforme", "Effectuer des dons pour soutenir des campagnes humanitaires", "Créer un compte personnel et suivre l'historique des dons", "Communiquer avec l'équipe de la Fondation", "Partager des liens de campagnes sur les réseaux sociaux"],
      s3banned:    "Utilisations Interdites",
      s3b:         ["Utiliser la Plateforme à des fins commerciales ou la revendre", "Copier le design ou le code pour créer des plateformes similaires", "Utiliser des robots d'exploration pour extraire des données", "Tenter de pirater ou perturber les systèmes de la Plateforme", "Usurper l'identité de la Fondation ou de ses partenaires", "Publier du contenu trompeur ou illégal"],
      s4:          "4. Exclusion de Responsabilité",
      s4p1:        "La Plateforme est fournie telle quelle sans aucune garantie. La Fondation 4Relief ne garantit pas que la Plateforme sera disponible en permanence et sans erreurs.",
      s4p2:        "Ni la Fondation 4Relief ni WEBEK LTD ne seront responsables des dommages directs ou indirects résultant de l'utilisation de la Plateforme.",
      s4p3:        "En cas de défaillance technique, l'équipe s'engage à résoudre le problème dans les meilleurs délais.",
      s5:          "5. Services Tiers et Passerelles de Paiement",
      s5p1:        "La Plateforme utilise Stripe et PayPal pour traiter les dons en toute sécurité. Ces services sont régis par leurs propres conditions indépendantes.",
      s5items:     ["Aucune donnée financière sensible n'est stockée sur nos serveurs", "Toutes les transactions sont cryptées SSL/TLS", "Pour tout litige de paiement, contactez immédiatement le support", "La Plateforme applique les normes PCI DSS"],
      s6:          "6. Modifications de la Licence",
      s6p1:        "La Fondation 4Relief se réserve le droit de modifier ces conditions à tout moment avec notification aux utilisateurs enregistrés.",
      s6p2:        "La poursuite de l'utilisation de la Plateforme après modifications vaut acceptation des nouvelles conditions.",
      s7:          "7. Droit Applicable et Juridiction",
      s7p1:        "Ces conditions sont régies par les lois applicables dans la juridiction de la Fondation 4Relief.",
      s7p2:        "Si une disposition est invalide, les autres restent pleinement en vigueur.",
      s8:          "8. Contact",
      cta1:        "Questions générales et juridiques — Fondation humanitaire 4Relief",
      cta2:        "Questions techniques — WEBEK LTD",
    },
    tr: {
      badge:       "Platform Lisansı ve Kullanım Koşulları",
      intro:       "Bu sayfa, 4Relief İnsani Yardım Platformunu kullanmaya ilişkin yasal koşulları, fikri mülkiyet haklarını, lisans koşullarını, sorumluluk sınırlarını ve kullanım kısıtlamalarını kapsamlı biçimde açıklamaktadır.",
      updated:     "Son Güncelleme",
      s1:          "1. Platform ve Geliştirici",
      s1p1:        "4Relief İnsani Yardım Platformu, 4Relief İnsani Yardım Vakfı'na aittir ve büyük ölçekli yazılım ve dijital platform geliştirme konusunda uzmanlaşmış WEBEK LTD (webek.org) tarafından sıfırdan tasarlanmış, geliştirilmiş ve inşa edilmiştir.",
      s1p2:        "WEBEK LTD, dijital endüstride kapsamlı ve kanıtlanmış bir sicile sahip olup dünya genelinde çeşitli sektörlerdeki müşterilere 200'den fazla eksiksiz web sitesi ve dijital platform teslim etmiş, bir milyondan fazla satır yüksek kaliteli kod yazmıştır.",
      s1stats:     "WEBEK LTD Başarıları",
      s2:          "2. Fikri Mülkiyet Hakları",
      s2p1:        "Platformun grafik tasarımı, kullanıcı arayüzleri, kaynak kodu ve teknik mimarisine ilişkin tüm haklar WEBEK LTD'nin münhasır mülkiyetindedir.",
      s2p2:        "4Relief İnsani Yardım Vakfı'na ait Platform içeriği korunmakta ve yalnızca Vakfa ayrılmaktadır.",
      s2items:     ["Hak sahiplerinden önceden yazılı izin alınmadan Platformun herhangi bir bölümünün kopyalanması kesinlikle yasaktır", "Belirtilen tüm logolar ve ticari markalar ilgili sahiplerine aittir", "İzinsiz kullanım yasal yaptırımlara yol açar"],
      s3:          "3. Kullanıcılara Verilen Lisans",
      s3p1:        "4Relief Vakfı, kullanıcılara yalnızca bağış yapmak ve insani yardım kampanyalarını takip etmek amacıyla Platformu kullanmak için sınırlı, münhasır olmayan, devredilemez bir lisans vermektedir.",
      s3allowed:   "İzin Verilen Kullanımlar",
      s3a:         ["Platform içeriğini görüntüleme", "İnsani yardım kampanyalarına bağış yapma", "Kişisel hesap oluşturma ve bağış geçmişini takip etme", "Vakıf ekibiyle iletişime geçme", "Kampanya bağlantılarını sosyal medyada paylaşma"],
      s3banned:    "Yasaklanan Kullanımlar",
      s3b:         ["Platformu ticari amaçlarla kullanmak veya yeniden satmak", "Benzer platformlar oluşturmak için tasarım veya kodu kopyalamak", "Platform verilerini çıkarmak için botlar kullanmak", "Platform sistemlerini hacklemek veya aksatmak", "Vakfın kimliğine bürünmek", "Yanıltıcı veya yasadışı içerik yayınlamak"],
      s4:          "4. Sorumluluk Reddi",
      s4p1:        "Platform, açık veya zımni hiçbir garanti verilmeksizin olduğu gibi sunulmaktadır.",
      s4p2:        "Ne 4Relief Vakfı ne de WEBEK LTD, Platformun kullanımından kaynaklanan zararlardan sorumlu tutulamaz.",
      s4p3:        "Teknik bir arıza durumunda ekip, sorunu mümkün olan en kısa sürede çözmeyi taahhüt eder.",
      s5:          "5. Üçüncü Taraf Hizmetleri ve Ödeme Ağ Geçitleri",
      s5p1:        "Platform, bağışları güvenli şekilde işlemek için Stripe ve PayPal kullanmaktadır. Bu hizmetler kendi bağımsız koşullarına tabidir.",
      s5items:     ["Sunucularımızda hassas finansal veri saklanmamaktadır", "Tüm işlemler SSL/TLS şifreli ağ geçitleri aracılığıyla gerçekleştirilir", "Ödeme anlaşmazlıkları için hemen destek ekibiyle iletişime geçin", "Platform PCI DSS standartlarını uygulamaktadır"],
      s6:          "6. Lisans Değişiklikleri",
      s6p1:        "4Relief Vakfı, bu koşulları dilediği zaman değiştirme hakkını saklı tutar ve kayıtlı kullanıcılara bildirim gönderir.",
      s6p2:        "Değişikliklerden sonra Platformu kullanmaya devam etmek, yeni koşulların kabulü anlamına gelir.",
      s7:          "7. Geçerli Hukuk ve Yargı Yetkisi",
      s7p1:        "Bu koşullar, 4Relief Vakfı'nın faaliyet gösterdiği yargı bölgesinde geçerli olan yasalara tabidir.",
      s7p2:        "Bir hükmün geçersiz olması, diğer hükümlerin geçerliliğini etkilemez.",
      s8:          "8. Lisansla İlgili İletişim",
      cta1:        "Genel ve hukuki sorular — 4Relief İnsani Yardım Vakfı",
      cta2:        "Teknik platform soruları — WEBEK LTD",
    },
  }[l];

  return (
    <>
      {/* Badge + intro */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/20">
        <span className="inline-block text-xs font-bold text-brand uppercase tracking-[0.25em] mb-3 bg-brand/10 px-3 py-1 rounded-full">
          {t.badge}
        </span>
        <p className="text-[15px] leading-loose text-muted">{t.intro}</p>
        <p className="mt-3 text-xs text-muted/60 font-semibold">{t.updated}: <span className="text-brand">12 / 07 / 2026</span></p>
      </div>

      {/* WEBEK stats */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">{t.s1}</h2>
        <div className="space-y-3 text-muted leading-relaxed mb-6">
          <P>{t.s1p1}</P>
          <P>{t.s1p2}</P>
        </div>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">{t.s1stats}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-gradient-to-br from-brand/8 to-brand/5 border border-brand/20 rounded-2xl p-4 text-center">
              <div className="font-display text-3xl font-extrabold text-brand mb-1">{s.n}</div>
              <div className="text-xs text-muted font-semibold leading-tight">{s[l]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* IP Rights */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">{t.s2}</h2>
        <div className="space-y-3 text-muted leading-relaxed mb-4">
          <P>{t.s2p1}</P>
          <P>{t.s2p2}</P>
        </div>
        <UL items={t.s2items} />
      </div>

      {/* License */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">{t.s3}</h2>
        <P>{t.s3p1}</P>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              <span className="text-sm font-bold text-success">{t.s3allowed}</span>
            </div>
            <ul className="space-y-2">
              {t.s3a.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted">
                  <span className="text-success font-bold mt-0.5 shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-danger inline-block" />
              <span className="text-sm font-bold text-danger">{t.s3banned}</span>
            </div>
            <ul className="space-y-2">
              {t.s3b.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-muted">
                  <span className="text-danger font-bold mt-0.5 shrink-0">✕</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <Section title={t.s4}>
        <P>{t.s4p1}</P>
        <P>{t.s4p2}</P>
        <P>{t.s4p3}</P>
      </Section>

      {/* Payments */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">{t.s5}</h2>
        <P>{t.s5p1}</P>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {t.s5items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-dashbg border border-line rounded-xl p-4">
              <span className="w-5 h-5 rounded-full bg-brand/15 text-brand flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-[13px] text-muted leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title={t.s6}>
        <P>{t.s6p1}</P>
        <P>{t.s6p2}</P>
      </Section>

      <Section title={t.s7}>
        <P>{t.s7p1}</P>
        <P>{t.s7p2}</P>
      </Section>

      {/* CTA */}
      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-brand/5 border border-brand/15 p-6 text-center">
          <p className="font-semibold text-ink mb-1 text-sm">{t.cta1}</p>
          <p className="text-muted text-xs mb-4">info@forrelief.org</p>
          <a href="mailto:info@forrelief.org" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition">
            {l === "ar" ? "تواصل معنا" : l === "fr" ? "Nous Contacter" : l === "tr" ? "İletişim" : "Contact Us"}
          </a>
        </div>
        <div className="rounded-2xl bg-dashbg border border-line p-6 text-center">
          <p className="font-semibold text-ink mb-1 text-sm">{t.cta2}</p>
          <p className="text-muted text-xs mb-4">info@webek.org</p>
          <a href="mailto:info@webek.org" className="inline-flex items-center gap-2 bg-ink hover:bg-ink/80 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition">
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
    <div className="max-w-screen-xl mx-auto px-6 py-14">
      <Component locale={locale} />
    </div>
  );
}
