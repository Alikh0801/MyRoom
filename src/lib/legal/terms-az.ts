import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_JURISDICTION,
} from "@/lib/legal/constants";
import type { LegalSection } from "@/lib/legal/types";

export const TERMS_INTRO = `${LEGAL_ENTITY_NAME} (“Platforma”, “biz”) Azərbaycan Respublikası ərazisində qısamüddətli istirahət və günlük icarə elanlarının yerləşdirilməsi və axtarışı üçün onlayn bazar yeri xidməti göstərir. Bu İstifadəçi Şərtləri və Qaydalar (“Şərtlər”) Platformadan istifadə, qeydiyyat, elan yerləşdirmə və digər xidmətlərlə bağlı hüquqi münasibətləri tənzimləyir. Platformadan istifadə etməklə, qeydiyyatdan keçməklə və/və ya elan yerləşdirməklə siz bu Şərtləri oxuduğunuzu, başa düşdüyünüzü və qanuni qüvvədə razı olduğunuzu təsdiq edirsiniz.`;

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "terifler",
    title: "1. Təriflər",
    paragraphs: [
      "Bu Şərtlərdə aşağıdakı terminlər istifadə olunur:",
    ],
    list: [
      "Platforma — MyRoom veb-saytı, mobil interfeysi və əlaqəli texniki infrastruktur.",
      "İstifadəçi — Platformaya daxil olan, qeydiyyatdan keçən və ya Platformadan istifadə edən hər bir fiziki və ya hüquqi şəxs.",
      "Elan sahibi (Host) — icarəyə verilən mülk və ya xidmət barədə elan yerləşdirən istifadəçi.",
      "Qonaq (Guest) — elanları baxan, axtaran və ya elan sahibi ilə əlaqə saxlayan istifadəçi.",
      "Elan — mülk, otaq və ya xidmət haqqında Platformada dərc olunan mətn, şəkil, qiymət, ünvan və digər məlumatlar.",
      "Məzmun — istifadəçilər tərəfindən Platformaya yüklənən və ya dərc edilən hər cür məlumat, mətn, şəkil, koordinat və əlaqə məlumatı.",
      "Şəxsi məlumat — müəyyən və ya müəyyən oluna bilən fiziki şəxsə aid hər hansı informasiya.",
    ],
  },
  {
    id: "xidmet",
    title: "2. Platformanın xidməti və hüquqi statusu",
    paragraphs: [
      "Platforma elanların yerləşdirilməsi, moderasiyası, axtarışı və ictimaiyyətə təqdim olunması üçün texniki vasitəçi (intermediator) xidməti göstərir. Platforma icarə müqaviləsinin tərəfi deyil; host ilə qonaq arasında bağlanan hüquqi münasibətlərə birbaşa tərəf sayılmır.",
      "Platforma ödəniş qəbul edən, rezervasiya sistemi işlədən, sığorta verən və ya turizm operatoru kimi fəaliyyət göstərmir (əgər ayrıca yazılı razılaşma olmasa). Qiymət, mövcudluq, ödəniş, qaydalar və xidmətin faktiki göstərilməsi birbaşa elan sahibi ilə qonaq arasında razılaşılır.",
      "Platforma elanların dəqiqliyinə, qanuniliyinə, təhlükəsizliyinə və ya uyğunluğuna zəmanət vermir. Elanların məzmununa görə əsas məsuliyyət elan sahibinə düşür.",
    ],
  },
  {
    id: "qebul",
    title: "3. Şərtlərin qəbulu və dəyişdirilməsi",
    paragraphs: [
      "Platformadan istifadə, qeydiyyat formasının doldurulması, “İstifadəçi şərtləri və Məxfilik siyasəti ilə razıyam” seçiminin aktiv edilməsi və/və ya elan göndərilməsi bu Şərtlərin tam həcmdə qəbul edildiyini bildirir.",
      "Biz Şərtləri, Platformanın funksionallığını və qaydalarını istənilən vaxt dəyişdirmək hüququnu özümüzdə saxlayırıq. Dəyişikliklər Platformada dərc edildiyi andan qüvvəyə minir. Əhəmiyyətli dəyişikliklər barədə mümkün olduqda qeydiyyatlı istifadəçilərə email və ya Platforma vasitəsilə məlumat verilə bilər.",
      "Dəyişikliklərdən sonra Platformadan istifadəni davam etdirməyiniz yenilənmiş Şərtləri qəbul etdiyiniz mənasına gəlir. Əgər dəyişikliklərlə razı deyilsinizsə, hesabınızı bağlamalı və Platformadan istifadəni dayandırmalısınız.",
    ],
  },
  {
    id: "qalify",
    title: "4. İstifadəçinin hüquqi qabiliyyəti və hesab",
    paragraphs: [
      "Platformadan istifadə üçün siz ən azı 18 yaşınız tamam olmuş fiziki şəxs olmalı və ya hüquqi şəxs adından səlahiyyətli nümayəndə olmalısınız. Qeydiyyat zamanı verdiyiniz məlumatların düzgün, tam və aktual olmasına görə məsuliyyət daşıyırsınız.",
      "Hesab məlumatlarınızın (email, şifrə) məxfiliyini qorumaq sizin öhdəliyinizdir. Hesabınız altında həyata keçirilən bütün fəaliyyətlərə görə məsuliyyət daşıyırsınız. İcazəsiz girişdən şübhələndikdə dərhal bizə məlumat verməlisiniz.",
      "Bir istifadəçiyə bir hesab prinsipi tətbiq olunur. Saxta şəxsiyyət, təkrarlanan hesablar və ya üçüncü şəxslərin məlumatlarından icazəsiz istifadə qadağandır.",
      "Platforma qaydaların pozulması, saxta məlumat, təhlükəsizlik riski və ya qanun pozuntusu halında hesabı müvəqqəti dondurmaq, məhdudlaşdırmaq və ya tamamilə bağlamaq hüququnu özündə saxlayır.",
    ],
  },
  {
    id: "elan-qaydalari",
    title: "5. Elan yerləşdirmə qaydaları",
    paragraphs: [
      "Elan sahibi yalnız özünə məxsus, icarəyə vermək hüququ olan və ya səlahiyyətli olduğu mülk və xidmətlər barədə elan yerləşdirə bilər. Hər elan real, aktual və natamam olmayan məlumatlarla təqdim edilməlidir.",
      "Elan sahibi aşağıdakılara riayət etməlidir:",
    ],
    list: [
      "Dəqiq başlıq, təsvir, qiymət, valyuta və qiymət vahidi göstərmək.",
      "Rayon, şəhər/kənd və mümkün olduqda tam ünvan məlumatını düzgün qeyd etmək.",
      "Xəritədə mülkün faktiki və ya qanuni icazə verilən yerini pin ilə göstərmək.",
      "Yalnız həmin mülkə aid real şəkillər yükləmək; başqa obyektlərin, stok və ya aldadıcı şəkillərdən istifadə etməmək.",
      "Qonaq tutumu, otaq sayı və təqdim olunan imkanları düzgün göstərmək.",
      "Əlaqə üçün aktiv və düzgün WhatsApp və ya telefon nömrəsi təqdim etmək.",
      "Qüvvədə olan qanunvericilik, yerli icra hakimiyyəti qaydaları və bina/əməkdaşlıq qaydalarına riayət etmək.",
    ],
    footerParagraphs: [
      "Elan göndərildikdən sonra admin moderasiyasından keçir. Təsdiq olunmamış elanlar ictimaiyyətə açılmır. Platforma elanı təsdiq etmək, dəyişiklik tələb etmək və ya rədd etmək hüququna malikdir.",
    ],
  },
  {
    id: "qadagan",
    title: "6. Qadağan olunmuş məzmun və davranış",
    paragraphs: [
      "Aşağıdakı fəaliyyətlər və məzmunlar qəti qadağandır:",
    ],
    list: [
      "Qanunsuz, saxta, aldadıcı, təhqiredici, pornoqrafik, zorakılığı təbliğ edən və ya ayrı-seçkiliyə əsaslanan məzmun.",
      "Mülkiyyət hüququ olmayan obyektlərin icarəyə verilməsi və ya icazəsiz subicarə.",
      "Qiymət, yer, imkanlar və şəkillər üzrə istifadəçiləri yanıltmaq.",
      "Spam, avtomatlaşdırılmış toplama, Platformanın texniki məhdudiyyətlərini aşmaq və ya təhlükəsizliyə müdaxilə.",
      "Başqa istifadəçilərin şəxsi məlumatlarını icazəsiz toplamaq, paylaşmaq və ya kommersiya məqsədilə istifadə etmək.",
      "Virus, zərərli kod və ya Platformanın işinə mane olan hər hansı texniki müdaxilə.",
      "Vergi, turizm, sanitar və digər tənzimləyici tələblərin pozulması.",
    ],
    footerParagraphs: [
      "Qaydaların pozulması aşkar edildikdə Platforma məzmunu silmək, elanı ləğv etmək, hesabı bağlamaq və zəruri hallarda hüquq-mühafizə orqanlarına müraciət etmək hüququna malikdir.",
    ],
  },
  {
    id: "elaqe-odenis",
    title: "7. Əlaqə, rezervasiya və ödənişlər",
    paragraphs: [
      "Qonaqlar adətən elan sahibi ilə Platformada göstərilən WhatsApp və ya telefon vasitəsilə birbaşa əlaqə saxlayır. Platforma bu əlaqə prosesində vasitəçi rolunu məhdud şəkildə oynayır.",
      "Rezervasiya, ödəniş, depozit, ləğvetmə, qaytarma və xidmətin göstərilməsi şərtləri birbaşa host ilə qonaq arasında razılaşılır. Platforma bu münasibətlər üzrə maliyyə əməliyyatlarının tərəfi deyil (əgər ayrıca bildiriş olmasa).",
      "Ödəniş mübahisələri, gecikmələr, ləğvetmələr və keyfiyyət iddiaları əsasən host və qonaq arasında həll olunmalıdır. Platforma məcburi arbitraj xidməti göstərmir, lakin qanun pozuntusu barədə məlumat daxil olduqda müvafiq tədbir görə bilər.",
    ],
  },
  {
    id: "muellif",
    title: "8. Müəllif hüquqları və lisenziya",
    paragraphs: [
      "Platformanın dizaynı, loqosu, proqram təminatı, verilənlər bazası strukturu və orijinal məzmunu Platformaya və ya lisenziya verənlərə məxsusdur və müəllif hüququ, ticarət nişanı və digər intellektual mülkiyyət qanunları ilə qorunur.",
      "İstifadəçi Platformaya yüklədiyi məzmun üzrə lazımi hüquqlara malik olduğunu təsdiq edir. Elan və şəkilləri yerləşdirməklə istifadəçi Platformaya bu məzmunu saxlamaq, reproduksiya etmək, göstərmək, formatlaşdırmaq, moderasiya etmək və xidmətin təbliği məqsədilə istifadə etmək üçün qeyri-ekskluziv, ödənişsiz, dünya üzrə lisenziya verir.",
      "İstifadəçi Platformanın adını, loqosunu və brendini icazəsiz kommersiya məqsədilə istifadə edə bilməz.",
    ],
  },
  {
    id: "mesuliyyet",
    title: "9. Zəmanətlərin istisna edilməsi və məsuliyyətin məhdudlaşdırılması",
    paragraphs: [
      "Platforma “olduğu kimi” (as is) və “mövcud olduğu kimi” (as available) prinsipi ilə təqdim olunur. Qanunun icazə verdiyi maksimum həddə Platforma fasiləsiz, xətasız, təhlükəsiz işləməyə, elanların dəqiqliyinə və ya müəyyən nəticənin əldə edilməsinə dair açıq və ya nəzərdə tutulan zəmanət vermir.",
      "Platforma üçüncü tərəf xidmətlərinin (hostinq, ödəniş, rabitə, xəritə və s.) fəaliyyətinə görə məsuliyyət daşımır.",
      "Qanunun icazə verdiyi həddə Platforma, idarəçiləri, əməkdaşları və tərəfdaşları indiki və ya gələcək birbaşa, dolayı, təsadüfi, xüsusi və ya nəticə etibarilə yaranan zərərlərə (mənfəət itkisi, məlumat itkisi, nüfuz zərəri daxil olmaqla) görə məsuliyyət daşımır.",
      "Əgər məsuliyyətin tam istisna edilməsi qanuni cəhətdən mümkün olmasa, Platformanın ümumi məsuliyyəti son 12 ay ərzində istifadəçinin Platformaya ödədiyi məbləğlə (əgər varsa) və ya 100 (bir yüz) AZN ilə məhdudlaşdırıla bilər.",
    ],
  },
  {
    id: "tezminat",
    title: "10. Təzminat öhdəliyi",
    paragraphs: [
      "İstifadəçi öz məzmunu, elanları, qanun pozuntuları və ya bu Şərtlərin pozulması nəticəsində Platformaya, onun rəhbərliyinə, əməkdaşlarına və tərəfdaşlarına dəyən iddialar, zərərlər, cərimələr, xərclər və vəkillik haqları (o cümlədən müdafiə xərcləri) üzrə Platformanı təzmin etməyə və zərərsiz təmin etməyə razılaşır.",
    ],
  },
  {
    id: "muxfilik",
    title: "11. Məxfilik",
    paragraphs: [
      `Şəxsi məlumatların toplanması və emalı ${LEGAL_ENTITY_NAME} Məxfilik Siyasətinə uyğun həyata keçirilir. Məxfilik Siyasəti bu Şərtlərin ayrılmaz hissəsidir. Qeydiyyat və elan yerləşdirmə zamanı Məxfilik Siyasəti ilə razılaşma tələb olunur.`,
    ],
  },
  {
    id: "muhitie",
    title: "12. Mübahisələrin həlli və tətbiq olunan hüquq",
    paragraphs: [
      `Bu Şərtlər ${LEGAL_JURISDICTION} qanunvericiliyinə uyğun tənzimlənir və şərh olunur.`,
      "Tərəflər mübahisələri əvvəlcə danışıqlar yolu ilə həll etməyə çalışacaqlar. Razılıq əldə olunmadıqda mübahisələr Azərbaycan Respublikasının müvafiq məhkəmələrinin səlahiyyəti daxilində həll edilir.",
      "Əgər hər hansı müddəa qanuna görə etibarsız sayılsa, qalan müddəalar qüvvədə qalır.",
    ],
  },
  {
    id: "xitam",
    title: "13. Xidmətin dayandırılması",
    paragraphs: [
      "İstifadəçi istənilən vaxt hesabını bağlamağı və Platformadan istifadəni dayandırmağı tələb edə bilər. Elanların silinməsi və məlumatların saxlanması Məxfilik Siyasətinə uyğun həyata keçirilir.",
      "Platforma texniki xidmət, təhlükəsizlik, qanun tələbi və ya qaydaların pozulması səbəbindən istənilən vaxt xidməti və ya ayrı-ayrı funksiyaları dayandıra bilər.",
    ],
  },
  {
    id: "elaqe",
    title: "14. Əlaqə",
    paragraphs: [
      `Bu Şərtlərlə bağlı suallar və hüquqi müraciətlər üçün: ${LEGAL_CONTACT_EMAIL}`,
      `${LEGAL_ENTITY_NAME} — Azərbaycan Respublikası üzrə onlayn elan platforması.`,
    ],
  },
];
