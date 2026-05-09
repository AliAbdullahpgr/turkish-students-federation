export interface GuideSection {
  id: string;
  title: string;
  content?: string;
  level: 1 | 2 | 3 | 4;
  children?: GuideSection[];
}

export const pakistanGuideData: GuideSection[] = [
  {
    id: "biz-kimiz",
    title: "BİZ KİMİZ?",
    level: 2,
    content: `Biz; Pakistan'da eğitim tahsil etme yolculuğuna çıkan ve çıkmak isteyen öğrencilere destek olmak, onların eğitim sürecini kolaylaştırmak ve bu yolculukta yalnız olmadıklarını hissettirmek için kurulmuş bir kardeşlik ve rehberlik grubuyuz. Niyetimiz; burada bulunan öğrencilerin hem akademik hem de kişisel gelişimlerinde Allah rızası doğrultusunda yanlarında olmak, karşılaştıkları zorluklarda kolaylaştırıcı, ihtiyaç duyduklarında yönlendirici bir destek ağı oluşturmaktır. Bu kitapçık; Pakistan'a yeni gelen veya gelmeyi düşünen kardeşlerimizin güvenli, bilinçli ve huzurlu bir şekilde eğitim hayatlarına başlamaları için hazırlanmıştır. Amacımız; onları doğru bilgiyle buluşturmak, karşılaşabilecekleri durumlara hazırlamak ve sorunsuz bir başlangıç yapmalarına vesile olmaktır. Üyelerimiz; Pakistan'ı tanıyan ve buradaki akademik hayatı bilen kişilerden oluşmaktadır. Biz sadece danışmanlık sağlayan bir grup değil, aynı zamanda ihtiyaç anında dayanabileceğiniz bir kardeşlik topluluğu olmaya çalışıyoruz. Burada bulunduğunuz süre boyunca yanınızda olmaya, her adımda destek vermeye devam etmeye çalışacağız. İlim yolculuğunuzun bereketli ve hayırlı olmasını diliyoruz.`,
  },
  {
    id: "kisa-tarihi",
    title: "KISA TARİHİ",
    level: 2,
    content: `Pakistan'ın 1947 öncesi tarihi Hindistan ile ortaktır. 1857 Büyük Hint Ayaklanması sonrasında İngilizler özellikle Müslümanları sorumlu tutmuş, bu durum Müslümanların siyasal ve toplumsal haklarını kaybetmesine yol açmıştır. Zamanla Müslümanlar siyasi örgütlenmeye yönelmiş ve 1906'da Hindistan Müslümanları Birliği'ni kurmuşlardır. Hindistan Kongre Partisi ile Müslümanlar arasında özellikle temsil ve çoğunluk meselesi konusunda görüş ayrılıkları derinleşmiştir. 1930'da Muhammed İkbal, Hindistan'ın kuzeybatı ve doğusunda ayrı bir Müslüman devleti kurulması fikrini ortaya atmıştır. 1940 Lahor Toplantısında "Pakistan" adı açıkça dile getirilmiş ve Müslüman çoğunluklu bölgelerin bağımsız bir devlet çatısı altında toplanması kararı benimsenmiştir. II. Dünya Savaşı sonrasında İngiltere'nin bölgeden çekilme kararı almasıyla süreç hızlanmış; 3 Haziran 1947 planı doğrultusunda Pakistan, Doğu ve Batı Pakistan olmak üzere iki kanatlı bir devlet olarak 14 Ağustos 1947'de bağımsızlığını ilan etmiştir. Bölünme sırasında büyük göçler ve şiddet olayları yaşanmış, yüz binlerce insan hayatını kaybetmiştir. Keşmir meselesi ise Pakistan ile Hindistan arasında kalıcı bir sorun haline gelmiştir. Bağımsız Pakistan'ın kurucusu Muhammed Ali Cinnah, ilk başbakan ise Liyakat Ali Han olmuştur. Cinnah'ın 1948'deki ölümünden sonra ülkede siyasi istikrarsızlık başlamış; anayasa tartışmaları, hükümet değişiklikleri ve askerî müdahaleler yaşanmıştır. 1956'da Pakistan İslam Cumhuriyeti ilan edilmiş, ancak 1958'de General Eyyûb Han darbe yaparak yönetime el koymuştur. 1971'de Doğu Pakistan'daki iç savaş ve Hindistan'ın müdahalesi sonucunda Bangladeş bağımsızlığını ilan etmiştir. 1970'ler ve sonrasında Zülfikar Ali Butto, Ziyaülhak ve Pervez Müşerref dönemlerinde askerî müdahaleler ve siyasi krizler yaşanmıştır. 1988'den itibaren Benazir Butto ve Nevaz Şerif arasında gidip gelen sivil yönetimler görülmüş; ancak 1999'da General Pervez Müşerref yeniden yönetime el koymuştur. Pakistan tarihi, bağımsızlık mücadelesi, Hindistan ile yaşanan Keşmir sorunu, askerî müdahaleler ve sivil-asker ilişkileri ekseninde şekillenmiştir.`,
  },
  {
    id: "pakistan-hakkinda",
    title: "PAKİSTAN HAKKINDA",
    level: 2,
    children: [
      {
        id: "cografya",
        title: "COĞRAFYA",
        level: 3,
        content: `Pakistan, kuzeyi yüksek dağlarla çevrili çanak biçiminde bir ülkedir. Kuzeyde Hindukuş, Karakurum ve Himalaya Dağları uzanır; birçok zirve 7000 metreyi aşar. Batıda orta yükseklikte dağlar ve Afganistan'a geçiş sağlayan Hayber Geçidi bulunur. Güneybatıdaki Belûcistan çöl ve yarı çöl özellikleri gösterir. Ülke topraklarının büyük bölümünü, İndus Nehri'nin suladığı verimli ovalar kaplar. Pencap Ovası en önemli tarım ve yerleşim alanıdır; güneyde Sind Ovası ve İndus Deltası yer alır. Güneydoğuda Tar Çölü uzanır. İklim doğuda yaz yağışlı muson, batıda kış yağışlı karasal, güneyde ise tropikal özellik gösterir. Genel olarak kurak olan ülkede yağış miktarı ovalarda düşük, dağlarda yüksektir. Ormanlar sınırlıdır ve daha çok kuzey dağlarında bulunur. Ülkenin en önemli akarsuyu olan İndus, tarımsal sulama ve enerji üretiminde hayati rol oynar. Dünyanın en kalabalık ülkelerinden biri olan Pakistan genç bir nüfusa sahiptir. Nüfusun çoğunluğunu Pencâbîler oluşturur; Sindliler, Peştular, Urduca konuşanlar ve Belûcîler diğer önemli gruplardır. Resmî dil Urduca, ikinci resmî dil İngilizcedir. Halkın büyük çoğunluğu Müslümandır. Nüfus yoğunluğu sulamalı tarım bölgelerinde artar; dağlık ve çöl alanlar seyrektir. Ekonomi büyük ölçüde tarıma dayanır. İndus havzasında buğday, pirinç ve pamuk başlıca ürünlerdir. Bunlar dışında şeker kamışı, tütün, turunçgiller ve hurma da yetiştirilir. Hayvancılık önemli olmakla birlikte verim düşüktür. Balıkçılık gelişmiştir. Yer altı kaynakları arasında doğal gaz öne çıkar. Ayrıca kireç taşı, kromit ve alçı da çıkarılır. Sanayi daha çok tarım ürünlerinin işlenmesine dayanır; tekstil ve şeker üretimi başta gelir. Sanayi tesisleri Karaçi ve Pencap-Sind şehirlerinde yoğunlaşmıştır. Dış ticarette tekstil, pamuk, pirinç ve deri ürünleri ihraç edilir. Petrol, makine ve sanayi ürünleri ithal edilir. Dış ticaret açığı, yurtdışındaki işçilerin gönderdiği dövizlerle kısmen dengelenir. Ulaşımda karayolları gelişmiştir. Karaçi, ülkenin en önemli limanı ve ticaret merkezidir. Lahor, Ravalpindi ve Peşâver önemli ulaşım noktalarıdır. 1978'de Çin'e uzanan Karakurum yolu açılmıştır.`,
      },
      {
        id: "kultur-ve-medeniyet",
        title: "KÜLTÜR VE MEDENİYET",
        level: 3,
        content: ``,
      },
      {
        id: "islam-ve-islami-kurumlar",
        title: "PAKİSTAN'DA İSLÂM VE İSLÂMÎ KURUMLAR",
        level: 3,
        content: `Pakistan topraklarına İslâm ilk defa Hulefâ-yi Râşidîn döneminde ulaşmış, bölgenin kalıcı fethi ise Emevî Halifesi Velîd b. Abdülmelik zamanında Muhammed b. Kāsım tarafından 710 yılında gerçekleştirilmiştir. Bölgenin İslâmlaşmasında özellikle Gazneliler önemli rol oynamış; Hücvîrî, Muînüddin Çiştî, Bahâeddin Zekeriyyâ ve Nizâmeddin Evliyâ gibi sûfîler İslâm'ın halk arasında yayılmasına büyük katkı sağlamıştır. Modern dönemde Müslüman kimliğinin siyasal bir temele oturtulmasında Muhammed İkbal'in 1930'daki İlâhâbâd konuşması dönüm noktası olmuştur. İkbal, ayrı bir Müslüman devlet fikrini açıkça savunmuş ve liberal nitelikli bir İslâm devleti modeli önermiştir. Pakistan'ın kurucusu Muhammed Ali Cinnah da bu görüşü benimsemiştir. Bağımsızlık sonrasında İslâmî kimliğin anayasal zemine oturtulması için çalışmalar başlatılmıştır. 1949 tarihli Hedefler Kararnâmesi'nde Pakistan'ın bir İslâm devleti olduğu ilan edilmiş ve anayasanın İslâmî esaslara dayanacağı belirtilmiştir. Ancak anayasa hazırlık süreci uzun tartışmalarla ilerlemiş, farklı taslaklar hazırlanmış fakat bir süre yürürlüğe konulamamıştır. 1956 Anayasası ile ülkenin adı "Pakistan İslâm Cumhuriyeti" olarak belirlenmiştir. 1958'de General Eyyûb Han'ın darbesiyle anayasa yürürlükten kaldırılmış, devlet yapısında değişikliklere gidilmiştir. 1962 Anayasası'nda Pakistan "demokratik devlet" olarak tanımlanmış, İslâm Düşüncesi Konseyi gibi kurumların kurulması öngörülmüştür. 1973 Anayasası ise Pakistan'ı resmî dini İslâm olan bir cumhuriyet olarak tanımlamış, kanunların Kur'an ve Sünnet'e aykırı olamayacağı hükmünü getirmiştir. Ziyâülhak döneminde (1977–1988) İslâmlaşma politikaları daha sistemli biçimde uygulanmış, Federal Şer'î Mahkeme kurulmuş ve Şeriat Kanunu yürürlüğe konmuştur. Eğitim müfredatına dinî dersler eklenmiş, zekât ve vakıf düzenlemeleri yapılmıştır. Ancak farklı dinî yorumlar, mezhep ayrılıkları ve siyasal çekişmeler nedeniyle İslâmlaştırma süreci toplumsal uzlaşıyı tam olarak sağlayamamıştır. Pakistan'da Sünnî çoğunluk içinde Diyûbendî, Birelvî, Ehl-i Hadîs ve Cemâat-i İslâmî gibi gruplar etkin rol oynamaktadır. Şiî nüfus önemli bir orana sahiptir ve Ca'ferîler en kalabalık Şiî grubudur. İsmâilîler özellikle ekonomik ve kurumsal güçleriyle dikkat çeker. Kādiyânîler anayasa gereği İslâm dışı azınlık kabul edilmiştir. Çiştiyye ve Kādiriyye tarikatları toplumda yaygındır.`,
      },
      {
        id: "egitim",
        title: "EĞİTİM",
        level: 3,
        content: `Pakistan'da okuma yazma oranı yaklaşık %65–70 civarındadır ve kadınların eğitim oranı erkeklere göre daha düşüktür. Ülkede 100'den fazla üniversite bulunmaktadır. Pencap, Karaçi, Peşâver ve İslâmâbâd'daki üniversiteler en önemli yükseköğretim kurumları arasındadır. Higher Education Commission yükseköğretimi düzenleyen temel kurumdur. Resmî dil Urduca olmakla birlikte İngilizce yaygın biçimde kullanılmakta ve yükseköğretimde etkinliğini sürdürmektedir. Çok sayıda yerel dil konuşulmasına rağmen Urduca ortak iletişim dili hâline gelmiştir. Din dersleri ilk ve orta öğretimde yer almakta, üniversitelerde İslâm araştırmaları bölümleri bulunmaktadır. Dinî eğitim büyük ölçüde medreselerde yürütülmekte ve yüz binlerce öğrenci bu kurumlarda öğrenim görmektedir. 11 Eylül sonrası dönemde medreseler uluslararası baskılara maruz kalmış ancak dinî eğitim sistemi varlığını sürdürmüştür. İslâm araştırmaları alanında özellikle Milletlerarası İslâm Üniversitesi ve Islamic Research Institute önemli merkezlerdir. Ayrıca çeşitli şehirlerde bağımsız araştırma enstitüleri ve zengin kütüphaneler bulunmaktadır.`,
      },
      {
        id: "edebiyat",
        title: "EDEBİYAT",
        level: 3,
        content: `Hint alt kıtasının çok kültürlü yapısı Pakistan edebiyatına da yansımıştır. 1947 sonrası göçlerle birlikte zengin bölgesel edebiyat birikimi Pakistan'a taşınmıştır. Muhammed İkbal'in öncülüğünde gelişen İslâmî edebiyat, özellikle na't geleneğiyle devam etmiştir. Roman ve hikâyelerde göç, toplumsal eşitsizlik, siyasî karışıklıklar, bölünme travması ve ahlâkî sorgulamalar sıkça işlenir. Saâdet Hasan Manto, toplumsal gerçekçi hikâyeleriyle; Feyz Ahmed Feyz ise şiirleriyle uluslararası ün kazanmıştır. Ahmed Faraz, Pervîn Şâkir ve diğer birçok şair ve yazar Urdu edebiyatının gelişimine katkı sağlamıştır.`,
      },
      {
        id: "toplumsal-hayat",
        title: "TOPLUMSAL HAYAT",
        level: 3,
        content: `Pakistan'da İslâm toplum hayatının merkezindedir ve dinî vecîbeleri yerine getirme oranı yüksektir. Bununla birlikte mezhep farklılıklarından kaynaklanan zaman zaman gerilimler yaşanabilmektedir. Bazı bölgelerde Hindu kültürünün etkileri özellikle evlilik törenlerinde görülmektedir. Kırsal kesimde eğitim seviyesi düşüktür. Dinî mûsiki türü olan kavvâli yaygındır. Şiir ve edebiyat toplum hayatında önemli bir yer tutar. Televizyon ve salon programlarında şiir dinletileri düzenlenir. Toplumun renkli ve süslü estetik anlayışı giyimden ev dekorasyonuna kadar pek çok alanda kendini gösterir.`,
      },
    ],
  },
  {
    id: "vize-ve-pasaport",
    title: "VİZE VE PASAPORT",
    level: 2,
    content: `Pakistan'da eğitim planlayan öğrencilerin pasaport ve vize işlemlerini Türkiye'den ayrılmadan önce tamamlamaları gerekmektedir. En az bir yıl geçerli pasaport ile işlem yapılabilmekle birlikte, eğitim süresinin tamamını kapsayacak şekilde daha uzun süreli pasaport alınması ileride yaşanabilecek uzatma ve yenileme işlemlerini önlemek açısından tavsiye edilir. Pasaport başvuruları, Türkiye'de Nüfus ve Vatandaşlık İşleri Genel Müdürlüğü üzerinden randevu sistemi ile yapılmaktadır. Öğrenci vizesi süreci, Pakistan'daki üniversiteden resmi kabul alınması ve bu kabulün Pakistan'ın yükseköğretim otoritesi olan Higher Education Commission (HEC) tarafından onaylanması ile başlar. Üniversite kabul mektubu (Admission Letter) ve HEC onay yazısı olmadan öğrenci vizesine başvuru yapılamaz. Pakistan öğrenci vizeleri tamamen çevrim içi (online) olarak alınmaktadır. Başvurular Pakistan Online Visa System (PAKVISA) sistemi üzerinden yapılır ve sistem National Database and Registration Authority (NADRA) altyapısı ile çalışmaktadır. Başvuru sahibi sisteme kayıt oluşturduktan sonra "Student Visa" kategorisini seçerek gerekli belgeleri dijital ortamda yükler. Öğrenci vizesi için genellikle aşağıdaki belgeler talep edilmektedir: Geçerli pasaport (en az 6 ay geçerlilik süresi bulunmalıdır), pasaportun kimlik bilgileri sayfasının taranmış kopyası, varsa eski vizelerin taranmış kopyaları, biyometrik fotoğraf (beyaz fonlu, güncel), Pakistan'daki üniversiteden alınmış resmi kabul mektubu (Admission Letter), HEC tarafından düzenlenen/onaylanan kabul yazısı, adli sicil kaydı (e-Devlet üzerinden alınabilir ve İngilizce alınması tavsiye edilir). Başvuru sırasında tüm belgelerin net, okunaklı ve eksiksiz şekilde sisteme yüklenmesi önemlidir. Eksik veya hatalı belge yüklenmesi durumunda başvuru süreci uzayabilmekte ya da ek belge talep edilebilmektedir. Online başvuru tamamlandıktan sonra sistem üzerinden vize harcı ödenir ve değerlendirme süreci başlar. Vize onaylandığında elektronik vize (e-visa) belgesi sistem üzerinden indirilebilir. Seyahat sırasında bu belgenin çıktısının pasaport ile birlikte taşınması gerekmektedir. İşlemlerin sorunsuz ilerleyebilmesi adına, üniversite kabulü alındıktan sonra vize başvurusunun gecikmeden yapılması ve pasaport süresinin planlanan eğitim dönemini kapsayacak şekilde düzenlenmesi önemle tavsiye edilir. Ayrıca vize yenileme süreci 8-12 hafta kadar sürdüğünden, devam eden vizenin bitmesine 3 ay kala vize yenileme başvurusunun yapılması gerekmektedir.`,
  },
  {
    id: "ogrenci-resmi-islemleri",
    title: "ÖĞRENCİ RESMİ İŞLEMLERİ",
    level: 2,
    children: [
      {
        id: "elcilige-adres-beyani",
        title: "ELÇİLİĞE ADRES BEYANI",
        level: 3,
        content: `Pakistan'a gelen Türkiye Cumhuriyeti vatandaşlarının, ülkede bulundukları adresi beyan etmeleri gerektiğini hatırlatmakta fayda vardır. Bu işlemin yapılabilmesi için vatandaşlarımızın ilgili T.C. Büyükelçiliğinin e-posta adresi üzerinden randevu talep etmeleri, ardından kendilerine verilen randevu günü ve saatinde T.C. kimlik kartları ve pasaportları ile birlikte şahsen Büyükelçiliğe gitmeleri gerekmektedir. Adres beyanının Pakistan'a giriş tarihinden itibaren 20 gün içerisinde yapılması zorunludur. Bu süre içinde işlem gerçekleştirilmediği takdirde idari para cezası uygulanabildiği unutulmamalıdır. Herhangi bir cezai durumla karşılaşmamak ve resmi kayıtların güncel tutulmasını sağlamak adına adres beyanı işleminin zamanında yapılması önemle tavsiye edilir.`,
      },
      {
        id: "denklik-universite-kayit",
        title: "DENKLİK İŞLEMLERİ / ÜNİVERSİTE KAYIT",
        level: 3,
        content: `Pakistan'daki üniversiteler, yabancı uyruklu öğrencilerden lise eğitimlerine ait belgelerin denklik işlemini tamamlamalarını talep etmektedir. Bu nedenle öğrencilerin Pakistan'a geldikten sonra mümkün olan en kısa sürede denklik başvurusunu yapmaları önemlidir. Uygulamada, öğrencilerin ülkeye giriş tarihinden itibaren ilk altı ay içerisinde denklik belgesini alarak kayıtlı oldukları üniversitenin ilgili birimine ibraz etmeleri gerekmektedir. Denklik işlemi, Pakistan'da faaliyet gösteren Inter Board Committee of Chairmen (IBCC) ofisleri aracılığıyla yürütülmektedir. Başvuru sırasında lise diploması ve lise transkriptinin asılları ile birlikte, bu belgelerin İngilizce tercümelerinin de sunulması istenmektedir. Belgelerin eksiksiz ve doğru şekilde hazırlanması sürecin daha hızlı tamamlanmasını sağlayacaktır. Başvuru, öğrencinin bulunduğu şehirdeki IBCC ofisine şahsen gidilerek yapılmakta ve gerekli incelemelerin ardından denklik belgesi düzenlenmektedir. Üniversite kayıt ve akademik işlemlerde herhangi bir gecikme veya sorun yaşanmaması adına öğrencilerin bu süreci zamanında başlatmaları ve denklik belgelerini belirtilen süre içinde üniversitelerine teslim etmeleri gerekmektedir.`,
      },
      {
        id: "denklik-universite-mezuniyet",
        title: "DENKLİK İŞLEMLERİ / ÜNİVERSİTE MEZUNİYET",
        level: 3,
        content: `Pakistan'daki bir üniversiteden mezun olan öğrencilerin, Türkiye'de denklik başvurusu yapabilmeleri için diplomalarına ilişkin belgeleri Pakistan'da usulüne uygun şekilde tamamlamaları ve onaylatmaları gerekmektedir. Aşağıdaki adımlar, mezuniyet sonrasında izlenmesi gereken süreci özetlemektedir:`,
        children: [
          {
            id: "universiteden-alinacak-belgeler",
            title: "ÜNİVERSİTEDEN ALINACAK BELGELER",
            level: 4,
            content: `Mezuniyet sonrasında öncelikle üniversitenizden şu belgeleri temin etmeniz gerekir: Diploma (Ad-soyad ve baba adı bilgilerinin pasaportla birebir uyumlu olduğu mutlaka kontrol edilmelidir.), Provisional Certificate (Geçici Mezuniyet Belgesi), Transcript (Not Dökümü). Belgelerde yer alan kimlik bilgilerinde herhangi bir yazım hatası bulunması ilerleyen aşamalarda ciddi gecikmelere neden olabileceğinden, teslim almadan önce dikkatlice kontrol edilmesi gerekmektedir.`,
          },
          {
            id: "universite-verification",
            title: "ÜNİVERSİTE VERİFİCATİON (DOĞRULAMA)",
            level: 4,
            content: `Diploma, provisional certificate ve transcript belgelerinin, üniversitenin ilgili birimi (genellikle kayıt/registrar ofisi) tarafından resmi olarak verification (doğrulama/onay) işleminden geçirilmesi gerekmektedir. Bu aşamada belgelerin arka yüzüne veya ilgili bölümüne üniversite tarafından kaşe ve imza atılır.`,
          },
          {
            id: "hec-elektronik-basvuru",
            title: "HEC ELEKTRONİK BAŞVURU",
            level: 4,
            content: `Belgelerin bir sonraki aşaması, Pakistan Yükseköğretim Kurumu olan Higher Education Commission (HEC) üzerinden yürütülmektedir. Öğrencilerin HEC'in resmi e-services sistemi üzerinden çevrim içi başvuru oluşturmaları gerekir: https://eservices.hec.gov.pk/#/auth/login Sisteme kayıt olduktan sonra diploma ve diğer belgeler için attestation (onay) başvurusu yapılır ve randevu alınır.`,
          },
          {
            id: "hec-attestation",
            title: "HEC ATTESTATİON (ONAY İŞLEMİ)",
            level: 4,
            content: `Randevu günü HEC ofisine gidilerek belgelerin asılları ibraz edilir. İnceleme sonrasında belgeler HEC tarafından resmi olarak onaylanır (attestation). Türkiye'de yapılacak denklik başvurularında bu onay zorunlu aşamalardan biridir.`,
          },
          {
            id: "mofa-islemleri",
            title: "MOFA İŞLEMLERİ (DIŞİŞLERİ BAKANLIĞI ONAYI)",
            level: 4,
            content: `HEC onayından sonra belgelerin Pakistan Dışişleri Bakanlığı tarafından da onaylanması gerekir. Bu işlem Ministry of Foreign Affairs (MOFA) üzerinden yapılmaktadır. Süreç şu şekildedir: MOFA için gerekli olan kırmızı pul (fee stamp) temin edilir. Sabah erken saatlerde MOFA ofisine gidilmesi tavsiye edilir. Belgeler için MOFA Attestation işlemi yaptırılır.`,
          },
          {
            id: "mofa-apostille",
            title: "MOFA APOSTİLLE",
            level: 4,
            content: `Türkiye'de resmi işlemlerde kullanılabilmesi için belgelerin ayrıca Apostille işleminden geçirilmesi gerekmektedir. Apostille başvurusu MOFA'nın resmi internet sitesi üzerinden randevu alınarak yapılır. Apostille, belgenin uluslararası geçerliliğini sağlayan resmi tasdik işlemidir.`,
          },
          {
            id: "belgelerin-tercumesi",
            title: "Belgelerin Tercümesi",
            level: 4,
            content: `Tüm onay ve apostil işlemleri tamamlandıktan sonra belgelerin Türkiye'de kullanılabilmesi için yeminli tercüman tarafından Türkçeye tercüme ettirilmesi ve tercümelerin mühürlü/onaylı olması gerekmektedir. Bazı durumlarda noter onayı da talep edilebilmektedir. Yukarıdaki adımlar tamamlandığında öğrenciler, Türkiye'de denklik başvurusu yapmaya hazır hale gelirler. Türkiye'deki denklik işlemleri ise Yükseköğretim Kurulu (YÖK) tarafından yürütülmektedir. Başvuru öncesinde YÖK'ün güncel mevzuat ve belge listelerinin kontrol edilmesi önemle tavsiye edilir. Süreçlerin zaman alabileceği göz önünde bulundurularak mezuniyet sonrası işlemlere gecikmeden başlanması öğrencilerin yararına olacaktır.`,
          },
        ],
      },
      {
        id: "ehliyet",
        title: "EHLİYET",
        level: 3,
        content: `Pakistan'da ehliyet almak isteyen Türk öğrenciler için süreç iki aşamadan oluşur: teorik (bilgisayar) sınavı ve direksiyon sınavı. Başvuru yaptıktan sonra genellikle sınav tarihi 42 gün sonrasına verilir. Teorik sınavda 10 soru sorulur ve en az 7 doğru yapan aday başarılı sayılır. Sınav İngilizcedir ve genellikle ehliyet sınavı için kullanılan mobil uygulamalardaki sorulara benzer sorular çıkar. Özellikle Google Play'de bulunan Traffic Sign uygulamasından çalışıldığında, sınavda benzer sorularla karşılaşmak mümkündür. Direksiyon sınavında adaydan temel sürüş becerileri istenir. Genellikle araçla kısa bir mesafe ileri gidip geri geri gelerek L park yapılması istenir. Sınava kendi aracınla gitme zorunluluğu yoktur. Sınav alanında genellikle manuel bir Mehran marka araç veya otomatik vites bir araç verilir. Bunun dışında isteyen adaylar kendi araçları ile sınava girebilir. Küçük ve otomatik vites araçlar sınavı kolaylaştırır. Sınav sırasında emniyet kemeri takmak zorunludur, geri manevralarda kamera olsa bile aynalar aktif şekilde kullanılmalıdır. Park sırasında genellikle tek hak verildiği için mesafe ve dönüş noktası iyi ayarlanmalıdır. Sınavdan önce parkuru gözlemlemek ve diğer adayların hatalarını izlemek faydalı olur. Başvuru sırasında gerekli belgeler şunlardır: Pasaport, en az 6 ay geçerli vize, öğrenci belgesi, öğrenci kimlik kartı, hostel (yurt) kartı (zorunlu değil ama önerilir). İkametgah adresi olarak hostel adresi gösterilmesi önerilir ve öğrenci belgesinde de aynı adresin yer alması gerekir. Ev adresi gösterildiğinde ek belgeler istenebilir. Ayrıca başvuru ve işlemler için yanında en az 10.000 PKR bulundurulmalıdır.`,
      },
    ],
  },
  {
    id: "konaklama",
    title: "KONAKLAMA",
    level: 2,
    content: `Pakistan'da eğitim süresince öğrenciler için farklı konaklama seçenekleri bulunmaktadır. Tercih yapılırken üniversiteye yakınlık, bütçe, güvenlik ve sunulan imkânlar dikkate alınmalıdır.`,
    children: [
      {
        id: "universite-yurtlari",
        title: "ÜNİVERSİTE YURTLARI",
        level: 3,
        content: `Birçok üniversitenin kampüs içinde veya kampüse yakın konumda bulunan öğrenci yurtları vardır. Bu yurtlar ulaşım kolaylığı ve derslere erişim açısından avantaj sağlar. Genellikle ekonomik bir seçenek olup öğrencilerin akademik ortama yakın bir çevrede kalmalarına imkân tanır. Bununla birlikte, üniversite yurtlarında yemek ve temizlik hizmetleri konusunda zaman zaman aksaklıklar yaşanabileceği göz önünde bulundurulmalıdır. Bu nedenle tercih yapmadan önce yurdun fiziki şartları ve sunduğu hizmetler hakkında bilgi edinilmesi faydalı olacaktır.`,
      },
      {
        id: "ozel-yurtlar",
        title: "ÖZEL YURTLAR",
        level: 3,
        content: `Üniversitelerin bulunduğu bölgelerde farklı bütçelere hitap eden çok sayıda özel yurt bulunmaktadır. Bu yurtlar genellikle daha esnek konaklama seçenekleri ve farklı oda alternatifleri sunar. Öğrenciler, üniversitelerine yakın ve bütçelerine uygun bir özel yurt tercih ederek daha konforlu bir konaklama imkânı elde edebilirler.`,
      },
      {
        id: "dernek-vakif-evleri",
        title: "DERNEK VE VAKIFLARA BAĞLI ÖĞRENCİ EVLERİ",
        level: 3,
        content: `Pakistan'a öğrenci gönderen ve eğitim süresince öğrencileri destekleyen bazı dernek ve vakıfların öğrenci evleri bulunmaktadır. Bu evler yalnızca barınma değil, aynı zamanda rehberlik ve sosyal destek imkânı da sunmaktadır. Özellikle Türkiye'den gelen öğrenciler için bu evlerde Türk yemeklerinin çıkması önemli bir avantajdır. Ayrıca bu ortam, öğrencilerin ülkeye uyum sağlamalarını kolaylaştırmakta ve güvenli bir sosyal çevre içinde eğitim hayatlarını sürdürmelerine katkı sunmaktadır. Öğrenciler, ihtiyaç ve beklentilerine göre bu seçeneklerden birini tercih ederek kendileri için en uygun konaklama imkânını değerlendirebilirler.`,
      },
    ],
  },
  {
    id: "temel-gereksinimler",
    title: "TEMEL GEREKSİNİMLER",
    level: 2,
    children: [
      {
        id: "ulasim",
        title: "ULAŞIM",
        level: 3,
        content: `Pakistan'da şehir içi ulaşım, öğrenciler için hem ekonomik hem de pratik seçenekler sunmaktadır. En yaygın yöntemlerden biri mobil uygulama üzerinden çağrılan taksi ve motor taksilerdir. InDrive, Careem, Yango ve Bikea gibi uygulamalar cep telefonuna indirilerek kolaylıkla kullanılabilir. Bu sistem sayesinde konum üzerinden araç çağrılabilir, ücret bilgisi önceden görülebilir ve sürücü bilgilerine uygulama üzerinden erişilebilir. Motor taksiler, özellikle kısa mesafelerde ve yoğun trafikte daha hızlı ve daha ekonomik bir alternatif sunmaktadır. Otomobil taksilere göre ücretleri genellikle daha düşüktür ve şehir içi ulaşımda pratiklik sağlar. Uzun süreli kalmayı planlayan öğrenciler arasında ise şahsi motor satın almak oldukça yaygındır. Motor hem ekonomik olması hem de günlük ulaşımı kolaylaştırması sebebiyle tercih edilmektedir. Maddi imkânı daha geniş olanlar otomobil satın almayı da düşünebilmektedir; ancak araç alımında resmî işlemler ve masraflar dikkate alınmalıdır.`,
      },
      {
        id: "iletisim",
        title: "İLETİŞİM",
        level: 3,
        content: `Pakistan'a giriş yaptıktan sonra yurt dışından getirilen cep telefonları, belirli bir süre (genellikle yaklaşık iki ay) sonunda kayıt yaptırılmadığı takdirde kullanıma kapanabilmektedir. Bu nedenle öğrencilerin iki seçeneği bulunmaktadır: Mevcut telefonlarını belirlenen prosedür çerçevesinde ücret ödeyerek kayıt ettirmek, ya da bütçelerine uygun yeni bir telefon satın almak. Ülkede cep telefonu ve elektronik ürünlere erişim kolaydır; farklı fiyat aralıklarında cihaz bulmak mümkündür. İletişim için Pakistan'a ait bir SIM kart edinmek gerekmektedir. Yerel bir numara alındıktan sonra uygun tarifelerle internet, şehir içi ve uluslararası arama hizmetlerinden faydalanılabilir. SIM kart temini genellikle pasaport ibrazıyla operatör bayilerinden kolayca yapılabilmektedir. Bu işlemlerin erken dönemde tamamlanması hem günlük iletişim hem de resmi işlemler açısından kolaylık sağlayacaktır.`,
      },
      {
        id: "tl-rupi-doviz",
        title: "TL-RUPİ-DÖVİZ",
        level: 3,
        content: `Pakistan'ın para birimi Pakistan Rupisi (PKR)'dir ve günlük kullanımda "rupi" olarak ifade edilir. Ülkede tüm nakit ödemeler PKR üzerinden yapılmaktadır. Öğrenciler para temini konusunda farklı yöntemler kullanabilmektedir. Yaygın uygulamalardan biri, Pakistan'da ticaret yapan veya şirket sahibi olan Türk vatandaşlarıyla anlaşarak Türkiye hesaplarına Türk lirası gönderip karşılığında elden rupi almaktır. Bu yöntem, kur farkı ve transfer süreci açısından bazı öğrenciler için pratik bir çözüm olabilmektedir. Bunun yanı sıra, bazı Türk bankalarının Pakistan'daki bankalarla anlaşmaları bulunmaktadır. Özellikle uluslararası işlem yapabilen banka kartlarıyla Pakistan'daki ATM'lerden doğrudan para çekmek mümkündür. Örneğin, yurt dışı kullanıma açık banka kartları aracılığıyla PKR cinsinden nakit temin edilebilir. Bu yöntemde bankanın uyguladığı döviz kuru ve komisyon oranlarının önceden öğrenilmesi faydalı olacaktır. Öğrencilerin, ülkede kalış sürelerine ve ihtiyaçlarına göre kendileri için en uygun finansal yöntemi tercih etmeleri tavsiye edilir.`,
      },
      {
        id: "acil-numaralar",
        title: "ACİL NUMARALAR VE E-POSTALAR",
        level: 3,
        content: `Aşağıdaki telefon numaraları Pakistan'da her şehirde genel olarak geçerli acil durum hizmetleri içindir. Bu numaraları telefonunuza kaydetmeniz, beklenmedik bir durumda hızlıca yardım almanızı kolaylaştırır: AMBULANS – 115 (Edhi Vakfı gibi ulusal yardım kuruluşlarının ambulans hizmetine doğrudan ulaşmak için aranır.), RESCUE – 1122 (Acil tıbbi yardım, kurtarma ve ilk müdahale hizmetlerini sağlayan genel acil durum hattıdır; yangın, kaza ve tıbbi müdahale için 1122 aranabilir.), POLİS – 15 (Suç, saldırı, hırsızlık ve güvenlik tehditleri gibi durumlarda polis ekiplerine ulaşmak için kullanılabilir.), İSLAMABAD BÜYÜKELÇİLİĞİ – consulate.islamabad@mfa.gov.tr (Bu mail adresi üzerinden Türkiye Cumhuriyeti İslamabad Başkonsolosluğu'na randevu alınabilir ve konsolosluk işlemleriyle ilgili bilgi talep edilebilir.)`,
      },
    ],
  },
  {
    id: "universiteler",
    title: "ÜNİVERSİTELER",
    level: 2,
    content: `Pakistan'ın üniversite sistemi son yıllarda hem bölgesel hem de uluslararası sıralamalarda dikkat çekmeye başlamıştır. Birçok kurum güçlü akademik programlar, araştırma imkânları ve uluslararası öğrencilere uygun kabul kriterleri sunmaktadır. Ülke genelinde farklı şehirlerdeki eğitim merkezleri, teknik bilimlerden sosyal bilimlere kadar geniş alanlarda diploma programları sağlar.`,
    children: [
      {
        id: "iiui",
        title: "ULUSLARARASI İSLÂM ÜNİVERSİTESİ İSLAMABAD (IIUI)",
        level: 3,
        content: `İslamabad'daki Uluslararası İslâm Üniversitesi (International Islamic University, IIUI), 1980 yılında Pakistan'ın uluslararası İslami yükseköğretim merkezi olarak kurulmuştur. Üniversite, İslami değerlerle modern akademiyi birleştirmeyi amaçlar ve hem yerel hem de yabancı öğrenciler için kapsamlı eğitim fırsatları sunar. IIUI, özellikle İslami ilimler alanında öne çıkar. Usuluddin, Tefsir, Hadis, Şeriat, İslam Düşüncesi, Seerah ve Dâ'wah gibi konularda lisans, yüksek lisans ve doktora programları bulunur. Akademik kadroda çoğu Al-Azhar mezunu profesörler yer alır. Ayrıca Şeriat ve Hukuk Fakültesi, BA/LLB Hons kombinasyon programları ve LLM uzmanlık alanları ile uluslararası ticaret, insan hakları ve şirketler hukuku konularında eğitim verir. Arap Dili ve Edebiyatı bölümü ise dilbilim, çeviri ve edebiyat alanlarında dersler sunar.`,
      },
      {
        id: "comsats",
        title: "COMSATS UNİVERSİTY İSLAMABAD (CUI)",
        level: 3,
        content: `COMSATS, Pakistan'ın önde gelen devlet üniversitelerindendir ve özellikle Bilgisayar Bilimleri ile Mühendislik alanlarında tanınır. QS Dünya Üniversite Sıralamalarında Pakistan'ın en üst sıralarında yer alan CUI, çok kampüslü yapısı ve geniş öğrenci topluluğuyla tercih edilmektedir. Uluslararası Öğrenci Ofisi: int.admissions@comsats.edu.pk`,
      },
      {
        id: "qau",
        title: "QUAİD-İ-AZAM UNİVERSİTY (QAU)",
        level: 3,
        content: `Quaid-i-Azam University, ülkenin en saygın devlet üniversitelerinden biridir ve araştırma performansı ile uluslararası tanınırlığı yüksek kurumlar arasındadır. Doğa bilimleri, sosyal bilimler ve araştırma odaklı programlarıyla öne çıkar. Uluslararası Öğrenci Ofisi: internationaloffice@qau.edu.pk`,
      },
      {
        id: "air-university",
        title: "AİR UNİVERSİTY",
        level: 3,
        content: `Islamabad merkezli Pakistan Hava Kuvvetleri tarafından kurulan bu devlet üniversitesi, mühendislik ve teknoloji alanlarında güçlü bir akademik profile sahiptir. Öğrenciler modern eğitim tesisleri ve pratik uygulama fırsatlarıyla eğitim görür. Pakistan'ın önde gelen araştırma üniversiteleri arasında yer alır. Uluslararası Öğrenci Ofisi: webmaster@mail.au.edu.pk`,
      },
      {
        id: "bahria",
        title: "BAHRİA UNİVERSİTY",
        level: 3,
        content: `Bahria University, Pakistan Deniz Kuvvetleri tarafından kurulmuş olup üç büyük şehirde kampüsleri bulunur. Çok disiplinli eğitim yapısıyla mühendislikten sosyal bilimlere kadar çeşitli programlar sunar ve ulusal akademik sıralamalarda yer alır. Uluslararası Ofis: internationaloffice@bahria.edu.pk`,
      },
      {
        id: "numl",
        title: "NATİONAL UNİVERSİTY OF MODERN LANGUAGES (NUML)",
        level: 3,
        content: `NUML, dil bilimleri, iletişim, sosyal bilimler ve mühendislik dallarında eğitim veren büyük bir devlet üniversitesidir. Birden fazla şehirde kampüsleri bulunur ve farklı ülkelerden öğrencilere açıktır. Uluslararası Öğrenci Ofisi: international@numl.edu.pk`,
      },
      {
        id: "aiou",
        title: "ALLAMA IQBAL OPEN UNİVERSİTY (AIOU)",
        level: 3,
        content: `AIOU, uzaktan eğitim modeliyle Pakistan'ın en büyük öğrenci kitlesine sahip üniversitelerindendir. Pek çok farklı şehirde merkezleri bulunur ve her düzeyde akademik programlar sunar. Uluslararası Öğrenci Ofisi: admission@aiou.edu.pk`,
      },
    ],
  },
  {
    id: "dil-kurslari",
    title: "DİL KURSLARI",
    level: 2,
    content: `İslamabad, yabancı öğrenciler için hem İngilizce hem de Urduca dil eğitimi sunan çeşitli kurs ve programlara ev sahipliği yapmaktadır. Bu kurslar, öğrencilerin dil becerilerini hızla geliştirmelerine, günlük yaşamda iletişimlerini güçlendirmelerine ve üniversite ortamına uyum sağlamalarına yardımcı olur.`,
    children: [
      {
        id: "5-star-institute",
        title: "5 STAR INSTITUTE / İNGİLİZCE",
        level: 3,
        content: `Özellikle sıfırdan İngilizce öğrenmek isteyen öğrenciler için uygun olan 5 Star Institute, gramer temelli eğitimle birlikte konuşma ve dinleme becerilerini geliştirmeye yoğunlaşır. Öğrenciler, eğitmenlerle birebir etkileşimde bulunarak pratik yapma imkânı bulur. Kursun küçük sınıf yapısı, her öğrencinin ilgi ve seviyesine uygun destek almasını sağlar.`,
      },
      {
        id: "numl-dil",
        title: "NUML ÜNİVERSİTESİ / İNGİLİZCE URDUCA ÇİNCE",
        level: 3,
        content: `NUML Üniversitesi'nin dil programı, akademik bir ortamda öğrenim görmek isteyenler için idealdir. Üniversite kampüsünde sunulan kurs, öğrencilerin hem sosyal çevre edinmesini hem de akademik disiplin içinde dil becerilerini geliştirmesini kolaylaştırır. Daha önce katılan öğrencilerle iletişim kurmak, kursun işleyişi ve öğretim tarzı hakkında ön bilgi edinmeyi sağlar.`,
      },
      {
        id: "bahria-dil",
        title: "BAHRİA ÜNİVERSİTESİ / İNGİLİZCE",
        level: 3,
        content: `Bahria Üniversitesi'nin sunduğu dil kursları, öğrencilere üniversite ortamını deneyimleme fırsatı verir. Kampüste mevcut Türk öğrenci topluluğu, yeni katılanların uyum sağlamasına yardımcı olur ve sosyal etkinliklere katılımı teşvik eder. Kurs, konuşma, dinleme ve yazma becerilerini dengeli bir şekilde geliştirmeyi amaçlar.`,
      },
      {
        id: "berlitz",
        title: "BERLİTZ / İNGİLİZCE",
        level: 3,
        content: `Berlitz, dünya genelinde şubeleri bulunan köklü bir dil okuludur ve özellikle iş İngilizcesi ile konuşma pratiğine odaklanır. Uluslararası öğrenciler ve profesyonellerle bir arada eğitim almak, öğrencilerin dil becerilerini gerçek yaşam ve iş ortamlarında uygulama fırsatını artırır. Modern öğretim yöntemleriyle öğrencilerin iletişim becerileri hızla gelişir.`,
      },
      {
        id: "zubaan",
        title: "ZUBAAN LANGUAGE INSTITUTE / URDUCA VE YEREL DİLLER",
        level: 3,
        content: `Zubaan, Urduca ve diğer yerel dillerin öğretiminde uzmanlaşmıştır. Kendi kaynak kitapları ve eğitim materyalleri ile sistematik bir öğrenim sunar. Kurs, başlangıçtan ileri seviyeye kadar dersler sunarak öğrencilerin hem dil bilinci kazanmalarını hem de kültürel bağlamda dil yetkinliklerini artırmalarını sağlar.`,
      },
    ],
  },
  {
    id: "saglik",
    title: "SAĞLIK",
    level: 2,
    children: [
      {
        id: "hastaneler",
        title: "HASTANELER",
        level: 3,
        children: [
          {
            id: "shifa",
            title: "SHİFA INTERNATİONAL HOSPİTAL – İSLAMABAD",
            level: 4,
            content: `Shifa International Hospital, İslamabad'da modern altyapısı ve deneyimli doktor kadrosuyla öne çıkan özel bir hastanedir. Acil servis, genel cerrahi, kardiyoloji, onkoloji ve pediatri gibi birçok branşta hizmet verir. Hizmet kalitesi yüksek olup, ücretler ortalamanın biraz üzerindedir.`,
          },
          {
            id: "pims",
            title: "PAKİSTAN INSTİTUTE OF MEDİCAL SCİENCES (PIMS) – İSLAMABAD",
            level: 4,
            content: `PIMS, kamu hastanesi olarak Pakistan'ın en büyük sağlık merkezlerinden biridir. Acil bakım, cerrahi, dahiliye ve yoğun bakım üniteleri dahil olmak üzere kapsamlı hizmetler sunar. Devlet destekli sağlık sistemi üzerinden erişim sağlanabilir, ücretler Shifa International'a göre daha uygundur.`,
          },
          {
            id: "paf-hospital",
            title: "PAKİSTAN AİR FORCE HOSPİTAL (PAF) – İSLAMABAD",
            level: 4,
            content: `PAF Hospital, modern ekipmanları ve deneyimli personeli ile yüksek standartlı sağlık hizmeti sunar. Acil servis, cerrahi ve dahili branşlarda güçlü bir altyapıya sahiptir. Hizmet kalitesi yüksek, ücretler özel hastane seviyesinde ve biraz yüksektir.`,
          },
          {
            id: "aga-khan",
            title: "AGA KHAN UNİVERSİTY HOSPİTAL – KARAÇİ",
            level: 4,
            content: `Aga Khan University Hospital, Karachi'de kapsamlı ve modern sağlık hizmeti sunan bir hastanedir. Kardiyoloji, onkoloji, organ nakli, pediatri ve acil servisleriyle öne çıkar. Kaliteli hizmet sağlamakta olup, ücretler biraz yüksektir.`,
          },
          {
            id: "shaukat-khanum",
            title: "SHAUKAT KHANUM MEMORİAL CANCER HOSPİTAL & RESEARCH CENTRE – LAHORE",
            level: 4,
            content: `Shaukat Khanum Memorial Cancer Hospital, kanser tedavisi ve araştırmalarında önde gelen bir merkezdir. Radyoterapi, kemoterapi ve cerrahi imkanları sunar. Sağlanan hizmet yüksek kalitededir ve ücretler ortalamanın üzerinde olabilir.`,
          },
        ],
      },
      {
        id: "saglik-beslenme",
        title: "PAKİSTAN'DA SAĞLIK VE BESLENME KONUSUNDA DİKKAT EDİLMESİ GEREKENLER",
        level: 3,
        content: `Pakistan'a seyahat etmeden önce bazı temel sağlık önlemlerini almak hem ilk uyum sürecinizi kolaylaştırır hem de karşılaşılabilecek riskleri en aza indirir. Yolculuk öncesinde hepatit A, hepatit B ve tetanos gibi aşıların yaptırılması tavsiye edilir. Ayrıca seyahatten önce doktorunuza danışarak ihtiyaç duyabileceğiniz ağrı kesici, ateş düşürücü ve mide ilaçlarını reçeteli şekilde temin etmeniz faydalı olacaktır. Özellikle ilk aylarda alışık olunmayan iklim ve beslenme düzeni sebebiyle basit sağlık sorunları yaşanabileceğinden hazırlıklı olmak önemlidir. Pakistan'da gıda ve içecek tüketiminde dikkatli davranmak sağlığınızı korumanın en önemli adımlarından biridir. Musluk suyu tüketiminden kaçınılmalı, yalnızca güvenilir ve kapalı ambalajlı sular tercih edilmelidir. Meyve suları ve benzeri içeceklerin hijyenik ve bilinen yerlerden alınmasına özen gösterilmelidir. Özellikle yaz aylarında içeceklere eklenen buzların hangi sudan yapıldığı bilinmediği için buz kullanımından kaçınmak daha güvenlidir. Çay ve kahve gibi sıcak içecekler genellikle daha güvenli bir tercih olacaktır. Sokak yemekleri Pakistan kültürünün önemli bir parçasıdır; ancak tüketirken yemeğin taze hazırlanmış ve sıcak olmasına dikkat edilmelidir. Uzun süre açıkta beklemiş yiyeceklerden uzak durmak gerekir. Ayrıca toplu kullanımda olan çatal, kaşık ve bardakların hijyeninden emin olunmadığı durumlarda tek kullanımlık ürünler tercih edilmesi sağlık açısından daha güvenlidir. Bunun yanında, özellikle yaz ve muson dönemlerinde görülebilen dengue ve sıtma gibi hastalıklara karşı sivrisineklerden korunmak önem taşır. Sinek kovucu sprey veya krem kullanmak, akşam saatlerinde daha kapalı kıyafetler tercih etmek ve yaşam alanlarını korumak alınabilecek basit ama etkili önlemlerdir. Kış aylarında ise büyük şehirlerde hava kirliliği artış gösterebilir; solunum yolu hassasiyeti olan kişilerin maske kullanması ve yoğun kirliliğin olduğu günlerde açık havada uzun süre kalmaması önerilir.`,
      },
    ],
  },
  {
    id: "turistik-mekanlar",
    title: "TURİSTİK VE TARİHİ MEKÂNLAR",
    level: 2,
    children: [
      {
        id: "islamabad",
        title: "İSLAMABAD",
        level: 3,
        children: [
          {
            id: "faysal-mosque",
            title: "FAYSAL CAMİ",
            level: 4,
            content: `Faysal Cami, yalnızca İslamabad'ın değil tüm Pakistan'ın en güçlü sembollerinden biridir. 1966 yılında dönemin Suudi Arabistan Kralı Faysal bin Abdülaziz'in Pakistan ziyareti sırasında caminin inşa edilmesi fikri ortaya çıkmış, proje Suudi Arabistan tarafından finanse edilmiştir. 1976 yılında temeli atılan cami 1986 yılında tamamlanmıştır. Cami, Türk mimar Vedat Dalokay tarafından tasarlanmıştır. Dalokay'ın modern çizgileri geleneksel İslam mimarisiyle harmanlayan tasarımı, klasik kubbeli cami anlayışını tamamen terk ederek çadır formunda bir yapı ortaya koymuştur. Bu tasarımın, İslam'ın sade ve evrensel ruhunu yansıtması amaçlanmıştır. Ana ibadet alanı yaklaşık 5.000 metrekarelik kapalı bir alana sahiptir ve avlularla birlikte aynı anda yaklaşık 100.000 kişinin namaz kılabileceği kapasiteye ulaşır. Dört minaresi 88 metre yüksekliğindedir ve Türk-Osmanlı mimari etkilerini taşır. İç mekânda Türk hattatların eserleri, büyük avize ve sade fakat görkemli bir mihrap tasarımı dikkat çeker. Caminin bulunduğu alan sadece bir ibadet yeri değil, aynı zamanda kültürel bir merkez niteliğindedir. Bir dönem International Islamic University Islamabad burada kurulmuş ve ilk akademik faaliyetlerini bu yerleşkede sürdürmüştür. Bu yönüyle cami, eğitim ve dini hayatın birleştiği önemli bir merkez olmuştur. Konumu itibarıyla Margalla Tepeleri ile bütünleşen yapı, gün batımında İslamabad siluetinin en etkileyici görüntülerinden birini oluşturur.`,
          },
          {
            id: "pakistan-monument",
            title: "PAKISTAN MONUMENT",
            level: 4,
            content: `Pakistan Anıtı, ülkenin ulusal kimliğini ve tarihsel birlik anlayışını temsil eden modern bir yapıdır. 2007 yılında tamamlanan anıt, Shakarparian Tepesi üzerinde konumlanmıştır ve mimari tasarımı Arif Masoud tarafından yapılmıştır. Anıtın çiçek formundaki yapısı, Pakistan'ı oluşturan dört ana eyaleti büyük yapraklarla, diğer bölgeleri ise daha küçük yapraklarla sembolize eder. Yaprakların iç yüzeylerinde ülkenin bağımsızlık mücadelesi, Pakistan'ın kurucusu Muhammed Ali Cinnah ve önemli tarihî olaylar kabartmalarla tasvir edilmiştir. Bu yönüyle anıt yalnızca mimari bir eser değil, aynı zamanda açık hava tarih anlatımıdır. Anıtın bulunduğu konum, İslamabad ve Rawalpindi şehirlerini aynı anda görebileceğiniz nadir noktalardan biridir. Gece saatlerinde yapılan ışıklandırma, yapıyı daha da dikkat çekici hâle getirir. Ulusal günlerde ve resmî törenlerde önemli bir toplanma alanı olarak kullanılır.`,
          },
          {
            id: "pakistan-monument-museum",
            title: "PAKİSTAN MONUMENT MUSEUM",
            level: 4,
            content: `Pakistan Anıtı kompleksinin içinde yer alan Pakistan Monument Museum, ülkenin tarihini kronolojik bir anlatımla sunan modern bir müzedir. Müze, Pakistan'ın 1947'deki bağımsızlık sürecinden günümüze kadar olan siyasal, kültürel ve toplumsal gelişimini multimedya sunumları ve görsel materyallerle aktarır. Müze içerisinde bağımsızlık hareketine dair belgeler, fotoğraflar, liderlere ait bilgiler ve dijital sergiler yer alır. Ziyaretçiler, Pakistan'ın kuruluş sürecini ve tarihsel kırılma noktalarını daha sistematik bir şekilde öğrenme fırsatı bulur. Eğitim grupları ve öğrenciler için de öğretici bir merkez niteliğindedir. Anıt ve müze birlikte düşünüldüğünde, bu kompleks İslamabad'daki en anlamlı ve simgesel ziyaret noktalarından biri olarak öne çıkar. Hem mimari estetik hem de tarihî bilinç açısından şehri anlamak isteyen ziyaretçiler için önemli bir duraktır.`,
          },
          {
            id: "daman-e-koh",
            title: "DAMAN-E-KOH",
            level: 4,
            content: `Daman-e-Koh, Margalla Tepeleri üzerinde yer alan popüler bir seyir ve piknik alanıdır. Şehir merkezinden kısa bir sürüş mesafesinde bulunan bu bölge, 360 derece İslamabad manzarası sunar ve temiz hava ile doğanın huzurunu bir arada yaşatır. Özellikle fotoğraf ve doğa tutkunları için gün doğumu ve gün batımı zamanları eşsiz görüntüler sağlar.`,
          },
          {
            id: "saidpur-village",
            title: "SAİDPUR KÖYÜ",
            level: 4,
            content: `Saidpur Köyü, Margalla Tepeleri'nin eteklerinde yer alan yaklaşık 500 yıllık tarihî bir köy yerleşimidir. Mughal dönemine kadar uzanan geçmişiyle Saidpur, farklı medeniyetlerin izlerini taşır. Restore edilmiş taş evler, dar tarihî sokaklar ve küçük galeriler burada görülür. Ayrıca bölgede Hindular ve Müslümanların birlikte yaşadığı dönemlere ait izler de vardır; eski tapınak kalıntıları ziyaret açısından ilgi çeker. Küçük müzeler, hediyelik eşya dükkanları ve geleneksel Pakistan mutfağı sunan mekanlar köyü hem tarihî hem sosyal bir gezi noktasına dönüştürmüştür.`,
          },
          {
            id: "lok-virsa",
            title: "LOK VİRSA KÜLTÜR MERKEZİ",
            level: 4,
            content: `Lok Virsa Kültür Merkezi, Pakistan'ın geleneksel halk kültürünü tanıtan kapsamlı bir merkezdir. İçerisindeki müzede ahşap oymalar, takılar, nakışlı kıyafetler, el sanatları ve çok çeşitli etnografik eserler sergilenir. Merkez, sadece müze olmayıp aynı zamanda kültürel festivallere, halk danslarına ve folklor etkinliklerine ev sahipliği yapar. Bu mekân, Pakistan'ın farklı bölgelerindeki yaşam biçimlerini ve zanaat geleneklerini öğrenmek isteyenler için bulunmaz bir fırsattır.`,
          },
          {
            id: "lake-view-park",
            title: "LAKE VIEW PARK",
            level: 4,
            content: `Lake View Park, şehir içindeki doğa kaçamağı olarak bilinen Rawal Gölü kıyısındaki geniş parklardan biridir. Yürüyüş yolları, piknik alanları ve göl çevresindeki dinlenme noktalarıyla özellikle hafta sonları ve akşam saatlerinde yerel halk ve turistler tarafından tercih edilir. Tekne gezisi, su sporları ve doğal manzaranın keyfini çıkarma gibi aktiviteler için uygundur.`,
          },
          {
            id: "rose-jasmine-garden",
            title: "ROSE AND JASMINE GARDEN",
            level: 4,
            content: `Rose and Jasmine Garden, Shakarparian bölgesinde yer alan geniş bir botanik alandır. Yaklaşık 250 farklı gül çeşidi ve 150'yi aşkın yasemin türü ile bahçe, özellikle ilkbahar sezonunda renk ve koku şöleni sunar. Yıllık çiçek sergileri ve bahar etkinlikleriyle doğa tutkunlarına huzurlu bir ortam sağlar. Burada yürüyüş yapabilir, çiçeklerin arasında fotoğraf çekebilir veya sadece temiz havanın tadını çıkarabilirsiniz.`,
          },
        ],
      },
      {
        id: "lahor",
        title: "LAHOR",
        level: 3,
        children: [
          {
            id: "lahore-fort",
            title: "LAHORE FORT",
            level: 4,
            content: `Lahore Fort, Pakistan'ın en önemli tarihî yapılarından biridir ve UNESCO Dünya Mirası Listesi'nde yer alır. Temelleri çok daha eski dönemlere dayansa da kale bugünkü görkemli hâlini özellikle Babür İmparatorluğu döneminde kazanmıştır. İmparator Ekber, Cihangir ve Şah Cihan dönemlerinde genişletilmiş ve saray kompleksi hâline getirilmiştir. Kale içerisinde Sheesh Mahal (Ayna Sarayı), Naulakha Köşkü, Diwan-i-Aam (Halk Divanı) ve Diwan-i-Khas (Özel Divan) gibi bölümler bulunur. Özellikle Sheesh Mahal'in duvar ve tavan süslemelerinde kullanılan aynalı mozaik tekniği Babür sanatının zirve örneklerindendir. Kale sadece askerî bir yapı değil; aynı zamanda yönetim, tören ve saray yaşamının merkezi olmuştur. Lahor'un tarihî kimliğinin en güçlü sembollerinden biridir.`,
          },
          {
            id: "badshahi-mosque",
            title: "BADSHAHI CAMİ",
            level: 4,
            content: `1673 yılında Babür İmparatoru Aurangzeb tarafından inşa ettirilen Badshahi Cami, Güney Asya'nın en büyük ve en görkemli camilerinden biridir. Kırmızı kumtaşı ve mermer kullanılarak yapılan cami, klasik Babür mimarisinin ihtişamını yansıtır. Avlusu aynı anda yaklaşık 55.000 kişiyi ağırlayabilecek büyüklüktedir. İç mekânda mermer kakmalar, fresk süslemeler ve kemerli yapılar dikkat çeker. Badshahi Cami hem mimari ölçeği hem de tarihî önemi bakımından İslam dünyasının en etkileyici ibadet yapılarından biri kabul edilir. Kraliyet Kalesi ile yan yana konumlanması, bölgeyi Lahor'un en önemli tarihî kompleksi hâline getirir.`,
          },
          {
            id: "shalimar-gardens",
            title: "ŞALİMAR BAHÇELERİ",
            level: 4,
            content: `1641 yılında Şah Cihan tarafından yaptırılan Şalimar Bahçeleri de UNESCO Dünya Mirası Listesi'ndedir. Babür bahçe mimarisinin en seçkin örneklerinden biri olan bu kompleks, üç teraslı bir düzen üzerine kurulmuştur. Bahçede yüzlerce mermer çeşme, su kanalları ve simetrik peyzaj düzeni bulunur. Su sistemi yerçekimi prensibiyle çalışacak şekilde tasarlanmıştır ve dönemi için ileri mühendislik örneği sayılır. Şalimar Bahçeleri, Babür döneminde kraliyet ailesinin dinlenme ve tören alanı olarak kullanılmıştır.`,
          },
          {
            id: "wazir-khan-mosque",
            title: "VAZİR KHAN CAMİ",
            level: 4,
            content: `1634 yılında Şah Cihan döneminde inşa edilen Vazir Khan Cami, Lahor'un en zarif ve süsleme açısından en zengin camilerinden biridir. Caminin duvarları tamamen fresk tekniğiyle yapılmış renkli motiflerle kaplıdır. Özellikle iç mekândaki kalem işi süslemeler, İran ve Orta Asya etkilerini yansıtır. Caminin avlusu, medrese odaları ve minareleriyle birlikte klasik Babür şehir camisi mimarisinin seçkin bir örneğidir.`,
          },
          {
            id: "shahi-hammam",
            title: "ŞAHI HAMAM",
            level: 4,
            content: `1641 yılında Lahor valisi Hâkim Ilmuddin Ansari tarafından yaptırılan Şahi Hamam, Babür dönemine ait kamusal hamam mimarisinin önemli örneklerinden biridir. Uzun süre toprak altında kalmış, restorasyon çalışmalarıyla yeniden gün yüzüne çıkarılmıştır. Hamamın iç mekânında sıcaklık ve buhar bölümleri, kubbeli tavanlar ve duvar süslemeleri yer alır. Bu yapı, Babür döneminde şehir yaşamının sosyal boyutunu anlamak açısından önemli bir eserdir.`,
          },
          {
            id: "chauburji",
            title: "CHAUBURJİ",
            level: 4,
            content: `Chauburji, 1646 yılında inşa edilmiş dört minareli anıtsal bir kapıdır. Aslında büyük bir bahçe kompleksinin giriş kapısı olarak yapılmıştır. Günümüzde yalnızca kapı kısmı ayakta kalmıştır. Mavi çini süslemeleri ve Pers etkili yazıtlarıyla dikkat çeker. Babür döneminin estetik anlayışını yansıtan nadir şehir kapılarından biridir.`,
          },
          {
            id: "minar-e-pakistan",
            title: "MİNAR-E-PAKİSTAN",
            level: 4,
            content: `Minar-e-Pakistan, 1940 yılında Pakistan'ın bağımsızlık kararının alındığı Lahor Kararı'nın anısına inşa edilmiştir. 1968 yılında tamamlanan anıt, modern Pakistan'ın doğuşunu simgeler. Yaklaşık 70 metre yüksekliğindeki yapı, İslami ve modern mimari unsurları birleştirir. Alt kısmında Mughal tarzı kemerler, üst bölümde ise modern betonarme tasarım görülür. Ulusal kimliğin sembolik yapılarından biridir.`,
          },
          {
            id: "allama-iqbal-tomb",
            title: "ALLAMA İQBAL TÜRBESİ",
            level: 4,
            content: `Pakistan'ın milli şairi ve düşünürü Muhammed İkbal'in mezarı, Badshahi Camisi'nin yanında yer alır. Kırmızı taş ve mermerle inşa edilen türbe, sade fakat anlam yüklü bir tasarıma sahiptir. İkbal'in fikirleri Pakistan'ın kuruluş ideolojisinde önemli rol oynamıştır. Bu nedenle türbe hem edebî hem siyasi anlamda sembolik bir mekândır.`,
          },
          {
            id: "tomb-of-jahangir",
            title: "CİHANGİR'İN MEZARI",
            level: 4,
            content: `Babür İmparatoru Cihangir'in mezarı 1637 yılında tamamlanmıştır. Büyük bir bahçe kompleksi içinde yer alır ve dört minareli yapısıyla dikkat çeker. Duvar süslemelerinde mermer kakma ve mozaik teknikleri kullanılmıştır. İç mekândaki cenotaf (temsili mezar) mermer işlemeleriyle oldukça zariftir. Babür mezar mimarisinin en seçkin örneklerinden biridir.`,
          },
          {
            id: "data-darbar",
            title: "DATA DARBAR",
            level: 4,
            content: `11. yüzyıl mutasavvıfı Ali Hucviri'ye ait olan türbe, Güney Asya'nın en önemli tasavvuf merkezlerinden biridir. Halk arasında Data Darbar olarak bilinir. Her gün binlerce ziyaretçi tarafından ziyaret edilir. Dini ve manevi atmosferi güçlüdür ve Pakistan'daki sufi geleneğinin en önemli merkezlerinden biridir.`,
          },
          {
            id: "wagah-border",
            title: "WAGAH SINIRI",
            level: 4,
            content: `Lahor ile Hindistan'ın Amritsar kenti arasında yer alan Wagah Sınırı, her gün gerçekleştirilen bayrak indirme töreniyle ünlüdür. Pakistan Rangers ve Hindistan sınır birlikleri tarafından yapılan tören, askeri disiplin ve millî gurur gösterisi niteliğindedir. Tören, iki ülke arasındaki tarihî rekabetin sembolik bir yansımasıdır ve oldukça kalabalık izleyici kitlesi tarafından takip edilir.`,
          },
        ],
      },
      {
        id: "karachi",
        title: "KARAÇİ",
        level: 3,
        children: [
          {
            id: "mazar-e-quaid",
            title: "MAZAR-E-QUAİD",
            level: 4,
            content: `Pakistan'ın kurucusu Muhammed Ali Cinnah'ın anıt mezarı, Karaçi'nin en önemli simgesi ve ülkenin ulusal hafızasının merkezlerinden biridir. 1960'lı yıllarda tamamlanan yapı tamamen beyaz mermerden inşa edilmiştir. Kare planlı ve büyük kubbeli tasarımı, modern İslam mimarisini yansıtan sade fakat anıtsal bir anlayışa sahiptir. İç mekânda Cinnah'ın sandukası yer almakta olup, Pakistan'ın önemli devlet adamlarından Liaquat Ali Khan ve Fatima Jinnah'ın kabirleri de aynı komplekste bulunmaktadır. Resmî törenler ve millî anma programları burada gerçekleştirilir. Yapı, Pakistan'ın bağımsızlık sürecinin sembolüdür.`,
          },
          {
            id: "wazir-mansion",
            title: "WAZİR MANSİON",
            level: 4,
            content: `1874 yılında inşa edilen bu üç katlı tarihî yapı, Muhammed Ali Cinnah'ın doğduğu evdir. Günümüzde müze olarak hizmet vermektedir. Kolonyal dönem mimarisini yansıtan bina, ahşap detayları ve dar merdivenleriyle dikkat çeker. Müze içerisinde Cinnah'a ait kişisel eşyalar, fotoğraflar, belgeler ve döneme ait mobilyalar sergilenmektedir. Pakistan'ın kuruluş sürecini anlamak açısından büyük tarihî öneme sahiptir.`,
          },
          {
            id: "quaid-e-azam-house",
            title: "QUAİD-E-AZAM HOUSE MUSEUM",
            level: 4,
            content: `1890'lı yıllarda inşa edilen bu yapı, Cinnah'ın Karaçi'de yaşadığı konuttur. İngiliz kolonyal mimarisinin seçkin örneklerinden biridir. Bağımsızlık sonrası bir süre resmî konut olarak kullanılmış, daha sonra müzeye dönüştürülmüştür. İç mekânda Cinnah ve Fatima Jinnah'a ait özel eşyalar, çalışma odaları ve tarihî belgeler yer almaktadır. Pakistan siyasi tarihine ışık tutan önemli yapılardandır.`,
          },
          {
            id: "bagh-e-jinnah",
            title: "BAGH-E-JİNNAH",
            level: 4,
            content: `Karaçi'nin en eski ve en geniş park alanlarından biridir. Britanya döneminde düzenlenmiştir. Şehir merkezinde yer alan bu geniş yeşil alan, yürüyüş yolları ve sosyal etkinlik alanlarıyla önemli bir dinlenme noktasıdır. Tarihî atmosferi ve merkezi konumu sebebiyle hem yerel halk hem de ziyaretçiler tarafından sıkça tercih edilmektedir.`,
          },
          {
            id: "national-museum",
            title: "NATİONAL MUSEUM OF PAKİSTAN",
            level: 4,
            content: `1950 yılında kurulan müze, Pakistan'ın en kapsamlı tarih ve arkeoloji koleksiyonuna sahiptir. İndus Vadisi Uygarlığı'na ait eserler, Gandhara dönemi Budist sanat örnekleri, İslamî yazmalar ve Babür dönemine ait objeler burada sergilenmektedir. Mohenjo-Daro kazılarından çıkarılan arkeolojik buluntular, eski sikkeler, minyatür sanat örnekleri ve tarihî silah koleksiyonları müzenin dikkat çeken bölümlerindendir. Pakistan tarihinin kronolojik gelişimini görmek açısından önemli bir merkezdir.`,
          },
          {
            id: "mohatta-palace",
            title: "MOHATTA PALACE",
            level: 4,
            content: `1927 yılında inşa edilen Mohatta Sarayı, pembe Caisalmer taşı kullanılarak yapılmıştır. Rajput ve İslam mimarisinin birleşimini yansıtan yapı, taş süslemeleri ve kemerli balkonlarıyla estetik açıdan oldukça dikkat çekicidir. Pakistan'ın kuruluşundan sonra bir dönem Fatima Jinnah tarafından da kullanılmıştır. Günümüzde sanat galerisi ve kültürel sergi alanı olarak hizmet vermektedir. Karaçi'nin en görkemli tarihî yapılarından biridir.`,
          },
          {
            id: "empress-market",
            title: "EMPRESS MARKET",
            level: 4,
            content: `1889 yılında Britanya döneminde inşa edilen yapı, adını Kraliçe Victoria'dan alır. Viktorya dönemi Gotik mimari özellikleri taşır ve yüksek saat kulesiyle dikkat çeker. Günümüzde geleneksel bir çarşı olarak faaliyet göstermektedir. Baharat, tekstil, sebze, meyve ve çeşitli yerel ürünlerin satıldığı hareketli bir ticaret merkezidir.`,
          },
          {
            id: "clifton-beach",
            title: "CLİFTON BEACH",
            level: 4,
            content: `Arap Denizi kıyısında yer alan Clifton Sahili, Karaçi'nin en bilinen sahil şerididir. Özellikle hafta sonları yoğun ilgi görür. Sahil çevresinde eğlence alanları, restoranlar ve sosyal etkinlik noktaları bulunmaktadır. Gün batımı manzarası oldukça etkileyicidir ve şehrin sosyal yaşamının önemli merkezlerinden biridir.`,
          },
          {
            id: "zaibunnisa-street",
            title: "ZAİBUNNİSA STREET",
            level: 4,
            content: `Karaçi'nin en işlek alışveriş caddelerinden biridir. İngiliz döneminde Elphinstone Street olarak bilinirdi. Günümüzde modern mağazalar, kitapçılar ve restoranlarla doludur. Şehrin ticari ve sosyal hareketliliğini yansıtan önemli bir merkezdir.`,
          },
          {
            id: "saddar",
            title: "SADDAR",
            level: 4,
            content: `Saddar, Karaçi'nin tarihî ve ticari merkezidir. Kolonyal dönemden kalma birçok yapı bu bölgede yer almaktadır. Empress Market başta olmak üzere pek çok önemli tarihî yapı burada toplanmıştır. Bölge, geleneksel çarşı kültürü ile modern ticaret hayatını bir arada sunar ve şehrin en hareketli noktalarından biridir.`,
          },
        ],
      },
      {
        id: "peshawar",
        title: "PEŞAVER",
        level: 3,
        children: [
          {
            id: "kissa-khawani",
            title: "KİSSA KHAWANİ BAZAAR",
            level: 4,
            content: `Kissa Khawani Pazarı, Peşaver'in en eski ve en canlı çarşılarından biridir ve şehrin kalbi sayılır. Adı "Hikâye Anlatıcılar Pazarı" anlamına gelir; bu isim, bir zamanlar burada halk hikâyelerinin anlatıldığı ahşap platformlardan gelir. İpek Yolu'nun kuzeybatı güzergâhı üzerinde yer alan pazar, yüzyıllar boyunca tüccarların, kervanların ve gezginlerin uğrak noktası olmuştur. Çarşı dar sokaklar, renkli dükkânlar ve zengin ürün çeşitliliğiyle karakterizedir. Baharatlar, çay çeşitleri, el dokuması şallar, deri ürünleri ve geleneksel Peştun kıyafetleri gibi yöresel mallar burada kolayca bulunabilir. Kissa Khawani, sadece ticaret değil; aynı zamanda Peşaver'in kültürel ve sosyal yaşantısının da merkezidir. Tarihî kafeler, sokak yemekleri ve el sanatları atölyeleri ziyaretçilere hem alışveriş hem de deneyim imkânı sağlar.`,
          },
          {
            id: "chowk-yadgar",
            title: "CHOWK YADGAR",
            level: 4,
            content: `Chowk Yadgar, Peşaver'in en bilinen meydanlarından biridir ve şehir yaşamının ritmini yansıtır. Meydanın merkezinde yer alan anıt, bölgenin tarihî hafızasını ve bağımsızlık mücadelesini sembolize eder. Hem yerel halk hem de ziyaretçiler için önemli bir toplanma noktasıdır. Meydanın çevresinde Britanya döneminden kalma binalar, kafeler ve yönetim yapıları bulunur. Sokak sanatçıları, seyyar satıcılar ve günlük koşuşturma meydanın dinamik atmosferini oluşturur. Chowk Yadgar, Peşaver'in tarihî kimliğini ve günlük yaşamını bir arada görebileceğiniz ideal bir başlangıç noktasıdır.`,
          },
          {
            id: "islamia-college",
            title: "İSLAMİA COLLEGE UNIVERSITY",
            level: 4,
            content: `Islamia College University, 1913 yılında kurulan ve Pakistan'ın en prestijli yükseköğretim kurumlarından biridir. Mimarî açıdan dikkat çeken kampüs, gotik, İslami ve kolonyal mimari unsurların harmanlandığı bir yapılaştırmaya sahiptir. Taş duvarlar, geniş avlular ve yüksek tavanlı binalar, ilk bakışta bir tarih müzesi gibi etkiler bırakır. Bugün hâlâ hem lisans hem de lisansüstü eğitim vermektedir. Büyük kütüphanesi, geniş yeşil alanları ve kültürel etkinlikleriyle üniversite, Peşaver'in entelektüel kalbinin attığı yerdir.`,
          },
          {
            id: "mahabat-khan",
            title: "MAHABAT KHAN CAMİ",
            level: 4,
            content: `Mahabat Khan Cami, 1630 yılında Mughal İmparatorluğu döneminde inşa edilmiştir ve Peşaver'in en zarif İslami yapılardan biridir. Caminin mimarî özelliğinde kırmızı tuğla ile işlenmiş taş oymaları ve zarif minareleri dikkat çeker. Caminin iç mekânı, Mughal sanatının tipik özelliklerini yansıtır: geniş avlu, kesme taş kemerler, sütunlar ve klasik İslami süsleme motifleri. Caminin yapımı sırasında kullanılan simetri ve oranlar, dönemin mimarî standartlarının yüksek düzeyini gösterir. Mahabat Khan Cami hem ibadet hem de eğitim alanı olarak kullanılmıştır. Ziyaretçiler burada sadece mimari estetiği değil aynı zamanda Peşaver'in İslami kültürel mirasını da yakından görebilirler.`,
          },
          {
            id: "bala-hissar",
            title: "BALA HİSSAR KALESİ",
            level: 4,
            content: `Bala Hissar Kalesi, Peşaver'in tarihî savunma yapılarının en önemli örneklerinden biridir. Stratejik tepe konumunda yer alan kale, yüzyıllar boyunca bölgenin kontrolü için Afgan, Moğol ve Britanya güçleri tarafından el değiştirmiştir. Kaleye çıkıldığında şehir ve çevresindeki vadiler panoramik olarak görülebilir; bu durum kale savunması açısından stratejik önemini gösterir. Surlar, iç avlular ve tarihî yapılar kalenin farklı dönemlerdeki mimarî dokusunu belgelemektedir. Kalede ayrıca savaş dönemine ait izler, bataryalar ve gözetleme noktaları vardır. Bala Hissar, Peşaver'in askerî ve tarihî kimliğini anlamak isteyenler için mutlaka ziyaret edilmesi gereken bir noktadır.`,
          },
          {
            id: "peshawar-museum",
            title: "PESHAWAR MUSEUM",
            level: 4,
            content: `Peshaver Müzesi, 1907 yılında kurulmuş olup Pakistan'ın kuzeybatı bölgelerinin tarihî ve kültürel mirasını koruyan en kapsamlı müzelerden biridir. Özellikle Gandhara uygarlığına ait eserler burada öne çıkar. Bu uygarlık, M.Ö. 1. yüzyıldan itibaren Budist sanatıyla Hind, Pers ve Helenistik etkileri harmanlayarak özgün eserler üretmiştir. Müze koleksiyonunda Budist heykeller, kabartmalar, lahit parçaları, altın süslemeler, antik sikkeler ve taş yazıtlar bulunur. Ayrıca arkeolojik kazılarda çıkarılmış eserler, Pakistan'ın farklı bölgelerindeki tarihî yerleşimlerin zenginliğini yansıtır. Müze, tarih ve arkeoloji meraklılarının mutlaka görmesi gereken bir bilimsel merkezdir.`,
          },
        ],
      },
      {
        id: "multan",
        title: "MULTAN",
        level: 3,
        children: [
          {
            id: "multan-fort",
            title: "MULTAN KALESİ",
            level: 4,
            content: `Multan Kalesi, Pakistan'ın en eski yerleşim bölgelerinden birinin kalbinde yer alan tarihî bir kaledir. Bu kale, yalnızca taşlardan ve surlardan oluşan bir yapı değil; binlerce yıllık bir medeniyetin izlerini taşıyan canlı bir tarih kitabıdır. Multan, İpek Yolu üzerinde stratejik bir konumda bulunduğu için tarih boyunca Pers, Arap, Türk, Moğol, Delhi Sultanlığı, Afghân ve Britanya gibi büyük güçlerin etkisi altında kalmıştır. Bu yüzden Multan Kalesi, her bir dönemin izlerini mimarisine yansıtan çok katmanlı bir geçmişe sahiptir. Kalenin en eski surlarının kökeni, bölgeye ilk yerleşimlerin başladığı antik dönemlere kadar uzanır. Ancak bugünkü hâli özellikle Orta Çağ'da şekillenmiş; daha sonra farklı hâkimiyet dönemlerinde sürekli olarak genişletilmiş ve güçlendirilmiştir. Bu süre içinde kale, sadece askeri bir savunma yapısı değil, aynı zamanda ticaret yollarını kontrol eden, şehrin güvenliğini sağlayan ve çok sayıda toplumsal aktiviteye ev sahipliği yapan bir merkez hâline gelmiştir. Multan Kalesi'nin taş surları, dik gözetleme kuleleri ve eski kapıları, burayı kuşatan verimli ovaları ve çevredeki vadileri izlemek için stratejik avantajlar sağlar. Ziyaretçiler kale çevresinde yürürken, her bir taşta tarihin farklı bir dönemine ait izler görürler: eski yerleşim yerleri, ticaret yolu izleri, yeniden inşa edilmiş sur bölümleri ve kalenin farklı dönemlerde aldığı mimarî şekiller… Kaleye adım attığınızda, surların iç kısmında günlük yaşamın izlerini taşıyan avlular, eski yapı temelleri ve kalıntılarla karşılaşırsınız. Bu kalıntılar, askeri savunmadan çok öte bir anlatım sunar; çünkü burada insanlar yaşamış, ticaret yapmış, ibadet etmiş ve toplumlarını inşa etmişlerdir. Multan Kalesi'nin tarihî önemi, sadece mimarî büyüklüğü değil, aynı zamanda bölgenin stratejik konumunu, kültürel etkileşimlerini ve ticaret tarihini yansıtmasıdır. Bu kale, Multan'ın tarihsel kimliğini anlamak için mutlaka ziyaret edilmesi gereken bir yerdir.`,
          },
          {
            id: "bahauddin-zekeriya",
            title: "BAHAUDDİN ZEKERİYA TÜRBESİ",
            level: 4,
            content: `Multan'ın en saygı duyulan manevî merkezlerinden biri olan Bahauddin Zekeriya Türbesi, şehirdeki mistik havayı hissetmek isteyen herkes için açık bir davet gibidir. Türbe, 13. yüzyılda yaşamış büyük sûfî velî Şeyh Mohyiddin Bahauddîn Zekeriya'nın mezarını barındırır. Zekeriya Hazretleri, tasavvufun sevgi, hoşgörü, tevazu ve Allah'a teslimiyet gibi temel ilkelerini öğretmiş hem sıradan halkın hem de bilim, sanat ve din âlimlerinin derin saygısını kazanmıştır. Bahauddin Zekeriya, yaşadığı dönemde sadece bir dinî lider değil, aynı zamanda bir manevî rehber, öğretmen ve toplumun moral kaynağı olmuştur. Onun öğretileri, günümüzde hâlâ sûfî düşünce içinde yaşar ve türbesi, bu öğretilerin fiziki bir sembolü haline gelmiştir. Türbenin mimarî yapısı, klasik Güney Asya sûfî türbe geleneğinin zarafetini yansıtır. Büyük kubbe, iç mekândaki taş oymalar, kemerli giriş kapısı ve çevresindeki avlular, ziyaretçilere hem estetik hem de manevi bir deneyim sunar. İçeri girdiğinizde, sadece tarihî bir mezar değil; burada uzun yüzyıllar boyunca süregelen dua, zikir ve manevî düşünce akışının bıraktığı atmosferi hissedersiniz. Bahauddin Zekeriya Türbesi, yıl boyunca ziyaretçi akınına uğrar; özellikle İslamî özel günlerde, ramazan ve şaban aylarında düzenlenen etkinlikler ve sema gösterileri türbeye ayrı bir canlılık katar. Türbe çevresindeki çarşılar ve derviş sohbet ortamları, ziyaretin sadece görsel değil aynı zamanda manevî bir deneyim olmasını sağlar.`,
          },
        ],
      },
      {
        id: "quetta",
        title: "KUETTA",
        level: 3,
        children: [
          {
            id: "geology-museum",
            title: "JEOLOJİ MÜZESİ",
            level: 4,
            content: `Jeoloji Müzesi, Pakistan'ın doğal tarihini ve yer kabuğunun oluşum süreçlerini öğrenmek isteyenler için şehirlerin en öğretici merkezlerinden biridir. Bu müze, Pakistan'ın farklı coğrafî bölgelerinden toplanmış fosil örnekleri, mineraller, kayaçlar ve jeolojik oluşumlar ile zengin bir koleksiyona sahiptir. Müze ziyaretçiye, yer kabuğunun milyonlarca yıllık evrimini, dağ oluşumlarını, fay hatlarını ve bölgede geçmişte bulunan eski deniz tabanlarının izlerini gösteren örneklerle anlatır. Çocuklar, öğrenciler ve doğa tutkunları için etkileşimli panolarla dolu bölümleri de bulunur. Jeoloji Müzesi, yalnızca bilgilendirici değil aynı zamanda bilimsel merakı tetikleyen bir eğitim alanıdır.`,
          },
          {
            id: "karkhasa-park",
            title: "KARKHASA PARKI",
            level: 4,
            content: `Karkhasi Parkı, doğayla iç içe vakit geçirmek isteyenler için ideal bir yeşil alandır. Şehrin kalabalığından uzaklaşmak ve temiz hava almak isteyen ziyaretçiler, yürüyüş yolları, çim alanlar ve kuş sesleri arasında huzurlu anlar geçirirler. Park aynı zamanda aileler için piknik alanları, çocuk oyun alanları ve dinlenme köşeleri sunar. Özellikle sabah yürüyüşleri ve akşam yürüyüşleri için tercih edilen bu park hem yerel halk hem de turistler tarafından sıklıkla ziyaret edilir. Doğal bitki örtüsü ve geniş kır alanları sayesinde şehirdeki betonlaşmış yapının tam tersini yaşatan bir ortam sağlar.`,
          },
          {
            id: "hazarganji-chiltan",
            title: "HAZARGANJİ CHİLTAN MİLLİ PARKI",
            level: 4,
            content: `Hazarganji Chiltan Milli Parkı, Pakistan'ın doğa koruma alanları içinde en etkileyici örneklerden biridir. Bu park, Chiltan dağları eteklerinde yer alır ve zengin bir biyolojik çeşitlilik sunar. Parkta çöl ve yarı çöl bitki örtüsü ile birlikte akasya, otlaklar ve çalılık bölgeler bulunur. Parkın en önemli özelliklerinden biri nesli tehlikede olan Baloç çitrası (Chiltan Ibex) gibi nadir türlere ev sahipliği yapmasıdır. Bu türler, yalnızca Pakistan'ın bu bölgesinde görülebilir ve uzman doğa rehberleri eşliğinde yapılan doğa yürüyüşlerinde izlenebilir. Ayrıca kuş gözlemciliği ve vahşi yaşam fotoğrafçılığı için ideal bir alandır. Hazarganji Chiltan Milli Parkı, Pakistan'ın doğal mirasını koruma altına alan en önemli merkezlerden biri olarak doğa tutkunlarına eşsiz bir deneyim sunar.`,
          },
          {
            id: "hanna-lake",
            title: "HANNA GÖLÜ",
            level: 4,
            content: `Hanna Gölü, geniş su yüzeyi, çevresindeki dağ siluetleri ve doğal peyzajı ile görsel açıdan etkileyici bir yerdir. Su sporları, tekne turları, balıkçılık ve göl kenarında yürüyüş gibi aktiviteler için tercih edilir. Göle bakan kafeler, manzara izleme noktaları ve piknik alanları sayesinde sadece doğa meraklıları değil, aileler ve arkadaş grupları için de popüler bir ziyaret alanıdır. Özellikle gün doğumu ve gün batımı saatlerinde göl manzarası, doğa fotoğrafçıları için eşsiz kareler sunar. Hanna Gölü, yerel halkın hafta sonu kaçamakları için tercih ettiği mekânlardan biri olmasının yanı sıra turistler için de doğal olarak dinlenme ve fotoğraf noktası görevi görür.`,
          },
        ],
      },
    ],
  },
];
