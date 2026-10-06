type Message = [string, string, string, string];
const errors: Message[] = [
    ["البريد وكلمة المرور مطلوبان", "Email and password are required", "L’e-mail et le mot de passe sont requis", "E-posta ve şifre gereklidir"],
    ["البريد الإلكتروني أو كلمة المرور غير صحيحة", "Incorrect email or password", "E-mail ou mot de passe incorrect", "E-posta veya şifre yanlış"],
    ["استخدم صفحة تسجيل دخول الأدمن", "Please use the admin login page", "Utilisez la page de connexion administrateur", "Yönetici giriş sayfasını kullanın"],
    ["يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني أولاً", "Please verify your email using the link we sent you", "Vérifiez votre e-mail avec le lien que nous vous avons envoyé", "Gönderdiğimiz bağlantı ile e-postanızı doğrulayın"],
    ["جميع الحقول مطلوبة", "All fields are required", "Tous les champs sont requis", "Tüm alanlar gereklidir"],
    ["كلمة المرور 8 أحرف على الأقل", "Password must contain at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères", "Şifre en az 8 karakter olmalıdır"],
    ["هذا البريد الإلكتروني مسجل مسبقاً", "This email address is already registered", "Cette adresse e-mail est déjà inscrite", "Bu e-posta adresi zaten kayıtlı"],
    ["حدث خطأ في التسجيل", "Registration failed. Please try again", "L’inscription a échoué. Réessayez", "Kayıt başarısız oldu. Tekrar deneyin"],
    ["حدث خطأ في السيرفر، يرجى المحاولة لاحقاً", "The server is unavailable. Please try again later", "Le serveur est indisponible. Réessayez plus tard", "Sunucuya ulaşılamıyor. Daha sonra tekrar deneyin"],
    ["حدث خطأ غير متوقع", "An unexpected error occurred", "Une erreur inattendue s’est produite", "Beklenmeyen bir hata oluştu"],
    ["حدث خطأ أثناء الحفظ", "Unable to save changes", "Impossible d’enregistrer les modifications", "Değişiklikler kaydedilemedi"],
    ["حدث خطأ في الاتصال بالخادم", "Unable to connect to the server", "Impossible de se connecter au serveur", "Sunucuya bağlanılamadı"],
    ["Current password required", "Current password is required", "Le mot de passe actuel est requis", "Mevcut şifre gereklidir"],
    ["Current password is incorrect", "Current password is incorrect", "Le mot de passe actuel est incorrect", "Mevcut şifre yanlış"],
    ["Invalid email or password", "Incorrect email or password", "E-mail ou mot de passe incorrect", "E-posta veya şifre yanlış"],
    ["Password too short", "Password must contain at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères", "Şifre en az 8 karakter olmalıdır"],
];
const aliases: Record<string, Message> = {
    "Invalid email or password": ["البريد الإلكتروني أو كلمة المرور غير صحيحة", "Incorrect email or password", "E-mail ou mot de passe incorrect", "E-posta veya şifre yanlış"],
    "رابط غير صالح": ["رابط غير صالح", "Invalid link", "Lien invalide", "Geçersiz bağlantı"],
    "انتهت صلاحية الرابط — اطلب رابطاً جديداً": ["انتهت صلاحية الرابط — اطلب رابطاً جديداً", "This link has expired. Request a new one", "Ce lien a expiré. Demandez-en un nouveau", "Bu bağlantının süresi doldu. Yeni bir bağlantı isteyin"],
    "INVALID_TOKEN": ["رابط غير صالح", "Invalid link", "Lien invalide", "Geçersiz bağlantı"],
    "TOKEN_EXPIRED": ["انتهت صلاحية الرابط", "This link has expired", "Ce lien a expiré", "Bu bağlantının süresi doldu"],
    "Unauthorized": ["يرجى تسجيل الدخول", "Please sign in", "Veuillez vous connecter", "Lütfen giriş yapın"],
    "Missing fields": ["جميع الحقول مطلوبة", "All fields are required", "Tous les champs sont requis", "Tüm alanlar gereklidir"],
    "Current password required": ["كلمة المرور الحالية مطلوبة", "Current password is required", "Le mot de passe actuel est requis", "Mevcut şifre gereklidir"],
    "Current password is incorrect": ["كلمة المرور الحالية غير صحيحة", "Current password is incorrect", "Le mot de passe actuel est incorrect", "Mevcut şifre yanlış"],
    "Password too short": ["كلمة المرور 8 أحرف على الأقل", "Password must contain at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères", "Şifre en az 8 karakter olmalıdır"],
    "Password must be at least 8 characters": ["كلمة المرور 8 أحرف على الأقل", "Password must contain at least 8 characters", "Le mot de passe doit contenir au moins 8 caractères", "Şifre en az 8 karakter olmalıdır"],
    "Password must contain at least one letter and one number": ["يجب أن تحتوي كلمة المرور على حرف ورقم على الأقل", "Password must contain at least one letter and one number", "Le mot de passe doit contenir au moins une lettre et un chiffre", "Şifre en az bir harf ve bir rakam içermelidir"],
    "Authentication is temporarily unavailable.": ["تسجيل الدخول غير متاح مؤقتًا", "Authentication is temporarily unavailable.", "La connexion est temporairement indisponible.", "Giriş geçici olarak kullanılamıyor."],
};

export function publicErrorMessage(message: unknown, locale: string): string {
    const text = typeof message === "string" ? message : "";
    const index = locale === "ar" ? 0 : locale === "fr" ? 2 : locale === "tr" ? 3 : 1;
    const entry = aliases[text] || errors.find(values => values.includes(text));
    if (entry) return entry[index];
    if (text && (locale === "ar" || !/[\u0621-\u064a]/.test(text))) return text;
    return ["حدث خطأ. يرجى المحاولة مجددًا.", "An error occurred. Please try again.", "Une erreur s’est produite. Réessayez.", "Bir hata oluştu. Tekrar deneyin."][index];
}
