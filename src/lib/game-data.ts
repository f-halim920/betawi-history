// ============================================================
// ASAL COMOT — Game Data
// 6 NPC, 6 bahasa, 30 kosakata, dengan dialog + quiz engine.
// Dialog Jafar & Hendrik LENGKAP (sesuai brief).
// Dialog Feng, Karsa, Thomas, João RINGKAS — mencakup semua quiz
// & kosakata, bisa diperluas verbatim di iterasi berikutnya.
// ============================================================

export type Language =
  | "Arab"
  | "Belanda"
  | "Tiongkok"
  | "Kawi"
  | "Inggris"
  | "Portugis";

export type VocabWord = {
  id: string;
  original: string;
  language: Language;
  literal: string;
  betawi: string;
  example: string;
  level: "common" | "advance";
};

export type DialogueLine = {
  speaker: "mc" | "narrator" | NpcId;
  text: string;
  word?: VocabWord; // unlock saat baris ini muncul
};

export type QuizOption = {
  text: string;
  correct: boolean;
  next: string;
};

export type Quiz = {
  question: string;
  options: QuizOption[];
};

export type DialogueChoice = { text: string; nextId: string };

export type DialogueNode = {
  id: string;
  lines?: DialogueLine[];
  quiz?: Quiz;
  choices?: DialogueChoice[];
  next?: string;
  end?: boolean;
};

export type Scene = "pasar" | "pelabuhan";
export type NpcId = "jafar" | "feng" | "karsa" | "hendrik" | "thomas" | "joao";

export type Npc = {
  id: NpcId;
  name: string;
  scene: Scene;
  x: number; // 0..100, posisi horisontal
  startNodeId: string;
  language: Language;
  colorClass: string;
  role: string;
};

// ============================================================
// VOCAB
// ============================================================
const V = (
  id: string,
  original: string,
  language: Language,
  literal: string,
  betawi: string,
  example: string,
  level: "common" | "advance" = "common",
): VocabWord => ({ id, original, language, literal, betawi, example, level });

export const VOCABULARY: Record<string, VocabWord> = {
  // ==========================================
  // COMMON WORDS (Dari Tabel)
  // ==========================================
  halo_arab: V("halo_arab", "مرحبًا (Marhaban)", "Arab", "Halo/Hai", "Halo/Hai", "", "common"),
  halo_belanda: V("halo_belanda", "Hallo", "Belanda", "Halo/Hai", "Halo/Hai", "", "common"),
  halo_tiongkok: V("halo_tiongkok", "你好 (Nǐ hǎo)", "Tiongkok", "Halo/Hai", "Halo/Hai", "", "common"),
  halo_kawi: V("halo_kawi", "Swasti", "Kawi", "Halo/Hai", "Halo/Hai", "", "common"),
  halo_inggris: V("halo_inggris", "Hello/Hi", "Inggris", "Halo/Hai", "Halo/Hai", "", "common"),

  sapa_pagi_arab: V("sapa_pagi_arab", "صَبَاحُ الخَيْرِ (Shabahul Khair), نَهَارُكَ سَعِيْد (Nahaaruka Sa'iid), مَسَاءُالخَيْرِ (Masaa'ul Khair), لَيْلَتُكَ سَعِيْدَةٌ (Laylatuka Sa'iid)", "Arab", "Selamat pagi/siang/sore/malam", "Selamet pagi/siang/sore/malem", "", "common"),
  sapa_pagi_belanda: V("sapa_pagi_belanda", "Goedenochtend/middag/navond", "Belanda", "Selamat pagi/siang/sore/malam", "Selamet pagi/siang/sore/malem", "", "common"),
  sapa_pagi_tiongkok: V("sapa_pagi_tiongkok", "早安 (Zǎo ān) / 午安 (Wǔ ān) / 早上好 (Zǎoshàng hǎo) / 晚安 (Wǎn’ān)", "Tiongkok", "Selamat pagi/siang/sore/malam", "Selamet pagi/siang/sore/malem", "", "common"),
  sapa_pagi_kawi: V("sapa_pagi_kawi", "Swasti ring enjing/tengahi dina/sonten/wengi", "Kawi", "Selamat pagi/siang/sore/malam", "Selamet pagi/siang/sore/malem", "", "common"),
  sapa_pagi_inggris: V("sapa_pagi_inggris", "Good morning/afternoon/evening/night", "Inggris", "Selamat pagi/siang/sore/malam", "Selamet pagi/siang/sore/malem", "", "common"),

  kabar_arab: V("kabar_arab", "كَيْفَ حَالُك؟ (Kayfa haaluk?)", "Arab", "Apa kabar?", "Ape kabar?", "", "common"),
  kabar_belanda: V("kabar_belanda", "Hoe gaat het?", "Belanda", "Apa kabar?", "Ape kabar?", "", "common"),
  kabar_tiongkok: V("kabar_tiongkok", "你好吗? (Nǐ hǎo ma)", "Tiongkok", "Apa kabar?", "Ape kabar?", "", "common"),
  kabar_kawi: V("kabar_kawi", "Kadi kabarta?", "Kawi", "Apa kabar?", "Ape kabar?", "", "common"),
  kabar_inggris: V("kabar_inggris", "How are you?", "Inggris", "Apa kabar?", "Ape kabar?", "", "common"),

  senang_temu_arab: V("senang_temu_arab", "تشَرَّفْتُ بِمَعْرِفَتِك (Tasharraftu bima'rifatik)", "Arab", "Senang bertemu dengan Anda", "Seneng ketemu ente", "", "common"),
  senang_temu_belanda: V("senang_temu_belanda", "Aangenaam kennis te maken", "Belanda", "Senang bertemu dengan Anda", "Seneng ketemu ente", "", "common"),
  senang_temu_tiongkok: V("senang_temu_tiongkok", "很高兴认识你 (Hěn gāoxìng rènshí nǐ)", "Tiongkok", "Senang bertemu dengan Anda", "Seneng ketemu ente", "", "common"),
  senang_temu_kawi: V("senang_temu_kawi", "Sukha tanemu ring sira", "Kawi", "Senang bertemu dengan Anda", "Seneng ketemu ente", "", "common"),
  senang_temu_inggris: V("senang_temu_inggris", "Nice to meet you", "Inggris", "Senang bertemu dengan Anda", "Seneng ketemu ente", "", "common"),

  nama_saya_arab: V("nama_saya_arab", "اسْمِي... (Ismii...)", "Arab", "Nama saya…", "Nama ane...", "", "common"),
  nama_saya_belanda: V("nama_saya_belanda", "Ik heet...", "Belanda", "Nama saya…", "Nama ane...", "", "common"),
  nama_saya_tiongkok: V("nama_saya_tiongkok", "我叫…… (Wǒ jiào... )", "Tiongkok", "Nama saya…", "Nama ane...", "", "common"),
  nama_saya_kawi: V("nama_saya_kawi", "Aran ingwan...", "Kawi", "Nama saya…", "Nama ane...", "", "common"),
  nama_saya_inggris: V("nama_saya_inggris", "My name is...", "Inggris", "Nama saya…", "Nama ane...", "", "common"),

  siapa_nama_arab: V("siapa_nama_arab", "مَا اسْمُكَ؟ (Maa ismuka? - laki-laki) / مَا اسْمُكِ؟ (Maa ismuki? - perempuan)", "Arab", "Siapa nama Anda?", "Siape nama ente?", "", "common"),
  siapa_nama_belanda: V("siapa_nama_belanda", "Hoe heet jij?", "Belanda", "Siapa nama Anda?", "Siape nama ente?", "", "common"),
  siapa_nama_tiongkok: V("siapa_nama_tiongkok", "你叫什么名字？ (Nǐ jiào shénme míngzì?)", "Tiongkok", "Siapa nama Anda?", "Siape nama ente?", "", "common"),
  siapa_nama_kawi: V("siapa_nama_kawi", "Sapa aranira?", "Kawi", "Siapa nama Anda?", "Siape nama ente?", "", "common"),
  siapa_nama_inggris: V("siapa_nama_inggris", "What is your name?", "Inggris", "Siapa nama Anda?", "Siape nama ente?", "", "common"),

  dari_mana_arab: V("dari_mana_arab", "مِنْ أَيْنَ أَنْتَ؟ (Min ayna anta? - laki-laki) / مِنْ أَيْنَ أَنْتِ؟ (Min ayna anti? - perempuan)", "Arab", "Dari mana Anda berasal?", "Ente asalnya dari mane?", "", "common"),
  dari_mana_belanda: V("dari_mana_belanda", "Waar komt u vandaan?", "Belanda", "Dari mana Anda berasal?", "Ente asalnya dari mane?", "", "common"),
  dari_mana_tiongkok: V("dari_mana_tiongkok", "你来自哪里？ (Nǐ láizì nǎlǐ?)", "Tiongkok", "Dari mana Anda berasal?", "Ente asalnya dari mane?", "", "common"),
  dari_mana_kawi: V("dari_mana_kawi", "Saking pundi sira?", "Kawi", "Dari mana Anda berasal?", "Ente asalnya dari mane?", "", "common"),
  dari_mana_inggris: V("dari_mana_inggris", "Where are you from?", "Inggris", "Dari mana Anda berasal?", "Ente asalnya dari mane?", "", "common"),

  asal_saya_arab: V("asal_saya_arab", "أَنَا مِنْ... (Ana min...)", "Arab", "Saya berasal dari...", "Ane dari...", "", "common"),
  asal_saya_belanda: V("asal_saya_belanda", "Ik kom uit...", "Belanda", "Saya berasal dari...", "Ane dari...", "", "common"),
  asal_saya_tiongkok: V("asal_saya_tiongkok", "我来自… (Wǒ láizì…)", "Tiongkok", "Saya berasal dari...", "Ane dari...", "", "common"),
  asal_saya_kawi: V("asal_saya_kawi", "Ingsun saking...", "Kawi", "Saya berasal dari...", "Ane dari...", "", "common"),
  asal_saya_inggris: V("asal_saya_inggris", "I am from...", "Inggris", "Saya berasal dari...", "Ane dari...", "", "common"),

  berapa_usia_arab: V("berapa_usia_arab", "كَمْ عُمْرُكَ؟ (Kam 'umruka? - laki-laki) / كَمْ عُمْرُكِ؟ (Kam 'umruki? - perempuan)", "Arab", "Berapa usia Anda?", "Umur ente berape?", "", "common"),
  berapa_usia_belanda: V("berapa_usia_belanda", "Hoe oud bent u?", "Belanda", "Berapa usia Anda?", "Umur ente berape?", "", "common"),
  berapa_usia_tiongkok: V("berapa_usia_tiongkok", "你今年多大？ (Nǐ jīnnián duōdà?)", "Tiongkok", "Berapa usia Anda?", "Umur ente berape?", "", "common"),
  berapa_usia_kawi: V("berapa_usia_kawi", "Pira yusa nira?", "Kawi", "Berapa usia Anda?", "Umur ente berape?", "", "common"),
  berapa_usia_inggris: V("berapa_usia_inggris", "How old are you?", "Inggris", "Berapa usia Anda?", "Umur ente berape?", "", "common"),

  usia_saya_arab: V("usia_saya_arab", "عُمْرِي... ('Umrii...)", "Arab", "Usia saya...", "Umur ane ... taun.", "", "common"),
  usia_saya_belanda: V("usia_saya_belanda", "Ik ben ... jaar oud.", "Belanda", "Usia saya...", "Umur ane ... taun.", "", "common"),
  usia_saya_tiongkok: V("usia_saya_tiongkok", "我今年…岁。 (Wǒ jīnnián ... suì.)", "Tiongkok", "Usia saya...", "Umur ane ... taun.", "", "common"),
  usia_saya_kawi: V("usia_saya_kawi", "Yusa ingwang ... warsa", "Kawi", "Usia saya...", "Umur ane ... taun.", "", "common"),
  usia_saya_inggris: V("usia_saya_inggris", "I am ... years old.", "Inggris", "Usia saya...", "Umur ane ... taun.", "", "common"),

  hobi_saya_arab: V("hobi_saya_arab", "هِوَايَتِي... (Hiwaayatii…)", "Arab", "Hobi saya...", "Hobi ane...", "", "common"),
  hobi_saya_belanda: V("hobi_saya_belanda", "Mijn hobby is.../Mijn hobby's zijn...", "Belanda", "Hobi saya...", "Hobi ane...", "", "common"),
  hobi_saya_tiongkok: V("hobi_saya_tiongkok", "我的爱好是… (Wǒ de àihào shì…)", "Tiongkok", "Hobi saya...", "Hobi ane...", "", "common"),
  hobi_saya_kawi: V("hobi_saya_kawi", "Priya ingwang...", "Kawi", "Hobi saya...", "Hobi ane...", "", "common"),
  hobi_saya_inggris: V("hobi_saya_inggris", "My hobby is... / My hobbies are...", "Inggris", "Hobi saya...", "Hobi ane...", "", "common"),

  terimakasih_arab: V("terimakasih_arab", "شُكْرًا (Syukran)", "Arab", "Terima kasih.", "Terima kasih ye.", "", "common"),
  terimakasih_belanda: V("terimakasih_belanda", "Dank u wel.", "Belanda", "Terima kasih.", "Terima kasih ye.", "", "common"),
  terimakasih_tiongkok: V("terimakasih_tiongkok", "谢谢 (Xièxie)", "Tiongkok", "Terima kasih.", "Terima kasih ye.", "", "common"),
  terimakasih_kawi: V("terimakasih_kawi", "Suksma", "Kawi", "Terima kasih.", "Terima kasih ye.", "", "common"),
  terimakasih_inggris: V("terimakasih_inggris", "Thank you.", "Inggris", "Terima kasih.", "Terima kasih ye.", "", "common"),

  sampai_jumpa_arab: V("sampai_jumpa_arab", "إِلَى اللِّقَاءِ (Ila l-liqaa')", "Arab", "Sampai jumpa.", "Sampe ketemu lagi ye.", "", "common"),
  sampai_jumpa_belanda: V("sampai_jumpa_belanda", "Tot ziens.", "Belanda", "Sampai jumpa.", "Sampe ketemu lagi ye.", "", "common"),
  sampai_jumpa_tiongkok: V("sampai_jumpa_tiongkok", "再见 (Zàijiàn)", "Tiongkok", "Sampai jumpa.", "Sampe ketemu lagi ye.", "", "common"),
  sampai_jumpa_kawi: V("sampai_jumpa_kawi", "Punar temu", "Kawi", "Sampai jumpa.", "Sampe ketemu lagi ye.", "", "common"),
  sampai_jumpa_inggris: V("sampai_jumpa_inggris", "See you.", "Inggris", "Sampai jumpa.", "Sampe ketemu lagi ye.", "", "common"),

  saya_arab: V("saya_arab", "أَنَا (Ana)", "Arab", "Saya/Aku", "Ane/Aye/Gue", "", "common"),
  saya_belanda: V("saya_belanda", "Ik", "Belanda", "Saya/Aku", "Ane/Aye/Gue", "", "common"),
  saya_tiongkok: V("saya_tiongkok", "我 (Wǒ)", "Tiongkok", "Saya/Aku", "Ane/Aye/Gue", "", "common"),
  saya_kawi: V("saya_kawi", "Ingsun", "Kawi", "Saya/Aku", "Ane/Aye/Gue", "", "common"),
  saya_inggris: V("saya_inggris", "I/Me", "Inggris", "Saya/Aku", "Ane/Aye/Gue", "", "common"),

  kamu_arab: V("kamu_arab", "أَنْتَ (Anta - laki-laki) / أَنْتِ (Anti - perempuan)", "Arab", "Anda/Kamu", "Ente/Lu", "", "common"),
  kamu_belanda: V("kamu_belanda", "U/Jij", "Belanda", "Anda/Kamu", "Ente/Lu", "", "common"),
  kamu_tiongkok: V("kamu_tiongkok", "你 (Nǐ)", "Tiongkok", "Anda/Kamu", "Ente/Lu", "", "common"),
  kamu_kawi: V("kamu_kawi", "Sira", "Kawi", "Anda/Kamu", "Ente/Lu", "", "common"),
  kamu_inggris: V("kamu_inggris", "You", "Inggris", "Anda/Kamu", "Ente/Lu", "", "common"),

  ibu_arab: V("ibu_arab", "أُمِّي (Ummii)", "Arab", "Ibu", "Emak/Nyak", "", "common"),
  ibu_belanda: V("ibu_belanda", "Moeder", "Belanda", "Ibu", "Emak/Nyak", "", "common"),
  ibu_tiongkok: V("ibu_tiongkok", "妈妈 (Māma)", "Tiongkok", "Ibu", "Emak/Nyak", "", "common"),
  ibu_kawi: V("ibu_kawi", "Ibu", "Kawi", "Ibu", "Emak/Nyak", "", "common"),
  ibu_inggris: V("ibu_inggris", "Mother/Mom", "Inggris", "Ibu", "Emak/Nyak", "", "common"),

  bapak_arab: V("bapak_arab", "أَبِي (Abii)", "Arab", "Bapak", "Babe", "", "common"),
  bapak_belanda: V("bapak_belanda", "Vader", "Belanda", "Bapak", "Babe", "", "common"),
  bapak_tiongkok: V("bapak_tiongkok", "爸爸 (Bàba)", "Tiongkok", "Bapak", "Babe", "", "common"),
  bapak_kawi: V("bapak_kawi", "Rama", "Kawi", "Bapak", "Babe", "", "common"),
  bapak_inggris: V("bapak_inggris", "Father/Dad", "Inggris", "Bapak", "Babe", "", "common"),

  kakek_belanda: V("kakek_belanda", "Opa", "Belanda", "Kakek", "Engkong", "", "common"),
  kakek_kawi: V("kakek_kawi", "Aki", "Kawi", "Kakek", "Engkong", "", "common"),
  kakek_inggris: V("kakek_inggris", "Grandfather/Grandpa", "Inggris", "Kakek", "Engkong", "", "common"),

  nenek_belanda: V("nenek_belanda", "Oma", "Belanda", "Nenek", "Nyai", "", "common"),
  nenek_kawi: V("nenek_kawi", "Nini", "Kawi", "Nenek", "Nyai", "", "common"),
  nenek_inggris: V("nenek_inggris", "Grandmother/Grandma", "Inggris", "Nenek", "Nyai", "", "common"),

  kakak_belanda: V("kakak_belanda", "Broer/Zus", "Belanda", "Kakak", "Abang/Mpok", "", "common"),
  kakak_kawi: V("kakak_kawi", "Raka", "Kawi", "Kakak", "Abang/Mpok", "", "common"),
  kakak_inggris: V("kakak_inggris", "Older Brother/Older Sister", "Inggris", "Kakak", "Abang/Mpok", "", "common"),

  adik_belanda: V("adik_belanda", "Broertje/Zusje", "Belanda", "Adik", "Ade", "", "common"),
  adik_kawi: V("adik_kawi", "Adi", "Kawi", "Adik", "Ade", "", "common"),
  adik_inggris: V("adik_inggris", "Younger Brother/Younger Sister", "Inggris", "Adik", "Ade", "", "common"),

  paman_belanda: V("paman_belanda", "Oom", "Belanda", "Paman", "Encang/Om", "", "common"),
  paman_kawi: V("paman_kawi", "Wa", "Kawi", "Paman", "Encang/Om", "", "common"),
  paman_inggris: V("paman_inggris", "Uncle", "Inggris", "Paman", "Encang/Om", "", "common"),

  bibi_belanda: V("bibi_belanda", "Tante", "Belanda", "Bibi", "Encing/Tante", "", "common"),
  bibi_kawi: V("bibi_kawi", "Bibi", "Kawi", "Bibi", "Encing/Tante", "", "common"),
  bibi_inggris: V("bibi_inggris", "Auntie", "Inggris", "Bibi", "Encing/Tante", "", "common"),

  // ARAB — Jafar
  ane: V("ane", "ane", "Arab", "Saya / aku", "Ane — kata ganti orang pertama (saya)", "“Ane mah orang Betawi asli, bang.”"),
  gahwe: V("gahwe", "gahwe", "Arab", "Kopi (qahwa)", "Kopi — minuman hitam pahit", "“Yuk ngopi dulu sebelum kerja.”"),
  sohib: V("sohib", "sohib", "Arab", "Teman, sahabat", "Sohib — teman dekat", "“Si Doel itu sohib gua dari kecil.”"),
  tajir: V("tajir", "tajir", "Arab", "Pedagang kaya, makmur", "Tajir — kaya raya", "“Sejak buka usaha, dia jadi tajir melintir.”"),
  wassalam: V("wassalam", "wassalam", "Arab", "Beserta salam (salam penutup)", "Wassalam — salam penutup", "“Sekian dari ane, wassalam.”", "advance"),

  // BELANDA — Hendrik
  haven: V("haven", "haven", "Belanda", "Pelabuhan", "Haven — pelabuhan (kini jarang dipakai, lihat 'havenrecht')", "“Kapal merapat di haven Tanjung Priok.”", "advance"),
  kumpeni: V("kumpeni", "compagnie", "Belanda", "Perusahaan / perserikatan dagang (VOC)", "Kumpeni — kompeni, perusahaan dagang Belanda", "“Jaman dulu rakyat dipaksa kerja sama kumpeni.”", "advance"),
  makelar: V("makelar", "makelaar", "Belanda", "Perantara / broker", "Makelar — perantara jual beli", "“Bapaknya makelar tanah di Tangerang.”"),
  tekor: V("tekor", "te kort", "Belanda", "Kekurangan, defisit", "Tekor — rugi, kekurangan uang", "“Bulan ini gua tekor gara-gara kondangan terus.”"),
  kalem: V("kalem", "kalm", "Belanda", "Tenang", "Kalem — santai, tenang", "“Kalem aja bro, masalahnya bisa dibicarain.”"),

  // TIONGKOK — Feng
  angpao: V("angpao", "紅包 hóng bāo", "Tiongkok", "Amplop merah berisi uang", "Angpao — amplop berisi uang hadiah", "“Pas Imlek anak-anak nungguin angpao dari om.”"),
  cincai: V("cincai", "青菜 qīng cài", "Tiongkok", "Santai, terserah, gampang", "Cincai — santai, gampang diatur", "“Harganya cincai lah, yang penting laku.”"),
  hoki: V("hoki", "福氣 fú qì", "Tiongkok", "Keberuntungan", "Hoki — keberuntungan", "“Lagi hoki nih, lotrenya menang terus.”"),
  kongkow: V("kongkow", "講古 kóng-kó͘", "Tiongkok", "Bercakap-cakap, berkumpul ngobrol", "Kongkow — nongkrong, ngobrol santai", "“Anak-anak kongkow di warkop tiap malem.”", "advance"),
  kamsia: V("kamsia", "感謝 kám-siā", "Tiongkok", "Terima kasih", "Kamsia — terima kasih (Hokkien)", "“Kamsia ya udah bantu gua tadi.”"),

  // KAWI — Karsa
  amprok: V("amprok", "amprok", "Kawi", "Bertemu (tak sengaja)", "Amprok — bertemu / berpapasan", "“Tadi gua amprok sama Pak RT di pasar.”", "advance"),
  "angen-angen": V("angen-angen", "angen-angen", "Kawi", "Lamunan, angan", "Angan-angan — melamun, berkhayal", "“Jangan cuma angan-angan, kerja juga.”"),
  jongjon: V("jongjon", "jongjon", "Kawi", "Teguh, tabah", "Jongjon — tetap tenang & teguh", "“Hadapi hidup dengan jongjon ya, Mas.”", "advance"),
  siloka: V("siloka", "siloka", "Kawi", "Perumpamaan, amsal", "Siloka — kiasan / perumpamaan", "“Omongan bapaknya banyak siloka.”", "advance"),
  cep: V("cep", "cep", "Kawi", "Diam, tenang (perintah)", "Cep — diam, tenang", "“Cep dulu, jangan berisik!”"),

  // INGGRIS — Thomas
  amplop: V("amplop", "envelope", "Inggris", "Sampul kertas untuk surat", "Amplop — sampul surat", "“Tolong masukin ke amplop coklat ya.”"),
  ngetem: V("ngetem", "stem", "Inggris", "Menunggu (di tempat)", "Ngetem — menunggu sambil parkir", "“Angkot ngetem di pertigaan dari tadi.”"),
  oper: V("oper", "over", "Inggris", "Mengalihkan, memberikan ke pihak lain", "Oper — memindahkan / memberi", "“Oper bolanya ke gua dong!”"),
  setop: V("setop", "stop", "Inggris", "Berhenti", "Setop — berhenti", "“Setop dulu, lampu merah!”"),
  uskut: V("uskut", "house-coat", "Inggris", "Pakaian rumah", "Uskut — daster / pakaian rumah", "“Mendingan pakai uskut aja di rumah, adem.”", "advance"),

  // PORTUGIS — João
  bobo: V("bobo", "bobo", "Portugis", "Tidur", "Bobo — tidur (bahasa anak/halus)", "“Adek udah bobo dari tadi.”"),
  lentera: V("lentera", "lanterna", "Portugis", "Lampu / pelita", "Lentera — lampu minyak", "“Pas mati lampu, nyalain lentera aja.”"),
  perlente: V("perlente", "pulento / pollente", "Portugis", "Rapi, parlente", "Perlente — necis, rapi", "“Pakaiannya perlente banget kalau ke kantor.”", "advance"),
  pesiar: V("pesiar", "passear", "Portugis", "Jalan-jalan, berlayar santai", "Pesiar — berjalan-jalan / berlayar", "“Kapal pesiar berlabuh di Bali.”"),
  olala: V("olala", "olá là", "Portugis", "Seruan kagum / takjub", "Olala — seruan kagum", "“Olala, cakep banget mobilnya!”", "advance"),
};

export const ALL_WORDS_BY_LANG: Record<Language, VocabWord[]> = {
  Arab: [],
  Belanda: [],
  Tiongkok: [],
  Kawi: [],
  Inggris: [],
  Portugis: [],
};
Object.values(VOCABULARY).forEach((w) => ALL_WORDS_BY_LANG[w.language].push(w));

// ============================================================
// NPC
// ============================================================
export const NPCS: Npc[] = [
  // PASAR
  { id: "jafar", name: "Jafar", scene: "pasar", x: 22, startNodeId: "jafar_1", language: "Arab", colorClass: "text-gold", role: "Pedagang parfum, kopi, batu akik" },
  { id: "feng", name: "Feng", scene: "pasar", x: 52, startNodeId: "feng_1", language: "Tiongkok", colorClass: "text-accent", role: "Pedagang sutra & barang mewah" },
  { id: "karsa", name: "Karsa", scene: "pasar", x: 82, startNodeId: "karsa_1", language: "Kawi", colorClass: "text-betawi", role: "Penjual jamu, kain & pengetahuan lokal" },
  // PELABUHAN
  { id: "hendrik", name: "Hendrik", scene: "pelabuhan", x: 22, startNodeId: "hendrik_1", language: "Belanda", colorClass: "text-dutch", role: "Pedagang rempah (VOC)" },
  { id: "thomas", name: "Sir Thomas", scene: "pelabuhan", x: 52, startNodeId: "thomas_1", language: "Inggris", colorClass: "text-dutch", role: "Pedagang tekstil & alat navigasi" },
  { id: "joao", name: "João", scene: "pelabuhan", x: 82, startNodeId: "joao_1", language: "Portugis", colorClass: "text-primary", role: "Pelaut singgah dari Portugis" },
];

export const NPC_BY_ID = Object.fromEntries(NPCS.map((n) => [n.id, n])) as Record<NpcId, Npc>;

// ============================================================
// Helper untuk membangun blok quiz singkat
// ============================================================
function quizBlock(
  prefix: string,
  npc: NpcId,
  wordId: keyof typeof VOCABULARY,
  question: string,
  options: { text: string; correct?: boolean }[],
  correctExplain: string,
  wrongExplain: string,
  afterId: string,
): Record<string, DialogueNode> {
  const correctId = `${prefix}_ok`;
  const wrongId = `${prefix}_no`;
  return {
    [prefix]: {
      id: prefix,
      quiz: {
        question,
        options: options.map((o) => ({
          text: o.text,
          correct: !!o.correct,
          next: o.correct ? correctId : wrongId,
        })),
      },
    },
    [correctId]: {
      id: correctId,
      lines: [
        { speaker: npc, text: correctExplain, word: VOCABULARY[wordId] },
      ],
      next: afterId,
    },
    [wrongId]: {
      id: wrongId,
      lines: [
        { speaker: npc, text: wrongExplain, word: VOCABULARY[wordId] },
      ],
      next: afterId,
    },
  };
}

// ============================================================
// DIALOG — JAFAR (Arab) — LENGKAP
// ============================================================
const JAFAR: Record<string, DialogueNode> = {
  jafar_1: {
    id: "jafar_1",
    lines: [
      { speaker: "mc", text: "“Harum banget tempat lu.”" },
      { speaker: "jafar", text: "Pria itu langsung tersenyum lebar. “Ah! Hidungmu bagus rupanya.”" },
      { speaker: "jafar", text: "“Masuklah. Parfum dari negeri Arab bukan sekadar wangi, tapi adalah identitas.”" },
      { speaker: "mc", text: "“Haha, lu ngomong puitis sekali.”" },
      { speaker: "jafar", text: "“Karena hidup tanpa sedikit keindahan itu menyedihkan.”" },
      { speaker: "mc", text: "“Lu jualan banyak juga ya. Parfum, kopi, batu…”" },
      { speaker: "jafar", text: "“Semuanya pilihan terbaik. Orang datang ke sini bukan cuma membeli barang, tapi membeli rasa.”" },
      { speaker: "jafar", text: "“Dulu ane belajar racik parfum dari keluarga ane.”" },
      { speaker: "mc", text: "“Ane… hm, bentar… maksudnya…”" },
    ],
    next: "q_ane",
  },
  ...quizBlock(
    "q_ane", "jafar", "ane",
    "Apa arti “ane”?",
    [{ text: "Saya", correct: true }, { text: "Kamu" }, { text: "Ibu" }],
    "“Betul! Cepat juga kamu menangkapnya.”",
    "“Haha, bukan itu maksudnya. Ane berbicara tentang diri sendiri.”",
    "jafar_2",
  ),
  jafar_2: {
    id: "jafar_2",
    lines: [
      { speaker: "jafar", text: "Pedagang itu menuang minuman hitam panas ke cangkir kecil. “Nih, coba sedikit gahwe.”" },
      { speaker: "mc", text: "“Gahwe itu…?”" },
    ],
    next: "q_gahwe",
  },
  ...quizBlock(
    "q_gahwe", "jafar", "gahwe",
    "Apa arti “gahwe”?",
    [{ text: "Parfum" }, { text: "Teh" }, { text: "Kopi", correct: true }],
    "“Betul sekali! Kopi terbaik dari negeri ane. Kamu harus mencobanya.”",
    "“Ya ampun, kau melukai hati ane. Ini kopi — kopi terbaik harus dinikmati perlahan.”",
    "jafar_3",
  ),
  jafar_3: {
    id: "jafar_3",
    lines: [
      { speaker: "mc", text: "Teguk sedikit. “Eh tapi enak. Pahitnya nggak aneh.”" },
      { speaker: "jafar", text: "“Tentu saja. Biji kopinya ane pilih sendiri.”" },
      { speaker: "jafar", text: "“Sohib ane sering bilang ane terlalu dramatis.”" },
      { speaker: "mc", text: "“Kayak…?”" },
    ],
    next: "q_sohib",
  },
  ...quizBlock(
    "q_sohib", "jafar", "sohib",
    "Apa arti “sohib”?",
    [{ text: "Teman", correct: true }, { text: "Tetangga" }, { text: "Keluarga" }],
    "“Nah, benar. Orang yang tetap tahan berteman dengan ane selama bertahun-tahun.”",
    "“Haha, bukan. Sohib itu teman — teman ane.”",
    "jafar_4",
  ),
  jafar_4: {
    id: "jafar_4",
    lines: [
      { speaker: "jafar", text: "Pedagang itu mengambil batu akik hijau. “Lihat batu ini… indah, bukan?”" },
      { speaker: "mc", text: "“Wih, keren. Batu beginian ada artinya?”" },
      { speaker: "jafar", text: "“Beberapa benda membawa keberuntungan, atau… kenangan.”" },
      { speaker: "jafar", text: "Seorang pelanggan berpakaian mewah lewat. “Itu pelanggan lama ane. Orangnya tajir sekali.”" },
      { speaker: "mc", text: "“Jadi dia…?”" },
    ],
    next: "q_tajir",
  },
  ...quizBlock(
    "q_tajir", "jafar", "tajir",
    "Apa arti “tajir”?",
    [{ text: "Pelit" }, { text: "Kaya", correct: true }, { text: "Ramah" }],
    "“Iya! Dia kaya raya. Datang ke ane selalu beli parfum mahal-mahal.”",
    "“Justru sebaliknya. Kalau dia pelit, mana mungkin beli parfum semahal ini.”",
    "jafar_5",
  ),
  jafar_5: {
    id: "jafar_5",
    lines: [
      { speaker: "jafar", text: "“Ah, waktu berjalan cepat. Sebentar lagi ane harus menyiapkan kios.”" },
      { speaker: "jafar", text: "“Kalau begitu… wassalam.”" },
      { speaker: "mc", text: "“Em…”" },
    ],
    next: "q_wassalam",
  },
  ...quizBlock(
    "q_wassalam", "jafar", "wassalam",
    "Apa arti “wassalam”?",
    [{ text: "Sampai besok" }, { text: "Salam penutup / beserta salam", correct: true }, { text: "Senang bertemu denganmu" }],
    "“Tepat. Perpisahan yang baik harus tetap terdengar indah.”",
    "“Haha, lebih tepatnya salam untukmu. Semoga harimu tetap indah.”",
    "jafar_end",
  ),
  jafar_end: {
    id: "jafar_end",
    lines: [
      { speaker: "mc", text: "“Lu bahkan pamit aja masih puitis. Tapi jujur aja, ngobrol sama lu seru sih.”" },
      { speaker: "jafar", text: "“Karena dunia memang penuh cerita. Datang lagi kapan-kapan!”" },
      { speaker: "jafar", text: "Ia tertawa lebar. “Kalau wanginya bagus, uang akan kembali. Wassalam!”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — HENDRIK (Belanda) — LENGKAP
// ============================================================
const HENDRIK: Record<string, DialogueNode> = {
  hendrik_1: {
    id: "hendrik_1",
    lines: [
      { speaker: "mc", text: "“Permisi… Kapal yang baru dateng itu punya lu ya?”" },
      { speaker: "hendrik", text: "Pria itu mengangkat kepala perlahan. “Sebagian muatannya milikku. Kenapa?”" },
      { speaker: "mc", text: "“Nggak kenapa-napa sih. Gue cuma penasaran aja.”" },
      { speaker: "hendrik", text: "“Karena perdagangan bukan sesuatu yang bisa dianggap main-main.”" },
      { speaker: "mc", text: "“Pelabuhan ini rame banget deh.”" },
      { speaker: "hendrik", text: "“Tentu. Semua orang datang untuk mencari keuntungan.”" },
      { speaker: "hendrik", text: "“Meski begitu, harus kuakui haven di Batavia cukup bagus.”" },
      { speaker: "mc", text: "“Haven… hm, bentar…”" },
    ],
    next: "q_haven",
  },
  ...quizBlock(
    "q_haven", "hendrik", "haven",
    "Apa arti “haven”?",
    [{ text: "Gudang" }, { text: "Pelabuhan", correct: true }, { text: "Kota" }],
    "“Betul sekali. Haven ini salah satu yang paling ramai yang pernah saya lihat.”",
    "“Bukan. Maksudku pelabuhan. Kau tidak paham?”",
    "hendrik_2",
  ),
  hendrik_2: {
    id: "hendrik_2",
    lines: [
      { speaker: "mc", text: "“Pantes kapal di sini banyak banget. Semua bawa rempah?”" },
      { speaker: "hendrik", text: "“Sebagian besar. Dan semuanya bernilai tinggi.”" },
      { speaker: "hendrik", text: "“Apalagi sekarang banyak perdagangan diawasi kumpeni.”" },
      { speaker: "mc", text: "“Gue pernah denger. … kan?”" },
    ],
    next: "q_kumpeni",
  },
  ...quizBlock(
    "q_kumpeni", "hendrik", "kumpeni",
    "Apa arti “kumpeni”?",
    [{ text: "Perusahaan dagang", correct: true }, { text: "Penagih pajak" }, { text: "Bajak laut" }],
    "“Benar. Mereka mengatur jalur perdagangan dan kapal.”",
    "“Pastinya bukan itu. Kumpeni lebih seperti sebuah perusahaan dagang.”",
    "hendrik_3",
  ),
  hendrik_3: {
    id: "hendrik_3",
    lines: [
      { speaker: "hendrik", text: "Ia mengetuk peti kayu pelan. “Yang tidak mengendalikan perdagangan akan dikendalikan orang lain.”" },
      { speaker: "hendrik", text: "“Kalau seseorang tidak punya koneksi, biasanya mereka memakai jasa makelar.”" },
      { speaker: "mc", text: "“Semacam…?”" },
    ],
    next: "q_makelar",
  },
  ...quizBlock(
    "q_makelar", "hendrik", "makelar",
    "Apa arti “makelar”?",
    [{ text: "Pedagang perantara", correct: true }, { text: "Penjaga kapal" }, { text: "Penjoki" }],
    "“Tepat sekali. Jasa mereka selalu didambakan di waktu sekarang.”",
    "“Tidak. Makelar adalah perantara jual beli.”",
    "hendrik_4",
  ),
  hendrik_4: {
    id: "hendrik_4",
    lines: [
      { speaker: "hendrik", text: "“Kau harus memikirkan harga, kapal, cuaca, dan pesaing. Sedikit salah saja bisa jadi masalah.”" },
      { speaker: "hendrik", text: "“Banyak pedagang yang bisa cepat tekor.”" },
      { speaker: "mc", text: "“Gue pernah dengar ini. Maksudnya…?”" },
    ],
    next: "q_tekor",
  },
  ...quizBlock(
    "q_tekor", "hendrik", "tekor",
    "Apa arti “tekor”?",
    [{ text: "Untung besar" }, { text: "Mengalami kerugian", correct: true }, { text: "Naik daun" }],
    "“Hm. Akhirnya ada juga yang benar.”",
    "“Justru sebaliknya. Banyak pedagang yang rugi karena ceroboh.”",
    "hendrik_5",
  ),
  hendrik_5: {
    id: "hendrik_5",
    lines: [
      { speaker: "mc", text: "“Emang kamu pernah rugi besar?”" },
      { speaker: "hendrik", text: "Pedagang tersebut terdiam. “Pernah. Dan aku tidak berniat mengulanginya.”" },
      { speaker: "hendrik", text: "“Itulah kenapa pedagang harus tetap kalem.”" },
      { speaker: "mc", text: "“Bersikap…?”" },
    ],
    next: "q_kalem",
  },
  ...quizBlock(
    "q_kalem", "hendrik", "kalem",
    "Apa arti “kalem”?",
    [{ text: "Marah" }, { text: "Teliti" }, { text: "Tenang", correct: true }],
    "“Benar. Kalau kau panik, orang lain akan melihat kelemahanmu.”",
    "“Aku juga bisa bersikap seperti itu. Tapi aku lebih memilih untuk tenang.”",
    "hendrik_end",
  ),
  hendrik_end: {
    id: "hendrik_end",
    lines: [
      { speaker: "mc", text: "“Makasih ya udah mau ngobrol. Semoga dagangannya nggak tekor deh.”" },
      { speaker: "hendrik", text: "Ia terkekeh kecil untuk pertama kalinya. “Setidaknya kau mengingat kata itu.”" },
      { speaker: "hendrik", text: "“Dan jangan membuat masalah di haven.”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — FENG (Tiongkok) — lengkap
// ============================================================
const FENG: Record<string, DialogueNode> = {
  feng_1: {
    id: "feng_1",
    lines: [
      { speaker: "mc", text: "“Wih… rame banget toko lu. Barang apaan aja nih yang dijual?”" },
      { speaker: "feng", text: "“Rame dong! Kalau toko sepi, hati ikut sepi. Kalau hati sepi, pelanggan kabur. Kalau pelanggan kabur, perut gue ikut sedih.”" },
      { speaker: "feng", text: "Pria paruh baya itu merapikan gulungan kain sutra berkilauan. “Lu mau cari apa? Semua ada di sini. Dari teh terbaik sampai sutra yang dipakai para bangsawan.”" },
      { speaker: "mc", text: "“Gue cuma liat-liat doang sih. Tadi denger lu ngomong perut sedih, emang lu senengnya apa?”" },
      { speaker: "feng", text: "Ia tertawa kecil lalu ngeluarin amplop merah kecil dari lacinya. “Dulu waktu kecil, gue paling semangat nunggu angpao. Sekarang gue yang harus ngasih.”" },
      { speaker: "mc", text: "“Ohh, amplop isi … itu ya?”" },
    ],
    next: "q_angpao",
  },
  ...quizBlock(
    "q_angpao", "feng", "angpao",
    "Apa isi “angpao”?",
    [{ text: "Kertas" }, { text: "Uang", correct: true }, { text: "Surat" }],
    "“Nah, bener! Waktu kecil dapet sedikit aja udah seneng banget rasanya. Amplop merah ini bawa rezeki.”",
    "“Hahaha, masa isinya kertas kosong! Bukan sembarang lembaran loh. Isinya uang merah!”",
    "feng_2",
  ),
  feng_2: {
    id: "feng_2",
    lines: [
      { speaker: "feng", text: "“Sekarang gue berdagang di sini biar bisa kirim duit ke keluarga di kampung.”" },
      { speaker: "mc", text: "“Keren juga lu. Berarti lu dapet untung gede ya dari toko seramai ini?”" },
      { speaker: "feng", text: "“Untung itu relatif. Tapi tenang aja, kalau buat pelanggan ramah kayak lu, harga bisa gue bikin cincai lah.”" },
      { speaker: "mc", text: "“Cincai… jadi maksudnya harga bisa… gitu?”" },
    ],
    next: "q_cincai",
  },
  ...quizBlock(
    "q_cincai", "feng", "cincai",
    "Apa arti “cincai”?",
    [{ text: "Santai/gampang diatur", correct: true }, { text: "Dinego" }, { text: "Variatif" }],
    "“Tepat! Di mana pun kita berada, berteman baik itu bikin segala urusan gampang. Cincai lah urusannya!”",
    "“Wah bukan! Maksud gue santai aja, gampang diatur kok harganya.”",
    "feng_3",
  ),
  feng_3: {
    id: "feng_3",
    lines: [
      { speaker: "feng", text: "Ia berjalan ke sudut tokonya dan menunjuk gelang batu giok hijau. “Yang itu paling cepat laku. Katanya pembawa hoki buat yang makai.”" },
      { speaker: "mc", text: "“Oh ya? Cuma gara-gara gelang doang bisa dapet…?”" },
    ],
    next: "q_hoki",
  },
  ...quizBlock(
    "q_hoki", "feng", "hoki",
    "Hoki berarti mendapatkan…",
    [{ text: "Sial" }, { text: "Arah yang beda" }, { text: "Keberuntungan", correct: true }],
    "“Betul! Orang-orang suka membeli harapan. Terkadang secercah keberuntungan lebih mahal dari barangnya sendiri.”",
    "“Aduh, nggak mungkin lah! Justru banyak yang mau keberuntungan selalu ada di sisi mereka.”",
    "feng_4",
  ),
  feng_4: {
    id: "feng_4",
    lines: [
      { speaker: "mc", text: "“Lu jualan tiap hari dari pagi sampai malem, nggak capek apa?”" },
      { speaker: "feng", text: "“Capek sih pasti. Tapi kalo lagi bosen, biasanya gue sama temen-temen sesama pedagang kongkow depan toko sambil minum teh.”" },
      { speaker: "mc", text: "“Kalian pada…?”" },
    ],
    next: "q_kongkow",
  },
  ...quizBlock(
    "q_kongkow", "feng", "kongkow",
    "Apa arti “kongkow”?",
    [{ text: "Berjudi" }, { text: "Nongkrong", correct: true }, { text: "Main kartu remi" }],
    "“Nah, benar! Ngobrol ngalor-ngidul, makan camilan, ketawa bareng… buat gue, itu udah cukup bikin capek hilang.”",
    "“Ah, tidak boleh sembarangan! Gue lebih suka nongkrong santai sambil bercerita pengalaman.”",
    "feng_5",
  ),
  feng_5: {
    id: "feng_5",
    lines: [
      { speaker: "mc", text: "“Yaudah nih, karena lu udah baik banget ceritain semuanya, gue beli kipas angin kecil ini aja deh.”" },
      { speaker: "feng", text: "Wajah Feng berbinar. “Wahh, kamsia! Kamsia banyak-banyak, sobat!”" },
      { speaker: "mc", text: "“Wah, sama-sama! Itu lu bilang… ya?”" },
    ],
    next: "q_kamsia",
  },
  ...quizBlock(
    "q_kamsia", "feng", "kamsia",
    "Apa arti “kamsia”?",
    [{ text: "Sampai jumpa" }, { text: "Terima kasih", correct: true }, { text: "Senang berbisnis denganmu" }],
    "“Tepat sekali! Wah, lama-lama lu cocok nih jadi pedagang juga di sini.”",
    "“Hampir bener, tapi lebih tepatnya gue lagi berterima kasih banget sama lu.”",
    "feng_end",
  ),
  feng_end: {
    id: "feng_end",
    lines: [
      { speaker: "feng", text: "“Dateng lagi kapan-kapan ya! Nanti gue kasih liat sutra yang lebih bagus, atau kita minum teh bareng.”" },
      { speaker: "feng", text: "Ia ketawa keras sambil melambaikan tangannya. “Kalau perut senang, hidup jadi lebih ringan!”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — KARSA (Kawi) — lengkap
// ============================================================
const KARSA: Record<string, DialogueNode> = {
  karsa_1: {
    id: "karsa_1",
    lines: [
      { speaker: "mc", text: "“Permisi Pak… Dari tadi gue liat orang-orang pada mampir ke sini, tapi tokonya nggak kelihatan jualan barang mewah.”" },
      { speaker: "karsa", text: "Pria bersorban sederhana itu tersenyum tipis sambil menumbuk dedaunan kering. “Orang sering datang bukan untuk mencari barang, melainkan saat pikirannya sedang ramai.”" },
      { speaker: "mc", text: "“Maksudnya lu jualan… jamu penenang pikiran?”" },
      { speaker: "karsa", text: "“Bisa dibilang begitu. Beberapa butuh jamu, beberapa hanya butuh didengarkan.”" },
      { speaker: "karsa", text: "Seorang bapak tua lewat dan menyapanya dengan hormat. Karsa membalas salamnya. “Sudah lama aku tidak amprok dengannya di pasar ini.”" },
      { speaker: "mc", text: "“Eh, amprok? Maksudnya…?”" },
    ],
    next: "q_amprok",
  },
  ...quizBlock(
    "q_amprok", "karsa", "amprok",
    "Apa arti “amprok”?",
    [{ text: "Bertemu", correct: true }, { text: "Berlambai" }, { text: "Berbincang" }],
    "Ia mengangguk kecil. “Beberapa pertemuan datang tanpa direncanakan, hanya amprok di jalan.”",
    "“Hm… lebih tepatnya sekadar bertemu tanpa sengaja.”",
    "karsa_2",
  ),
  karsa_2: {
    id: "karsa_2",
    lines: [
      { speaker: "mc", text: "“Pasar ini kadang bikin pusing ya Pak, rame banget orang sibuk sana-sini.”" },
      { speaker: "karsa", text: "“Benar. Di Batavia ini banyak yang mencari kekayaan, mengejar kedudukan. Tapi terkadang mereka lupa untuk berpijak di bumi.”" },
      { speaker: "karsa", text: "“Orang yang terlalu banyak angen-angen biasanya lupa melihat keindahan yang ada di depan matanya sendiri.”" },
      { speaker: "mc", text: "“Oooh, mereka itu terlalu suka …?”" },
    ],
    next: "q_angen",
  },
  ...quizBlock(
    "q_angen", "karsa", "angen-angen",
    "Apa arti “angen-angen”?",
    [{ text: "Bersedih" }, { text: "Merasa marah" }, { text: "Melamun", correct: true }],
    "“Tepat. Memikirkan masa depan itu baik, asal jangan sampai tersesat di dalam khayalan semata.”",
    "“Ya, ada juga yang seperti itu. Tapi aku lebih sering melihat orang yang asyik melamun membayangkan hal yang belum terjadi.”",
    "karsa_3",
  ),
  karsa_3: {
    id: "karsa_3",
    lines: [
      { speaker: "karsa", text: "“Lagipula, hidup ini penuh badai. Kadang untung, kadang rugi. Kadang dipuji, kadang dicaci.”" },
      { speaker: "mc", text: "“Bener banget. Kadang bikin mental down kalau lagi rugi.”" },
      { speaker: "karsa", text: "“Itulah mengapa, apa pun yang terjadi, hidup harus dijalani dengan jongjon.”" },
      { speaker: "mc", text: "“Jongjon… itu artinya kita harus…?”" },
    ],
    next: "q_jongjon",
  },
  ...quizBlock(
    "q_jongjon", "karsa", "jongjon",
    "Apa arti “jongjon”?",
    [{ text: "Terhuyung" }, { text: "Tergesa-gesa" }, { text: "Tetap tabah", correct: true }],
    "“Tepat sekali. Hidup ini terlalu sebentar jika kita tidak tenang menghadapinya.”",
    "“Bukan. Jongjon itu artinya tetap teguh, tabah dan tidak mudah goyah meski keadaan berubah.”",
    "karsa_4",
  ),
  karsa_4: {
    id: "karsa_4",
    lines: [
      { speaker: "mc", text: "“Wah, gue jadi dapet banyak pencerahan nih ngobrol sama lu. Bahasanya puitis banget.”" },
      { speaker: "karsa", text: "Karsa menunjuk ke sebuah gulungan daun lontar di atas mejanya. “Dulu aku banyak belajar dari leluhur. Yang di lontar ini banyak berisi siloka.”" },
      { speaker: "mc", text: "“Siloka? Itu semacam…?”" },
    ],
    next: "q_siloka",
  },
  ...quizBlock(
    "q_siloka", "karsa", "siloka",
    "Apa arti “siloka”?",
    [{ text: "Amsal / perumpamaan", correct: true }, { text: "Catatan dagang" }, { text: "Jurnal pelaut" }],
    "“Benar. Kadang manusia lebih mudah memahami kehidupan lewat cerita dan perumpamaan.”",
    "“Kurasa yang ini jauh lebih bermakna. Siloka adalah amsal yang membuat hidup lebih mudah dipahami.”",
    "karsa_5",
  ),
  karsa_5: {
    id: "karsa_5",
    lines: [
      { speaker: "karsa", text: "Tiba-tiba beberapa anak kecil berlarian melintasi kios sambil tertawa sangat ribut, mengganggu ketenangan." },
      { speaker: "karsa", text: "Ia mengangkat tangannya sedikit. “Anak-anak, cep dulu! Jangan berlarian di sini.”" },
      { speaker: "mc", text: "“Nah tuh anak-anak pada nurut. Cep tuh apaan?”" },
    ],
    next: "q_cep",
  },
  ...quizBlock(
    "q_cep", "karsa", "cep",
    "Apa arti “cep”?",
    [{ text: "Makan" }, { text: "Diam / tenang", correct: true }, { text: "Pergi cepat" }],
    "“Iya, aku menyuruh mereka diam. Aku lebih suka jika suasana kiosku tenang.”",
    "“Artinya diam. Kadang tenang and tidak berisik lebih berguna daripada banyak bicara.”",
    "karsa_end",
  ),
  karsa_end: {
    id: "karsa_end",
    lines: [
      { speaker: "mc", text: "“Yaudah, gue cabut dulu deh Pak Karsa. Semoga kita amprok lagi nanti.”" },
      { speaker: "karsa", text: "Karsa tersenyum lebar dan mengangguk pelan. “Kalau waktunya tepat, manusia pasti bertemu kembali. Hati-hati di jalan.”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — THOMAS (Inggris) — lengkap
// ============================================================
const THOMAS: Record<string, DialogueNode> = {
  thomas_1: {
    id: "thomas_1",
    lines: [
      { speaker: "mc", text: "“Permisi… Sir? Wah bajunya beda banget sama pedagang lain di sini.”" },
      { speaker: "thomas", text: "Pria berjas rapi itu melirik sambil membersihkan monokelnya. “Interesting. Lazim bagi pendatang untuk langsung bingung dan menyentuh barang-barang di sini tanpa izin.”" },
      { speaker: "mc", text: "“Eh sori, gue cuma ngeliatin doang kok.”" },
      { speaker: "thomas", text: "Ia kembali merapikan tumpukan kertas di mejanya. “Tidak masalah. Saya masih harus menyiapkan beberapa amplop untuk dikirim ke London siang nanti.”" },
      { speaker: "mc", text: "“Amplop? Oh itu benda yang dipake buat … kan?”" },
    ],
    next: "q_amplop",
  },
  ...quizBlock(
    "q_amplop", "thomas", "amplop",
    "Apa arti “amplop”?",
    [{ text: "Perhiasan" }, { text: "Kunci" }, { text: "Surat", correct: true }],
    "“Tepat. Setidaknya ada satu benda di toko ini yang terasa familiar bagimu. Komunikasi itu penting.”",
    "“Bukan, ini untuk membungkus surat saja. Surat-surat berharga untuk ratu.”",
    "thomas_2",
  ),
  thomas_2: {
    id: "thomas_2",
    lines: [
      { speaker: "mc", text: "“Lu jualan alat navigasi juga ya? Emang kapal lu sering mondar-mandir jauh?”" },
      { speaker: "thomas", text: "“Tentu. Tapi sejujurnya, cuaca belakangan ini sangat tidak bersahabat.”" },
      { speaker: "thomas", text: "“Tadi malam kapal saya harus ngetem cukup lama di teluk karena badai.”" },
      { speaker: "mc", text: "“Oh, kapalnya harus…?”" },
    ],
    next: "q_ngetem",
  },
  ...quizBlock(
    "q_ngetem", "thomas", "ngetem",
    "Apa arti “ngetem”?",
    [{ text: "Menunggu waktu", correct: true }, { text: "Berlayar cepat" }, { text: "Diisi komoditas" }],
    "“Benar. Dan sayangnya menunggu tanpa kepastian adalah bagian terbesar dari perdagangan laut.”",
    "“Keinginan saya sih itu. Faktanya, kapal saya harus berhenti dan menunggu cukup lama.”",
    "thomas_3",
  ),
  thomas_3: {
    id: "thomas_3",
    lines: [
      { speaker: "thomas", text: "Ia memberikan gulungan kain tebal berwarna merah marun kepada asistennya. “Tolong oper barang itu ke gudang belakang. Hati-hati.”" },
      { speaker: "mc", text: "“Itu barangnya mau diapakan? Lu tadi bilang oper, berarti minta di…, ya?”" },
    ],
    next: "q_oper",
  },
  ...quizBlock(
    "q_oper", "thomas", "oper",
    "Apa arti “oper”?",
    [{ text: "Mengalihkan / memberikan ke orang lain", correct: true }, { text: "Buang ke tempat lain" }, { text: "Menyimpan barang" }],
    "“Tepat. Barang ini terlalu berharga untuk ditaruh di sembarang tempat, jadi harus dipindahkan ke asisten saya.”",
    "“Tidak persis. Oper berarti memindahkan atau memberikan benda tersebut pada orang lain.”",
    "thomas_4",
  ),
  thomas_4: {
    id: "thomas_4",
    lines: [
      { speaker: "mc", text: "Gue ga sengaja nyenggol kotak kayu di dekat meja." },
      { speaker: "thomas", text: "“Setop! Jangan sentuh peti itu dulu. Isinya instrumen astronomi yang sangat rapuh.”" },
      { speaker: "mc", text: "“O-oke! Tadi lu suruh gue untuk di…, kan?”" },
    ],
    next: "q_setop",
  },
  ...quizBlock(
    "q_setop", "thomas", "setop",
    "Apa arti “setop”?",
    [{ text: "Berangkatkan" }, { text: "Berhentikan", correct: true }, { text: "Pindahkan" }],
    "“Exactly. Akhirnya ada orang yang mengerti instruksi sederhana tanpa harus saya jelaskan panjang lebar.”",
    "“Buat apa saya minta dipindahkan? Saya meminta Anda menghentikan apa yang Anda lakukan. Setop itu berhenti.”",
    "thomas_5",
  ),
  thomas_5: {
    id: "thomas_5",
    lines: [
      { speaker: "mc", text: "“Btw, ini kain yang dipajang bahannya lembut banget. Baju buat bangsawan ya?”" },
      { speaker: "thomas", text: "“Oh, bukan. Itu uskut. Lebih cocok digunakan saat bersantai di dalam rumah.”" },
      { speaker: "mc", text: "“Uskut… kayak sejenis pakaian…?”" },
    ],
    next: "q_uskut",
  },
  ...quizBlock(
    "q_uskut", "thomas", "uskut",
    "Apa arti “uskut”?",
    [{ text: "Mantel resmi" }, { text: "Pakaian dalam" }, { text: "Daster / pakaian rumah", correct: true }],
    "“Tentu. House-coat. Bahkan saya menjadi pemasok kain terbesar untuk uskut di kota ini.”",
    "“Tidak. Untungnya bukan jas berat atau mantel resmi. Itu pakaian yang nyaman untuk di rumah.”",
    "thomas_end",
  ),
  thomas_end: {
    id: "thomas_end",
    lines: [
      { speaker: "mc", text: "“Yaudah gue cabut dulu deh Sir Thomas. Makasih ngobrolnya!”" },
      { speaker: "thomas", text: "“Hati-hati di dermaga. Orang sering kehilangan arah atau kehilangan dompetnya di tempat seramai itu.”" },
      { speaker: "thomas", text: "Ia tersenyum tipis merapikan dasinya. “Perhaps both. Good day.”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — JOÃO (Portugis) — lengkap
// ============================================================
const JOAO: Record<string, DialogueNode> = {
  joao_1: {
    id: "joao_1",
    lines: [
      { speaker: "mc", text: "“Whoa… Lu udah di sini dari tadi bang? Tampangnya capek bener.”" },
      { speaker: "joao", text: "Pria berwajah eksotis itu nyengir lebar, memperlihatkan giginya yang putih. “Dari sebelum matahari muncul kawan! Kapalku bocor sedikit setelah dihantam ombak besar. Tapi tenang, belum tenggelam.”" },
      { speaker: "mc", text: "“BELUM?! Terus krunya pada ke mana?”" },
      { speaker: "joao", text: "“Tadi malam setelah mati-matian bongkar barang, beberapa awak langsung bobo di dek kapal.”" },
      { speaker: "mc", text: "“Bobo… oh, itu berarti mereka lagi… kan?”" },
    ],
    next: "q_bobo",
  },
  ...quizBlock(
    "q_bobo", "joao", "bobo",
    "Apa arti “bobo”?",
    [{ text: "Tidur", correct: true }, { text: "Makan" }, { text: "Muntah" }],
    "“Benar! Kadang mereka tidur begitu cepat sampai-sampai masih memegang tali layar.”",
    "“Ah, kamu sedikit salah paham. Bobo artinya mereka langsung terlelap tidur.”",
    "joao_2",
  ),
  joao_2: {
    id: "joao_2",
    lines: [
      { speaker: "joao", text: "“Sayangnya karena saking lelahnya, aku lupa mematikan lentera di tiang utama.”" },
      { speaker: "joao", text: "“Kalau malam terlalu gelap, lentera itu bisa menyelamatkan orang dari jatuh ke laut.”" },
      { speaker: "mc", text: "“Lentera… itu berarti benda macam…?”" },
    ],
    next: "q_lentera",
  },
  ...quizBlock(
    "q_lentera", "joao", "lentera",
    "Apa arti “lentera”?",
    [{ text: "Senter" }, { text: "Lampu", correct: true }, { text: "Kompas" }],
    "“Benar. Cahaya kecil di lautan kadang jauh lebih menenangkan daripada lampu-lampu di kota besar.”",
    "“Bukan kompas. Lentera adalah lampu minyak. Cahaya redupnya terasa menenangkan di tengah kelamnya laut.”",
    "joao_3",
  ),
  joao_3: {
    id: "joao_3",
    lines: [
      { speaker: "mc", text: "“Btw, baju lu keren juga buat ukuran pelaut yang kapalnya baru bocor.”" },
      { speaker: "joao", text: "Ia tertawa sambil menyisir rambut ikalnya ke belakang. “Temanku juga sering bilang aku terlalu perlente buat ukuran orang laut yang kotor.”" },
      { speaker: "mc", text: "“Perlente… itu artinya lu dibilang…?”" },
    ],
    next: "q_perlente",
  },
  ...quizBlock(
    "q_perlente", "joao", "perlente",
    "Apa arti “perlente”?",
    [{ text: "Norak" }, { text: "Ribet" }, { text: "Rapih", correct: true }],
    "“Tepat! Laut boleh saja berantakan, ombak boleh saja mengamuk. Tapi penampilanku tidak boleh kalah.”",
    "“Tidak, tidak. Baju saya terlalu rapih and necis. Makanya orang bilang pakaian saya ini perlente.”",
    "joao_4",
  ),
  joao_4: {
    id: "joao_4",
    lines: [
      { speaker: "joao", text: "“Aku sebenarnya rindu rumah. Awalnya aku cuma ikut pesiar kecil dekat pantai Lisbon.”" },
      { speaker: "joao", text: "“Sekarang malah ikut kapal besar keliling dunia sampai terdampar di Batavia.”" },
      { speaker: "mc", text: "“Pesiar… kayak perjalanan buat…?”" },
    ],
    next: "q_pesiar",
  },
  ...quizBlock(
    "q_pesiar", "joao", "pesiar",
    "Apa arti “pesiar”?",
    [{ text: "Berlayar" }, { text: "Jalan-jalan", correct: true }, { text: "Berjualan kecil-kecilan" }],
    "“Benar. Awalnya terasa menyenangkan karena hanya untuk bersantai. Lalu tiba-tiba hidupmu habis di tengah lautan.”",
    "“Bukan pelayaran berat. Pesiar lebih ke sekadar berjalan-jalan bersantai menikmati indahnya pantai.”",
    "joao_5",
  ),
  joao_5: {
    id: "joao_5",
    lines: [
      { speaker: "joao", text: "“Olala, jangan pasang wajah sedih begitu kawanku. Aku belum mati dan aku sangat mencintai petualangan ini!”" },
      { speaker: "mc", text: "“Olala… itu ekspresi buat nunjukin rasa…?”" },
    ],
    next: "q_olala",
  },
  ...quizBlock(
    "q_olala", "joao", "olala",
    "Apa arti “olala”?",
    [{ text: "Ragu" }, { text: "Takut" }, { text: "Senang", correct: true }],
    "“Ya! Olala biasanya keluar spontan kalau kita melihat sesuatu yang menakjubkan atau merasa gembira.”",
    "“Itu hal yang berbeda. Saat aku takjub dan senang, aku mengatakan ‘Olala’. Cobalah nanti!”",
    "joao_end",
  ),
  joao_end: {
    id: "joao_end",
    lines: [
      { speaker: "joao", text: "Melambai sambil berbalik ke arah kapalnya. “Kalau kita bertemu lagi, akan kuceritakan tentang badai terbesar yang pernah kulihat di Tanjung Harapan.”" },
      { speaker: "joao", text: "“Olala… semoga saja kapal ini tidak bocor lagi saat aku tidur siang ini.”" },
      { speaker: "mc", text: "“ITU BAGIAN PERTAMA YANG HARUSNYA LU KHAWATIRIN DARI TADI 😭”" },
    ],
    end: true,
  },
};

export const DIALOGUE: Record<string, DialogueNode> = {
  ...JAFAR,
  ...HENDRIK,
  ...FENG,
  ...KARSA,
  ...THOMAS,
  ...JOAO,
};
