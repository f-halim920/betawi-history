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
    [{ text: "Kopi", correct: true }, { text: "Teh" }, { text: "Parfum" }],
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
    [{ text: "Kaya", correct: true }, { text: "Pelit" }, { text: "Ramah" }],
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
    [{ text: "Salam penutup / beserta salam", correct: true }, { text: "Sampai besok" }, { text: "Senang bertemu denganmu" }],
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
    [{ text: "Tenang", correct: true }, { text: "Marah" }, { text: "Teliti" }],
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
// DIALOG — FENG (Tiongkok) — ringkas
// ============================================================
const FENG: Record<string, DialogueNode> = {
  feng_1: {
    id: "feng_1",
    lines: [
      { speaker: "mc", text: "“Wih… rame banget toko lu.”" },
      { speaker: "feng", text: "“Rame dong! Kalau toko sepi, hati ikut sepi. Kalau hati sepi, pelanggan kabur. Kalau pelanggan kabur, perut gue ikut sedih.”" },
      { speaker: "feng", text: "Ia ngeluarin amplop merah kecil dari laci. “Dulu waktu kecil gue paling semangat nunggu angpao.”" },
      { speaker: "mc", text: "“Ohh, amplop isi … itu?”" },
    ],
    next: "q_angpao",
  },
  ...quizBlock(
    "q_angpao", "feng", "angpao",
    "Apa isi “angpao”?",
    [{ text: "Kertas" }, { text: "Uang", correct: true }, { text: "Surat" }],
    "“Nah, bener! Waktu kecil dapet sedikit aja udah seneng.”",
    "“Bukan sembarang lembaran loh. Isinya uang!”",
    "feng_2",
  ),
  feng_2: {
    id: "feng_2",
    lines: [
      { speaker: "feng", text: "“Tapi tenang. Kalau pelanggan ramah kayak lu, harga bisa gue bikin cincai.”" },
      { speaker: "mc", text: "“Jadi… gitu?”" },
    ],
    next: "q_cincai",
  },
  ...quizBlock(
    "q_cincai", "feng", "cincai",
    "Apa arti “cincai”?",
    [{ text: "Santai/gampang diatur", correct: true }, { text: "Dinego" }, { text: "Variatif" }],
    "“Tepat! Di mana pun, teman baik selalu dikasih mudah, bukan?”",
    "“Deket. Maksud gue santai aja, gampang diatur.”",
    "feng_3",
  ),
  feng_3: {
    id: "feng_3",
    lines: [
      { speaker: "feng", text: "Nunjuk gelang batu hijau. “Yang itu paling cepat laku. Katanya pembawa hoki.”" },
      { speaker: "mc", text: "“Oooh, jadi biar dapet…?”" },
    ],
    next: "q_hoki",
  },
  ...quizBlock(
    "q_hoki", "feng", "hoki",
    "Hoki berarti mendapatkan…",
    [{ text: "Sial" }, { text: "Arah yang beda" }, { text: "Keberuntungan", correct: true }],
    "“Betul! Orang suka beli harapan. Kadang lebih mahal dari barangnya sendiri.”",
    "“Nggak mungkin, lah! Justru banyak yang mau keberuntungan selalu di sisi mereka.”",
    "feng_4",
  ),
  feng_4: {
    id: "feng_4",
    lines: [
      { speaker: "feng", text: "“Kalo lagi bosen, biasanya gue sama temen-temen kongkow depan toko.”" },
      { speaker: "mc", text: "“Kalian…?”" },
    ],
    next: "q_kongkow",
  },
  ...quizBlock(
    "q_kongkow", "feng", "kongkow",
    "Apa arti “kongkow”?",
    [{ text: "Berjudi" }, { text: "Nongkrong", correct: true }, { text: "Main kartu remi" }],
    "“Nah, benar! Ngobrol, makan, ketawa… buat gue, itu cukup bikin capek hilang.”",
    "“Ah, tidak! Gue lebih suka nongkrong santai sambil bercerita.”",
    "feng_5",
  ),
  feng_5: {
    id: "feng_5",
    lines: [
      { speaker: "mc", text: "“Yaudah nih, gue beli yang ini aja deh.”" },
      { speaker: "feng", text: "“Wahh, kamsia!”" },
      { speaker: "mc", text: "“Itu … ya?”" },
    ],
    next: "q_kamsia",
  },
  ...quizBlock(
    "q_kamsia", "feng", "kamsia",
    "Apa arti “kamsia”?",
    [{ text: "Sampai jumpa" }, { text: "Terima kasih", correct: true }, { text: "Senang berbisnis denganmu" }],
    "“Tepat! Wah, lama-lama lu cocok jadi pedagang juga.”",
    "“Lebih tepatnya berterima kasih.”",
    "feng_end",
  ),
  feng_end: {
    id: "feng_end",
    lines: [
      { speaker: "feng", text: "“Dateng lagi kapan-kapan! Nanti gue kasih liat sutra yang lebih bagus.”" },
      { speaker: "feng", text: "Ia ketawa keras sambil dadah. “Kalau perut senang, hidup jadi lebih ringan!”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — KARSA (Kawi) — ringkas
// ============================================================
const KARSA: Record<string, DialogueNode> = {
  karsa_1: {
    id: "karsa_1",
    lines: [
      { speaker: "mc", text: "“Permisi… Dari tadi gue liat orang-orang pada mampir ke sini.”" },
      { speaker: "karsa", text: "“Orang sering datang saat pikirannya ramai.”" },
      { speaker: "karsa", text: "Seorang bapak tua lewat dan menyapa. “Sudah lama tidak amprok dengannya.”" },
      { speaker: "mc", text: "“Maksudnya…?”" },
    ],
    next: "q_amprok",
  },
  ...quizBlock(
    "q_amprok", "karsa", "amprok",
    "Apa arti “amprok”?",
    [{ text: "Bertemu", correct: true }, { text: "Berlambai" }, { text: "Berbincang" }],
    "Ia mengangguk kecil. “Beberapa pertemuan datang tanpa direncanakan.”",
    "“Hm… lebih tepatnya sekadar bertemu.”",
    "karsa_2",
  ),
  karsa_2: {
    id: "karsa_2",
    lines: [
      { speaker: "karsa", text: "“Orang yang terlalu banyak angen-angen biasanya lupa melihat yang ada di depan mata.”" },
      { speaker: "mc", text: "“Oooh, mereka suka …?”" },
    ],
    next: "q_angen",
  },
  ...quizBlock(
    "q_angen", "karsa", "angen-angen",
    "Apa arti “angen-angen”?",
    [{ text: "Melamun", correct: true }, { text: "Merasa marah" }, { text: "Bersedih" }],
    "“Tepat. Memikirkan masa depan itu baik asal jangan sampai tersesat di dalamnya.”",
    "“Ya, ada juga yang seperti itu. Tapi aku lebih sering lihat orang yang melamun.”",
    "karsa_3",
  ),
  karsa_3: {
    id: "karsa_3",
    lines: [
      { speaker: "karsa", text: "“Lagipula, hidup harus dijalani dengan jongjon.”" },
      { speaker: "mc", text: "“Jongjon…?”" },
    ],
    next: "q_jongjon",
  },
  ...quizBlock(
    "q_jongjon", "karsa", "jongjon",
    "Apa arti “jongjon”?",
    [{ text: "Tetap tabah", correct: true }, { text: "Tergesa-gesa" }, { text: "Terhuyung" }],
    "“Tepat sekali. Hidup ini terlalu sebentar jika terlalu tergesa-gesa.”",
    "“Bukan. Jongjon itu tetap teguh meski keadaan berubah.”",
    "karsa_4",
  ),
  karsa_4: {
    id: "karsa_4",
    lines: [
      { speaker: "karsa", text: "Menunjuk daun lontar. “Yang ini banyak berisi siloka.”" },
      { speaker: "mc", text: "“Suatu…?”" },
    ],
    next: "q_siloka",
  },
  ...quizBlock(
    "q_siloka", "karsa", "siloka",
    "Apa arti “siloka”?",
    [{ text: "Amsal / perumpamaan", correct: true }, { text: "Catatan dagang" }, { text: "Jurnal pelaut" }],
    "“Benar. Kadang manusia lebih mudah memahami sesuatu lewat cerita.”",
    "“Kurasa yang ini jauh lebih bermakna. Banyaknya amsal membuat hidup lebih mudah dipahami.”",
    "karsa_5",
  ),
  karsa_5: {
    id: "karsa_5",
    lines: [
      { speaker: "karsa", text: "Beberapa anak kecil lari ribut. “Cep dulu!”" },
      { speaker: "mc", text: "“Nah tuh. Cep tuh apaan?”" },
    ],
    next: "q_cep",
  },
  ...quizBlock(
    "q_cep", "karsa", "cep",
    "Apa arti “cep”?",
    [{ text: "Diam / tenang", correct: true }, { text: "Makan" }, { text: "Pergi cepat" }],
    "“Iya, aku lebih suka jika suasana kiosku tenang.”",
    "“Diam. Kadang tenang lebih berguna daripada banyak bicara.”",
    "karsa_end",
  ),
  karsa_end: {
    id: "karsa_end",
    lines: [
      { speaker: "mc", text: "“Yaudah, gue cabut dulu deh. Semoga kita amprok lagi.”" },
      { speaker: "karsa", text: "Karsa tersenyum lebar. “Kalau waktunya tepat, manusia pasti bertemu kembali.”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — THOMAS (Inggris) — ringkas
// ============================================================
const THOMAS: Record<string, DialogueNode> = {
  thomas_1: {
    id: "thomas_1",
    lines: [
      { speaker: "mc", text: "“Permisi…”" },
      { speaker: "thomas", text: "“Interesting. Lazim untuk langsung bingung dan menyentuh barang-barang di sini.”" },
      { speaker: "thomas", text: "Merapikan surat. “Saya masih harus menyiapkan beberapa amplop untuk dikirim siang nanti.”" },
      { speaker: "mc", text: "“Amplop? Oh itu yang buat … kan?”" },
    ],
    next: "q_amplop",
  },
  ...quizBlock(
    "q_amplop", "thomas", "amplop",
    "Apa arti “amplop”?",
    [{ text: "Surat", correct: true }, { text: "Kunci" }, { text: "Perhiasan" }],
    "“Tepat. Setidaknya ada satu benda di toko ini yang terasa familiar bagimu.”",
    "“Bukan, ini untuk surat saja.”",
    "thomas_2",
  ),
  thomas_2: {
    id: "thomas_2",
    lines: [
      { speaker: "thomas", text: "“Tadi malam kapal saya harus ngetem cukup lama karena cuaca.”" },
      { speaker: "mc", text: "“Berarti…?”" },
    ],
    next: "q_ngetem",
  },
  ...quizBlock(
    "q_ngetem", "thomas", "ngetem",
    "Apa arti “ngetem”?",
    [{ text: "Menunggu waktu", correct: true }, { text: "Berlayar cepat" }, { text: "Diisi komoditas" }],
    "“Benar. Dan sayangnya menunggu adalah bagian besar dari perdagangan.”",
    "“Keinginan saya sih itu. Faktanya, kapal saya harus menunggu cukup lama.”",
    "thomas_3",
  ),
  thomas_3: {
    id: "thomas_3",
    lines: [
      { speaker: "thomas", text: "Memberi gulungan kain. “Tolong oper barang itu ke belakang.”" },
      { speaker: "mc", text: "“Itu barangnya mau diapakan? Lagi di…, ya?”" },
    ],
    next: "q_oper",
  },
  ...quizBlock(
    "q_oper", "thomas", "oper",
    "Apa arti “oper”?",
    [{ text: "Mengalihkan / memberikan ke orang lain", correct: true }, { text: "Buang ke tempat lain" }, { text: "Menyimpan barang" }],
    "“Tepat. Barang ini terlalu berharga untuk ditaruh di sembarang tempat.”",
    "“Tidak persis. Oper berarti memindahkan atau memberikan pada orang lain.”",
    "thomas_4",
  ),
  thomas_4: {
    id: "thomas_4",
    lines: [
      { speaker: "thomas", text: "Suara barang jatuh. “Setop. Jangan sentuh peti itu dulu.”" },
      { speaker: "mc", text: "“Itu mau di…, kan?”" },
    ],
    next: "q_setop",
  },
  ...quizBlock(
    "q_setop", "thomas", "setop",
    "Apa arti “setop”?",
    [{ text: "Berangkatkan" }, { text: "Berhentikan", correct: true }, { text: "Pindahkan" }],
    "“Exactly. Akhirnya ada yang tidak perlu saya jelaskan panjang lebar.”",
    "“Buat apa saya lakukan itu? Saya hentikan saja apa yang mereka lakukan. Setop itu berhenti.”",
    "thomas_5",
  ),
  thomas_5: {
    id: "thomas_5",
    lines: [
      { speaker: "mc", text: "Ngeliat kain panjang. “Yang itu apaan?”" },
      { speaker: "thomas", text: "“Oh, itu uskut. Pakaian rumah.”" },
      { speaker: "mc", text: "“Uskut… kayak ‘XYZ’?”" },
    ],
    next: "q_uskut",
  },
  ...quizBlock(
    "q_uskut", "thomas", "uskut",
    "Apa arti “uskut”?",
    [{ text: "Mantel resmi" }, { text: "Pakaian dalam" }, { text: "Daster / pakaian rumah", correct: true }],
    "“Tentu. Bahkan saya menjadi pemasok kain terbesar untuk uskut di sini.”",
    "“Tidak. Dan untungnya bukan jas atau apapun itu.”",
    "thomas_end",
  ),
  thomas_end: {
    id: "thomas_end",
    lines: [
      { speaker: "mc", text: "“Yaudah gue cabut dulu.”" },
      { speaker: "thomas", text: "“Hati-hati di dermaga. Orang sering kehilangan arah di tempat seramai itu.”" },
      { speaker: "thomas", text: "Ia tersenyum tipis. “Perhaps both.”" },
    ],
    end: true,
  },
};

// ============================================================
// DIALOG — JOÃO (Portugis) — ringkas
// ============================================================
const JOAO: Record<string, DialogueNode> = {
  joao_1: {
    id: "joao_1",
    lines: [
      { speaker: "mc", text: "“Whoa… Lu udah di sini dari tadi?”" },
      { speaker: "joao", text: "Nyengir lebar. “Dari sebelum matahari muncul. Kapalku bocor sedikit. Tapi tenang, belum tenggelam.”" },
      { speaker: "mc", text: "“BELUM?!”" },
      { speaker: "joao", text: "“Tadi malam setelah bongkar barang, beberapa awak langsung bobo di dek kapal.”" },
      { speaker: "mc", text: "“Bobo… oh, itu ‘XYZ’ kan?”" },
    ],
    next: "q_bobo",
  },
  ...quizBlock(
    "q_bobo", "joao", "bobo",
    "Apa arti “bobo”?",
    [{ text: "Tidur", correct: true }, { text: "Makan" }, { text: "Muntah" }],
    "“Benar! Kadang mereka tidur begitu cepat sampai masih memegang tali kapal.”",
    "“Ah, kamu sedikit salah paham. Bobo artinya tidur.”",
    "joao_2",
  ),
  joao_2: {
    id: "joao_2",
    lines: [
      { speaker: "joao", text: "“Aku lupa mematikan lentera. Kalau malam terlalu gelap, lentera bisa menyelamatkan orang dari jatuh ke laut.”" },
      { speaker: "mc", text: "“Lentera… itu ‘XYZ’?”" },
    ],
    next: "q_lentera",
  },
  ...quizBlock(
    "q_lentera", "joao", "lentera",
    "Apa arti “lentera”?",
    [{ text: "Lampu", correct: true }, { text: "Senter" }, { text: "Kompas" }],
    "“Benar. Cahaya kecil di laut kadang lebih menenangkan daripada kota besar.”",
    "“Lentera adalah lampu. Cahaya redupnya terasa menenangkan di tengah kelamnya laut.”",
    "joao_3",
  ),
  joao_3: {
    id: "joao_3",
    lines: [
      { speaker: "joao", text: "“Temanku sering bilang aku terlalu perlente buat orang kapal.”" },
      { speaker: "mc", text: "“Perlente… berarti ‘XYZ’?”" },
    ],
    next: "q_perlente",
  },
  ...quizBlock(
    "q_perlente", "joao", "perlente",
    "Apa arti “perlente”?",
    [{ text: "Norak" }, { text: "Ribet" }, { text: "Rapih", correct: true }],
    "“Tepat! Laut boleh berantakan. Aku tidak.”",
    "“Tidak, tidak. Baju saya terlalu rapih. Makanya orang bilang pakaian saya perlente.”",
    "joao_4",
  ),
  joao_4: {
    id: "joao_4",
    lines: [
      { speaker: "joao", text: "“Awalnya aku cuma ikut pesiar kecil dekat pantai. Sekarang malah keliling dunia.”" },
      { speaker: "mc", text: "“Pesiar… kayak ‘XYZ’?”" },
    ],
    next: "q_pesiar",
  },
  ...quizBlock(
    "q_pesiar", "joao", "pesiar",
    "Apa arti “pesiar”?",
    [{ text: "Berlayar" }, { text: "Jalan-jalan", correct: true }, { text: "Berjualan kecil-kecilan" }],
    "“Benar. Awalnya terasa menyenangkan. Lalu tiba-tiba hidupmu habis di laut.”",
    "“Bukan. Pesiar lebih dari itu — aku bisa berlayar menikmati indahnya laut.”",
    "joao_5",
  ),
  joao_5: {
    id: "joao_5",
    lines: [
      { speaker: "joao", text: "“Olala, jangan pasang wajah sedih begitu. Aku belum mati.”" },
      { speaker: "mc", text: "“Olala… itu ekspresi ‘XYZ’ ya?”" },
    ],
    next: "q_olala",
  },
  ...quizBlock(
    "q_olala", "joao", "olala",
    "Apa arti “olala”?",
    [{ text: "Ragu" }, { text: "Takut" }, { text: "Senang", correct: true }],
    "“Ya! Biasanya keluar spontan kalau melihat sesuatu menarik.”",
    "“Itu hal yang berbeda. Aku senang, aku mengatakan ‘Olala’. Cobalah!”",
    "joao_end",
  ),
  joao_end: {
    id: "joao_end",
    lines: [
      { speaker: "joao", text: "Melambai. “Kalau kita bertemu lagi, akan kuceritakan badai terbesar yang pernah kulihat.”" },
      { speaker: "joao", text: "“Olala… semoga kapal ini tidak bocor lagi pagi ini.”" },
      { speaker: "mc", text: "“ITU BAGIAN PERTAMA YANG HARUSNYA LU KHAWATIRIN 😭”" },
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
