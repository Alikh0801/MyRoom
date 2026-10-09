import type { Locale } from "@/i18n/routing";

export interface AboutListItem {
  title: string;
  text: string;
}

export interface AboutSection {
  id: string;
  icon: string;
  title: string;
  paragraphs: string[];
  list?: AboutListItem[];
}

export interface AboutContent {
  intro: string;
  sections: AboutSection[];
  closingTitle: string;
  closingText: string;
  ctaBrowse: string;
  ctaPost: string;
}

const AZ: AboutContent = {
  intro:
    "myroomaz.com Azərbaycanın bütün bölgələrində günlük icarəyə verilən məkanları tək bir platformada birləşdirir — bağ evlərindən kotec və hostellərə, hotellərdən A-frame evlərə qədər.",
  sections: [
    {
      id: "meqsed",
      icon: "📌",
      title: "Platformamızın əsas məqsədi nədir?",
      paragraphs: [
        "myroomaz.com müasir süni intellekt texnologiyalarından istifadə edərək Azərbaycanın müxtəlif zonalarında öz məkanını icarəyə verən mülk sahiblərinin elanlarını tək bir məkanda birləşdirir. Əsas hədəfimiz — bu məkanları həm yerli, həm də xarici turistlərin qarşısına ən rahat və sürətli şəkildə çıxarmaqdır.",
        "Elan yerləşdirmək pulsuzdur və platforma rezervasiyadan heç bir komissiya götürmür: qonaq birbaşa məkan sahibi ilə əlaqə saxlayır.",
      ],
    },
    {
      id: "neticeler",
      icon: "📈",
      title: "Uğurlu başlanğıc və yüksək nəticələr",
      paragraphs: [
        "Saytımızın yeni olmasına baxmayaraq, mükəmməl qurulan SEO və axtarış optimizasiyaları sayəsində platformadakı hər bir elan artıq 250–350 arası baxış toplayır.",
        "Üstəlik, bu baxışlar təkcə yerli istifadəçilərlə məhdudlaşmır — xarici qonaqlar da məkanlarınıza böyük maraq göstərir. Sayt Azərbaycan, rus və türk dillərində işləyir, ona görə elanınız üç auditoriyanın qarşısına eyni anda çıxır.",
      ],
    },
    {
      id: "gelecek",
      icon: "🤖",
      title: "Gələcək planlarımız və süni intellekt inteqrasiyaları",
      paragraphs: ["Sizi irəlidə daha böyük yeniliklər gözləyir:"],
      list: [
        {
          title: "Mülk sahibləri üçün AI alətləri",
          text: "Elanların daha rahat idarə olunması, təsvirlərin və qiymət strategiyalarının optimallaşdırılması üçün xüsusi süni intellekt köməkçisi.",
        },
        {
          title: "Qonaqlar üçün ağıllı tur rəhbəri",
          text: "Məkanı ziyarət edən turistlər üçün fərdiləşdirilmiş AI söhbət köməkçisi və səyahət marşrutu tövsiyələri.",
        },
        {
          title: "Geniş tərəfdaşlıq",
          text: "Ölkənin aparıcı otelləri və istirahət kompleksləri ilə strateji əməkdaşlıqlar planlaşdırılır.",
        },
      ],
    },
  ],
  closingTitle: "Bu, hələ başlanğıcdır",
  closingText:
    "Səyahətinizi planlaşdırmaq və ya məkanınızı minlərlə qonağa təqdim etmək üçün elə indi başlayın.",
  ctaBrowse: "Elanlara bax",
  ctaPost: "Elan yerləşdir",
};

const RU: AboutContent = {
  intro:
    "myroomaz.com объединяет на одной площадке жильё, которое сдаётся посуточно по всем регионам Азербайджана — от загородных домов, коттеджей и хостелов до отелей и A-frame.",
  sections: [
    {
      id: "meqsed",
      icon: "📌",
      title: "В чём основная цель нашей платформы?",
      paragraphs: [
        "myroomaz.com использует современные технологии искусственного интеллекта, чтобы собрать в одном месте объявления владельцев, сдающих жильё в разных зонах Азербайджана. Наша главная задача — показать эти места местным и иностранным туристам максимально удобно и быстро.",
        "Размещение объявления бесплатно, и платформа не берёт комиссию с бронирования: гость связывается с владельцем напрямую.",
      ],
    },
    {
      id: "neticeler",
      icon: "📈",
      title: "Успешный старт и высокие результаты",
      paragraphs: [
        "Несмотря на то что сайт новый, благодаря тщательно выстроенной SEO- и поисковой оптимизации каждое объявление на платформе уже набирает от 250 до 350 просмотров.",
        "При этом просмотры не ограничиваются местной аудиторией — иностранные гости тоже проявляют большой интерес. Сайт работает на азербайджанском, русском и турецком, поэтому ваше объявление видят сразу три аудитории.",
      ],
    },
    {
      id: "gelecek",
      icon: "🤖",
      title: "Наши планы и интеграции искусственного интеллекта",
      paragraphs: ["Впереди вас ждут ещё большие новшества:"],
      list: [
        {
          title: "AI-инструменты для владельцев",
          text: "Отдельный помощник на базе искусственного интеллекта для удобного управления объявлениями и оптимизации описаний и ценовых стратегий.",
        },
        {
          title: "Умный гид для гостей",
          text: "Персонализированный AI-чат и рекомендации маршрутов для туристов, приезжающих в выбранное место.",
        },
        {
          title: "Широкое партнёрство",
          text: "Планируется стратегическое сотрудничество с ведущими отелями и зонами отдыха страны.",
        },
      ],
    },
  ],
  closingTitle: "Это только начало",
  closingText:
    "Начните прямо сейчас — спланируйте поездку или покажите своё жильё тысячам гостей.",
  ctaBrowse: "Смотреть объявления",
  ctaPost: "Разместить объявление",
};

const TR: AboutContent = {
  intro:
    "myroomaz.com, Azerbaycan'ın tüm bölgelerinde günlük kiralanan mekânları tek bir platformda birleştiriyor — bağ evlerinden kotec ve hostellere, otellerden A-frame evlere kadar.",
  sections: [
    {
      id: "meqsed",
      icon: "📌",
      title: "Platformamızın temel amacı nedir?",
      paragraphs: [
        "myroomaz.com, modern yapay zekâ teknolojilerinden yararlanarak Azerbaycan'ın farklı bölgelerinde mekânını kiraya veren mülk sahiplerinin ilanlarını tek bir yerde topluyor. Temel hedefimiz, bu mekânları hem yerli hem de yabancı turistlerin karşısına en rahat ve hızlı şekilde çıkarmak.",
        "İlan vermek ücretsizdir ve platform rezervasyondan komisyon almaz: misafir doğrudan mekân sahibiyle iletişime geçer.",
      ],
    },
    {
      id: "neticeler",
      icon: "📈",
      title: "Başarılı bir başlangıç ve yüksek sonuçlar",
      paragraphs: [
        "Sitemiz yeni olmasına rağmen, özenle kurulan SEO ve arama optimizasyonu sayesinde platformdaki her ilan şimdiden 250–350 arası görüntülenme topluyor.",
        "Üstelik bu görüntülenmeler yalnızca yerli kullanıcılarla sınırlı değil — yabancı misafirler de mekânlarınıza büyük ilgi gösteriyor. Site Azerbaycanca, Rusça ve Türkçe çalışıyor, böylece ilanınız üç kitleye aynı anda ulaşıyor.",
      ],
    },
    {
      id: "gelecek",
      icon: "🤖",
      title: "Gelecek planlarımız ve yapay zekâ entegrasyonları",
      paragraphs: ["İleride sizi daha büyük yenilikler bekliyor:"],
      list: [
        {
          title: "Mülk sahipleri için AI araçları",
          text: "İlanların daha rahat yönetilmesi, açıklamaların ve fiyat stratejilerinin optimize edilmesi için özel bir yapay zekâ asistanı.",
        },
        {
          title: "Misafirler için akıllı tur rehberi",
          text: "Mekânı ziyaret eden turistler için kişiselleştirilmiş AI sohbet asistanı ve seyahat rotası önerileri.",
        },
        {
          title: "Geniş iş birliği",
          text: "Ülkenin önde gelen otelleri ve tatil kompleksleriyle stratejik iş birlikleri planlanıyor.",
        },
      ],
    },
  ],
  closingTitle: "Bu daha başlangıç",
  closingText:
    "Seyahatinizi planlamak ya da mekânınızı binlerce misafire sunmak için hemen başlayın.",
  ctaBrowse: "İlanlara göz at",
  ctaPost: "İlan ver",
};

export function getAboutContent(locale: Locale): AboutContent {
  if (locale === "ru") return RU;
  if (locale === "tr") return TR;
  return AZ;
}
