import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import "./Vocabulary.css";

/* =========================================================
   CẤU HÌNH TIMER
========================================================= */

const EXP_PER_MINUTE = 10;
const SECONDS_PER_MINUTE = 60;

const TIMER_STORAGE_PREFIX = "vocabulary_study_";

/* =========================================================
   DỮ LIỆU CHỦ ĐỀ
========================================================= */

const vocabularyCategories = [
  {
    id: "numbers",
    icon: "🔢",
    title: "Số đếm",
    description: "Số 1–20, hàng chục, hàng trăm và 1.000",
  },
  {
    id: "greetings",
    icon: "👋",
    title: "Chào hỏi",
    description: "Chào hỏi và giao tiếp cơ bản",
  },
  {
    id: "family",
    icon: "👨‍👩‍👧",
    title: "Gia đình",
    description: "Các thành viên trong gia đình",
  },
  {
    id: "jobs",
    icon: "👨‍⚕️",
    title: "Nghề nghiệp",
    description: "15 nghề nghiệp thông dụng",
  },
  {
    id: "animals",
    icon: "🐃",
    title: "Con vật",
    description: "15 con vật quen thuộc",
  },
  {
    id: "objects",
    icon: "🎒",
    title: "Đồ vật",
    description: "15 đồ vật thường gặp",
  },
];

/* =========================================================
   TỪ VỰNG
========================================================= */

const vocabularyData = {
  /* =======================================================
     1. SỐ ĐẾM
  ======================================================= */

  numbers: [
    { khmer: "មួយ", roman: "muoy", vietnamese: "Một", image: "1" },
    { khmer: "ពីរ", roman: "pii", vietnamese: "Hai", image: "2" },
    { khmer: "បី", roman: "bei", vietnamese: "Ba", image: "3" },
    { khmer: "បួន", roman: "buon", vietnamese: "Bốn", image: "4" },
    { khmer: "ប្រាំ", roman: "pram", vietnamese: "Năm", image: "5" },

    {
      khmer: "ប្រាំមួយ",
      roman: "pram-muoy",
      vietnamese: "Sáu",
      image: "6",
    },
    {
      khmer: "ប្រាំពីរ",
      roman: "pram-pii",
      vietnamese: "Bảy",
      image: "7",
    },
    {
      khmer: "ប្រាំបី",
      roman: "pram-bei",
      vietnamese: "Tám",
      image: "8",
    },
    {
      khmer: "ប្រាំបួន",
      roman: "pram-buon",
      vietnamese: "Chín",
      image: "9",
    },
    {
      khmer: "ដប់",
      roman: "dop",
      vietnamese: "Mười",
      image: "10",
    },

    {
      khmer: "ដប់មួយ",
      roman: "dop-muoy",
      vietnamese: "Mười một",
      image: "11",
    },
    {
      khmer: "ដប់ពីរ",
      roman: "dop-pii",
      vietnamese: "Mười hai",
      image: "12",
    },
    {
      khmer: "ដប់បី",
      roman: "dop-bei",
      vietnamese: "Mười ba",
      image: "13",
    },
    {
      khmer: "ដប់បួន",
      roman: "dop-buon",
      vietnamese: "Mười bốn",
      image: "14",
    },
    {
      khmer: "ដប់ប្រាំ",
      roman: "dop-pram",
      vietnamese: "Mười lăm",
      image: "15",
    },
    {
      khmer: "ដប់ប្រាំមួយ",
      roman: "dop-pram-muoy",
      vietnamese: "Mười sáu",
      image: "16",
    },
    {
      khmer: "ដប់ប្រាំពីរ",
      roman: "dop-pram-pii",
      vietnamese: "Mười bảy",
      image: "17",
    },
    {
      khmer: "ដប់ប្រាំបី",
      roman: "dop-pram-bei",
      vietnamese: "Mười tám",
      image: "18",
    },
    {
      khmer: "ដប់ប្រាំបួន",
      roman: "dop-pram-buon",
      vietnamese: "Mười chín",
      image: "19",
    },
    {
      khmer: "ម្ភៃ",
      roman: "m'phai",
      vietnamese: "Hai mươi",
      image: "20",
    },

    {
      khmer: "សាមសិប",
      roman: "sam-sap",
      vietnamese: "Ba mươi",
      image: "30",
    },
    {
      khmer: "សែសិប",
      roman: "sae-sap",
      vietnamese: "Bốn mươi",
      image: "40",
    },
    {
      khmer: "ហាសិប",
      roman: "haa-sap",
      vietnamese: "Năm mươi",
      image: "50",
    },
    {
      khmer: "ហុកសិប",
      roman: "hok-sap",
      vietnamese: "Sáu mươi",
      image: "60",
    },
    {
      khmer: "ចិតសិប",
      roman: "chet-sap",
      vietnamese: "Bảy mươi",
      image: "70",
    },
    {
      khmer: "ប៉ែតសិប",
      roman: "paet-sap",
      vietnamese: "Tám mươi",
      image: "80",
    },
    {
      khmer: "កៅសិប",
      roman: "kau-sap",
      vietnamese: "Chín mươi",
      image: "90",
    },

    {
      khmer: "មួយរយ",
      roman: "muoy-roy",
      vietnamese: "Một trăm",
      image: "100",
    },
    {
      khmer: "ពីររយ",
      roman: "pii-roy",
      vietnamese: "Hai trăm",
      image: "200",
    },
    {
      khmer: "បីរយ",
      roman: "bei-roy",
      vietnamese: "Ba trăm",
      image: "300",
    },
    {
      khmer: "បួនរយ",
      roman: "buon-roy",
      vietnamese: "Bốn trăm",
      image: "400",
    },
    {
      khmer: "ប្រាំរយ",
      roman: "pram-roy",
      vietnamese: "Năm trăm",
      image: "500",
    },
    {
      khmer: "ប្រាំមួយរយ",
      roman: "pram-muoy-roy",
      vietnamese: "Sáu trăm",
      image: "600",
    },
    {
      khmer: "ប្រាំពីររយ",
      roman: "pram-pii-roy",
      vietnamese: "Bảy trăm",
      image: "700",
    },
    {
      khmer: "ប្រាំបីរយ",
      roman: "pram-bei-roy",
      vietnamese: "Tám trăm",
      image: "800",
    },
    {
      khmer: "ប្រាំបួនរយ",
      roman: "pram-buon-roy",
      vietnamese: "Chín trăm",
      image: "900",
    },
    {
      khmer: "មួយពាន់",
      roman: "muoy-poan",
      vietnamese: "Một nghìn",
      image: "1000",
    },
  ],

  /* =======================================================
     2. CHÀO HỎI
  ======================================================= */

  greetings: [
    {
      khmer: "ជំរាបសួរ",
      roman: "chum-riep-sua",
      vietnamese: "Xin chào (lịch sự)",
      image: "🙏",
    },
    {
      khmer: "សួស្តី",
      roman: "suos-dei",
      vietnamese: "Xin chào (thân mật)",
      image: "👋",
    },
    {
      khmer: "សួស្តីបង",
      roman: "suos-dei bong",
      vietnamese: "Chào anh/chị",
      image: "👋",
    },
    {
      khmer: "អរគុណ",
      roman: "aw-kun",
      vietnamese: "Cảm ơn",
      image: "🙏",
    },
    {
      khmer: "អរគុណច្រើន",
      roman: "aw-kun chraen",
      vietnamese: "Cảm ơn rất nhiều",
      image: "🙏",
    },
    {
      khmer: "សូមទោស",
      roman: "som-toh",
      vietnamese: "Xin lỗi",
      image: "🙇",
    },
    {
      khmer: "ខ្ញុំឈ្មោះ...",
      roman: "khnhom chmuah...",
      vietnamese: "Tôi tên là...",
      image: "🙋",
    },
    {
      khmer: "អ្នកឈ្មោះអ្វី?",
      roman: "neak chmuah avei?",
      vietnamese: "Bạn tên gì?",
      image: "❓",
    },
    {
      khmer: "ខ្ញុំសុខសប្បាយ",
      roman: "khnhom sok-sa-bai",
      vietnamese: "Tôi khỏe",
      image: "😊",
    },
    {
      khmer: "អ្នកសុខសប្បាយទេ?",
      roman: "neak sok-sa-bai te?",
      vietnamese: "Bạn khỏe không?",
      image: "🙂",
    },
    {
      khmer: "ខ្ញុំជាគ្រូ",
      roman: "khnhom chea kru",
      vietnamese: "Tôi là giáo viên",
      image: "👨‍🏫",
    },
    {
      khmer: "ខ្ញុំធ្វើការជាគ្រូ",
      roman: "khnhom tvea-kaa chea kru",
      vietnamese: "Tôi làm giáo viên",
      image: "👨‍🏫",
    },
    {
      khmer: "ខ្ញុំរស់នៅ...",
      roman: "khnhom ros-nov...",
      vietnamese: "Tôi sống ở...",
      image: "🏠",
    },
    {
      khmer: "លាហើយ",
      roman: "lia-haey",
      vietnamese: "Tạm biệt",
      image: "👋",
    },
    {
      khmer: "ជួបគ្នាម្តងទៀត",
      roman: "chuob-khnea mdong-tiet",
      vietnamese: "Hẹn gặp lại",
      image: "🤝",
    },
  ],

  /* =======================================================
     3. GIA ĐÌNH
  ======================================================= */

  family: [
    {
      khmer: "ឪពុក",
      roman: "aow-puk",
      vietnamese: "Bố / cha",
      image: "👨",
    },
    {
      khmer: "ម្ដាយ",
      roman: "m'daay",
      vietnamese: "Mẹ",
      image: "👩",
    },
    {
      khmer: "ជីតា",
      roman: "chi-dtaa",
      vietnamese: "Ông",
      image: "👴",
    },
    {
      khmer: "ជីដូន",
      roman: "chi-doon",
      vietnamese: "Bà",
      image: "👵",
    },
    {
      khmer: "បងប្រុស",
      roman: "bong-proh",
      vietnamese: "Anh trai",
      image: "👦",
    },
    {
      khmer: "បងស្រី",
      roman: "bong-srei",
      vietnamese: "Chị gái",
      image: "👧",
    },
    {
      khmer: "ប្អូនប្រុស",
      roman: "p'oun-proh",
      vietnamese: "Em trai",
      image: "👦",
    },
    {
      khmer: "ប្អូនស្រី",
      roman: "p'oun-srei",
      vietnamese: "Em gái",
      image: "👧",
    },
    {
      khmer: "កូនប្រុស",
      roman: "koun-proh",
      vietnamese: "Con trai",
      image: "👦",
    },
    {
      khmer: "កូនស្រី",
      roman: "koun-srei",
      vietnamese: "Con gái",
      image: "👧",
    },
    {
      khmer: "ប្តី",
      roman: "bdei",
      vietnamese: "Chồng",
      image: "👨",
    },
    {
      khmer: "ប្រពន្ធ",
      roman: "prap-on",
      vietnamese: "Vợ",
      image: "👩",
    },
    {
      khmer: "ពូ",
      roman: "puu",
      vietnamese: "Chú / bác trai",
      image: "👨",
    },
    {
      khmer: "មីង",
      roman: "ming",
      vietnamese: "Cô / dì",
      image: "👩",
    },
    {
      khmer: "ក្មួយ",
      roman: "kmouy",
      vietnamese: "Cháu",
      image: "🧒",
    },
    {
      khmer: "គ្រួសារ",
      roman: "krua-saa",
      vietnamese: "Gia đình",
      image: "👨‍👩‍👧‍👦",
    },
    {
      khmer: "សមាជិកគ្រួសារ",
      roman: "sa-ma-jik krua-saa",
      vietnamese: "Thành viên gia đình",
      image: "👨‍👩‍👧",
    },
  ],

  /* =======================================================
     4. NGHỀ NGHIỆP
  ======================================================= */

  jobs: [
    {
      khmer: "គ្រូបង្រៀន",
      roman: "kruu-bong-rien",
      vietnamese: "Giáo viên",
      image: "👨‍🏫",
    },
    {
      khmer: "គ្រូពេទ្យ",
      roman: "kruu-bpeet",
      vietnamese: "Bác sĩ",
      image: "👨‍⚕️",
    },
    {
      khmer: "គិលានុបដ្ឋាយិកា",
      roman: "kila-nu-bat-tha-ye-ka",
      vietnamese: "Y tá",
      image: "👩‍⚕️",
    },
    {
      khmer: "ប៉ូលិស",
      roman: "polish",
      vietnamese: "Công an / cảnh sát",
      image: "👮",
    },
    {
      khmer: "ទាហាន",
      roman: "tea-han",
      vietnamese: "Bộ đội / quân nhân",
      image: "🪖",
    },
    {
      khmer: "វិស្វករ",
      roman: "vi-sva-ka",
      vietnamese: "Kỹ sư",
      image: "👷",
    },
    {
      khmer: "កសិករ",
      roman: "ka-se-ka",
      vietnamese: "Nông dân",
      image: "👨‍🌾",
    },
    {
      khmer: "កម្មករ",
      roman: "kam-ka",
      vietnamese: "Công nhân",
      image: "👷",
    },
    {
      khmer: "សិស្ស",
      roman: "se-sa",
      vietnamese: "Học sinh",
      image: "🧑‍🎓",
    },
    {
      khmer: "និស្សិត",
      roman: "ni-set",
      vietnamese: "Sinh viên",
      image: "🎓",
    },
    {
      khmer: "អ្នកបើកបរ",
      roman: "neak baek-ba",
      vietnamese: "Tài xế",
      image: "🚗",
    },
    {
      khmer: "ចុងភៅ",
      roman: "chong-phov",
      vietnamese: "Đầu bếp",
      image: "👨‍🍳",
    },
    {
      khmer: "ជាងសំណង់",
      roman: "cheang sam-nong",
      vietnamese: "Thợ xây",
      image: "👷",
    },
    {
      khmer: "អ្នកលក់",
      roman: "neak lork",
      vietnamese: "Người bán hàng",
      image: "🛒",
    },
    {
      khmer: "បុគ្គលិកការិយាល័យ",
      roman: "bok-kol-lik ka-ri-ya-lai",
      vietnamese: "Nhân viên văn phòng",
      image: "💼",
    },
  ],

  /* =======================================================
     5. CON VẬT
  ======================================================= */

  animals: [
    {
      khmer: "ក្របី",
      roman: "kro-bey",
      vietnamese: "Con trâu",
      image: "🐃",
    },
    {
      khmer: "គោ",
      roman: "koo",
      vietnamese: "Con bò",
      image: "🐄",
    },
    {
      khmer: "ឆ្កែ",
      roman: "chkae",
      vietnamese: "Con chó",
      image: "🐕",
    },
    {
      khmer: "ឆ្មា",
      roman: "chhma",
      vietnamese: "Con mèo",
      image: "🐈",
    },
    {
      khmer: "មាន់",
      roman: "moan",
      vietnamese: "Con gà",
      image: "🐔",
    },
    {
      khmer: "ទា",
      roman: "tea",
      vietnamese: "Con vịt",
      image: "🦆",
    },
    {
      khmer: "ជ្រូក",
      roman: "chrouk",
      vietnamese: "Con heo",
      image: "🐖",
    },
    {
      khmer: "សេះ",
      roman: "seh",
      vietnamese: "Con ngựa",
      image: "🐎",
    },
    {
      khmer: "ពពែ",
      roman: "po-peh",
      vietnamese: "Con dê",
      image: "🐐",
    },
    {
      khmer: "ដំរី",
      roman: "dom-rei",
      vietnamese: "Con voi",
      image: "🐘",
    },
    {
      khmer: "ស្វា",
      roman: "sva",
      vietnamese: "Con khỉ",
      image: "🐒",
    },
    {
      khmer: "ខ្លា",
      roman: "khla",
      vietnamese: "Con hổ",
      image: "🐅",
    },
    {
      khmer: "ត្រី",
      roman: "trei",
      vietnamese: "Con cá",
      image: "🐟",
    },
    {
      khmer: "បក្សី",
      roman: "bak-sae",
      vietnamese: "Chim",
      image: "🐦",
    },
    {
      khmer: "ពស់",
      roman: "poah",
      vietnamese: "Con rắn",
      image: "🐍",
    },
  ],

  /* =======================================================
     6. ĐỒ VẬT
  ======================================================= */

  objects: [
    {
      khmer: "តុ",
      roman: "to",
      vietnamese: "Cái bàn",
      image: "🪑",
    },
    {
      khmer: "កៅអី",
      roman: "kav-ey",
      vietnamese: "Cái ghế",
      image: "🪑",
    },
    {
      khmer: "សៀវភៅ",
      roman: "siev-phov",
      vietnamese: "Quyển sách",
      image: "📖",
    },
    {
      khmer: "ប៊ិច",
      roman: "bech",
      vietnamese: "Cây bút",
      image: "🖊️",
    },
    {
      khmer: "សៀវភៅសរសេរ",
      roman: "siev-phov sa-sae",
      vietnamese: "Vở",
      image: "📓",
    },
    {
      khmer: "កាបូប",
      roman: "ka-bop",
      vietnamese: "Cặp / túi",
      image: "🎒",
    },
    {
      khmer: "ទូរស័ព្ទ",
      roman: "tu-re-saap",
      vietnamese: "Điện thoại",
      image: "📱",
    },
    {
      khmer: "កុំព្យូទ័រ",
      roman: "kom-pyu-ta",
      vietnamese: "Máy tính",
      image: "💻",
    },
    {
      khmer: "ទ្វារ",
      roman: "tvea",
      vietnamese: "Cửa",
      image: "🚪",
    },
    {
      khmer: "បង្អួច",
      roman: "bong-ouach",
      vietnamese: "Cửa sổ",
      image: "🪟",
    },
    {
      khmer: "ផ្ទះ",
      roman: "pteah",
      vietnamese: "Ngôi nhà",
      image: "🏠",
    },
    {
      khmer: "គ្រែ",
      roman: "kreh",
      vietnamese: "Cái giường",
      image: "🛏️",
    },
    {
      khmer: "កង្ហារ",
      roman: "kong-haa",
      vietnamese: "Quạt",
      image: "🌀",
    },
    {
      khmer: "កែវ",
      roman: "kaev",
      vietnamese: "Cái ly / cốc",
      image: "🥛",
    },
    {
      khmer: "ចាន",
      roman: "chaan",
      vietnamese: "Cái chén / bát",
      image: "🍚",
    },
  ],
};

/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

const formatStudyTime = (totalSeconds) => {
  const safeSeconds = Math.max(
    0,
    Math.floor(Number(totalSeconds) || 0)
  );

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const seconds = safeSeconds % 60;

  return (
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`
  );
};

/* =========================================================
   COMPONENT
========================================================= */

function Vocabulary({
  navigate,
  session,
  profile,
  onLogout,
  onProgressUpdated,
}) {
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedWord, setSelectedWord] =
    useState(null);

  /* =======================================================
     USER ID
  ======================================================= */

  const userId =
    session?.user?.id ||
    profile?.id ||
    null;

  /* =======================================================
     TIMER
  ======================================================= */

  const [totalStudySeconds, setTotalStudySeconds] =
    useState(
      Math.max(
        0,
        Number(
          profile?.total_study_seconds ?? 0
        )
      )
    );

  const [remainderSeconds, setRemainderSeconds] =
    useState(0);

  const totalStudySecondsRef =
    useRef(totalStudySeconds);

  const remainderSecondsRef =
    useRef(remainderSeconds);

  const timerRef =
    useRef(null);

  const savingRef =
    useRef(false);

  /* =======================================================
     ĐỒNG BỘ REF
  ======================================================= */

  useEffect(() => {
    totalStudySecondsRef.current =
      totalStudySeconds;
  }, [totalStudySeconds]);

  useEffect(() => {
    remainderSecondsRef.current =
      remainderSeconds;
  }, [remainderSeconds]);

  /* =======================================================
     LOAD THỜI GIAN
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      setTotalStudySeconds(0);
      setRemainderSeconds(0);

      totalStudySecondsRef.current = 0;
      remainderSecondsRef.current = 0;

      return;
    }

    let cancelled = false;

    const loadStudyTime = async () => {
      try {
        /* -----------------------------------------------
           LẤY TOTAL TỪ SUPABASE
        ------------------------------------------------ */

        const {
          data,
          error,
        } = await supabase
          .from("profiles")
          .select("total_study_seconds")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error(
            "❌ Không lấy được thời gian học:",
            error
          );
        }

        if (!cancelled && data) {
          const savedTotal =
            Math.max(
              0,
              Number(
                data.total_study_seconds ?? 0
              )
            );

          totalStudySecondsRef.current =
            savedTotal;

          setTotalStudySeconds(
            savedTotal
          );
        }

        /* -----------------------------------------------
           LẤY GIÂY LẺ TỪ LOCAL STORAGE
        ------------------------------------------------ */

        const storageKey =
          `${TIMER_STORAGE_PREFIX}${userId}`;

        let savedRemainder = 0;

        try {
          savedRemainder =
            Math.max(
              0,
              Math.min(
                SECONDS_PER_MINUTE - 1,
                Number(
                  localStorage.getItem(
                    storageKey
                  )
                ) || 0
              )
            );
        } catch (error) {
          console.warn(
            "⚠️ Không đọc được timer:",
            error
          );
        }

        if (!cancelled) {
          remainderSecondsRef.current =
            savedRemainder;

          setRemainderSeconds(
            savedRemainder
          );
        }
      } catch (error) {
        console.error(
          "❌ Lỗi load thời gian học:",
          error
        );
      }
    };

    loadStudyTime();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* =======================================================
     LƯU GIÂY LẺ
  ======================================================= */

  const saveRemainder = (seconds) => {
    if (!userId) {
      return;
    }

    const safeSeconds =
      Math.max(
        0,
        Math.min(
          SECONDS_PER_MINUTE - 1,
          Number(seconds) || 0
        )
      );

    try {
      localStorage.setItem(
        `${TIMER_STORAGE_PREFIX}${userId}`,
        String(safeSeconds)
      );
    } catch (error) {
      console.warn(
        "⚠️ Không thể lưu timer tạm:",
        error
      );
    }
  };

  /* =======================================================
     CỘNG 1 PHÚT
  ======================================================= */

  const saveOneMinute = async () => {
    if (!userId) {
      return false;
    }

    if (savingRef.current) {
      return false;
    }

    savingRef.current = true;

    try {
      const {
        data: currentProfile,
        error: fetchError,
      } = await supabase
        .from("profiles")
        .select(
          "exp, total_study_seconds"
        )
        .eq("id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error(
          "❌ Không lấy được profile:",
          fetchError
        );

        return false;
      }

      if (!currentProfile) {
        console.error(
          "❌ Không tìm thấy profile."
        );

        return false;
      }

      const currentExp =
        Math.max(
          0,
          Number(
            currentProfile.exp ?? 0
          )
        );

      const currentStudySeconds =
        Math.max(
          0,
          Number(
            currentProfile.total_study_seconds ??
              0
          )
        );

      const newExp =
        currentExp +
        EXP_PER_MINUTE;

      const newStudySeconds =
        currentStudySeconds +
        SECONDS_PER_MINUTE;

      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          exp: newExp,
          total_study_seconds:
            newStudySeconds,
        })
        .eq("id", userId);

      if (updateError) {
        console.error(
          "❌ Lỗi lưu EXP/thời gian:",
          updateError
        );

        return false;
      }

      /* -----------------------------------------------
         CẬP NHẬT NGAY TRÊN MÀN HÌNH
      ------------------------------------------------ */

      totalStudySecondsRef.current =
        newStudySeconds;

      setTotalStudySeconds(
        newStudySeconds
      );

      remainderSecondsRef.current =
        0;

      setRemainderSeconds(0);

      saveRemainder(0);

      console.log(
        `✅ VOCABULARY +${EXP_PER_MINUTE} EXP`
      );

      console.log(
        `✅ Tổng thời gian: ${newStudySeconds}s`
      );

      /* -----------------------------------------------
         ĐỒNG BỘ STUDENT HOME
      ------------------------------------------------ */

      if (
        typeof onProgressUpdated ===
        "function"
      ) {
        await onProgressUpdated();
      }

      return true;
    } catch (error) {
      console.error(
        "❌ Lỗi cộng EXP:",
        error
      );

      return false;
    } finally {
      savingRef.current = false;
    }
  };

  /* =======================================================
     TIMER CHỈ CHẠY Ở VOCABULARY
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return;
    }

    /*
      Không tạo timer thứ hai.
    */

    if (timerRef.current) {
      return;
    }

    console.log(
      "🟢 VOCABULARY: bắt đầu tính thời gian."
    );

    timerRef.current =
      setInterval(() => {
        /*
          Nếu đang lưu phút trước
          thì chờ vòng tiếp theo.
        */

        if (savingRef.current) {
          return;
        }

        const currentRemainder =
          remainderSecondsRef.current;

        const next =
          currentRemainder + 1;

        /* ---------------------------------------------
           CHƯA ĐỦ 60 GIÂY
        --------------------------------------------- */

        if (
          next <
          SECONDS_PER_MINUTE
        ) {
          remainderSecondsRef.current =
            next;

          setRemainderSeconds(
            next
          );

          saveRemainder(next);

          return;
        }

        /* ---------------------------------------------
           ĐỦ 60 GIÂY
        --------------------------------------------- */

        saveOneMinute();
      }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }

      /*
        Lưu phần giây lẻ khi rời Vocabulary.
      */

      saveRemainder(
        remainderSecondsRef.current
      );

      console.log(
        "⏹️ VOCABULARY: dừng bộ đếm."
      );
    };
  }, [userId]);

  /* =======================================================
     HIỂN THỊ THỜI GIAN
  ======================================================= */

  const displayedTotalSeconds =
    totalStudySeconds +
    remainderSeconds;

  const displayTime =
    formatStudyTime(
      displayedTotalSeconds
    );

  /* =======================================================
     ĐIỀU HƯỚNG
  ======================================================= */

  const goToStudent = () => {
    if (
      typeof navigate ===
      "function"
    ) {
      navigate("/student");
    } else {
      window.location.href =
        "/student";
    }
  };

  /* =======================================================
     CHỌN CHỦ ĐỀ
  ======================================================= */

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedWord(null);
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setSelectedWord(null);
  };

  /* =======================================================
     PHÁT ÂM
  ======================================================= */

  const speakWord = (word) => {
    if (
      !("speechSynthesis" in window)
    ) {
      alert(
        "Trình duyệt không hỗ trợ phát âm."
      );

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        word.khmer
      );

    utterance.lang = "km-KH";
    utterance.rate = 0.75;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="vocabulary-page">

      {/* =================================================
          BỘ ĐẾM DUY NHẤT CỦA VOCABULARY
      ================================================= */}

      <div className="vocabulary-timer">
        <div className="vocabulary-timer-label">
          🟢 ĐANG HỌC
        </div>

        <div className="vocabulary-timer-time">
          {displayTime}
        </div>

        <div className="vocabulary-timer-exp">
          +10 EXP / phút
        </div>
      </div>

      {/* =================================================
          NÚT QUAY LẠI
      ================================================= */}

      <button
        type="button"
        className="vocabulary-back-button"
        onClick={goToStudent}
      >
        ← Về trang học tập
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="vocabulary-header">

        <div className="vocabulary-header-main">

          <div className="vocabulary-header-icon">
            📚
          </div>

          <div className="vocabulary-header-khmer">
            ពាក្យសព្ទខ្មែរ
          </div>

          <h1>
            TỪ VỰNG TIẾNG KHMER
          </h1>

          <p>
            Học từ vựng Khmer theo chủ đề
          </p>

        </div>

        <div className="vocabulary-stats">

          <div className="vocabulary-stat">
            <strong>
              {Object.keys(vocabularyData).length}
            </strong>

            <span>
              Chủ đề
            </span>
          </div>

          <div className="vocabulary-stat">
            <strong>
              {Object.values(vocabularyData)
                .reduce(
                  (total, items) =>
                    total + items.length,
                  0
                )}
            </strong>

            <span>
              Từ vựng
            </span>
          </div>

        </div>

      </header>

      {/* =================================================
          NỘI DUNG
      ================================================= */}

      <main className="vocabulary-container">

        {/* =================================================
            DANH SÁCH CHỦ ĐỀ
        ================================================= */}

        {!selectedCategory && (
          <section>

            <div className="vocabulary-section-title">

              <h2>
                📖 Chọn chủ đề học
              </h2>

              <p>
                Chọn một chủ đề để bắt đầu
                học từ vựng.
              </p>

            </div>

            <div className="vocabulary-category-grid">

              {vocabularyCategories.map(
                (category) => (
                  <button
                    type="button"
                    key={category.id}
                    className="vocabulary-category-card"
                    onClick={() =>
                      openCategory(
                        category
                      )
                    }
                  >

                    <div className="vocabulary-category-icon">
                      {category.icon}
                    </div>

                    <h3>
                      {category.title}
                    </h3>

                    <p>
                      {category.description}
                    </p>

                    <span>
                      {vocabularyData[
                        category.id
                      ]?.length || 0}{" "}
                      mục
                    </span>

                  </button>
                )
              )}

            </div>

          </section>
        )}

        {/* =================================================
            DANH SÁCH TỪ VỰNG
        ================================================= */}

        {selectedCategory && (
          <section className="vocabulary-list-section">

            <button
              type="button"
              className="vocabulary-category-back"
              onClick={
                backToCategories
              }
            >
              ← Chọn chủ đề khác
            </button>

            <div className="vocabulary-topic-header">

              <div className="vocabulary-topic-icon">
                {selectedCategory.icon}
              </div>

              <div>
                <h2>
                  {selectedCategory.title}
                </h2>

                <p>
                  {selectedCategory.description}
                </p>
              </div>

            </div>

            <div className="vocabulary-word-grid">

              {vocabularyData[
                selectedCategory.id
              ].map(
                (word, index) => (
                  <button
                    type="button"
                    key={`${selectedCategory.id}-${index}`}
                    className="vocabulary-word-card"
                    onClick={() =>
                      setSelectedWord(
                        word
                      )
                    }
                  >

                    <div className="vocabulary-word-image">
                      {word.image}
                    </div>

                    <div className="vocabulary-word-number">
                      {index + 1}
                    </div>

                    <div className="vocabulary-word-khmer">
                      {word.khmer}
                    </div>

                    <div className="vocabulary-word-roman">
                      {word.roman}
                    </div>

                    <div className="vocabulary-word-vietnamese">
                      {word.vietnamese}
                    </div>

                  </button>
                )
              )}

            </div>

          </section>
        )}

      </main>

      {/* =================================================
          MODAL TỪ VỰNG
      ================================================= */}

      {selectedWord && (
        <div
          className="vocabulary-modal-backdrop"
          onClick={() =>
            setSelectedWord(null)
          }
        >

          <div
            className="vocabulary-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="vocabulary-modal-close"
              onClick={() =>
                setSelectedWord(null)
              }
            >
              ×
            </button>

            <div className="vocabulary-modal-image">
              {selectedWord.image}
            </div>

            <div className="vocabulary-modal-khmer">
              {selectedWord.khmer}
            </div>

            <div className="vocabulary-modal-roman">
              {selectedWord.roman}
            </div>

            <div className="vocabulary-modal-vietnamese">
              {selectedWord.vietnamese}
            </div>

            <button
              type="button"
              className="vocabulary-speak-button"
              onClick={() =>
                speakWord(
                  selectedWord
                )
              }
            >
              🔊 Nghe phát âm
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="vocabulary-footer">

        <span>
          📚 Học tiếng Khmer
        </span>

        <span>
          •
        </span>

        <span>
          +10 EXP mỗi phút học
        </span>

      </footer>

    </div>
  );
}

export default Vocabulary;