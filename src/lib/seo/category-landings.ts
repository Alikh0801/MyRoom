import type { Locale } from "@/i18n/routing";

/**
 * Kateqoriya üzrə açılış səhifələri (myroomaz.com/a-frame-evleri və s.).
 *
 * Niyə ayrıca səhifə: əvvəl kateqoriyalar yalnız /search?category=... kimi
 * mövcud idi — başlığı "A-frame (Glamping) elanları", təsviri bütün
 * kateqoriyalar üçün eyni, mətni isə yox idi. Google axtarış nəticəsi
 * səhifələrini zəif dəyərləndirir və "a-frame evləri" sorğusu üçün mövzusu
 * məhz bu olan bir səhifə tapmırdı. Burada hər kateqoriyanın açar söz
 * daşıyan ünvanı, öz başlığı, təsviri və real məzmunu var.
 *
 * Mətnlərdə yoxlanıla bilməyən rəqəm (elan sayı, qiymət aralığı) qəsdən
 * yoxdur — elanlar dəyişdikcə köhnələrdi. Şəraitə istinadlar (hovuz, jakuzi,
 * manqal, səhər yeməyi) bazadakı real şərait siyahısındandır.
 *
 * URL-lər dəyişdirilməməlidir: Google indeksləyəndən sonra ünvan dəyişikliyi
 * toplanmış sıralama dəyərini itirir.
 */

export interface LandingSection {
  heading: string;
  text: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface CategoryLandingCopy {
  /** Keçidlərdə görünən qısa ad */
  label: string;
  /** <title> — sayt adı şablonla əlavə olunur */
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  sections: LandingSection[];
  faq: LandingFaq[];
}

export interface CategoryLanding {
  /** Ünvan seqmenti: myroomaz.com/<path> */
  path: string;
  /** Bazadakı kateqoriya slug-ı */
  categorySlug: string;
  copy: Record<Locale, CategoryLandingCopy>;
}

const BOOKING_FAQ: Record<Locale, LandingFaq> = {
  az: {
    q: "Necə rezerv etmək olar?",
    a: "Bəyəndiyiniz elanı açıb sahibi ilə WhatsApp və ya telefonla birbaşa əlaqə saxlayın. MyRoomAZ vasitəçi deyil və rezervasiyadan komissiya götürmür.",
  },
  ru: {
    q: "Как забронировать?",
    a: "Откройте понравившееся объявление и свяжитесь с владельцем напрямую через WhatsApp или по телефону. MyRoomAZ не является посредником и не берёт комиссию за бронирование.",
  },
  tr: {
    q: "Nasıl rezervasyon yapılır?",
    a: "Beğendiğiniz ilanı açıp ev sahibiyle WhatsApp veya telefonla doğrudan iletişime geçin. MyRoomAZ aracı değildir ve rezervasyondan komisyon almaz.",
  },
};

export const CATEGORY_LANDINGS: CategoryLanding[] = [
  {
    path: "a-frame-evleri",
    categorySlug: "a-frame",
    copy: {
      az: {
        label: "A-frame evləri",
        title: "A-frame evləri — günlük kirayə, Azərbaycan",
        h1: "A-frame evləri",
        metaDescription:
          "Azərbaycanda günlük kirayə A-frame (glamping) evləri: Qəbələ, Quba, Qusar, İsmayıllı və digər bölgələr. Sahibi ilə birbaşa əlaqə, komissiyasız.",
        intro:
          "Meşə və dağ mənzərəli A-frame (glamping) evləri Azərbaycanda ən çox axtarılan istirahət növlərindən biridir. Bu səhifədə günlük kirayəyə verilən A-frame elanlarını bir yerdə görə və sahibi ilə birbaşa əlaqə saxlaya bilərsiniz.",
        sections: [
          {
            heading: "A-frame evi nədir?",
            text: "A-frame — üçbucaq formalı damı demək olar yerə qədər enən kiçik taxta evdir. Adətən təbiətin içində, meşədə və ya dağ ətəyində tikilir: geniş şüşə fasad, rahat yataq otağı, bəzən isə jakuzi, kamin və manqal yeri olur. Şəhər səs-küyündən uzaqlaşmaq istəyən cütlər və kiçik ailələr üçün idealdır.",
          },
          {
            heading: "Azərbaycanda A-frame evləri harada var?",
            text: "A-frame evləri əsasən təbiəti zəngin bölgələrdə yerləşir: Qəbələ, Quba, Qusar, İsmayıllı, Şamaxı, Lənkəran və Astara. Hər elanda ünvan, xəritə, şəkillər və şərait siyahısı göstərilir — seçim etməzdən əvvəl variantları müqayisə edə bilərsiniz.",
          },
        ],
        faq: [
          {
            q: "A-frame evinin günlük qiyməti nə qədərdir?",
            a: "Qiymət bölgədən, mövsümdən və evin şəraitindən asılıdır. Hər elanda günlük, həftəlik və ya aylıq qiymət ayrıca göstərilir.",
          },
          BOOKING_FAQ.az,
          {
            q: "A-frame evində neçə nəfər qala bilər?",
            a: "A-frame evləri adətən 2–4 nəfərlik olur, daha geniş variantlar da var. Maksimum qonaq sayı hər elanda göstərilir.",
          },
        ],
      },
      ru: {
        label: "A-frame дома",
        title: "A-frame дома посуточно в Азербайджане",
        h1: "A-frame дома",
        metaDescription:
          "A-frame (глэмпинг) дома посуточно в Азербайджане: Габала, Губа, Гусар, Исмаиллы и другие регионы. Прямая связь с владельцем, без комиссии.",
        intro:
          "A-frame дома (глэмпинг) с видом на лес и горы — один из самых популярных форматов отдыха в Азербайджане. Здесь собраны объявления об A-frame домах посуточно — связывайтесь с владельцем напрямую.",
        sections: [
          {
            heading: "Что такое A-frame дом?",
            text: "A-frame — небольшой деревянный дом с треугольной крышей, спускающейся почти до земли. Обычно его строят на природе, в лесу или у подножия гор: большие панорамные окна, уютная спальня, а иногда джакузи, камин и мангал. Идеальный вариант для пары или небольшой семьи, которые хотят отдохнуть от города.",
          },
          {
            heading: "Где найти A-frame дома в Азербайджане?",
            text: "Большинство A-frame домов находится в живописных регионах: Габала, Губа, Гусар, Исмаиллы, Шамахы, Ленкорань и Астара. В каждом объявлении указаны адрес, карта, фотографии и удобства — варианты можно сравнить до выбора.",
          },
        ],
        faq: [
          {
            q: "Сколько стоит A-frame дом в сутки?",
            a: "Цена зависит от региона, сезона и удобств. В каждом объявлении отдельно указана цена за сутки, неделю или месяц.",
          },
          BOOKING_FAQ.ru,
          {
            q: "Сколько человек может разместиться?",
            a: "A-frame дома обычно рассчитаны на 2–4 человек, но есть и более просторные. Максимальное число гостей указано в каждом объявлении.",
          },
        ],
      },
      tr: {
        label: "A-frame evleri",
        title: "Azerbaycan'da günlük kiralık A-frame evleri",
        h1: "A-frame evleri",
        metaDescription:
          "Azerbaycan'da günlük kiralık A-frame (glamping) evleri: Gebele, Guba, Gusar, İsmayıllı ve diğer bölgeler. Ev sahibiyle doğrudan iletişim, komisyonsuz.",
        intro:
          "Orman ve dağ manzaralı A-frame (glamping) evleri Azerbaycan'da en çok aranan tatil seçeneklerinden biri. Bu sayfada günlük kiralık A-frame ilanlarını bir arada görebilir, ev sahibiyle doğrudan iletişime geçebilirsiniz.",
        sections: [
          {
            heading: "A-frame ev nedir?",
            text: "A-frame, üçgen çatısı neredeyse yere kadar inen küçük bir ahşap evdir. Genellikle doğanın içinde, ormanda ya da dağ eteğinde kurulur: geniş cam cephe, rahat bir yatak odası, bazen de jakuzi, şömine ve mangal alanı bulunur. Şehirden uzaklaşmak isteyen çiftler ve küçük aileler için idealdir.",
          },
          {
            heading: "Azerbaycan'da A-frame evleri nerede?",
            text: "A-frame evlerinin çoğu doğası zengin bölgelerde yer alır: Gebele, Guba, Gusar, İsmayıllı, Şamahı, Lenkeran ve Astara. Her ilanda adres, harita, fotoğraflar ve olanaklar yer alır; karar vermeden önce seçenekleri karşılaştırabilirsiniz.",
          },
        ],
        faq: [
          {
            q: "A-frame evin günlük fiyatı ne kadar?",
            a: "Fiyat bölgeye, sezona ve olanaklara göre değişir. Her ilanda günlük, haftalık veya aylık fiyat ayrıca belirtilir.",
          },
          BOOKING_FAQ.tr,
          {
            q: "A-frame evde kaç kişi kalabilir?",
            a: "A-frame evleri genellikle 2–4 kişiliktir, daha geniş seçenekler de var. Maksimum misafir sayısı her ilanda belirtilir.",
          },
        ],
      },
    },
  },
  {
    path: "rayon-evleri",
    categorySlug: "rayon-evi",
    copy: {
      az: {
        label: "Rayon evləri",
        title: "Rayon evləri — günlük kirayə, Azərbaycan",
        h1: "Rayon evləri",
        metaDescription:
          "Azərbaycanın rayonlarında günlük kirayə evlər: Quba, Qusar, Qəbələ, Şəki, Lənkəran və digər bölgələr. Sahibi ilə birbaşa əlaqə, komissiyasız.",
        intro:
          "Ailə ilə və ya dostlarla rayona istirahətə gedirsinizsə, otel əvəzinə bütöv bir ev kirayələmək həm rahat, həm də sərfəlidir. Bu səhifədə Azərbaycanın müxtəlif bölgələrində günlük kirayəyə verilən rayon evlərinin elanları toplanıb.",
        sections: [
          {
            heading: "Niyə rayon evi?",
            text: "Rayon evi böyük qrup üçün ayrıca otaqlar, mətbəx, həyət və manqal yeri deməkdir. Yeməyinizi özünüz bişirə, uşaqlarla həyətdə vaxt keçirə, öz qrafikinizlə dincələ bilərsiniz. Uzun müddət qalanlar üçün həftəlik və aylıq kirayə variantları da var.",
          },
          {
            heading: "Hansı rayonlarda ev kirayələmək olar?",
            text: "Ən çox axtarılan istiqamətlər: Quba, Qusar, Qəbələ, İsmayıllı, Şəki, Lənkəran, Masallı və Astara. Konkret rayon və ya şəhər üzrə süzmək üçün ətraflı axtarışdan istifadə edin.",
          },
        ],
        faq: [
          {
            q: "Rayon evini neçə günlük kirayələmək olar?",
            a: "Əksər sahiblər günlük kirayə verir, bəziləri həftəlik və aylıq qiymət də təklif edir. Qiymət vahidi hər elanda göstərilir.",
          },
          BOOKING_FAQ.az,
          {
            q: "Evdə hansı şərait olur?",
            a: "Hər elanda şərait siyahısı (Wi-Fi, mətbəx, manqal, hovuz və s.), otaq və hamam sayı göstərilir.",
          },
        ],
      },
      ru: {
        label: "Загородные дома",
        title: "Загородные дома посуточно в регионах Азербайджана",
        h1: "Загородные дома в регионах",
        metaDescription:
          "Дома посуточно в регионах Азербайджана: Губа, Гусар, Габала, Шеки, Ленкорань и другие. Прямая связь с владельцем, без комиссии.",
        intro:
          "Если вы едете отдыхать в регион с семьёй или друзьями, снять целый дом вместо отеля и удобнее, и выгоднее. Здесь собраны объявления о посуточной аренде домов в разных регионах Азербайджана.",
        sections: [
          {
            heading: "Почему дом, а не отель?",
            text: "Дом — это отдельные комнаты для большой компании, кухня, двор и мангал. Можно готовить самим, проводить время во дворе с детьми и отдыхать в своём ритме. Для долгого проживания есть варианты понедельной и помесячной аренды.",
          },
          {
            heading: "В каких регионах можно снять дом?",
            text: "Самые популярные направления: Губа, Гусар, Габала, Исмаиллы, Шеки, Ленкорань, Масаллы и Астара. Чтобы отфильтровать по региону или городу, воспользуйтесь расширенным поиском.",
          },
        ],
        faq: [
          {
            q: "На какой срок можно снять дом?",
            a: "Большинство владельцев сдают посуточно, некоторые предлагают цену за неделю или месяц. Единица цены указана в каждом объявлении.",
          },
          BOOKING_FAQ.ru,
          {
            q: "Какие удобства есть в доме?",
            a: "В каждом объявлении указаны удобства (Wi-Fi, кухня, мангал, бассейн и т. д.), количество комнат и санузлов.",
          },
        ],
      },
      tr: {
        label: "Köy evleri",
        title: "Azerbaycan'da günlük kiralık köy evleri",
        h1: "Bölgelerde köy evleri",
        metaDescription:
          "Azerbaycan'ın bölgelerinde günlük kiralık evler: Guba, Gusar, Gebele, Şeki, Lenkeran ve daha fazlası. Ev sahibiyle doğrudan iletişim, komisyonsuz.",
        intro:
          "Ailenizle ya da arkadaşlarınızla bölgelere tatile gidiyorsanız, otel yerine bütün bir ev kiralamak hem rahat hem de ekonomik. Bu sayfada Azerbaycan'ın farklı bölgelerindeki günlük kiralık ev ilanları bir arada.",
        sections: [
          {
            heading: "Neden köy evi?",
            text: "Köy evi; kalabalık gruplar için ayrı odalar, mutfak, bahçe ve mangal alanı demek. Yemeğinizi kendiniz yapabilir, çocuklarla bahçede vakit geçirebilir, kendi temponuzda dinlenebilirsiniz. Uzun konaklamalar için haftalık ve aylık kiralama seçenekleri de var.",
          },
          {
            heading: "Hangi bölgelerde ev kiralanabilir?",
            text: "En çok tercih edilen yerler: Guba, Gusar, Gebele, İsmayıllı, Şeki, Lenkeran, Masallı ve Astara. Bölgeye veya şehre göre filtrelemek için detaylı aramayı kullanın.",
          },
        ],
        faq: [
          {
            q: "Ev kaç günlüğüne kiralanabilir?",
            a: "Çoğu ev sahibi günlük kiralar, bazıları haftalık ve aylık fiyat da sunar. Fiyat birimi her ilanda belirtilir.",
          },
          BOOKING_FAQ.tr,
          {
            q: "Evde hangi olanaklar var?",
            a: "Her ilanda olanaklar listesi (Wi-Fi, mutfak, mangal, havuz vb.), oda ve banyo sayısı belirtilir.",
          },
        ],
      },
    },
  },
  {
    path: "villa-bag-evleri",
    categorySlug: "villa",
    copy: {
      az: {
        label: "Villa və bağ evləri",
        title: "Villa və bağ evləri — günlük kirayə",
        h1: "Villa və bağ evləri",
        metaDescription:
          "Abşeron bağları, Qəbələ, Quba və digər bölgələrdə günlük kirayə villa və bağ evləri. Sahibi ilə birbaşa əlaqə, komissiyasız.",
        intro:
          "Böyük ailə toplantısı, ad günü və ya sadəcə şəhərdən uzaq bir həftəsonu üçün villa və bağ evləri ən rahat seçimdir. Bu səhifədə günlük kirayəyə verilən villa və bağ evlərinin elanları toplanıb.",
        sections: [
          {
            heading: "Villa və bağ evinin üstünlükləri",
            text: "Geniş həyət, ayrıca otaqlar, tam təchiz olunmuş mətbəx və manqal yeri; bəzi evlərdə hovuz və jakuzi də olur. Böyük qrup üçün bir neçə otel otağı əvəzinə bir ev kirayələmək adətən daha sərfəlidir.",
          },
          {
            heading: "Harada axtarmaq olar?",
            text: "Bakıya yaxın Abşeron bağları (Mərdəkan, Şüvəlan, Buzovna, Novxanı) qısa istirahət üçün, Qəbələ, Quba və İsmayıllı isə dağ havası istəyənlər üçün populyardır.",
          },
        ],
        faq: [
          {
            q: "Hovuzlu villa tapmaq olar?",
            a: "Bəli. Hovuzu olan evlərdə bu, elanın şərait siyahısında göstərilir — şəkillərə və şəraitə baxaraq seçim edin.",
          },
          BOOKING_FAQ.az,
          {
            q: "Villada tədbir keçirmək olar?",
            a: "Ad günü və ya ailə toplantısı planlaşdırırsınızsa, bunu öncədən sahiblə razılaşdırın — qaydalar evdən evə fərqlənir.",
          },
        ],
      },
      ru: {
        label: "Виллы и дачи",
        title: "Виллы и дачи посуточно в Азербайджане",
        h1: "Виллы и дачи",
        metaDescription:
          "Виллы и дачи посуточно: Абшеронские дачи, Габала, Губа и другие регионы Азербайджана. Прямая связь с владельцем, без комиссии.",
        intro:
          "Для большого семейного праздника, дня рождения или просто выходных вдали от города виллы и дачи — самый удобный вариант. Здесь собраны объявления о посуточной аренде вилл и дач.",
        sections: [
          {
            heading: "Преимущества виллы и дачи",
            text: "Просторный двор, отдельные комнаты, полностью оборудованная кухня и мангал; в некоторых домах есть бассейн и джакузи. Для большой компании снять один дом обычно выгоднее, чем несколько номеров в отеле.",
          },
          {
            heading: "Где искать?",
            text: "Абшеронские дачи недалеко от Баку (Мардакан, Шувелан, Бузовна, Новханы) популярны для коротких поездок, а Габала, Губа и Исмаиллы — для тех, кто хочет горного воздуха.",
          },
        ],
        faq: [
          {
            q: "Можно ли найти виллу с бассейном?",
            a: "Да. Если в доме есть бассейн, это указано в списке удобств объявления — ориентируйтесь на фотографии и удобства.",
          },
          BOOKING_FAQ.ru,
          {
            q: "Можно ли провести мероприятие на вилле?",
            a: "Если планируете день рождения или семейный праздник, заранее согласуйте это с владельцем — правила в каждом доме свои.",
          },
        ],
      },
      tr: {
        label: "Villa ve bağ evleri",
        title: "Azerbaycan'da günlük kiralık villa ve bağ evleri",
        h1: "Villa ve bağ evleri",
        metaDescription:
          "Günlük kiralık villa ve bağ evleri: Abşeron bağları, Gebele, Guba ve Azerbaycan'ın diğer bölgeleri. Ev sahibiyle doğrudan iletişim, komisyonsuz.",
        intro:
          "Kalabalık bir aile buluşması, doğum günü ya da şehirden uzak bir hafta sonu için villa ve bağ evleri en rahat seçenek. Bu sayfada günlük kiralık villa ve bağ evi ilanları bir arada.",
        sections: [
          {
            heading: "Villa ve bağ evinin avantajları",
            text: "Geniş bahçe, ayrı odalar, tam donanımlı mutfak ve mangal alanı; bazı evlerde havuz ve jakuzi de bulunur. Kalabalık bir grup için birkaç otel odası yerine tek bir ev kiralamak genellikle daha ekonomiktir.",
          },
          {
            heading: "Nerede aranır?",
            text: "Bakü'ye yakın Abşeron bağları (Merdekan, Şüvelan, Buzovna, Novhanı) kısa tatiller için, Gebele, Guba ve İsmayıllı ise dağ havası isteyenler için popülerdir.",
          },
        ],
        faq: [
          {
            q: "Havuzlu villa bulunur mu?",
            a: "Evet. Havuzu olan evlerde bu, ilanın olanaklar listesinde belirtilir — fotoğraflara ve olanaklara bakarak seçim yapın.",
          },
          BOOKING_FAQ.tr,
          {
            q: "Villada etkinlik düzenlenebilir mi?",
            a: "Doğum günü veya aile buluşması planlıyorsanız bunu önceden ev sahibiyle konuşun — kurallar evden eve değişir.",
          },
        ],
      },
    },
  },
  {
    path: "oteller",
    categorySlug: "hotel",
    copy: {
      az: {
        label: "Otellər",
        title: "Otellər — Bakı və bölgələrdə",
        h1: "Otellər",
        metaDescription:
          "Bakı, Qəbələ, Şəki, Quba və Azərbaycanın digər bölgələrində otellər. Otaq növlərini və şəraiti müqayisə edin, otellə birbaşa əlaqə saxlayın.",
        intro:
          "Qısa səfər, iş gəzintisi və ya bir neçə günlük istirahət üçün otel ən asan seçimdir. Bu səhifədə MyRoomAZ-da yerləşdirilmiş otel elanlarını bir yerdə görə bilərsiniz.",
        sections: [
          {
            heading: "Otel seçərkən nəyə baxmalı?",
            text: "Ünvana və xəritəyə, otaq növlərinə, səhər yeməyinin daxil olub-olmamasına və şərait siyahısına diqqət edin. Oteldə bir neçə otaq növü varsa, elanda hər birinin şəraiti ayrıca göstərilir.",
          },
          {
            heading: "Hansı bölgələrdə?",
            text: "Bakı ilə yanaşı Qəbələ, Şəki, Quba, Qusar və Lənkəran otel axtaranların ən çox seçdiyi istiqamətlərdir.",
          },
        ],
        faq: [
          {
            q: "Səhər yeməyi daxildirmi?",
            a: "Bu, oteldən asılıdır. Səhər yeməyi verilirsə, elanın şərait siyahısında göstərilir.",
          },
          BOOKING_FAQ.az,
          {
            q: "Qiymət necə hesablanır?",
            a: "Otellər adətən günlük qiymət göstərir. Qiymət vahidi (gün, həftə, ay) hər elanda yazılıb.",
          },
        ],
      },
      ru: {
        label: "Отели",
        title: "Отели в Баку и регионах Азербайджана",
        h1: "Отели",
        metaDescription:
          "Отели в Баку, Габале, Шеки, Губе и других регионах Азербайджана. Сравнивайте номера и удобства, связывайтесь с отелем напрямую.",
        intro:
          "Для короткой поездки, командировки или отдыха на несколько дней отель — самый простой вариант. Здесь собраны все объявления отелей, размещённые на MyRoomAZ.",
        sections: [
          {
            heading: "На что обратить внимание при выборе отеля?",
            text: "Смотрите на адрес и карту, типы номеров, наличие завтрака и список удобств. Если в отеле несколько типов номеров, удобства каждого указаны в объявлении отдельно.",
          },
          {
            heading: "В каких регионах?",
            text: "Помимо Баку, чаще всего отели ищут в Габале, Шеки, Губе, Гусаре и Ленкорани.",
          },
        ],
        faq: [
          {
            q: "Включён ли завтрак?",
            a: "Зависит от отеля. Если завтрак предоставляется, это указано в списке удобств объявления.",
          },
          BOOKING_FAQ.ru,
          {
            q: "Как рассчитывается цена?",
            a: "Отели обычно указывают цену за сутки. Единица цены (сутки, неделя, месяц) указана в каждом объявлении.",
          },
        ],
      },
      tr: {
        label: "Oteller",
        title: "Bakü ve Azerbaycan bölgelerinde oteller",
        h1: "Oteller",
        metaDescription:
          "Bakü, Gebele, Şeki, Guba ve Azerbaycan'ın diğer bölgelerinde oteller. Oda tiplerini ve olanakları karşılaştırın, otelle doğrudan iletişime geçin.",
        intro:
          "Kısa bir gezi, iş seyahati ya da birkaç günlük tatil için otel en kolay seçenek. Bu sayfada MyRoomAZ'da yayınlanan otel ilanlarını bir arada görebilirsiniz.",
        sections: [
          {
            heading: "Otel seçerken nelere dikkat edilmeli?",
            text: "Adrese ve haritaya, oda tiplerine, kahvaltının dahil olup olmadığına ve olanaklar listesine bakın. Otelde birden fazla oda tipi varsa, her birinin olanakları ilanda ayrıca gösterilir.",
          },
          {
            heading: "Hangi bölgelerde?",
            text: "Bakü'nün yanı sıra Gebele, Şeki, Guba, Gusar ve Lenkeran otel arayanların en çok tercih ettiği yerlerdir.",
          },
        ],
        faq: [
          {
            q: "Kahvaltı dahil mi?",
            a: "Otele göre değişir. Kahvaltı veriliyorsa ilanın olanaklar listesinde belirtilir.",
          },
          BOOKING_FAQ.tr,
          {
            q: "Fiyat nasıl hesaplanır?",
            a: "Oteller genellikle günlük fiyat gösterir. Fiyat birimi (gün, hafta, ay) her ilanda yazılıdır.",
          },
        ],
      },
    },
  },
  {
    path: "hostel-kotec",
    categorySlug: "hostel",
    copy: {
      az: {
        label: "Hostel və kotec",
        title: "Hostel və kotec — günlük kirayə",
        h1: "Hostel və kotec",
        metaDescription:
          "Büdcəyə uyğun hostellər və kotec evləri: Bakı və Azərbaycanın bölgələrində günlük kirayə. Sahibi ilə birbaşa əlaqə, komissiyasız.",
        intro:
          "Büdcəli səyahət edirsinizsə və ya kiçik qrupla təbiətdə rahat bir yer axtarırsınızsa, hostel və kotec elanları sizin üçündür.",
        sections: [
          {
            heading: "Hostel ilə kotec arasında fərq",
            text: "Hostel adətən şəhərdə yerləşir və sərfəli qiymətə yataq və ya otaq təklif edir — tək səyahətçilər və gənclər üçün uyğundur. Kotec isə təbiət içində kiçik, ayrıca evdir: öz girişi, adətən mətbəxi və həyəti olur.",
          },
          {
            heading: "Hansı bölgələrdə?",
            text: "Hostellər daha çox Bakıda, kotec evləri isə Qəbələ, Qusar, Quba və İsmayıllı kimi dağ-meşə bölgələrində olur.",
          },
        ],
        faq: [
          {
            q: "Hostel otağında neçə nəfər qalır?",
            a: "Bu, hosteldən asılıdır: bəziləri ayrıca otaq, bəziləri ümumi otaqda yataq təklif edir. Detallar elanda göstərilir.",
          },
          BOOKING_FAQ.az,
          {
            q: "Kotec ilə A-frame evi eynidirmi?",
            a: "Xeyr. A-frame üçbucaq damlı xüsusi dizaynlı evdir, kotec isə adi formada kiçik evdir. A-frame evləri üçün ayrıca bölmə var.",
          },
        ],
      },
      ru: {
        label: "Хостелы и коттеджи",
        title: "Хостелы и коттеджи посуточно в Азербайджане",
        h1: "Хостелы и коттеджи",
        metaDescription:
          "Недорогие хостелы и коттеджи посуточно в Баку и регионах Азербайджана. Прямая связь с владельцем, без комиссии.",
        intro:
          "Если вы путешествуете с ограниченным бюджетом или ищете уютное место на природе для небольшой компании, эти объявления для вас.",
        sections: [
          {
            heading: "Чем хостел отличается от коттеджа?",
            text: "Хостел обычно находится в городе и предлагает койку или комнату по доступной цене — подходит для одиночных путешественников и молодёжи. Коттедж — небольшой отдельный дом на природе: свой вход, обычно кухня и двор.",
          },
          {
            heading: "В каких регионах?",
            text: "Хостелы чаще всего находятся в Баку, а коттеджи — в горно-лесных регионах: Габала, Гусар, Губа и Исмаиллы.",
          },
        ],
        faq: [
          {
            q: "Сколько человек живёт в комнате хостела?",
            a: "Зависит от хостела: одни предлагают отдельные комнаты, другие — места в общей комнате. Подробности указаны в объявлении.",
          },
          BOOKING_FAQ.ru,
          {
            q: "Коттедж и A-frame — это одно и то же?",
            a: "Нет. A-frame — дом особой конструкции с треугольной крышей, а коттедж — небольшой дом обычной формы. Для A-frame домов есть отдельный раздел.",
          },
        ],
      },
      tr: {
        label: "Hostel ve apart oteller",
        title: "Azerbaycan'da günlük kiralık hostel ve apart oteller",
        h1: "Hostel ve apart oteller",
        metaDescription:
          "Uygun fiyatlı hosteller ve apart oteller: Bakü'de ve Azerbaycan'ın bölgelerinde günlük kiralık. Ev sahibiyle doğrudan iletişim, komisyonsuz.",
        intro:
          "Bütçe dostu bir seyahat planlıyorsanız ya da küçük bir grupla doğada rahat bir yer arıyorsanız, hostel ve apart otel ilanları tam size göre.",
        sections: [
          {
            heading: "Hostel ile apart otel arasındaki fark",
            text: "Hostel genellikle şehir merkezindedir ve uygun fiyata yatak ya da oda sunar — tek başına seyahat edenler ve gençler için uygundur. Apart otel ise kendi girişi, genellikle mutfağı ve bahçesi olan küçük, müstakil bir konaklama birimidir.",
          },
          {
            heading: "Hangi bölgelerde?",
            text: "Hosteller daha çok Bakü'de, doğa içindeki küçük evler ise Gebele, Gusar, Guba ve İsmayıllı gibi dağ ve orman bölgelerinde bulunur.",
          },
        ],
        faq: [
          {
            q: "Hostel odasında kaç kişi kalıyor?",
            a: "Hostele göre değişir: bazıları özel oda, bazıları ortak odada yatak sunar. Ayrıntılar ilanda belirtilir.",
          },
          BOOKING_FAQ.tr,
          {
            q: "Apart otel ile A-frame aynı şey mi?",
            a: "Hayır. A-frame üçgen çatılı özel tasarımlı bir evdir, apart otel ise klasik yapıda küçük bir konaklama birimidir. A-frame evleri için ayrı bir bölüm var.",
          },
        ],
      },
    },
  },
];

const BY_PATH = new Map(CATEGORY_LANDINGS.map((l) => [l.path, l]));
const BY_CATEGORY = new Map(CATEGORY_LANDINGS.map((l) => [l.categorySlug, l]));

export function getLandingByPath(path: string): CategoryLanding | null {
  return BY_PATH.get(path) ?? null;
}

export function getLandingByCategory(
  categorySlug: string | undefined | null
): CategoryLanding | null {
  if (!categorySlug) return null;
  return BY_CATEGORY.get(categorySlug) ?? null;
}

/** Açılış səhifəsinin locale-sız ünvanı: "/a-frame-evleri" */
export function landingHref(landing: CategoryLanding): string {
  return `/${landing.path}`;
}
