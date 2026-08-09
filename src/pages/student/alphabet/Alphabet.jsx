import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import "./Alphabet.css";

/* =========================================================
   33 PHỤ ÂM KHMER
========================================================= */

const consonants = [
  { stt: 1, letter: "ក", roman: "Co", voice: "O" },
  { stt: 2, letter: "ខ", roman: "Kho", voice: "O" },
  { stt: 3, letter: "គ", roman: "Cô", voice: "Ô" },
  { stt: 4, letter: "ឃ", roman: "Khô", voice: "Ô" },
  { stt: 5, letter: "ង", roman: "Ngô", voice: "Ô" },

  { stt: 6, letter: "ច", roman: "Cho", voice: "O" },
  { stt: 7, letter: "ឆ", roman: "Chho", voice: "O" },
  { stt: 8, letter: "ជ", roman: "Chô", voice: "Ô" },
  { stt: 9, letter: "ឈ", roman: "Chhô", voice: "Ô" },
  { stt: 10, letter: "ញ", roman: "Nhô", voice: "Ô" },

  { stt: 11, letter: "ដ", roman: "Do", voice: "O" },
  { stt: 12, letter: "ឋ", roman: "Tho", voice: "O" },
  { stt: 13, letter: "ឌ", roman: "Đô", voice: "Ô" },
  { stt: 14, letter: "ឍ", roman: "Thô", voice: "Ô" },
  { stt: 15, letter: "ណ", roman: "No", voice: "O" },

  { stt: 16, letter: "ត", roman: "To", voice: "O" },
  { stt: 17, letter: "ថ", roman: "Tho", voice: "O" },
  { stt: 18, letter: "ទ", roman: "Tô", voice: "Ô" },
  { stt: 19, letter: "ធ", roman: "Thô", voice: "Ô" },
  { stt: 20, letter: "ន", roman: "Nô", voice: "Ô" },

  { stt: 21, letter: "ប", roman: "Bo", voice: "O" },
  { stt: 22, letter: "ផ", roman: "Pho", voice: "O" },
  { stt: 23, letter: "ព", roman: "Pô", voice: "Ô" },
  { stt: 24, letter: "ភ", roman: "Phô", voice: "Ô" },
  { stt: 25, letter: "ម", roman: "Mô", voice: "Ô" },

  { stt: 26, letter: "យ", roman: "Dô", voice: "Ô" },
  { stt: 27, letter: "រ", roman: "Rô", voice: "Ô" },
  { stt: 28, letter: "ល", roman: "Lô", voice: "Ô" },
  { stt: 29, letter: "វ", roman: "Vô", voice: "Ô" },
  { stt: 30, letter: "ស", roman: "So", voice: "O" },
  { stt: 31, letter: "ហ", roman: "Ho", voice: "O" },
  { stt: 32, letter: "ឡ", roman: "Lo", voice: "O" },
  { stt: 33, letter: "អ", roman: "O / Â", voice: "O" },
];

/* =========================================================
   24 NGUYÊN ÂM KHMER
========================================================= */

const vowels = [
  {
    stt: 1,
    symbol: "◌ា",
    romanO: "a",
    romanOh: "ia",
    note: "Âm dài",
  },
  {
    stt: 2,
    symbol: "◌ិ",
    romanO: "ế",
    romanOh: "í",
    note: "Âm ngắn",
  },
  {
    stt: 3,
    symbol: "◌ី",
    romanO: "ây",
    romanOh: "i",
    note: "Âm dài",
  },
  {
    stt: 4,
    symbol: "◌ឹ",
    romanO: "ấ",
    romanOh: "ứ",
    note: "Âm ngắn",
  },
  {
    stt: 5,
    symbol: "◌ឺ",
    romanO: "ơ",
    romanOh: "ơ / ư",
    note: "Âm dài",
  },
  {
    stt: 6,
    symbol: "◌ុ",
    romanO: "u",
    romanOh: "ú",
    note: "Âm ngắn",
  },
  {
    stt: 7,
    symbol: "◌ូ",
    romanO: "ua",
    romanOh: "ua",
    note: "Không đổi giọng",
  },
  {
    stt: 8,
    symbol: "◌ួ",
    romanO: "ờ",
    romanOh: "u",
    note: "",
  },
  {
    stt: 9,
    symbol: "ើ",
    romanO: "ưa",
    romanOh: "ưa",
    note: "Không đổi giọng",
  },
  {
    stt: 10,
    symbol: "ៀ",
    romanO: "ia",
    romanOh: "ia",
    note: "Không đổi giọng",
  },
  {
    stt: 11,
    symbol: "េ",
    romanO: "ê",
    romanOh: "ê",
    note: "Âm ê",
  },
  {
    stt: 12,
    symbol: "ែ",
    romanO: "e",
    romanOh: "ê",
    note: "Âm e / ê",
  },
  {
    stt: 13,
    symbol: "ៃ",
    romanO: "ay",
    romanOh: "ây",
    note: "Âm ay / ây",
  },
  {
    stt: 14,
    symbol: "ោ",
    romanO: "ao",
    romanOh: "âu",
    note: "Âm ao / âu",
  },
  {
    stt: 15,
    symbol: "ៅ",
    romanO: "au",
    romanOh: "âu",
    note: "Âm au / âu",
  },
  {
    stt: 16,
    symbol: "ុំ",
    romanO: "um",
    romanOh: "um",
    note: "Nikkahit",
  },
  {
    stt: 17,
    symbol: "ំ",
    romanO: "om",
    romanOh: "um",
    note: "Dấu chấm tròn",
  },
  {
    stt: 18,
    symbol: "ាំ",
    romanO: "ăm",
    romanOh: "oăm",
    note: "Âm ăm / oăm",
  },
  {
    stt: 19,
    symbol: "អាះ / ះ",
    romanO: "ás",
    romanOh: "iás",
    note: "Reahmuk",
  },
  {
    stt: 20,
    symbol: "ិះ",
    romanO: "és",
    romanOh: "ís",
    note: "Ngắt hơi",
  },
  {
    stt: 21,
    symbol: "ុះ",
    romanO: "ốs",
    romanOh: "ús",
    note: "Ngắt hơi",
  },
  {
    stt: 22,
    symbol: "េះ",
    romanO: "és",
    romanOh: "és",
    note: "Ngắt hơi",
  },
  {
    stt: 23,
    symbol: "ោះ",
    romanO: "ós",
    romanOh: "uás",
    note: "Ngắt hơi",
  },
  {
    stt: 24,
    symbol: "ឹះ",
    romanO: "ứs",
    romanOh: "ứs",
    note: "Ngắt hơi",
  },
];

/* =========================================================
   CẤU HÌNH
========================================================= */

const EXP_PER_MINUTE = 10;
const SECONDS_PER_MINUTE = 60;

const TIMER_STORAGE_PREFIX = "alphabet_study_";

/* =========================================================
   FORMAT THỜI GIAN

   65 giây       → 00:01:05
   3661 giây     → 01:01:01
   360000 giây   → 100:00:00

   Không bao giờ reset về 00:00 khi sang phút mới.
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

  const seconds =
    safeSeconds % 60;

  return (
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`
  );
};

/* =========================================================
   COMPONENT
========================================================= */

function Alphabet({
  navigate,
  session,
  profile,
  onLogout,
  onProgressUpdated,
}) {
  const [tab, setTab] =
    useState("consonants");

  const [voiceFilter, setVoiceFilter] =
    useState("all");

  const [selected, setSelected] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState(null);

  /* =======================================================
     USER ID
  ======================================================= */

  const userId =
    session?.user?.id ||
    profile?.id ||
    null;

  /* =======================================================
     TỔNG THỜI GIAN ĐÃ HỌC

     Đây là tổng thời gian lấy từ Supabase.
     Không phải bộ đếm chỉ của một phút.
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

  /*
    Phần giây chưa đủ 1 phút.
    Ví dụ:
    Supabase = 1200 giây
    localStorage = 35 giây

    Hiển thị:
    00:20:35
  */

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
     LOAD DỮ LIỆU THỜI GIAN

     Khi mở Alphabet:
       1. Lấy total_study_seconds từ Supabase.
       2. Lấy phần giây lẻ từ localStorage.
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
           LẤY TỔNG THỜI GIAN TỪ SUPABASE
        ------------------------------------------------ */

        const { data, error } =
          await supabase
            .from("profiles")
            .select(
              "total_study_seconds"
            )
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
           LẤY PHẦN GIÂY LẺ
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
     LƯU PHẦN GIÂY LẺ

     Không lưu vào total_study_seconds.

     Chỉ lưu:
       1 → 59 giây
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

     +60 total_study_seconds
     +10 EXP
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
      const { data: currentProfile, error: fetchError } =
        await supabase
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

      const { error: updateError } =
        await supabase
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
        `✅ ALPHABET +${EXP_PER_MINUTE} EXP`
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
     BỘ ĐẾM ALPHABET

     CHỈ chạy khi đang ở Alphabet.

     Quan trọng:
     Không dùng studySeconds làm tổng thời gian nữa.

     Tổng thời gian =
       totalStudySeconds
       +
       remainderSeconds
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return;
    }

    /*
      Nếu đã có timer thì không tạo timer thứ hai.
    */

    if (timerRef.current) {
      return;
    }

    console.log(
      "🟢 ALPHABET: bắt đầu tính thời gian."
    );

    timerRef.current =
      setInterval(() => {
        const currentRemainder =
          remainderSecondsRef.current;

        /*
          Nếu request cộng phút trước
          vẫn đang xử lý thì chờ.
        */

        if (savingRef.current) {
          return;
        }

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

           KHÔNG reset tổng thời gian.

           Chỉ reset phần giây lẻ.
           Sau khi Supabase lưu thành công,
           totalStudySeconds tăng thêm 60.
        --------------------------------------------- */

        saveOneMinute();
      }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current =
          null;
      }

      /*
        Lưu phần giây lẻ khi rời trang.
      */

      saveRemainder(
        remainderSecondsRef.current
      );

      console.log(
        "⏹️ ALPHABET: dừng bộ đếm."
      );
    };
  }, [userId]);

  /* =======================================================
     TỔNG THỜI GIAN HIỂN THỊ
  ======================================================= */

  const displayedTotalSeconds =
    totalStudySeconds +
    remainderSeconds;

  const displayTime =
    formatStudyTime(
      displayedTotalSeconds
    );

  /* =======================================================
     QUAY VỀ TRANG HỌC
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
     LỌC PHỤ ÂM
  ======================================================= */

  const filteredConsonants =
    voiceFilter === "all"
      ? consonants
      : consonants.filter(
          (item) =>
            item.voice ===
            voiceFilter
        );

  /* =======================================================
     MODAL
  ======================================================= */

  const openConsonant = (item) => {
    setSelected(item);
    setSelectedType(
      "consonant"
    );
  };

  const openVowel = (item) => {
    setSelected(item);
    setSelectedType(
      "vowel"
    );
  };

  const closeModal = () => {
    setSelected(null);
    setSelectedType(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div>
      {/* =================================================
          BỘ ĐẾM DUY NHẤT CỦA ALPHABET
      ================================================= */}

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          background: "#ffffff",
          borderRadius: "14px",
          padding: "12px 18px",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.15)",
          textAlign: "center",
          minWidth: "155px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#666",
            marginBottom: "5px",
          }}
        >
          🟢 ĐANG HỌC
        </div>

        <div
          style={{
            fontSize: "27px",
            fontWeight: "700",
            lineHeight: "1.1",
            fontVariantNumeric:
              "tabular-nums",
          }}
        >
          {displayTime}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#888",
            marginTop: "5px",
          }}
        >
          +10 EXP / phút
        </div>
      </div>

      {/* =================================================
          NÚT QUAY LẠI
      ================================================= */}

      <button
        type="button"
        className="alphabet-back-button"
        onClick={goToStudent}
      >
        ← Về trang học tập
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="alphabet-header">
        <div className="alphabet-header-main">
          <div className="alphabet-khmer">
            អក្សរខ្មែរ
          </div>

          <h1>
            BẢNG CHỮ CÁI KHMER
          </h1>

          <p>
            Tra cứu phụ âm và
            nguyên âm tiếng Khmer
          </p>
        </div>

        <div className="alphabet-stats">
          <div className="alphabet-stat">
            <strong>33</strong>
            <span>Phụ âm</span>
          </div>

          <div className="alphabet-stat">
            <strong>24</strong>
            <span>Nguyên âm</span>
          </div>
        </div>
      </header>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="alphabet-tabs">
        <button
          type="button"
          className={
            tab === "consonants"
              ? "alphabet-tab active"
              : "alphabet-tab"
          }
          onClick={() => {
            setTab("consonants");
            setSelected(null);
            setSelectedType(null);
          }}
        >
          🔤 Phụ âm
          <span>33 chữ</span>
        </button>

        <button
          type="button"
          className={
            tab === "vowels"
              ? "alphabet-tab active"
              : "alphabet-tab"
          }
          onClick={() => {
            setTab("vowels");
            setSelected(null);
            setSelectedType(null);
          }}
        >
          🔡 Nguyên âm
          <span>24 âm</span>
        </button>
      </div>

      {/* =================================================
          PHỤ ÂM
      ================================================= */}

      {tab === "consonants" && (
        <section>
          <div className="alphabet-toolbar">
            <div>
              <h2>
                33 PHỤ ÂM KHMER
              </h2>

              <p>
                Hai nhóm giọng
                chính: Giọng O
                và Giọng Ô
              </p>
            </div>

            <div className="voice-buttons">
              <button
                type="button"
                className={
                  voiceFilter === "all"
                    ? "voice-btn active"
                    : "voice-btn"
                }
                onClick={() =>
                  setVoiceFilter("all")
                }
              >
                Tất cả
              </button>

              <button
                type="button"
                className={
                  voiceFilter === "O"
                    ? "voice-btn voice-o active"
                    : "voice-btn voice-o"
                }
                onClick={() =>
                  setVoiceFilter("O")
                }
              >
                🟢 Giọng O
              </button>

              <button
                type="button"
                className={
                  voiceFilter === "Ô"
                    ? "voice-btn voice-oh active"
                    : "voice-btn voice-oh"
                }
                onClick={() =>
                  setVoiceFilter("Ô")
                }
              >
                🔵 Giọng Ô
              </button>
            </div>
          </div>

          <div className="alphabet-grid">
            {filteredConsonants.map(
              (item) => (
                <button
                  type="button"
                  key={item.stt}
                  className="consonant-card"
                  onClick={() =>
                    openConsonant(item)
                  }
                >
                  <div className="consonant-number">
                    {item.stt}
                  </div>

                  <div className="consonant-letter">
                    {item.letter}
                  </div>

                  <div className="consonant-roman">
                    {item.roman}
                  </div>

                  <div
                    className={
                      item.voice === "O"
                        ? "voice-badge voice-o"
                        : "voice-badge voice-oh"
                    }
                  >
                    Giọng{" "}
                    {item.voice}
                  </div>
                </button>
              )
            )}
          </div>

          <div className="alphabet-notes">
            <h3>
              📌 Ghi chú phát âm
            </h3>

            <p>
              <strong>
                Chh (ឆ, ឈ):
              </strong>{" "}
              Đọc như chữ S
              tiếng Việt nhưng
              có hơi bật mạnh.
            </p>

            <p>
              <strong>
                P (ព):
              </strong>{" "}
              Âm P phát rõ và
              mạnh.
            </p>

            <p>
              <strong>
                S (ស):
              </strong>{" "}
              Đọc gần với âm X
              trong tiếng Việt.
            </p>
          </div>
        </section>
      )}

      {/* =================================================
          NGUYÊN ÂM
      ================================================= */}

      {tab === "vowels" && (
        <section>
          <div className="alphabet-toolbar">
            <div>
              <h2>
                24 NGUYÊN ÂM KHMER
              </h2>

              <p>
                Cách đọc phụ thuộc
                vào nhóm giọng của
                phụ âm đi kèm.
              </p>
            </div>
          </div>

          <div className="alphabet-grid vowel-grid">
            {vowels.map(
              (item) => (
                <button
                  type="button"
                  key={item.stt}
                  className="consonant-card vowel-card"
                  onClick={() =>
                    openVowel(item)
                  }
                >
                  <div className="consonant-number">
                    {item.stt}
                  </div>

                  <div className="consonant-letter vowel-symbol">
                    {item.symbol}
                  </div>

                  <div className="vowel-pronunciation">
                    <div>
                      <span>O</span>

                      <strong>
                        {item.romanO}
                      </strong>
                    </div>

                    <div>
                      <span>Ô</span>

                      <strong>
                        {item.romanOh}
                      </strong>
                    </div>
                  </div>

                  <div className="vowel-note">
                    {item.note || "—"}
                  </div>
                </button>
              )
            )}
          </div>

          <div className="vowel-rule">
            <h3>
              💡 Quy tắc đọc
              nguyên âm
            </h3>

            <div className="rule-grid">
              <div>
                <strong>
                  🟢 Phụ âm Giọng O
                </strong>

                <p>
                  Đọc nguyên âm
                  theo cách đọc{" "}
                  <b>Giọng O</b>.
                </p>
              </div>

              <div>
                <strong>
                  🔵 Phụ âm Giọng Ô
                </strong>

                <p>
                  Đọc nguyên âm
                  theo cách đọc{" "}
                  <b>Giọng Ô</b>.
                </p>
              </div>

              <div>
                <strong>
                  ⭐ 3 nguyên âm
                  đặc biệt
                </strong>

                <p>
                  ◌ូ, ើ và ៀ giữ
                  nguyên cách đọc
                  giữa hai nhóm
                  giọng.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          MODAL
      ================================================= */}

      {selected && (
        <div
          className="alphabet-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="alphabet-modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
            >
              ×
            </button>

            {selectedType ===
              "consonant" && (
              <>
                <div className="modal-letter">
                  {selected.letter}
                </div>

                <h2>
                  {selected.roman}
                </h2>

                <div
                  className={
                    selected.voice === "O"
                      ? "modal-voice voice-o"
                      : "modal-voice voice-oh"
                  }
                >
                  Giọng{" "}
                  {selected.voice}
                </div>

                <div className="modal-info">
                  <div>
                    <span>STT</span>

                    <strong>
                      {selected.stt}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Phụ âm
                    </span>

                    <strong>
                      {selected.letter}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Phiên âm
                    </span>

                    <strong>
                      {selected.roman}
                    </strong>
                  </div>
                </div>
              </>
            )}

            {selectedType ===
              "vowel" && (
              <>
                <div className="modal-letter vowel-modal-symbol">
                  {selected.symbol}
                </div>

                <h2>
                  Nguyên âm{" "}
                  {selected.stt}
                </h2>

                <div className="modal-vowel-pronunciation">
                  <div className="modal-vowel-item">
                    <span>
                      🟢 Giọng O
                    </span>

                    <strong>
                      {selected.romanO}
                    </strong>
                  </div>

                  <div className="modal-vowel-item">
                    <span>
                      🔵 Giọng Ô
                    </span>

                    <strong>
                      {selected.romanOh}
                    </strong>
                  </div>
                </div>

                <div className="modal-info">
                  <div>
                    <span>STT</span>

                    <strong>
                      {selected.stt}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Ký hiệu
                    </span>

                    <strong>
                      {selected.symbol}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Ghi chú
                    </span>

                    <strong>
                      {selected.note ||
                        "—"}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Alphabet;
