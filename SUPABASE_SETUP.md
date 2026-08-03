# ربط المشروع بـ Supabase (عبر تكامل Netlify الرسمي — بدون Prisma)

هذا المشروع **لا يستخدم Prisma أو أي ORM**. كل الوصول لقاعدة البيانات يتم مباشرة عبر **Supabase JS SDK** (`@supabase/supabase-js`) باستخدام المتغيرات التي يوفرها تكامل Netlify ↔ Supabase تلقائياً:

```
SUPABASE_DATABASE_URL      -> رابط API الخاص بالمشروع (https://xxx.supabase.co)
SUPABASE_ANON_KEY          -> غير مستخدم في هذا المشروع
SUPABASE_SERVICE_ROLE_KEY  -> يُستخدم من السيرفر فقط (Full access, يتجاوز RLS)
SUPABASE_JWT_SECRET        -> يُستخدم لتوقيع/فحص جلسة تسجيل دخول الأدمن
```

✅ **لا حاجة لإضافة `DATABASE_URL` أو `JWT_SECRET` أو أي متغير غير موجود في التكامل** — كل شيء يعتمد على المتغيرات الأربعة أعلاه فقط، وهي موجودة تلقائياً بعد تفعيل التكامل.

ملف الاتصال: `lib/supabase.ts` — يستخدم `SUPABASE_DATABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` لإنشاء عميل Supabase من السيرفر.

---

## 1. إنشاء الجداول + المحتوى التجريبي + حساب الأدمن

كل الجداول معرّفة كـ SQL خام (بدون Prisma) في `supabase/schema.sql` و `supabase/seed.sql`.

1. **Supabase Dashboard → SQL Editor → New query** → الصق محتوى `supabase/schema.sql` كاملاً → **Run**.
   ينشئ كل الجداول (`Page`, `Campaign`, `CampaignUpdate`, `Donation`, `User`, `SiteSettings`, `NewsPost`, `Subscriber`) والعلاقات والـ Enums.

2. **New query** جديد → الصق محتوى `supabase/seed.sql` كاملاً → **Run**.
   يضيف: إعدادات الموقع، 5 حملات تجريبية، الصفحة الرئيسية وباقي الصفحات بكل أقسامها، أخبار تجريبية، **وحساب أدمن جاهز**:
   ```
   Email:    admin@4relief.org
   Password: Relief@2026!
   ```
   ⚠️ **غيّر هذا الباسورد بعد أول تسجيل دخول.**

### توليد `seed.sql` بباسورد أدمن مختلف من البداية

```bash
npm install
ADMIN_EMAIL=admin@4relief.org ADMIN_PASSWORD=باسوردك npm run export-seed-sql > supabase/seed.sql
```

ثم الصق الناتج الجديد في SQL Editor وشغّله.

---

## 2. متغيرات Netlify المطلوبة

تأكد إن **تكامل Supabase مفعّل** في: Netlify → Project configuration → **Integrations → Supabase**. عند تفعيله تُضاف هذه المتغيرات تلقائياً (مثل ما ظهر في حسابك):

```
SUPABASE_ANON_KEY
SUPABASE_DATABASE_URL
SUPABASE_JWT_SECRET
SUPABASE_SERVICE_ROLE_KEY
```

لا حاجة لإضافة أي متغير آخر لتشغيل الموقع وتسجيل دخول الأدمن.

### متغيرات اختيارية (Stripe / PayPal / اسم الموقع)

```
NEXT_PUBLIC_SITE_URL = https://forrelief.netlify.app
NEXT_PUBLIC_SITE_NAME = 4Relief Humanitarian Foundation

STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...

PAYPAL_CLIENT_ID = ...
PAYPAL_CLIENT_SECRET = ...
PAYPAL_MODE = sandbox
```

تقدر تسيبهم فاضيين مؤقتاً — الموقع يعمل، وفقط صفحة التبرع تظهر رسالة واضحة عند الدفع قبل إضافة المفاتيح.

---

## 5. إشعارات واتساب عبر WABEK (اختياري)

لتفعيل إشعار الأدمن على واتساب عند كل تبرع جديد أو رسالة تواصل، أضف في Netlify:

```
WABEK_API_URL = https://app.waabek.com      (رابط حساب WABEK بتاعك)
WABEK_API_KEY = مفتاح API من حسابك على WABEK
WABEK_ADMIN_PHONE = 201234567890             (رقم الأدمن، أرقام فقط بدون +)
```

لو نقطة الإرسال في حسابك مختلفة عن `/api/v1/messages/send` (الافتراضي)، أضف:
```
WABEK_SEND_PATH = /المسار-الصحيح
```

لتفعيل **زر واتساب عائم** في الموقع: من لوحة التحكم → الإعدادات → أضف رقم واتساب في خانة "WhatsApp" — يظهر الزر تلقائياً بدون أي متغير بيئة إضافي.

---

## 6. Google Analytics (اختياري)

```
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
```

---

## 3. إعادة النشر

بعد تشغيل `schema.sql` + `seed.sql` والتأكد من تكامل Supabase مفعّل:

**Deploys → Trigger deploy → Clear cache and deploy site**

---

## 4. التحقق

1. الموقع يعرض الصفحة الرئيسية بالمحتوى التجريبي.
2. `/admin/login` يعمل بـ `admin@4relief.org` / `Relief@2026!` (أو بياناتك المخصصة).
3. `/admin/pages` → فتح المحرر، التعديل، الحفظ يعمل بدون أخطاء.

---

## مشاكل شائعة

| المشكلة | السبب | الحل |
|---|---|---|
| "Supabase is not configured" | تكامل Supabase غير مفعّل في Netlify، أو المتغيرات غير ظاهرة | فعّل Integrations → Supabase، تأكد من ظهور المتغيرات الأربعة، وأعد النشر |
| تسجيل الدخول لا يعمل | `seed.sql` لم يُشغّل (لا يوجد صف في جدول `User`) | شغّل `supabase/seed.sql` في SQL Editor |
| الموقع بدون محتوى | `schema.sql`/`seed.sql` لم يُشغّلا | شغّلهم بالترتيب في SQL Editor |
| خطأ صلاحيات (RLS) | الكود يستخدم `SUPABASE_SERVICE_ROLE_KEY` (يتجاوز RLS) — تأكد إنه موجود في env vars | تأكد من ظهور `SUPABASE_SERVICE_ROLE_KEY` في Netlify Environment variables |
