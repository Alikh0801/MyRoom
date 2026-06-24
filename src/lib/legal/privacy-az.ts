import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_JURISDICTION,
} from "@/lib/legal/constants";
import type { LegalSection } from "@/lib/legal/types";

export const PRIVACY_INTRO = `${LEGAL_ENTITY_NAME} (“Platforma”, “biz”) istifadəçilərin şəxsi məlumatlarının qorunmasına ciddi yanaşır. Bu Məxfilik Siyasəti Platformadan istifadə, qeydiyyat, elan yerləşdirmə və əlaqəli xidmətlər çərçivəsində hansı məlumatların toplandığını, necə emal edildiyini, kimlərlə paylaşıldığını və hüquqlarınızı izah edir. Siyasət ${LEGAL_JURISDICTION} qanunvericiliyinə, o cümlədən şəxsi məlumatların qorunması ilə bağlı tələblərə uyğun hazırlanmışdır.`;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "operator",
    title: "1. Məlumat operatoru",
    paragraphs: [
      `Şəxsi məlumatların operatoru ${LEGAL_ENTITY_NAME} platformasıdır.`,
      `Məxfilik və şəxsi məlumatlarla bağlı sorğular üçün: ${LEGAL_CONTACT_EMAIL}`,
    ],
  },
  {
    id: "toplanan",
    title: "2. Toplanan məlumat kateqoriyaları",
    paragraphs: [
      "Platformanın xidmətindən asılı olaraq aşağıdakı məlumatlar toplana bilər:",
    ],
    list: [
      "Şəxsiyyət və əlaqə məlumatları: ad, soyad, email, telefon, WhatsApp nömrəsi.",
      "Hesab məlumatları: giriş emaili, şifrənin şifrələnmiş forması, qeydiyyat tarixi, email təsdiqi statusu.",
      "Elan məlumatları: başlıq, təsvir, qiymət, ünvan, rayon, şəhər, koordinatlar (lat/lng), şəkillər, kateqoriya, imkanlar, otaq məlumatları.",
      "Texniki məlumatlar: IP ünvanı, brauzer növü, cihaz məlumatı, sessiya identifikatorları, cookie faylları.",
      "Təhlükəsizlik məlumatları: CAPTCHA yoxlama nəticələri, rate limit qeydləri, fırıldaqçılığın qarşısının alınması üçün loglar.",
      "İstifadə statistikası: səhifə baxışları, axtarış sorğuları, elan baxış sayı (mövcud funksionallıq daxilində).",
      "İstifadəçi əlaqələri: dəstək və şikayət müraciətləri, moderasiya qeydləri.",
    ],
  },
  {
    id: "meqsed",
    title: "3. Emal məqsədləri və hüquqi əsaslar",
    paragraphs: [
      "Şəxsi məlumatlar aşağıdakı məqsədlərlə emal olunur:",
    ],
    list: [
      "Hesab yaratmaq, identifikasiya etmək və Platformaya giriş təmin etmək.",
      "Elanların yerləşdirilməsi, moderasiyası, dərc edilməsi və axtarış funksiyasının işlədilməsi.",
      "İstifadəçilər arasında əlaqənin təşkili (məsələn, WhatsApp əlaqə düyməsi).",
      "Platformanın təhlükəsizliyini, bütövlüyünü və qanuni fəaliyyətini qorumaq.",
      "Qanuni öhdəliklərin yerinə yetirilməsi və hüquq-mühafizə orqanlarının qanuni sorğularına cavab verilməsi.",
      "Xidmətin təkmilləşdirilməsi, texniki nasazlıqların aradan qaldırılması və statistik təhlil.",
      "İstifadəçiyə xidmətlə bağlı mühüm bildirişlər göndərmək (məsələn, email təsdiqi, təhlükəsizlik xəbərdarlığı).",
    ],
    footerParagraphs: [
      "Hüquqi əsaslar: istifadəçinin açıq razılığı, xidmət müqaviləsinin icrası, qanuni maraqlar (təhlükəsizlik, fırıldaqçılığın qarşısının alınması) və qanunvericiliklə nəzərdə tutulmuş öhdəliklər.",
    ],
  },
  {
    id: "uchuncu-teref",
    title: "4. Üçüncü tərəflərlə paylaşım",
    paragraphs: [
      "Məlumatlar xidmətin göstərilməsi üçün etibarlı texniki tərəfdaşlarla paylaşıla bilər. Hazırda və ya tipik olaraq aşağıdakı kateqoriyalar istifadə olunur:",
    ],
    list: [
      "Hostinq və infrastruktur provayderləri (məsələn, Vercel).",
      "Verilənlər bazası və autentifikasiya xidmətləri (məsələn, Supabase).",
      "Fayl saxlama xidmətləri (məsələn, AWS S3 və ya ekvivalent obyekt saxlama).",
      "Təhlükəsizlik xidmətləri: CAPTCHA (Cloudflare Turnstile), rate limiting (Upstash Redis).",
      "Xəritə xidmətləri: OpenStreetMap tile serverləri (koordinat göstərilməsi üçün).",
    ],
    footerParagraphs: [
      "Bu tərəfdaşlar məlumatları yalnız müqavilə və təhlükəsizlik tələblərinə uyğun emal edirlər. Şəxsi məlumatlar reklam şəbəkələrinə satılmır.",
      "Qanuni tələb, məhkəmə qərarı və ya dövlət orqanlarının səlahiyyətli sorğusu olduqda məlumatlar hüquqi çərçivədə açıqlana bilər.",
      "İctimai elan səhifələrində elan sahibinin seçdiyi əlaqə məlumatları (məsələn, WhatsApp) digər istifadəçilər tərəfindən görünə bilər.",
    ],
  },
  {
    id: "saxlama",
    title: "5. Saxlama müddəti",
    paragraphs: [
      "Şəxsi məlumatlar yalnız yuxarıda göstərilən məqsədlər üçün lazım olan müddət ərzində saxlanılır.",
      "Hesab aktiv olduqda məlumatlar xidmətin göstərilməsi üçün saxlanılır. Hesab bağlandıqda və ya silindikdə məlumatlar mümkün qədər tez silinir və ya anonimləşdirilir, qanunla saxlama tələbi olan hallar istisna olmaqla.",
      "Təhlükəsizlik logları və moderasiya qeydləri mübahisələrin həlli və qanuni öhdəliklər üçün məhdud müddət saxlanıla bilər.",
      "Yedəkləmə (backup) sistemlərində məlumatlar texniki dövr ərzində qalıq surət kimi mövcud ola bilər.",
    ],
  },
  {
    id: "huquqlar",
    title: "6. İstifadəçi hüquqları",
    paragraphs: [
      "Qanunvericiliyin icazə verdiyi həddə siz aşağıdakı hüquqlara maliksiniz:",
    ],
    list: [
      "Şəxsi məlumatlarınızın emal edilib-edilmədiyi barədə məlumat almaq.",
      "Məlumatlara çıxış tələb etmək və düzəliş və ya yenilənmə istəmək.",
      "Qanunsuz emal olduqda silinmə və ya məhdudlaşdırma tələb etmək.",
      "Razılığı geri götürmək (razılığa əsaslanan emal üçün).",
      "Qanuna uyğun olaraq məlumatların portativliyini tələb etmək.",
      "Qanuni əsaslar olduqda emala etiraz etmək.",
    ],
    footerParagraphs: [
      `Hüquqlarınızı həyata keçirmək üçün ${LEGAL_CONTACT_EMAIL} ünvanına müraciət edə bilərsiniz. Sorğunuz şəxsiyyətinizi təsdiq etməyimiz üçün əlavə məlumat tələb oluna bilər. Cavab qanuni müddətlərdə verilir.`,
    ],
  },
  {
    id: "tehlukesizlik",
    title: "7. Təhlükəsizlik tədbirləri",
    paragraphs: [
      "Şəxsi məlumatların qorunması üçün texniki və təşkilati tədbirlər görülür: HTTPS şifrələmə, giriş autentifikasiyası, server tərəfi giriş nəzarəti (RLS), rate limiting, CAPTCHA, məhdud admin girişi və s.",
      "Heç bir onlayn sistem tam təhlükəsizlik zəmanəti verə bilməz. İstifadəçi də öz şifrəsini qorumaq və hesab məlumatlarını üçüncü şəxslərlə paylaşmamaq öhdəliyini daşıyır.",
      "Şəxsi məlumatların pozulması (data breach) halında qanunun tələb etdiyi hallarda istifadəçilər və səlahiyyətli orqanlar məlumatlandırılır.",
    ],
  },
  {
    id: "cookie",
    title: "8. Cookie və oxşar texnologiyalar",
    paragraphs: [
      "Platforma sessiyanın saxlanması, autentifikasiya, təhlükəsizlik və əsas funksionallıq üçün zəruri cookie və local storage texnologiyalarından istifadə edə bilər.",
      "Analitik və ya marketinq cookie-ləri istifadə edildikdə bu barədə ayrıca məlumat verilə və lazım gəldikdə razılıq alınacaq.",
      "Brauzer parametrlərindən cookie-ləri məhdudlaşdıra bilərsiniz; lakin bu, Platformanın bəzi funksiyalarının işləməməsinə səbəb ola bilər.",
    ],
  },
  {
    id: "usaq",
    title: "9. Uşaqların məlumatları",
    paragraphs: [
      "Platforma 18 yaşdan aşağı şəxslər üçün nəzərdə tutulmayıb və bilərəkdən uşaqlardan şəxsi məlumat toplamır. Belə məlumat aşkar edildikdə silinəcək və hesab bağlana bilər.",
    ],
  },
  {
    id: "beynelxalq",
    title: "10. Beynəlxalq ötürmə",
    paragraphs: [
      "Texniki tərəfdaşların serverləri xarici ölkələrdə yerləşə bilər. Belə ötürmələr yalnız müvafiq müqavilə və təhlükəsizlik tədbirləri ilə həyata keçirilir.",
    ],
  },
  {
    id: "deyisiklik",
    title: "11. Siyasətə dəyişikliklər",
    paragraphs: [
      "Bu Məxfilik Siyasəti vaxtaşırı yenilənə bilər. Yenilənmiş versiya Platformada dərc edilir; əhəmiyyətli dəyişikliklər barədə qeydiyyatlı istifadəçilərə bildiriş göndərilə bilər.",
      "Dərc tarixi səhifənin yuxarısında göstərilir. Dəyişikliklərdən sonra Platformadan istifadəni davam etdirməyiniz yenilənmiş Siyasəti qəbul etdiyiniz mənasına gəlir.",
    ],
  },
  {
    id: "elaqe",
    title: "12. Əlaqə və şikayətlər",
    paragraphs: [
      `Məxfiliklə bağlı sual və müraciətlər: ${LEGAL_CONTACT_EMAIL}`,
      "Cavabdan razı qalmadıqda qanunvericiliklə müəyyən edilmiş qaydada müvafiq dövlət orqanına müraciət hüququnuz var.",
    ],
  },
];
