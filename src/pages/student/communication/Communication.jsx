import { useEffect, useRef, useState } from "react";
import communicationData from "../../../data/communicationdata";
import { supabase } from "../../../supabase";
import "./Communication.css";

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

function Communication({
  profile,
  navigate,
  onLogout,
  onProgressUpdated,
}) {
  /* =======================================================
    USER
  ======================================================= */

  const userId = profile?.id || null;

  /* =======================================================
    CATEGORY
  ======================================================= */

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(null);

  const selectedCategory =
    communicationData.find(
      (category) =>
        category.id === selectedCategoryId
    ) || null;

  /* =======================================================
    LESSON
  ======================================================= */

  const [selectedLessonId, setSelectedLessonId] =
    useState(null);

  const selectedLesson =
    selectedCategory?.lessons?.find(
      (lesson) =>
        lesson.id === selectedLessonId
    ) ||
    selectedCategory?.lessons?.[0] ||
    null;

  /* =======================================================
    TIMER
  ======================================================= */

  const [totalStudySeconds, setTotalStudySeconds] =
    useState(
      Math.max(
        0,
        Number(profile?.total_study_seconds ?? 0)
      )
    );

  const [remainderSeconds, setRemainderSeconds] =
    useState(0);

  const timerRef = useRef(null);

  const totalStudySecondsRef =
    useRef(totalStudySeconds);

  const remainderSecondsRef =
    useRef(remainderSeconds);

  const savingRef = useRef(false);

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
    LOAD THỜI GIAN HỌC
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
          .select("total_study_seconds")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error(
            "❌ COMMUNICATION: Không lấy được thời gian học:",
            error
          );
        }

        if (!cancelled && data) {
          const savedTotal = Math.max(
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
          remainderSecondsRef.current = 0;
          setRemainderSeconds(0);
        }
      } catch (error) {
        console.error(
          "❌ COMMUNICATION: Lỗi load thời gian học:",
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
    LƯU 1 PHÚT HỌC
  ======================================================= */

  const saveOneMinute = async () => {
    if (!userId) return false;

    if (savingRef.current) return false;

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
          "❌ COMMUNICATION: Không lấy được profile:",
          fetchError
        );

        return false;
      }

      if (!currentProfile) {
        console.error(
          "❌ COMMUNICATION: Không tìm thấy profile."
        );

        return false;
      }

      const currentExp = Math.max(
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
        currentExp + EXP_PER_MINUTE;

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
          "❌ COMMUNICATION: Lỗi lưu EXP/thời gian:",
          updateError
        );

        return false;
      }

      totalStudySecondsRef.current =
        newStudySeconds;

      setTotalStudySeconds(
        newStudySeconds
      );

      remainderSecondsRef.current = 0;
      setRemainderSeconds(0);

      console.log(
        `✅ COMMUNICATION: +${EXP_PER_MINUTE} EXP`
      );

      console.log(
        `✅ COMMUNICATION: tổng thời gian ${newStudySeconds}s`
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
        "❌ COMMUNICATION: Lỗi cộng EXP:",
        error
      );

      return false;
    } finally {
      savingRef.current = false;
    }
  };

  /* =======================================================
    TIMER HỌC TẬP
  ======================================================= */

  useEffect(() => {
    if (!userId) return;

    if (timerRef.current) return;

    console.log(
      "🟢 COMMUNICATION: bắt đầu tính thời gian."
    );

    timerRef.current = setInterval(() => {
      if (savingRef.current) return;

      const current =
        remainderSecondsRef.current;

      const next = current + 1;

      if (next < SECONDS_PER_MINUTE) {
        remainderSecondsRef.current =
          next;

        setRemainderSeconds(next);

        return;
      }

      saveOneMinute();
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      remainderSecondsRef.current = 0;
      setRemainderSeconds(0);

      console.log(
        "⏹️ COMMUNICATION: dừng bộ đếm."
      );
    };
  }, [userId]);

  /* =======================================================
    THỜI GIAN HIỂN THỊ
  ======================================================= */

  const displayedTotalSeconds =
    totalStudySeconds +
    remainderSeconds;

  const displayTime =
    formatStudyTime(
      displayedTotalSeconds
    );

  /* =======================================================
    AUDIO HỘI THOẠI
  ======================================================= */

  const dialogueAudioRef =
    useRef(null);

  const dialogueStopRef =
    useRef(false);

  const [isPlayingDialogue, setIsPlayingDialogue] =
    useState(false);

  /* =======================================================
    DỌN AUDIO KHI UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      dialogueStopRef.current = true;

      if (dialogueAudioRef.current) {
        dialogueAudioRef.current.pause();
        dialogueAudioRef.current.currentTime = 0;
        dialogueAudioRef.current = null;
      }
    };
  }, []);

  /* =======================================================
    DỪNG AUDIO KHI ĐỔI CHỦ ĐỀ / BÀI
  ======================================================= */

  useEffect(() => {
    stopDialogue();
  }, [
    selectedCategoryId,
    selectedLessonId,
  ]);

  /* =======================================================
    DỪNG HỘI THOẠI
  ======================================================= */

  const stopDialogue = () => {
    dialogueStopRef.current = true;

    if (dialogueAudioRef.current) {
      dialogueAudioRef.current.pause();

      dialogueAudioRef.current.currentTime = 0;

      dialogueAudioRef.current = null;
    }

    setIsPlayingDialogue(false);
  };

  /* =======================================================
    CHỌN CHỦ ĐỀ
  ======================================================= */

  const handleCategoryChange = (
    category
  ) => {
    stopDialogue();

    setSelectedCategoryId(
      category.id
    );

    setSelectedLessonId(
      category.lessons?.[0]?.id ??
        null
    );
  };

  /* =======================================================
    QUAY VỀ DANH SÁCH CHỦ ĐỀ
  ======================================================= */

  const handleBackToCategories = () => {
    stopDialogue();

    setSelectedLessonId(null);

    setSelectedCategoryId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
    AUDIO TỪNG CÂU
  ======================================================= */

  const playAudio = (audio) => {
    if (!audio) return;

    stopDialogue();

    const sound = new Audio(audio);

    sound.play().catch((error) => {
      console.warn(
        "Không thể phát audio:",
        error
      );
    });
  };

  /* =======================================================
    PHÁT 1 CÂU HỘI THOẠI
  ======================================================= */

  const playDialogueLine = (
    line
  ) => {
    return new Promise((resolve) => {
      if (!line?.audio) {
        resolve();
        return;
      }

      if (dialogueStopRef.current) {
        resolve();
        return;
      }

      const audio = new Audio(
        line.audio
      );

      dialogueAudioRef.current =
        audio;

      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
        audio.onabort = null;

        if (
          dialogueAudioRef.current ===
          audio
        ) {
          dialogueAudioRef.current =
            null;
        }

        resolve();
      };

      audio.onended = cleanup;
      audio.onerror = cleanup;
      audio.onabort = cleanup;

      audio.play().catch((error) => {
        console.warn(
          "Không thể phát audio hội thoại:",
          error
        );

        cleanup();
      });
    });
  };

  /* =======================================================
    PHÁT TOÀN BỘ HỘI THOẠI
  ======================================================= */

  const playDialogue = async () => {
    const dialogue =
      selectedLesson?.dialogue;

    if (!dialogue?.length) return;

    if (isPlayingDialogue) {
      stopDialogue();
      return;
    }

    dialogueStopRef.current = false;

    setIsPlayingDialogue(true);

    for (const line of dialogue) {
      if (dialogueStopRef.current) {
        break;
      }

      await playDialogueLine(line);

      if (dialogueStopRef.current) {
        break;
      }
    }

    if (!dialogueStopRef.current) {
      setIsPlayingDialogue(false);
      dialogueAudioRef.current = null;
    }
  };

  /* =======================================================
    ICON CATEGORY
  ======================================================= */

  const getCategoryIcon = (
    category
  ) => {
    if (category.id === 1) {
      return "💬";
    }

    if (category.id === 2) {
      return "👥";
    }

    return "📚";
  };

  /* =======================================================
    ICON LESSON
  ======================================================= */

  const getLessonIcon = (
    lesson
  ) => {
    if (lesson.id === 1) return "👋";
    if (lesson.id === 2) return "👤";
    if (lesson.id === 3) return "💬";
    if (lesson.id === 4) return "📍";
    if (lesson.id === 5) return "🗣";

    return "📖";
  };

  /* =======================================================
    XÁC ĐỊNH VỊ TRÍ NGƯỜI NÓI TỰ ĐỘNG

    KHÔNG PHỤ THUỘC TÊN:
    Dara / Chantria / Kru / Teacher / ...

    Người nói xuất hiện đầu tiên  → trái
    Người nói xuất hiện thứ hai   → phải
    Người nói thứ ba              → trái
    Người nói thứ tư              → phải

    Nếu một người nói nhiều câu liên tiếp,
    người đó vẫn giữ nguyên phía của mình.
  ======================================================= */

  const getDialogueSpeakerSides = (
    dialogue
  ) => {
    const speakerOrder = [];

    dialogue.forEach((line) => {
      const speaker = String(
        line?.speaker || ""
      ).trim();

      if (
        speaker &&
        !speakerOrder.includes(speaker)
      ) {
        speakerOrder.push(speaker);
      }
    });

    return dialogue.map((line) => {
      const speaker = String(
        line?.speaker || ""
      ).trim();

      const speakerIndex =
        speakerOrder.indexOf(
          speaker
        );

      /*
       * Nếu không có tên người nói,
       * mặc định bên trái.
       */
      if (speakerIndex < 0) {
        return "speaker-left";
      }

      /*
       * Người nói thứ 1, 3, 5... → trái
       * Người nói thứ 2, 4, 6... → phải
       */
      return speakerIndex % 2 === 0
        ? "speaker-left"
        : "speaker-right";
    });
  };

  /* =======================================================
    RENDER SENTENCE
  ======================================================= */

  const renderSentence = (
    sentence,
    index
  ) => {
    return (
      <article
        key={sentence.id}
        className="communication-sentence-card"
      >
        <div className="communication-sentence-number">
          {index + 1}
        </div>

        <div className="communication-sentence-content">

          {/* KHMER TRÊN */}
          <div className="communication-khmer">
            {sentence.khmer}
          </div>

          {/* PHIÊN ÂM GIỮA */}
          <div className="communication-pronunciation">
            {sentence.pronunciation}
          </div>

          {/* VIỆT DƯỚI */}
          <div className="communication-vietnamese">
            {sentence.vietnamese}
          </div>

        </div>

        <button
          type="button"
          className="communication-audio-button"
          onClick={() =>
            playAudio(sentence.audio)
          }
          title="Nghe phát âm"
          aria-label={`Nghe: ${sentence.khmer}`}
        >
          🔊
        </button>

      </article>
    );
  };

  /* =======================================================
    RENDER DIALOGUE
  ======================================================= */

  const renderDialogue = (
    dialogue
  ) => {
    const speakerSides =
      getDialogueSpeakerSides(
        dialogue
      );

    return (
      <div className="communication-dialogue">

        {dialogue.map(
          (line, index) => {
            const speakerSide =
              speakerSides[index];

            return (
              <div
                key={
                  line.id ?? index
                }
                className={`communication-dialogue-row ${speakerSide}`}
              >

                {/* TÊN NGƯỜI NÓI */}
                <div className="communication-speaker">
                  {line.speaker}
                </div>

                <div className="communication-dialogue-bubble">

                  {/* KHMER TRÊN */}
                  <div className="communication-dialogue-khmer">
                    {line.khmer}
                  </div>

                  {/* PHIÊN ÂM GIỮA */}
                  <div className="communication-dialogue-pronunciation">
                    {line.pronunciation}
                  </div>

                  {/* VIỆT DƯỚI */}
                  <div className="communication-dialogue-vietnamese">
                    {line.vietnamese}
                  </div>

                  <button
                    type="button"
                    className="communication-dialogue-audio"
                    onClick={() =>
                      playAudio(
                        line.audio
                      )
                    }
                    title="Nghe câu này"
                    aria-label={`Nghe: ${line.khmer}`}
                  >
                    🔊
                  </button>

                </div>

              </div>
            );
          }
        )}

      </div>
    );
  };

  /* =======================================================
    VỀ TRANG HỌC TẬP
  ======================================================= */

  const goToStudent = () => {
    stopDialogue();

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
    RENDER
  ======================================================= */

  return (
    <div className="communication-page">

      {/* =================================================
          ĐỒNG HỒ HỌC TẬP
      ================================================= */}

      <div className="communication-timer">

        <div className="communication-timer-label">
          🟢 ĐANG HỌC
        </div>

        <div className="communication-timer-value">
          {displayTime}
        </div>

        <div className="communication-timer-exp">
          +10 EXP / phút
        </div>

      </div>


      {/* =================================================
          NÚT ĐIỀU HƯỚNG
      ================================================= */}

      <button
        type="button"
        className="communication-back-button"
        onClick={
          selectedCategory
            ? handleBackToCategories
            : goToStudent
        }
      >
        {selectedCategory
          ? "← Chọn chủ đề"
          : "← Về trang học tập"}
      </button>


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="communication-header">

        <div className="communication-header-content">

          {/* KHMER */}
          <h1>
            {selectedCategory
              ? selectedCategory.categoryKhmer
              : "ហាត់ការសន្ទនា"}
          </h1>

          {/* VIỆT */}
          <h2>
            {selectedCategory
              ? selectedCategory.category
              : "LUYỆN GIAO TIẾP"}
          </h2>

          <p>
            {selectedCategory
              ? selectedCategory.description
              : "Học những mẫu câu Khmer cơ bản và sử dụng trong giao tiếp hằng ngày."}
          </p>

        </div>


        {/* =================================================
            THỐNG KÊ SỐ CHỦ ĐỀ
        ================================================= */}

        <div className="communication-header-stat">

          <strong>
            {communicationData.length}
          </strong>

          <span>
            Chủ đề
          </span>

        </div>

      </header>


      {/* =================================================
          DANH SÁCH CHỦ ĐỀ
      ================================================= */}

      {!selectedCategory && (

        <section className="communication-category-section">

          <div className="communication-category-title">
            Chủ đề giao tiếp
          </div>

          <div className="communication-category-list">

            {communicationData.map(
              (category) => (

                <button
                  key={category.id}
                  type="button"
                  className="communication-category-card"
                  onClick={() =>
                    handleCategoryChange(
                      category
                    )
                  }
                >

                  <div className="communication-category-icon">
                    {getCategoryIcon(
                      category
                    )}
                  </div>

                  <div className="communication-category-content">

                    {/* KHMER TRÊN */}
                    <strong>
                      {category.categoryKhmer}
                    </strong>

                    {/* VIỆT DƯỚI */}
                    <span>
                      {category.category}
                    </span>

                    <p>
                      {category.description}
                    </p>

                  </div>

                  <div className="communication-category-arrow">
                    →
                  </div>

                </button>

              )
            )}

          </div>

        </section>

      )}


      {/* =================================================
          TRANG HỌC CHỦ ĐỀ
      ================================================= */}

      {selectedCategory && (

        <div className="communication-layout">

          {/* =============================================
              SIDEBAR
          ============================================= */}

          <aside className="communication-sidebar">

            {/* =================================================
                ĐÃ BỎ TIÊU ĐỀ CHỦ ĐỀ BỊ TRÙNG Ở ĐÂY

                Không còn:
                ការស្វាគមន៍ និងការណែនាំខ្លួន
                Chào hỏi - Giới thiệu 1

                Tiêu đề + mô tả đã được giữ ở HEADER phía trên.
            ================================================= */}

            <div className="communication-lesson-list">

              {selectedCategory.lessons?.map(
                (lesson) => (

                  <button
                    key={lesson.id}
                    type="button"
                    className={
                      selectedLesson?.id ===
                      lesson.id
                        ? "communication-lesson active"
                        : "communication-lesson"
                    }
                    onClick={() => {

                      stopDialogue();

                      setSelectedLessonId(
                        lesson.id
                      );

                    }}
                  >

                    <span className="communication-lesson-number">
                      {getLessonIcon(
                        lesson
                      )}
                    </span>

                    <span className="communication-lesson-info">

                      {/* KHMER TRÊN */}
                      <strong>
                        {lesson.titleKhmer}
                      </strong>

                      {/* VIỆT DƯỚI */}
                      <small>
                        {lesson.title}
                      </small>

                    </span>

                    <span className="communication-lesson-arrow">
                      →
                    </span>

                  </button>

                )
              )}

            </div>

          </aside>


          {/* =============================================
              NỘI DUNG BÀI HỌC
          ============================================= */}

          <main className="communication-main">

            {selectedLesson && (

              <>

                {/* ===================================
                    HEADER BÀI HỌC
                =================================== */}

                <section className="communication-lesson-header">

                  <div>

                    <div className="communication-lesson-label">
                      BÀI HỌC{" "}
                      {selectedLesson.id}
                    </div>

                    {/* KHMER TRÊN */}
                    <h2 className="communication-lesson-title-khmer">
                      {
                        selectedLesson.titleKhmer
                      }
                    </h2>

                    {/* VIỆT DƯỚI */}
                    <div className="communication-lesson-title-vietnamese">
                      {selectedLesson.title}
                    </div>

                    <p>
                      {
                        selectedLesson.description
                      }
                    </p>

                  </div>

                  <div className="communication-lesson-badge">
                    💬
                  </div>

                </section>


                {/* ===================================
                    MẪU CÂU
                =================================== */}

                {selectedLesson.sentences
                  ?.length > 0 && (

                  <section className="communication-section">

                    <div className="communication-section-heading">

                      <div>

                        <h3>
                          Mẫu câu
                        </h3>

                        <p>
                          Nghe và học cách sử dụng
                          các câu giao tiếp.
                        </p>

                      </div>

                      <span>
                        {
                          selectedLesson
                            .sentences
                            .length
                        }{" "}
                        câu
                      </span>

                    </div>

                    <div className="communication-sentence-list">

                      {selectedLesson.sentences.map(
                        renderSentence
                      )}

                    </div>

                  </section>

                )}


                {/* ===================================
                    HỘI THOẠI
                =================================== */}

                {selectedLesson.dialogue
                  ?.length > 0 && (

                  <section className="communication-section">

                    <div className="communication-section-heading">

                      <div>

                        <h3>
                          Hội thoại ngắn
                        </h3>

                        <p>
                          Thực hành các mẫu câu
                          trong đoạn hội thoại.
                        </p>

                      </div>

                      <span>
                        💬 Hội thoại
                      </span>

                    </div>


                    <div className="communication-dialogue-play-wrapper">

                      <button
                        type="button"
                        className={
                          isPlayingDialogue
                            ? "communication-dialogue-play playing"
                            : "communication-dialogue-play"
                        }
                        onClick={
                          playDialogue
                        }
                      >

                        <span
                          className="communication-dialogue-play-icon"
                        >
                          {isPlayingDialogue
                            ? "⏹"
                            : "▶"}
                        </span>

                        <span>
                          {isPlayingDialogue
                            ? "Dừng hội thoại"
                            : "Phát hội thoại"}
                        </span>

                      </button>

                    </div>


                    {renderDialogue(
                      selectedLesson.dialogue
                    )}

                  </section>

                )}

              </>

            )}

          </main>

        </div>

      )}

    </div>
  );
}

export default Communication;