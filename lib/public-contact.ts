export const OFFICIAL_EMAIL = "info@forrelief.org";
export const OFFICIAL_PHONE = "+447938426217";
export const OFFICIAL_WHATSAPP_URL = "https://wa.me/447938426217";
// Public editorial content only. Never use this on account/customer records.
export const officialEmail = (isSite: boolean) => OFFICIAL_EMAIL;
export function normalizePublicContact<T>(value: T, email = OFFICIAL_EMAIL): T {
    if (typeof value === "string") {
        let text = value.replace(/[a-z0-9._%+-]+@(?:forrelief|4relief|site)\.org/gi, email);
        if (email === OFFICIAL_EMAIL)
            text = text
                .replace('ونخضع لرقابة هيئة الشركات البريطانية (Companies House) لضمان أعلى معايير الحوكمة', 'والشركة مسجلة لدى هيئة الشركات البريطانية (Companies House) برقم 17306194')
                .replace('we are regulated by the UK Companies House to ensure the highest standards of governance', 'the company is registered with Companies House under number 17306194')
                .replace('nous sommes réglementés par la Companies House du Royaume-Uni pour garantir les normes de gouvernance les plus élevées', 'la société est enregistrée auprès de Companies House sous le numéro 17306194')
                .replace('+44 20 1234 5678', OFFICIAL_PHONE)
                .replace(/جمعية خيرية مسجلة|جمعية مسجلة غير ربحية|منظمة غير ربحية(?:\s*\(NGO\))?|مؤسسة غير ربحية|منظمة إنسانية مسجلة ومستقلة/g, 'جهة تعمل في مشاريع إنسانية وإغاثية')
                .replace(/registered (?:independent )?(?:charit(?:y|able association)|NGO)|non[- ]profit (?:organisation|organization|foundation)/gi, 'humanitarian relief organisation')
                .replace(/ONG indépendante enregistrée|ONG Indépendante Enregistrée|ONG Non Lucrative/gi, 'Organisation humanitaire')
                .replace(/Kayıtlı Bağımsız STK|Kayıtlı STK \/ Vakıf/g, 'İnsani yardım projeleri');
        return text as T;
    }
    if (Array.isArray(value))
        return value.map(item => normalizePublicContact(item, email)) as T;
    if (value && typeof value === "object")
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizePublicContact(item, email)])) as T;
    return value;
}
export const launchCopy: Record<string, {
    status: string;
    contact: string;
    response: string;
}> = {
    ar: { status: "قنوات التبرع لم تُفتح بعد. سنعلن بدء استقبال التبرعات عند جاهزيتها.", contact: "البريد الرسمي الوحيد لجميع الاستفسارات هو info@forrelief.org. يرجى توضيح موضوع الرسالة، مثل شكوى أو خصوصية أو شراكة.", response: "نرد على الرسائل الواردة إلى info@forrelief.org خلال 24 ساعة. قد تتطلب معالجة الطلب أو حله وقتاً إضافياً بحسب طبيعته." },
    en: { status: "Donation channels are not open yet. We will announce when donations can be accepted.", contact: "Our only official email for all enquiries is info@forrelief.org. Please state the topic in the subject, such as a complaint, privacy or a partnership.", response: "We reply to messages sent to info@forrelief.org within 24 hours. Reviewing or resolving a request may take longer depending on its nature." },
    fr: { status: "Les canaux de dons ne sont pas encore ouverts. Leur ouverture sera annoncée lorsqu’ils seront prêts.", contact: "Notre seule adresse officielle pour toutes les demandes est info@forrelief.org. Précisez le sujet : réclamation, confidentialité ou partenariat, par exemple.", response: "Nous répondons aux messages envoyés à info@forrelief.org sous 24 heures. Le traitement ou la résolution peut demander davantage de temps selon la demande." },
    tr: { status: "Bağış kanalları henüz açılmadı. Bağış kabulüne hazır olduğumuzda duyuru yapacağız.", contact: "Tüm sorular için tek resmî e-posta adresimiz info@forrelief.org. Konu satırında şikâyet, gizlilik veya ortaklık gibi talebinizi belirtin.", response: "info@forrelief.org adresine gelen mesajlara 24 saat içinde yanıt veriyoruz. Talebin incelenmesi veya çözülmesi, niteliğine göre daha uzun sürebilir." },
};
