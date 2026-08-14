import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import {
  vocabularyCategories,
  vocabularyData,
} from "../../../data/vocabularydata";
import "./vocabulary.css";

/* =========================================================
CẤU HÌNH TIMER
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

  GIỐNG CƠ CHẾ ALPHABET:

  - Tổng thời gian lấy từ Supabase.
  - Giây đang học chỉ tồn tại khi đang ở Vocabulary.
  - Thoát trang → reset giây lẻ.
  - Không dùng localStorage.
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
  LOAD TỔNG THỜI GIAN TỪ SUPABASE

  Khi mở Vocabulary:

  1. Lấy total_study_seconds
  2. Không lấy giây lẻ cũ
  3. Bắt đầu phần giây từ 0
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

        /*
          Không khôi phục remainder.

          Mỗi lần mở Vocabulary:
          phần giây bắt đầu từ 00.
        */

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

      /*
        Đã hoàn thành 1 phút.

        Reset phần giây về 0.
      */

      remainderSecondsRef.current =
        0;

      setRemainderSeconds(0);

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

  Ví dụ:

  Vào:
  00:20:00

  Sau 30 giây:
  00:20:30

  Thoát:
  00:20:00

  Vào lại:
  00:20:00

  Sau đủ 60 giây:
  00:21:00
  +10 EXP
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

    /*
      Mỗi lần bắt đầu vào Vocabulary,
      phần giây luôn bắt đầu từ 0.
    */

    remainderSecondsRef.current =
      0;

    setRemainderSeconds(0);

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

          return;
        }

        /* ---------------------------------------------
           ĐỦ 60 GIÂY

           +60 giây vào Supabase
           +10 EXP
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
        QUAN TRỌNG:

        Không lưu phần giây lẻ.

        Ví dụ:
        00:25:37

        Thoát Vocabulary
        ↓
        37 giây bị reset.

        Lần sau:
        00:25:00
      */

      remainderSecondsRef.current =
        0;

      setRemainderSeconds(0);

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
    <div>
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
              {Object.keys(
                vocabularyData
              ).length}
            </strong>

            <span>
              Chủ đề
            </span>
          </div>

          <div className="vocabulary-stat">
            <strong>
              {Object.values(
                vocabularyData
              ).reduce(
                (
                  total,
                  items
                ) =>
                  total +
                  items.length,
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
                  {
                    selectedCategory.description
                  }
                </p>
              </div>
            </div>

            <div className="vocabulary-word-grid">
              {vocabularyData[
                selectedCategory.id
              ].map(
                (
                  word,
                  index
                ) => (
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
