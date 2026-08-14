import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import "./Alphabet.css";

/* =========================================================
   33 PHỤ ÂM KHMER
========================================================= */

const consonants = [
  {
    stt: 1,
    letter: "ក",
    roman: "Co",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 2,
    letter: "ខ",
    roman: "Kho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 3,
    letter: "គ",
    roman: "Cô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 4,
    letter: "ឃ",
    roman: "Khô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 5,
    letter: "ង",
    roman: "Ngô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 6,
    letter: "ច",
    roman: "Cho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 7,
    letter: "ឆ",
    roman: "Chho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 8,
    letter: "ជ",
    roman: "Chô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 9,
    letter: "ឈ",
    roman: "Chhô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 10,
    letter: "ញ",
    roman: "Nhô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 11,
    letter: "ដ",
    roman: "Do",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 12,
    letter: "ឋ",
    roman: "Tho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 13,
    letter: "ឌ",
    roman: "Đô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 14,
    letter: "ឍ",
    roman: "Thô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 15,
    letter: "ណ",
    roman: "No",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 16,
    letter: "ត",
    roman: "To",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 17,
    letter: "ថ",
    roman: "Tho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 18,
    letter: "ទ",
    roman: "Tô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 19,
    letter: "ធ",
    roman: "Thô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 20,
    letter: "ន",
    roman: "Nô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 21,
    letter: "ប",
    roman: "Bo",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 22,
    letter: "ផ",
    roman: "Pho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 23,
    letter: "ព",
    roman: "Pô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 24,
    letter: "ភ",
    roman: "Phô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 25,
    letter: "ម",
    roman: "Mô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 26,
    letter: "យ",
    roman: "Dô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 27,
    letter: "រ",
    roman: "Rô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 28,
    letter: "ល",
    roman: "Lô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 29,
    letter: "វ",
    roman: "Vô",
    voice: "Ô",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 30,
    letter: "ស",
    roman: "So",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 31,
    letter: "ហ",
    roman: "Ho",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 32,
    letter: "ឡ",
    roman: "Lo",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 33,
    letter: "អ",
    roman: "O / Â",
    voice: "O",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
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
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 2,
    symbol: "◌ិ",
    romanO: "ế",
    romanOh: "í",
    note: "Âm ngắn",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 3,
    symbol: "◌ី",
    romanO: "ây",
    romanOh: "i",
    note: "Âm dài",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 4,
    symbol: "◌ឹ",
    romanO: "ấ",
    romanOh: "ứ",
    note: "Âm ngắn",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 5,
    symbol: "◌ឺ",
    romanO: "ơ",
    romanOh: "ơ / ư",
    note: "Âm dài",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 6,
    symbol: "◌ុ",
    romanO: "u",
    romanOh: "ú",
    note: "Âm ngắn",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 7,
    symbol: "◌ូ",
    romanO: "ua",
    romanOh: "ua",
    note: "Không đổi giọng",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 8,
    symbol: "◌ួ",
    romanO: "ờ",
    romanOh: "u",
    note: "",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 9,
    symbol: "ើ",
    romanO: "ưa",
    romanOh: "ưa",
    note: "Không đổi giọng",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 10,
    symbol: "ៀ",
    romanO: "ia",
    romanOh: "ia",
    note: "Không đổi giọng",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 11,
    symbol: "េ",
    romanO: "ê",
    romanOh: "ê",
    note: "Âm ê",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 12,
    symbol: "ែ",
    romanO: "e",
    romanOh: "ê",
    note: "Âm e / ê",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 13,
    symbol: "ៃ",
    romanO: "ay",
    romanOh: "ây",
    note: "Âm ay / ây",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 14,
    symbol: "ោ",
    romanO: "ao",
    romanOh: "âu",
    note: "Âm ao / âu",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 15,
    symbol: "ៅ",
    romanO: "au",
    romanOh: "âu",
    note: "Âm au / âu",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 16,
    symbol: "ុំ",
    romanO: "um",
    romanOh: "um",
    note: "Nikkahit",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 17,
    symbol: "ំ",
    romanO: "om",
    romanOh: "um",
    note: "Dấu chấm tròn",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 18,
    symbol: "ាំ",
    romanO: "ăm",
    romanOh: "oăm",
    note: "Âm ăm / oăm",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 19,
    symbol: "អាះ / ះ",
    romanO: "ás",
    romanOh: "iás",
    note: "Reahmuk",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 20,
    symbol: "ិះ",
    romanO: "és",
    romanOh: "ís",
    note: "Ngắt hơi",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 21,
    symbol: "ុះ",
    romanO: "ốs",
    romanOh: "ús",
    note: "Ngắt hơi",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 22,
    symbol: "េះ",
    romanO: "és",
    romanOh: "és",
    note: "Ngắt hơi",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 23,
    symbol: "ោះ",
    romanO: "ós",
    romanOh: "uás",
    note: "Ngắt hơi",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
  {
    stt: 24,
    symbol: "ឹះ",
    romanO: "ứs",
    romanOh: "ứs",
    note: "Ngắt hơi",
    uppercase: null,
    handwriting: null,
    audio: null,
  },
];

/* =========================================================
   CẤU HÌNH
========================================================= */

const EXP_PER_MINUTE = 10;
const SECONDS_PER_MINUTE = 60;

/* =========================================================
   FORMAT THỜI GIAN
========================================================= */

const formatStudyTime = (totalSeconds) => {
  const safeSeconds = Math.max(
    0,
    Math.floor(Number(totalSeconds) || 0)
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

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

function Alphabet({
  navigate,
  session,
  profile,
  onLogout,
  onProgressUpdated,
}) {
  const [tab, setTab] = useState(
    "consonants"
  );

  const [voiceFilter, setVoiceFilter] =
    useState("all");

  const [selected, setSelected] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState(null);

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
     LOAD TỔNG THỜI GIAN
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
        const {
          data,
          error,
        } = await supabase
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

        if (!cancelled) {
          remainderSecondsRef.current =
            0;

          setRemainderSeconds(0);
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
            currentProfile
              .total_study_seconds ?? 0
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

      totalStudySecondsRef.current =
        newStudySeconds;

      setTotalStudySeconds(
        newStudySeconds
      );

      remainderSecondsRef.current =
        0;

      setRemainderSeconds(0);

      console.log(
        `✅ ALPHABET +${EXP_PER_MINUTE} EXP`
      );

      console.log(
        `✅ Tổng thời gian: ${newStudySeconds}s`
      );

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
     ALPHABET TIMER
  ======================================================= */

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (timerRef.current) {
      return;
    }

    console.log(
      "🟢 ALPHABET: bắt đầu tính thời gian."
    );

    remainderSecondsRef.current =
      0;

    setRemainderSeconds(0);

    timerRef.current =
      setInterval(() => {
        if (savingRef.current) {
          return;
        }

        const currentRemainder =
          remainderSecondsRef.current;

        const next =
          currentRemainder + 1;

        if (
          next <
          SECONDS_PER_MINUTE
        ) {
          remainderSecondsRef.current =
            next;

          setRemainderSeconds(
            next
          );

          return;
        }

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

      remainderSecondsRef.current =
        0;

      setRemainderSeconds(0);

      console.log(
        "⏹️ ALPHABET: dừng bộ đếm."
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
     QUAY VỀ TRANG HỌC
  ======================================================= */

  const goToStudent = () => {
    if (
      typeof navigate === "function"
    ) {
      navigate("/student");
    } else {
      window.location.href =
        "/student";
    }
  };

  /* =======================================================
     FILTER
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
    setSelectedType("vowel");
  };

  const closeModal = () => {
    setSelected(null);
    setSelectedType(null);
  };

  /* =======================================================
     ESC ĐÓNG MODAL
  ======================================================= */

  useEffect(() => {
    if (!selected) {
      return;
    }

    const handleKeyDown = (
      event
    ) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selected]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="alphabet-page">

      {/* =================================================
          TIMER
      ================================================= */}

      <div className="alphabet-timer">

        <div className="alphabet-timer-label">
          🟢 ĐANG HỌC
        </div>

        <div className="alphabet-timer-value">
          {displayTime}
        </div>

        <div className="alphabet-timer-exp">
          +10 EXP / phút
        </div>

      </div>


      {/* =================================================
          BACK
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
            Tra cứu phụ âm và nguyên âm tiếng Khmer
          </p>

        </div>

        <div className="alphabet-stats">

          <div className="alphabet-stat">
            <strong>33</strong>

            <span>
              Phụ âm
            </span>
          </div>

          <div className="alphabet-stat">
            <strong>24</strong>

            <span>
              Nguyên âm
            </span>
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
          Phụ âm

          <span>
            33 chữ
          </span>
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
          Nguyên âm

          <span>
            24 âm
          </span>
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
                Nhấn vào chữ để xem đầy đủ thông tin
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
                🟠 Giọng Ô
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
                  aria-label={
                    `Xem chi tiết chữ ${item.letter}`
                  }
                >

                  <div className="consonant-number">
                    {item.stt}
                  </div>

                  <div className="consonant-card-content">

                    <div className="consonant-letter">
                      {item.letter}
                    </div>

                    <div className="consonant-card-roman">
                      {item.roman}
                    </div>

                    <div
                      className={
                        item.voice === "O"
                          ? "voice-badge voice-o"
                          : "voice-badge voice-oh"
                      }
                    >
                      Giọng {item.voice}
                    </div>

                    <div className="consonant-card-action">
                      Nhấn để xem chi tiết →
                    </div>

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
              Đọc như chữ S tiếng Việt nhưng có hơi bật mạnh.
            </p>

            <p>
              <strong>
                P (ព):
              </strong>{" "}
              Âm P phát rõ và mạnh.
            </p>

            <p>
              <strong>
                S (ស):
              </strong>{" "}
              Đọc gần với âm X trong tiếng Việt.
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
                Cách đọc phụ thuộc vào nhóm giọng của phụ âm đi kèm.
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
                      <span>
                        🟢 O
                      </span>

                      <strong>
                        {item.romanO}
                      </strong>
                    </div>

                    <div>
                      <span>
                        🟠 Ô
                      </span>

                      <strong>
                        {item.romanOh}
                      </strong>
                    </div>

                  </div>

                  <div className="vowel-note">
                    {item.note || "—"}
                  </div>

                  <div className="consonant-card-action">
                    Nhấn để xem chi tiết →
                  </div>

                </button>
              )
            )}

          </div>


          <div className="vowel-rule">

            <h3>
              💡 Quy tắc đọc nguyên âm
            </h3>

            <div className="rule-grid">

              <div>
                <strong>
                  🟢 Phụ âm Giọng O
                </strong>

                <p>
                  Đọc nguyên âm theo cách đọc{" "}
                  <b>Giọng O</b>.
                </p>
              </div>

              <div>
                <strong>
                  🟠 Phụ âm Giọng Ô
                </strong>

                <p>
                  Đọc nguyên âm theo cách đọc{" "}
                  <b>Giọng Ô</b>.
                </p>
              </div>

              <div>
                <strong>
                  ⭐ Nguyên âm đặc biệt
                </strong>

                <p>
                  Một số nguyên âm giữ nguyên cách đọc giữa hai nhóm giọng.
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Đóng"
            >
              ×
            </button>


            {/* =================================================
                MODAL PHỤ ÂM
            ================================================= */}

            {selectedType ===
              "consonant" && (
              <>

                <div className="modal-consonant-header">

                  <div className="modal-detail-stt">
                    STT {selected.stt}
                  </div>

                  <div
                    className={
                      selected.voice === "O"
                        ? "modal-voice voice-o"
                        : "modal-voice voice-oh"
                    }
                  >
                    {selected.voice ===
                    "O"
                      ? "🟢 Giọng O"
                      : "🟠 Giọng Ô"}
                  </div>

                </div>


                <div className="alphabet-detail-grid">

                  {/* ===============================
                      CHỮ THƯỜNG
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-normal">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Chữ thường
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value normal-khmer-value">

                      {selected.letter}

                    </div>

                  </div>


                  {/* ===============================
                      CHỮ HOA
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-uppercase">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Chữ hoa
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value uppercase-khmer-value">

                      {selected.uppercase ||
                        selected.letter}

                    </div>

                  </div>


                  {/* ===============================
                      VIẾT TAY
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-handwriting">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Viết tay
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value handwriting-khmer-value">

                      {selected.handwriting ||
                        selected.letter}

                    </div>

                  </div>


                  {/* ===============================
                      PHIÊN ÂM
                      SỬA QUAN TRỌNG:
                      GÁN CLASS TRỰC TIẾP THEO GIỌNG
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-pronunciation">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        🗣️
                      </span>

                      <span>
                        Phiên âm
                      </span>

                    </div>

                    <div
                      className={
                        selected.voice === "O"
                          ? "alphabet-detail-card-value pronunciation-value pronunciation-voice-o"
                          : "alphabet-detail-card-value pronunciation-value pronunciation-voice-oh"
                      }
                    >
                      {selected.roman}
                    </div>

                  </div>

                </div>


                {/* ===============================
                    AUDIO
                =============================== */}

                <div className="modal-audio-divider">
                  - - - - - - 🗣️ Giọng đọc - - - - - -
                </div>

                <div className="modal-audio-area">

                  {selected.audio ? (
                    <audio
                      controls
                      preload="none"
                      src={
                        selected.audio
                      }
                    />
                  ) : (
                    <div className="audio-coming">

                      <span className="audio-icon">
                        🔊
                      </span>

                      <strong>
                        Chưa có MP3
                      </strong>

                    </div>
                  )}

                </div>

              </>
            )}


            {/* =================================================
                MODAL NGUYÊN ÂM
            ================================================= */}

            {selectedType ===
              "vowel" && (
              <>

                <div className="modal-vowel-header">

                  <div className="modal-detail-stt">
                    STT {selected.stt}
                  </div>

                </div>


                <div className="alphabet-detail-grid vowel-detail-grid">

                  {/* ===============================
                      CHỮ THƯỜNG
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-normal">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Chữ thường
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value normal-khmer-value">

                      {selected.symbol}

                    </div>

                  </div>


                  {/* ===============================
                      CHỮ HOA
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-uppercase">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Chữ hoa
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value uppercase-khmer-value">

                      {selected.uppercase ||
                        selected.symbol}

                    </div>

                  </div>


                  {/* ===============================
                      VIẾT TAY
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-handwriting">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        Viết tay
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value handwriting-khmer-value">

                      {selected.handwriting ||
                        selected.symbol}

                    </div>

                  </div>


                  {/* ===============================
                      PHIÊN ÂM NGUYÊN ÂM
                  =============================== */}

                  <div className="alphabet-detail-card detail-card-pronunciation vowel-pronunciation-detail">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        🗣️
                      </span>

                      <span>
                        Phiên âm
                      </span>

                    </div>

                    <div className="vowel-modal-pronunciation">

                      <div className="vowel-modal-pronunciation-row">

                        <span className="vowel-modal-voice voice-o">
                          🟢 Giọng O
                        </span>

                        <strong>
                          {selected.romanO}
                        </strong>

                      </div>

                      <div className="vowel-modal-pronunciation-row">

                        <span className="vowel-modal-voice voice-oh">
                          🟠 Giọng Ô
                        </span>

                        <strong>
                          {selected.romanOh}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ===============================
                    GHI CHÚ
                =============================== */}

                <div className="modal-note">

                  <span className="modal-note-icon">
                    📝
                  </span>

                  <span>

                    <strong>
                      Ghi chú:
                    </strong>{" "}

                    {selected.note ||
                      "Không có ghi chú"}

                  </span>

                </div>


                {/* ===============================
                    AUDIO
                =============================== */}

                <div className="modal-audio-divider">
                  - - - - - - 🗣️ Giọng đọc - - - - - -
                </div>

                <div className="modal-audio-area">

                  {selected.audio ? (
                    <audio
                      controls
                      preload="none"
                      src={
                        selected.audio
                      }
                    />
                  ) : (
                    <div className="audio-coming">

                      <span className="audio-icon">
                        🔊
                      </span>

                      <strong>
                        Chưa có MP3
                      </strong>

                    </div>
                  )}

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