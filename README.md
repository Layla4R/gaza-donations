# 4Relief Humanitarian Foundation — Donations Platform

منصة تبرعات (Next.js 14 + TypeScript + Supabase) مع محرر صفحات مرئي شبيه بـ Wix، تكامل Stripe و PayPal، ولوحة تحكم كاملة.

## المزايا

- **محرر صفحات مرئي (Wix-like)**: إنشاء/حذف/إعادة ترتيب الصفحات، نشر/إخفاء، إضافة عناصر بالسحب والإفلات (Hero, إحصائيات, نص, صورة+نص, أزرار تبرع, شبكة حملات, معرض صور, قصص, أسئلة شائعة, CTA, نموذج تواصل, نشرة بريدية, فراغ), تعديل كل عنصر من لوحة جانبية (نصوص/صور/ألوان/قوائم), حفظ تلقائي (autosave), تراجع/إعادة (undo/redo), معاينة جوال/كمبيوتر.
- **نظام تبرعات**: صفحة تبرع موحدة (مبلغ، تكرار شهري/مرة واحدة، بيانات المتبرع، رسالة، تبرع مجهول).
- **Stripe**: Checkout Session (دفعة واحدة أو اشتراك شهري) + Webhook لتأكيد الدفع وتحديث إجمالي الحملة.
- **PayPal**: إنشاء طلب (Order) + التقاط الدفع (Capture) وتحديث إجمالي الحملة.
- **إدارة الحملات**: CRUD كامل (عنوان، وصف، صورة، هدف مالي، تصنيف، تمييز، تفعيل).
- **التبرعات**: سجل كامل لكل العمليات مع الحالة (قيد الانتظار/مكتملة/فاشلة/مسترجعة).
- **لوحة التحكم**: نظرة عامة + إحصائيات + إعدادات الموقع (الشعار، التواصل، روابط التواصل الاجتماعي، تفعيل/تعطيل بوابات الدفع).
- **محتوى تجريبي جاهز**: صفحة رئيسية كاملة، صفحات (من نحن / الشفافية / اتصل بنا / الخصوصية)، 5 حملات تبرع وهمية، أخبار.
- **تصنيفات الحملات**: شارة تصنيف (غذاء/طبي/مأوى/تعليم/مياه/عام) بأيقونة على كل بطاقة حملة.
- **إشعارات واتساب (WABEK)**: إشعار فوري للأدمن عبر [WABEK](https://waabek.com) عند كل تبرع جديد مكتمل (Stripe/PayPal) وعند كل رسالة تواصل جديدة. زر واتساب عائم في الموقع يفتح محادثة على `whatsappNumber` من الإعدادات.
- **تصدير CSV**: زر "تصدير CSV" في صفحة التبرعات بلوحة التحكم يصدّر كل التبرعات بصيغة متوافقة مع Excel (عربي).
- **SEO**: `sitemap.xml` و `robots.txt` تلقائيين، Open Graph / Twitter meta tags، أيقونة الموقع من شعار 4Relief.
- **Google Analytics**: يُفعَّل تلقائياً بإضافة `NEXT_PUBLIC_GA_ID`.

## البنية التقنية

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + TailwindCSS (RTL عربي).
- **Backend**: Next.js API Routes (`/app/api`), منطق منفصل في `/lib`.
- **Database**: PostgreSQL عبر **Supabase** — بدون Prisma أو أي ORM. الوصول مباشرة عبر `@supabase/supabase-js` (`lib/supabase.ts`). الجداول معرّفة كـ SQL خام في `supabase/schema.sql`.
- **Auth**: مصادقة أدمن عبر JWT (jose) + كوكي httpOnly، موقّعة بـ `SUPABASE_JWT_SECRET`. بيانات الأدمن (بريد + باسورد مشفّر bcrypt) في جدول `User` على Supabase.
- **Payments**: Stripe Checkout + Webhooks, PayPal Orders SDK.

## الإعداد

كل التفاصيل (المتغيرات المطلوبة، تشغيل `schema.sql`/`seed.sql`، حساب الأدمن) موجودة في **[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)** — اقرأه أولاً.

ملخص سريع:

1. فعّل تكامل **Netlify ↔ Supabase** (Project configuration → Integrations → Supabase). هذا يضيف تلقائياً:
   ```
   SUPABASE_DATABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_JWT_SECRET
   ```
2. في **Supabase SQL Editor**، شغّل `supabase/schema.sql` ثم `supabase/seed.sql` (يضيف محتوى تجريبي + حساب أدمن جاهز: `admin@4relief.org` / `Relief@2026!`).
3. (اختياري) أضف `STRIPE_*`, `PAYPAL_*`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`.
4. **Trigger deploy**.

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # واملأ القيم من Netlify -> Environment variables
npm run dev
```

- الموقع: http://localhost:3000
- لوحة التحكم: http://localhost:3000/admin

## إعداد Stripe Webhook

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

في الإنتاج: أضف Endpoint في لوحة Stripe يشير إلى `https://your-domain.com/api/webhooks/stripe` مع الحدث `checkout.session.completed`.

## هيكل المشروع (مختصر)

```
app/
  page.tsx                 # الصفحة الرئيسية (slug=home)
  [slug]/page.tsx          # صفحات ديناميكية منشورة
  campaigns/                # صفحة الحملات + تفاصيل الحملة
  donate/                   # صفحة التبرع + نجاح/إلغاء
  admin/
    login/                  # تسجيل دخول الأدمن
    (panel)/
      page.tsx              # لوحة المعلومات
      pages/                # إدارة الصفحات + المحرر المرئي
      campaigns/            # إدارة الحملات
      donations/            # سجل التبرعات
      settings/             # إعدادات الموقع
  api/
    admin/                  # CRUD محمي بالأدمن (pages, campaigns, settings, auth)
    donations/checkout      # Stripe Checkout
    donations/paypal        # PayPal Orders (create + capture)
    webhooks/stripe         # Stripe webhook handler
components/
  blocks/                   # عناصر العرض العامة (Hero, Stats, ...)
  editor/                   # محرر الصفحات المرئي (Canvas, Inspector, BlockLibrary)
  admin/                    # عناصر لوحة التحكم
  site/                     # الهيدر والفوتر
  icons.tsx                 # مجموعة أيقونات SVG مشتركة
lib/
  supabase.ts               # عميل Supabase من السيرفر (Service Role)
  auth.ts / stripe.ts / paypal.ts / format.ts / pageData.ts / blocks.ts
supabase/
  schema.sql                # كامل مخطط قاعدة البيانات (SQL خام)
  seed.sql                  # محتوى تجريبي + حساب أدمن
scripts/
  export-seed-sql.ts        # توليد seed.sql بباسورد أدمن مخصص
```

## ملاحظات وتوسعات مستقبلية (Phase 2)

- حسابات المتبرعين (تسجيل دخول، سجل التبرعات، إيصالات قابلة للتحميل PDF).
- إدارة المستخدمين والأدوار من لوحة التحكم (Admin/Editor/Donor).
- تصدير التقارير (Excel/CSV) للتبرعات والحملات.
- تكامل واتساب للإشعارات.
- Google Analytics وتحسينات SEO متقدمة.
- معالجة الدفعات الشهرية المتكررة عبر PayPal (مدعومة حالياً عبر Stripe فقط).
