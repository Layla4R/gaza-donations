export function donationAvailabilityText(locale: string, enabled: boolean): string {
  const copy: Record<string, string> = enabled ? {
    ar: 'يمكنك التبرع باستخدام وسائل الدفع المتاحة في صفحة التبرع. راجع المبلغ والعملة ودورية الدفع وسياسة الاسترداد قبل التأكيد.',
    en: 'You can donate using the payment methods available on the donation page. Review the amount, currency, payment frequency and refund policy before confirming.',
    fr: 'Vous pouvez faire un don avec les moyens disponibles sur la page de don. Vérifiez le montant, la devise, la fréquence et la politique de remboursement.',
    tr: 'Bağış sayfasındaki mevcut ödeme yöntemlerini kullanabilirsiniz. Onaylamadan önce tutarı, para birimini, sıklığı ve iade politikasını inceleyin.',
  } : {
    ar: 'الدفع الإلكتروني غير متاح حالياً. للاستفسار عن التبرعات، تواصل مع info@forrelief.org. وجود نموذج التبرع لا يعني نجاح الدفع أو استلام المال.',
    en: 'Online payments are currently unavailable. For donation enquiries, contact info@forrelief.org. A donation form does not confirm payment or receipt of funds.',
    fr: 'Les paiements en ligne sont actuellement indisponibles. Pour toute question sur les dons, contactez info@forrelief.org.',
    tr: 'Çevrimiçi ödemeler şu anda kullanılamıyor. Bağış soruları için info@forrelief.org ile iletişime geçin.',
  };
  return copy[locale] || copy.en;
}
