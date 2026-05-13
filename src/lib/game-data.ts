export type VocabWord = {
  id: string;
  original: string; // Dutch word
  language: string;
  literal: string; // original meaning
  betawi: string; // betawi/modern Indonesian meaning
  example: string; // contoh kalimat modern
  level: "common" | "advance";
};

export type DialogueLine = {
  speaker: "mc" | "merchant" | "narrator";
  text: string;
  // If this line introduces a new word, store it
  word?: VocabWord;
};

export type DialogueChoice = {
  text: string;
  nextId: string;
};

export type DialogueNode = {
  id: string;
  lines: DialogueLine[];
  choices?: DialogueChoice[];
  next?: string; // auto-advance to next node
  end?: boolean;
};

export const VOCABULARY: Record<string, VocabWord> = {
  bekend: {
    id: "bekend",
    original: "bekend",
    language: "Belanda",
    literal: "Terkenal, dikenal banyak orang",
    betawi: "Beken — keren, populer, terkenal",
    example: "“Warung kopi di pojok itu beken banget di kalangan anak muda.”",
    level: "common",
  },
  kantoor: {
    id: "kantoor",
    original: "kantoor",
    language: "Belanda",
    literal: "Tempat kerja, ruang administrasi",
    betawi: "Kantor — tempat bekerja",
    example: "“Gua berangkat ke kantor naik kereta tiap pagi.”",
    level: "common",
  },
  handdoek: {
    id: "handdoek",
    original: "handdoek",
    language: "Belanda",
    literal: "Kain pengering tangan/badan",
    betawi: "Handuk — kain untuk mengeringkan badan",
    example: "“Jangan lupa bawa handuk kalo ke kolam renang.”",
    level: "common",
  },
  gratis: {
    id: "gratis",
    original: "gratis",
    language: "Belanda",
    literal: "Tanpa biaya",
    betawi: "Gratis — cuma-cuma, tidak bayar",
    example: "“Wifi di kafe ini gratis, asal pesen minum.”",
    level: "common",
  },
  ongkos: {
    id: "ongkos",
    original: "onkost",
    language: "Belanda",
    literal: "Biaya, pengeluaran",
    betawi: "Ongkos — biaya transportasi atau jasa",
    example: "“Ongkos ojek dari sini ke stasiun berapa, bang?”",
    level: "advance",
  },
  persekot: {
    id: "persekot",
    original: "voorschot",
    language: "Belanda",
    literal: "Uang muka, pembayaran di awal",
    betawi: "Persekot — uang muka, DP",
    example: "“Sewa kontrakan ini mesti bayar persekot dulu sebulan.”",
    level: "advance",
  },
};

export const DIALOGUE: Record<string, DialogueNode> = {
  start: {
    id: "start",
    lines: [
      {
        speaker: "narrator",
        text: "Batavia, tahun 1619. Matahari sore membakar langit di atas pelabuhan Sunda Kelapa...",
      },
      {
        speaker: "narrator",
        text: "Kau, Sanip — pemuda Betawi — berjalan menyusuri pasar yang ramai oleh saudagar dari segala penjuru dunia.",
      },
      {
        speaker: "mc",
        text: "(Banyak sekali orang asing hari ini. Bahasa mereka aneh di telinga gue...)",
      },
      {
        speaker: "merchant",
        text: "Hé, jongen! Kemari, kemari! Lihat barang-barang dari Amsterdam!",
      },
    ],
    next: "intro2",
  },
  intro2: {
    id: "intro2",
    lines: [
      {
        speaker: "mc",
        text: "Eh, tuan saudagar. Barang apa saja yang tuan jual?",
      },
      {
        speaker: "merchant",
        text: "Ah, banyak! Rempah, kain, dan kitab. Toko saya zeer bekend di Amsterdam, tahukah kau?",
        word: VOCABULARY.bekend,
      },
    ],
    choices: [
      { text: "“Bekend? Apa artinya itu, tuan?”", nextId: "explain_bekend" },
      { text: "(Anggukkan kepala saja, pura-pura mengerti.)", nextId: "skip_bekend" },
    ],
  },
  explain_bekend: {
    id: "explain_bekend",
    lines: [
      {
        speaker: "merchant",
        text: "Bekend! Artinya... terkenal! Banyak orang tahu tokoku di seluruh negeri Belanda.",
      },
      {
        speaker: "mc",
        text: "(Bekend... terkenal. Kata yang menarik. Akan kuingat-ingat.)",
      },
      {
        speaker: "narrator",
        text: "📖 Kata baru tersimpan di kamusmu: BEKEND",
      },
    ],
    next: "office",
  },
  skip_bekend: {
    id: "skip_bekend",
    lines: [
      {
        speaker: "mc",
        text: "(Aku tak mengerti, tapi tak ingin terlihat bodoh.)",
      },
      {
        speaker: "merchant",
        text: "Hahaha, kau bingung? Bekend artinya terkenal, jongen. Banyak orang kenal tokoku!",
      },
      {
        speaker: "narrator",
        text: "📖 Kata baru tersimpan di kamusmu: BEKEND",
      },
    ],
    next: "office",
  },
  office: {
    id: "office",
    lines: [
      {
        speaker: "merchant",
        text: "Aku punya kantoor di dekat kastil. Datanglah kapan-kapan untuk berdagang.",
        word: VOCABULARY.kantoor,
      },
      {
        speaker: "mc",
        text: "Kantoor itu... tempat tuan bekerja, begitu?",
      },
      {
        speaker: "merchant",
        text: "Tepat! Tempat aku menulis surat dan menghitung uang. Kantoor.",
      },
      {
        speaker: "narrator",
        text: "📖 Kata baru tersimpan di kamusmu: KANTOOR",
      },
    ],
    next: "price",
  },
  price: {
    id: "price",
    lines: [
      {
        speaker: "merchant",
        text: "Nah, untuk sahabat baru, kuberikan handdoek ini... gratis!",
        word: VOCABULARY.gratis,
      },
      {
        speaker: "mc",
        text: "Handdoek? Gratis?",
      },
      {
        speaker: "merchant",
        text: "Handdoek — kain untuk mengeringkan tangan dan badan. Gratis — tanpa bayar! Hadiah dariku.",
        word: VOCABULARY.handdoek,
      },
      {
        speaker: "narrator",
        text: "📖 Dua kata baru tersimpan: HANDDOEK & GRATIS",
      },
    ],
    choices: [
      { text: "“Tanyakan tentang biaya pengiriman.”", nextId: "ongkos" },
      { text: "“Tanyakan cara memesan barang.”", nextId: "persekot" },
    ],
  },
  ongkos: {
    id: "ongkos",
    lines: [
      {
        speaker: "mc",
        text: "Tuan, kalau aku ingin barang dikirim ke kampungku, bagaimana?",
      },
      {
        speaker: "merchant",
        text: "Ah, ada onkost — biaya tambahan untuk kuli dan pedati. Tergantung jauhnya.",
        word: VOCABULARY.ongkos,
      },
      {
        speaker: "narrator",
        text: "📖 Kata baru tersimpan: ONKOST → ONGKOS",
      },
    ],
    next: "ending",
  },
  persekot: {
    id: "persekot",
    lines: [
      {
        speaker: "mc",
        text: "Bagaimana cara memesan barang yang belum ada, tuan?",
      },
      {
        speaker: "merchant",
        text: "Mudah! Bayar voorschot — uang muka — separuh harga. Sisanya saat barang tiba.",
        word: VOCABULARY.persekot,
      },
      {
        speaker: "narrator",
        text: "📖 Kata baru tersimpan: VOORSCHOT → PERSEKOT",
      },
    ],
    next: "ending",
  },
  ending: {
    id: "ending",
    lines: [
      {
        speaker: "merchant",
        text: "Tot ziens, jongen! Sampai jumpa lagi!",
      },
      {
        speaker: "mc",
        text: "(Hari ini aku belajar banyak kata baru. Mungkin suatu hari nanti, orang-orang Betawi akan memakai kata-kata ini juga...)",
      },
      {
        speaker: "narrator",
        text: "— Tamat babak 1 —",
      },
      {
        speaker: "narrator",
        text: "Buka 📖 Kamus untuk melihat semua kata yang sudah kau kumpulkan.",
      },
    ],
    end: true,
  },
};
