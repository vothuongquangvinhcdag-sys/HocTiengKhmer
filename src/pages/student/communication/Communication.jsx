import { useEffect, useRef, useState } from "react";
import communicationData from "../../../data/communicationdata";
import "./Communication.css";

function Communication({
  profile,
  navigate,
  onLogout,
}) {
  /* =======================================================
     CATEGORY
  ======================================================= */

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(communicationData[0]?.id ?? null);

  /* =======================================================
     CATEGORY ĐANG CHỌN
  ======================================================= */

  const selectedCategory =
    communicationData.find(
      (category) => category.id === selectedCategoryId
    ) || communicationData[0];

  /* =======================================================
     LESSON
  ======================================================= */

  const [selectedLessonId, setSelectedLessonId] =
    useState(
      communicationData[0]?.lessons?.[0]?.id ?? null
    );

  const selectedLesson =
    selectedCategory?.lessons?.find(
      (lesson) => lesson.id === selectedLessonId
    ) || selectedCategory?.lessons?.[0];

  /* =======================================================
     AUDIO HỘI THOẠI
  ======================================================= */

  const dialogueAudioRef = useRef(null);
  const dialogueStopRef = useRef(false);

  const [isPlayingDialogue, setIsPlayingDialogue] =
    useState(false);

  /* =======================================================
     DỪNG AUDIO KHI RỜI TRANG
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
     DỪNG AUDIO KHI ĐỔI BÀI / ĐỔI CHỦ ĐỀ
  ======================================================= */

  useEffect(() => {
    stopDialogue();
  }, [selectedCategoryId, selectedLessonId]);

  /* =======================================================
     ĐỔI CATEGORY
  ======================================================= */

  const handleCategoryChange = (category) => {
    stopDialogue();

    setSelectedCategoryId(category.id);

    setSelectedLessonId(
      category.lessons?.[0]?.id ?? null
    );
  };

  /* =======================================================
     AUDIO - NGHE TỪNG CÂU
  ======================================================= */

  const playAudio = (audio) => {
    if (!audio) return;

    /*
     * Nếu đang phát hội thoại thì dừng hội thoại
     * trước khi phát riêng một câu.
     */
    stopDialogue();

    const sound = new Audio(audio);

    sound.play().catch((error) => {
      console.warn("Không thể phát audio:", error);
    });
  };

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
     PHÁT 1 CÂU TRONG HỘI THOẠI
  ======================================================= */

  const playDialogueLine = (line) => {
    return new Promise((resolve) => {
      if (!line?.audio) {
        resolve();
        return;
      }

      if (dialogueStopRef.current) {
        resolve();
        return;
      }

      const audio = new Audio(line.audio);

      dialogueAudioRef.current = audio;

      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
        audio.onabort = null;

        if (dialogueAudioRef.current === audio) {
          dialogueAudioRef.current = null;
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

     - Không giới hạn số lần
     - Phát từ đầu -> cuối
     - Tự động theo dữ liệu dialogue
     - Thêm câu mới không cần sửa code
  ======================================================= */

  const playDialogue = async () => {
    const dialogue = selectedLesson?.dialogue;

    if (!dialogue?.length) return;

    /*
     * Nếu đang phát thì nút này sẽ trở thành DỪNG.
     */
    if (isPlayingDialogue) {
      stopDialogue();
      return;
    }

    /*
     * Bắt đầu phiên phát mới.
     */
    dialogueStopRef.current = false;
    setIsPlayingDialogue(true);

    /*
     * Duyệt toàn bộ dialogue hiện tại.
     *
     * Không kiểm tra id, không giới hạn số câu.
     * Sau này thêm câu thứ 6, 7, 8... vẫn tự động phát.
     */
    for (const line of dialogue) {
      if (dialogueStopRef.current) {
        break;
      }

      await playDialogueLine(line);

      if (dialogueStopRef.current) {
        break;
      }
    }

    /*
     * Kết thúc toàn bộ hội thoại.
     */
    if (!dialogueStopRef.current) {
      setIsPlayingDialogue(false);
      dialogueAudioRef.current = null;
    }
  };

  /* =======================================================
     ICON CATEGORY
  ======================================================= */

  const getCategoryIcon = (category) => {
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

  const getLessonIcon = (lesson) => {
    if (lesson.id === 1) return "👋";
    if (lesson.id === 2) return "👤";
    if (lesson.id === 3) return "💬";
    if (lesson.id === 4) return "📍";
    if (lesson.id === 5) return "🗣";

    return "📖";
  };

  /* =======================================================
     XÁC ĐỊNH NGƯỜI NÓI

     Dara    -> bên trái
     Chantra -> bên phải
  ======================================================= */

  const getSpeakerClass = (speaker) => {
    const normalizedSpeaker = String(speaker || "")
      .trim()
      .toLowerCase();

    if (normalizedSpeaker === "dara") {
      return "speaker-dara";
    }

    if (normalizedSpeaker === "chantra") {
      return "speaker-chantra";
    }

    return "speaker-default";
  };

  /* =======================================================
     RENDER SENTENCE
  ======================================================= */

  const renderSentence = (sentence, index) => {
    return (
      <article
        key={sentence.id}
        className="communication-sentence-card"
      >
        <div className="communication-sentence-number">
          {index + 1}
        </div>

        <div className="communication-sentence-content">
          <div className="communication-khmer">
            {sentence.khmer}
          </div>

          <div className="communication-pronunciation">
            {sentence.pronunciation}
          </div>

          <div className="communication-vietnamese">
            {sentence.vietnamese}
          </div>
        </div>

        <button
          type="button"
          className="communication-audio-button"
          onClick={() => playAudio(sentence.audio)}
          title="Nghe phát âm"
          aria-label={`Nghe: ${sentence.khmer}`}
        >
          <span aria-hidden="true">🔊</span>
        </button>
      </article>
    );
  };

  /* =======================================================
     RENDER DIALOGUE

     Dara    -> trái
     Chantra -> phải
  ======================================================= */

  const renderDialogue = (dialogue) => {
    return (
      <div className="communication-dialogue">

        {dialogue.map((line, index) => {
          const speakerClass = getSpeakerClass(
            line.speaker
          );

          return (
            <div
              key={line.id ?? index}
              className={`communication-dialogue-row ${speakerClass}`}
            >
              {/* =========================================
                  SPEAKER
              ========================================= */}

              <div className="communication-speaker">
                {line.speaker}
              </div>

              {/* =========================================
                  BUBBLE
              ========================================= */}

              <div className="communication-dialogue-bubble">

                <div className="communication-dialogue-khmer">
                  {line.khmer}
                </div>

                <div className="communication-dialogue-pronunciation">
                  {line.pronunciation}
                </div>

                <div className="communication-dialogue-vietnamese">
                  {line.vietnamese}
                </div>

                {/* =====================================
                    NGHE RIÊNG TỪNG CÂU
                ===================================== */}

                <button
                  type="button"
                  className="communication-dialogue-audio"
                  onClick={() => playAudio(line.audio)}
                  title="Nghe câu này"
                  aria-label={`Nghe: ${line.khmer}`}
                >
                  <span aria-hidden="true">🔊</span>
                </button>

              </div>
            </div>
          );
        })}

      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="communication-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="communication-header">

        <div className="communication-header-content">

          <button
            type="button"
            className="communication-back-button"
            onClick={() => {
              stopDialogue();
              navigate("/student");
            }}
          >
            ← Quay lại trang chủ
          </button>

          <div className="communication-header-label">
            HỌC TIẾNG KHMER
          </div>

          <h1>
            Giao tiếp
          </h1>

          <h2>
            ការសន្ទនា
          </h2>

          <p>
            Học những mẫu câu Khmer cơ bản
            và sử dụng trong giao tiếp hằng ngày.
          </p>

        </div>

        <div className="communication-header-symbol">
          ក
        </div>

      </header>

      {/* =================================================
          CATEGORY
      ================================================= */}

      <section className="communication-category-section">

        <div className="communication-category-title">
          Chủ đề giao tiếp
        </div>

        <div className="communication-category-list">

          {communicationData.map((category) => (
            <button
              key={category.id}
              type="button"
              className={
                selectedCategoryId === category.id
                  ? "communication-category-card active"
                  : "communication-category-card"
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >
              <div className="communication-category-icon">
                {getCategoryIcon(category)}
              </div>

              <div className="communication-category-content">

                <strong>
                  {category.category}
                </strong>

                <span>
                  {category.categoryKhmer}
                </span>

                <p>
                  {category.description}
                </p>

              </div>

              <div className="communication-category-arrow">
                →
              </div>

            </button>
          ))}

        </div>

      </section>

      {/* =================================================
          CONTENT LAYOUT
      ================================================= */}

      <div className="communication-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="communication-sidebar">

          <div className="communication-sidebar-title">
            {selectedCategory?.category}
          </div>

          <div className="communication-sidebar-khmer">
            {selectedCategory?.categoryKhmer}
          </div>

          <div className="communication-lesson-list">

            {selectedCategory?.lessons?.map(
              (lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  className={
                    selectedLesson?.id === lesson.id
                      ? "communication-lesson active"
                      : "communication-lesson"
                  }
                  onClick={() => {
                    stopDialogue();
                    setSelectedLessonId(lesson.id);
                  }}
                >

                  <span className="communication-lesson-number">
                    {getLessonIcon(lesson)}
                  </span>

                  <span className="communication-lesson-info">

                    <strong>
                      {lesson.title}
                    </strong>

                    <small>
                      {lesson.titleKhmer}
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

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="communication-main">

          {selectedLesson && (
            <>

              {/* ===========================================
                  LESSON HEADER
              =========================================== */}

              <section className="communication-lesson-header">

                <div>

                  <div className="communication-lesson-label">
                    BÀI HỌC {selectedLesson.id}
                  </div>

                  <h2>
                    {selectedLesson.title}
                  </h2>

                  <div className="communication-lesson-title-khmer">
                    {selectedLesson.titleKhmer}
                  </div>

                  <p>
                    {selectedLesson.description}
                  </p>

                </div>

                <div className="communication-lesson-badge">
                  💬
                </div>

              </section>

              {/* ===========================================
                  SENTENCES
              =========================================== */}

              {selectedLesson.sentences?.length > 0 && (
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
                      {selectedLesson.sentences.length} câu
                    </span>

                  </div>

                  <div className="communication-sentence-list">

                    {selectedLesson.sentences.map(
                      renderSentence
                    )}

                  </div>

                </section>
              )}

              {/* ===========================================
                  DIALOGUE
              =========================================== */}

              {selectedLesson.dialogue?.length > 0 && (
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

                  {/* =======================================
                      NÚT PHÁT TOÀN BỘ HỘI THOẠI
                  ======================================= */}

                  <div className="communication-dialogue-play-wrapper">

                    <button
                      type="button"
                      className={
                        isPlayingDialogue
                          ? "communication-dialogue-play playing"
                          : "communication-dialogue-play"
                      }
                      onClick={playDialogue}
                      aria-label={
                        isPlayingDialogue
                          ? "Dừng hội thoại"
                          : "Phát hội thoại"
                      }
                    >
                      <span
                        className="communication-dialogue-play-icon"
                        aria-hidden="true"
                      >
                        {isPlayingDialogue ? "⏹" : "▶"}
                      </span>

                      <span>
                        {isPlayingDialogue
                          ? "Dừng hội thoại"
                          : "Phát hội thoại"}
                      </span>
                    </button>

                  </div>

                  {/* =======================================
                      TOÀN BỘ HỘI THOẠI
                  ======================================= */}

                  {renderDialogue(
                    selectedLesson.dialogue
                  )}

                </section>
              )}

            </>
          )}

        </main>

      </div>

    </div>
  );
}

export default Communication;