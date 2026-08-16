import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import "./Alphabet.css";

/* =========================================================
   33 PHỤ ÂM KHMER
========================================================= */

const consonants = [
  { stt: 1, letter: "ក", roman: "Co", voice: "O", uppercase: null, handwriting: null },
  { stt: 2, letter: "ខ", roman: "Kho", voice: "O", uppercase: null, handwriting: null },
  { stt: 3, letter: "គ", roman: "Cô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 4, letter: "ឃ", roman: "Khô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 5, letter: "ង", roman: "Ngô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 6, letter: "ច", roman: "Cho", voice: "O", uppercase: null, handwriting: null },
  { stt: 7, letter: "ឆ", roman: "Chho", voice: "O", uppercase: null, handwriting: null },
  { stt: 8, letter: "ជ", roman: "Chô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 9, letter: "ឈ", roman: "Chhô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 10, letter: "ញ", roman: "Nhô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 11, letter: "ដ", roman: "Do", voice: "O", uppercase: null, handwriting: null },
  { stt: 12, letter: "ឋ", roman: "Tho", voice: "O", uppercase: null, handwriting: null },
  { stt: 13, letter: "ឌ", roman: "Đô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 14, letter: "ឍ", roman: "Thô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 15, letter: "ណ", roman: "No", voice: "O", uppercase: null, handwriting: null },
  { stt: 16, letter: "ត", roman: "To", voice: "O", uppercase: null, handwriting: null },
  { stt: 17, letter: "ថ", roman: "Tho", voice: "O", uppercase: null, handwriting: null },
  { stt: 18, letter: "ទ", roman: "Tô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 19, letter: "ធ", roman: "Thô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 20, letter: "ន", roman: "Nô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 21, letter: "ប", roman: "Bo", voice: "O", uppercase: null, handwriting: null },
  { stt: 22, letter: "ផ", roman: "Pho", voice: "O", uppercase: null, handwriting: null },
  { stt: 23, letter: "ព", roman: "Pô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 24, letter: "ភ", roman: "Phô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 25, letter: "ម", roman: "Mô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 26, letter: "យ", roman: "Dô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 27, letter: "រ", roman: "Rô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 28, letter: "ល", roman: "Lô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 29, letter: "វ", roman: "Vô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 30, letter: "ស", roman: "So", voice: "O", uppercase: null, handwriting: null },
  { stt: 31, letter: "ហ", roman: "Ho", voice: "O", uppercase: null, handwriting: null },
  { stt: 32, letter: "ឡ", roman: "Lo", voice: "O", uppercase: null, handwriting: null },
  { stt: 33, letter: "អ", roman: "O / Â", voice: "O", uppercase: null, handwriting: null },
];

/* =========================================================
   24 NGUYÊN ÂM KHMER
========================================================= */

const vowels = [
  { stt: 1, symbol: "◌ា", romanO: "a", romanOh: "ia", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 2, symbol: "◌ិ", romanO: "ế", romanOh: "í", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 3, symbol: "◌ី", romanO: "ây", romanOh: "i", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 4, symbol: "◌ឹ", romanO: "ấ", romanOh: "ứ", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 5, symbol: "◌ឺ", romanO: "ơ", romanOh: "ơ / ư", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 6, symbol: "◌ុ", romanO: "u", romanOh: "ú", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 7, symbol: "◌ូ", romanO: "ua", romanOh: "ua", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 8, symbol: "◌ួ", romanO: "ờ", romanOh: "u", note: "", uppercase: null, handwriting: null },
  { stt: 9, symbol: "ើ", romanO: "ưa", romanOh: "ưa", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 10, symbol: "ឿ", romanO: "ia", romanOh: "ia", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 11, symbol: "ៀ", romanO: "ê", romanOh: "ê", note: "Âm ê", uppercase: null, handwriting: null },
  { stt: 12, symbol: "េ", romanO: "e", romanOh: "ê", note: "Âm e / ê", uppercase: null, handwriting: null },
  { stt: 13, symbol: "ែ", romanO: "ay", romanOh: "ây", note: "Âm ay / ây", uppercase: null, handwriting: null },
  { stt: 14, symbol: "ៃ", romanO: "ao", romanOh: "âu", note: "Âm ao / âu", uppercase: null, handwriting: null },
  { stt: 15, symbol: "ោ", romanO: "au", romanOh: "âu", note: "Âm au / âu", uppercase: null, handwriting: null },
  { stt: 16, symbol: "ៅ", romanO: "um", romanOh: "um", note: "Nikkahit", uppercase: null, handwriting: null },
  { stt: 17, symbol: "ុំ", romanO: "om", romanOh: "um", note: "Dấu chấm tròn", uppercase: null, handwriting: null },
  { stt: 18, symbol: "ំ", romanO: "ăm", romanOh: "oăm", note: "Âm ăm / oăm", uppercase: null, handwriting: null },
  { stt: 19, symbol: "ាំ", romanO: "ás", romanOh: "iás", note: "Reahmuk", uppercase: null, handwriting: null },
  { stt: 20, symbol: "ះ", romanO: "és", romanOh: "ís", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 21, symbol: "ិះ", romanO: "ốs", romanOh: "ús", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 22, symbol: "េះ", romanO: "és", romanOh: "és", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 23, symbol: "ោះ", romanO: "ós", romanOh: "uás", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 24, symbol: "ឹះ", romanO: "ứs", romanOh: "ứs", note: "Ngắt hơi", uppercase: null, handwriting: null },
];

/* =========================================================
   CẤU HÌNH
========================================================= */

const EXP_PER_MINUTE = 10;
const SECONDS_PER_MINUTE = 60;

/* =========================================================
   CHUẨN HÓA TÊN FILE NGUYÊN ÂM
========================================================= */

const getSafeVowelFileName = (symbol) => {
  if (!symbol) return "";

  return symbol
    .trim()
    .replace(/\s*\/\s*/g, "-")
    .replace(/\s+/g, "");
};

/* =========================================================
   LẤY ĐƯỜNG DẪN AUDIO
========================================================= */

const getAlphabetAudio = (item, type, voice = null) => {
  if (!item) return null;

  /* =======================================================
     PHỤ ÂM

     Ví dụ:
     ក
     ↓
     /audio/alphabet/consonants/%E1%9E%80.mp3
  ======================================================= */

  if (type === "consonant") {
    const fileName = `${item.letter}.mp3`;

    return `/audio/alphabet/consonants/${encodeURIComponent(
      fileName
    )}`;
  }

  /* =======================================================
     NGUYÊN ÂM

     Ví dụ:

     ◌ា + O
     → ◌ា-o.mp3

     ◌ា + Ô
     → ◌ា-oh.mp3
  ======================================================= */

  if (type === "vowel") {
    const safeName = getSafeVowelFileName(item.symbol);

    if (!safeName) return null;

    if (voice === "O") {
      return `/audio/alphabet/vowels/${encodeURIComponent(
        `${safeName}-o.mp3`
      )}`;
    }

    if (voice === "Ô") {
      return `/audio/alphabet/vowels/${encodeURIComponent(
        `${safeName}-oh.mp3`
      )}`;
    }
  }

  return null;
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

function Alphabet({
  navigate,
  session,
  profile,
  onLogout,
  onProgressUpdated,
}) {
  const [tab, setTab] = useState("consonants");

  const [voiceFilter, setVoiceFilter] =
    useState("all");

  const [selected, setSelected] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState(null);

  /* =======================================================
     USER
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
        Number(profile?.total_study_seconds ?? 0)
      )
    );

  const [remainderSeconds, setRemainderSeconds] =
    useState(0);

  const totalStudySecondsRef =
    useRef(totalStudySeconds);

  const remainderSecondsRef =
    useRef(remainderSeconds);

  const timerRef = useRef(null);

  const savingRef = useRef(false);

  /* =======================================================
     AUDIO

     audioRef:
       Lưu Audio object hiện tại.

     audioIdRef:
       Mỗi lần tạo Audio mới sẽ tăng ID.
       Nhờ vậy event của Audio cũ không thể
       làm thay đổi trạng thái của Audio mới.

     currentAudioUrlRef:
       URL hiện tại.

     playingVoice:
       null
       "consonant"
       "O"
       "Ô"
  ======================================================= */

  const audioRef = useRef(null);

  const audioIdRef = useRef(0);

  const currentAudioUrlRef =
    useRef(null);

  const [isAudioPlaying, setIsAudioPlaying] =
    useState(false);

  const [playingVoice, setPlayingVoice] =
    useState(null);

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
            "❌ Không lấy được thời gian học:",
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

      const currentExp = Math.max(
        0,
        Number(currentProfile.exp ?? 0)
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

      remainderSecondsRef.current = 0;
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
    if (!userId) return;

    if (timerRef.current) return;

    console.log(
      "🟢 ALPHABET: bắt đầu tính thời gian."
    );

    remainderSecondsRef.current = 0;
    setRemainderSeconds(0);

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
        "⏹️ ALPHABET: dừng bộ đếm."
      );
    };
  }, [userId]);

  /* =======================================================
     AUDIO - RESET STATE
  ======================================================= */

  const resetAudioState = () => {
    setIsAudioPlaying(false);
    setPlayingVoice(null);

    currentAudioUrlRef.current = null;
  };

  /* =======================================================
     AUDIO - STOP

     Hàm này dùng khi:
     - đổi chữ
     - đóng modal
     - đổi tab
     - unmount
     - chuyển audio
  ======================================================= */

  const stopAudio = () => {
    /*
       Tăng ID để tất cả event của Audio cũ
       bị vô hiệu hóa.
    */

    audioIdRef.current += 1;

    if (audioRef.current) {
      const oldAudio = audioRef.current;

      try {
        oldAudio.pause();
        oldAudio.currentTime = 0;

        oldAudio.onplay = null;
        oldAudio.onpause = null;
        oldAudio.onended = null;
        oldAudio.onerror = null;
      } catch (error) {
        console.error(
          "❌ Lỗi dừng audio:",
          error
        );
      }
    }

    audioRef.current = null;

    resetAudioState();
  };

  /* =======================================================
     AUDIO - PLAY URL

     LOGIC:

     1. Nếu đúng audio đang phát:
        → pause
        → nút trở lại ▶

     2. Nếu audio khác:
        → dừng audio cũ
        → tạo audio mới

     3. Khi audio bắt đầu:
        → hiện ❚❚

     4. Khi audio kết thúc:
        → tự động hiện ▶

     5. Nếu lỗi:
        → hiện ▶
  ======================================================= */

  const playAudioUrl = async (
    audioUrl,
    voice = null
  ) => {
    if (!audioUrl) {
      console.error(
        "❌ Không có đường dẫn audio."
      );

      return;
    }

    /* =====================================================
       TRƯỜNG HỢP ĐANG PHÁT ĐÚNG AUDIO

       Bấm ❚❚
       → pause
       → trở lại ▶
    ===================================================== */

    if (
      audioRef.current &&
      currentAudioUrlRef.current ===
        audioUrl &&
      !audioRef.current.paused
    ) {
      console.log(
        "⏸️ AUDIO: tạm dừng:",
        audioUrl
      );

      try {
        audioRef.current.pause();
      } catch (error) {
        console.error(
          "❌ Lỗi pause audio:",
          error
        );
      }

      /*
         Không cần chờ onpause.
         Chủ động đưa UI về ▶ ngay.
      */

      setIsAudioPlaying(false);
      setPlayingVoice(null);

      return;
    }

    /* =====================================================
       AUDIO CŨ
    ===================================================== */

    stopAudio();

    /* =====================================================
       TẠO AUDIO ID MỚI
    ===================================================== */

    const currentAudioId =
      audioIdRef.current + 1;

    audioIdRef.current =
      currentAudioId;

    /* =====================================================
       TẠO AUDIO
    ===================================================== */

    const audio = new Audio();

    audio.preload = "auto";

    audioRef.current = audio;

    currentAudioUrlRef.current =
      audioUrl;

    /*
       Quan trọng:

       Khi bắt đầu tải audio,
       chưa hiển thị ❚❚ cho tới khi
       audio thật sự PLAY.
    */

    setIsAudioPlaying(false);
    setPlayingVoice(voice);

    console.log(
      "🔊 AUDIO:",
      audioUrl
    );

    /* =====================================================
       EVENT: PLAY
    ===================================================== */

    audio.onplay = () => {
      /*
         Nếu đây không còn là Audio hiện tại
         thì bỏ qua.
      */

      if (
        audioIdRef.current !==
        currentAudioId
      ) {
        return;
      }

      console.log(
        "▶️ AUDIO ĐANG PHÁT:",
        audioUrl
      );

      setIsAudioPlaying(true);
      setPlayingVoice(voice);
    };

    /* =====================================================
       EVENT: PAUSE

       Chỉ xử lý nếu chính Audio hiện tại
       bị pause.

       Không dùng onpause để đổi audio mới.
    ===================================================== */

    audio.onpause = () => {
      if (
        audioIdRef.current !==
        currentAudioId
      ) {
        return;
      }

      /*
         Nếu pause thủ công thì nút trở lại ▶.
      */

      if (
        audio.currentTime <
        audio.duration
      ) {
        console.log(
          "⏸️ AUDIO ĐÃ DỪNG:",
          audioUrl
        );

        setIsAudioPlaying(false);
        setPlayingVoice(null);
      }
    };

    /* =====================================================
       EVENT: ENDED

       Đây là phần QUAN TRỌNG NHẤT.

       Khi đọc xong:
       ❚❚ → ▶
    ===================================================== */

    audio.onended = () => {
      if (
        audioIdRef.current !==
        currentAudioId
      ) {
        return;
      }

      console.log(
        "✅ AUDIO ĐỌC XONG:",
        audioUrl
      );

      setIsAudioPlaying(false);
      setPlayingVoice(null);

      currentAudioUrlRef.current =
        null;

      audioRef.current = null;
    };

    /* =====================================================
       EVENT: ERROR
    ===================================================== */

    audio.onerror = () => {
      if (
        audioIdRef.current !==
        currentAudioId
      ) {
        return;
      }

      console.error(
        "❌ KHÔNG TÌM THẤY AUDIO:",
        audioUrl
      );

      console.error(
        "👉 Kiểm tra file trong:"
      );

      console.error(
        "👉 public/audio/alphabet/"
      );

      setIsAudioPlaying(false);
      setPlayingVoice(null);

      currentAudioUrlRef.current =
        null;

      audioRef.current = null;
    };

    /* =====================================================
       GÁN SRC SAU KHI ĐÃ GẮN EVENT
    ===================================================== */

    audio.src = audioUrl;

    /* =====================================================
       PLAY

       Nếu trình duyệt chặn autoplay,
       catch sẽ xử lý.
    ===================================================== */

    try {
      await audio.play();
    } catch (error) {
      console.error(
        "❌ Không thể phát audio:",
        audioUrl,
        error
      );

      if (
        audioIdRef.current ===
        currentAudioId
      ) {
        setIsAudioPlaying(false);
        setPlayingVoice(null);

        currentAudioUrlRef.current =
          null;

        audioRef.current = null;
      }
    }
  };

  /* =======================================================
     AUDIO PHỤ ÂM
  ======================================================= */

  const toggleConsonantAudio = async () => {
    if (
      !selected ||
      selectedType !== "consonant"
    ) {
      return;
    }

    const audioUrl =
      getAlphabetAudio(
        selected,
        "consonant"
      );

    console.log(
      "🔊 AUDIO PHỤ ÂM:",
      audioUrl
    );

    await playAudioUrl(
      audioUrl,
      "consonant"
    );
  };

  /* =======================================================
     AUDIO NGUYÊN ÂM
  ======================================================= */

  const playVowelAudio = async (
    voice
  ) => {
    if (
      !selected ||
      selectedType !== "vowel"
    ) {
      return;
    }

    const audioUrl =
      getAlphabetAudio(
        selected,
        "vowel",
        voice
      );

    console.log(
      `🔊 AUDIO NGUYÊN ÂM GIỌNG ${voice}:`,
      audioUrl
    );

    await playAudioUrl(
      audioUrl,
      voice
    );
  };

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  const openConsonant = (item) => {
    stopAudio();

    setSelected(item);
    setSelectedType("consonant");
  };

  const openVowel = (item) => {
    stopAudio();

    setSelected(item);
    setSelectedType("vowel");
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    stopAudio();

    setSelected(null);
    setSelectedType(null);
  };

  /* =======================================================
     RESET AUDIO KHI ĐỔI CHỮ
  ======================================================= */

  useEffect(() => {
    /*
       Không cần stopAudio() ở đây.

       openConsonant/openVowel đã stopAudio()
       trước khi setSelected.

       Nếu gọi stopAudio() ở đây sẽ dễ tạo
       thêm các lần reset không cần thiết.
    */

    setIsAudioPlaying(false);
    setPlayingVoice(null);
  }, [selected]);

  /* =======================================================
     CLEANUP AUDIO KHI UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      /*
         Vô hiệu hóa mọi event Audio.
      */

      audioIdRef.current += 1;

      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;

          audioRef.current.onplay = null;
          audioRef.current.onpause = null;
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        } catch {
          // bỏ qua
        }
      }

      audioRef.current = null;
      currentAudioUrlRef.current = null;
    };
  }, []);

  /* =======================================================
     ESC ĐÓNG MODAL
  ======================================================= */

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event) => {
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
     VỀ TRANG STUDENT
  ======================================================= */

  const goToStudent = () => {
    stopAudio();

    if (typeof navigate === "function") {
      navigate("/student");
    } else {
      window.location.href =
        "/student";
    }
  };

  /* =======================================================
     FILTER PHỤ ÂM
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
     KIỂM TRA AUDIO ĐANG PHÁT
  ======================================================= */

  const isConsonantPlaying =
    selectedType === "consonant" &&
    isAudioPlaying;

  const isVowelOPlaying =
    selectedType === "vowel" &&
    playingVoice === "O" &&
    isAudioPlaying;

  const isVowelOhPlaying =
    selectedType === "vowel" &&
    playingVoice === "Ô" &&
    isAudioPlaying;

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
            stopAudio();

            setTab("consonants");

            setSelected(null);
            setSelectedType(null);
          }}
        >
          Phụ âm
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
            stopAudio();

            setTab("vowels");

            setSelected(null);
            setSelectedType(null);
          }}
        >
          Nguyên âm
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
                  aria-label={`Xem chi tiết chữ ${item.letter}`}
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

            {selectedType === "consonant" && (
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
                    {selected.voice === "O"
                      ? "🟢 Giọng O"
                      : "🟠 Giọng Ô"}
                  </div>

                </div>

                <div className="alphabet-detail-grid">

                  {/* CHỮ THƯỜNG */}

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

                  {/* CHỮ HOA */}

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

                  {/* VIẾT TAY */}

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

                  {/* PHIÊN ÂM */}

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

                {/* =================================================
                    AUDIO PHỤ ÂM
                ================================================= */}

                <div className="modal-audio-divider">
                  - - - - - - 🔊 Giọng đọc - - - - - -
                </div>

                <div className="modal-audio-area">

                  <button
                    type="button"
                    className={
                      isConsonantPlaying
                        ? "audio-play-button playing"
                        : "audio-play-button"
                    }
                    style={{
                      width: "80px",
                      height: "80px",
                      minWidth: "80px",
                      minHeight: "80px",
                      maxWidth: "80px",
                      maxHeight: "80px",

                      flex: "0 0 80px",

                      borderRadius: "12px",

                      border: "2px solid transparent",

                      backgroundColor:
                        selected.voice === "O"
                          ? "var(--khmer-green)"
                          : "var(--khmer-gold)",

                      color: "#000",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      padding: 0,
                      margin: "0 auto",

                      fontFamily:
                        '"Segoe UI", Arial, sans-serif',

                      fontSize:
                        isConsonantPlaying
                          ? "28px"
                          : "34px",

                      fontWeight: 900,
                      lineHeight: 1,

                      cursor: "pointer",

                      boxShadow:
                        "0 5px 14px rgba(0, 0, 0, 0.18)",

                      transition:
                        "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onClick={
                      toggleConsonantAudio
                    }
                    aria-label={
                      isConsonantPlaying
                        ? "Tạm dừng"
                        : "Phát âm thanh"
                    }
                  >
                    {isConsonantPlaying
                      ? "❚❚"
                      : "▶"}
                  </button>

                </div>

              </>
            )}

            {/* =================================================
                MODAL NGUYÊN ÂM
            ================================================= */}

            {selectedType === "vowel" && (
              <>

                <div className="modal-vowel-header">

                  <div className="modal-detail-stt">
                    STT {selected.stt}
                  </div>

                </div>

                <div className="alphabet-detail-grid vowel-detail-grid">

                  {/* CHỮ THƯỜNG */}

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

                  {/* CHỮ HOA */}

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

                  {/* VIẾT TAY */}

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

                  {/* PHIÊN ÂM */}

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

                      {/* GIỌNG O */}

                      <div className="vowel-modal-pronunciation-row">

                        <span className="vowel-modal-voice voice-o">
                          🟢 Giọng O
                        </span>

                        <strong>
                          {selected.romanO}
                        </strong>

                      </div>

                      {/* GIỌNG Ô */}

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

                {/* =================================================
                    GHI CHÚ
                ================================================= */}

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

                {/* =================================================
                    AUDIO NGUYÊN ÂM
                ================================================= */}

                <div className="modal-audio-divider">
                  - - - - - - 🔊 Giọng đọc - - - - - -
                </div>

                <div className="modal-vowel-audio">

                  <div
                    className="vowel-audio-buttons"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "60px",
                      marginTop: "10px",
                      width: "100%",
                    }}
                  >

                    {/* =================================================
                        NÚT PLAY O
                    ================================================= */}

                    <button
                      type="button"
                      className={
                        isVowelOPlaying
                          ? "audio-play-button playing"
                          : "audio-play-button"
                      }
                      style={{
                        width: "80px",
                        height: "80px",
                        minWidth: "80px",
                        minHeight: "80px",
                        maxWidth: "80px",
                        maxHeight: "80px",

                        flex: "0 0 80px",

                        borderRadius: "12px",

                        border:
                          "2px solid var(--khmer-green)",

                        backgroundColor:
                          "var(--khmer-green)",

                        color: "#000",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        padding: 0,
                        margin: 0,

                        fontFamily:
                          '"Segoe UI", Arial, sans-serif',

                        fontSize:
                          isVowelOPlaying
                            ? "28px"
                            : "34px",

                        fontWeight: 900,
                        lineHeight: 1,

                        cursor: "pointer",

                        boxShadow:
                          "0 5px 14px rgba(0, 0, 0, 0.18)",

                        transition:
                          "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                      onClick={() =>
                        playVowelAudio("O")
                      }
                      aria-label={
                        isVowelOPlaying
                          ? "Tạm dừng"
                          : "Phát âm thanh giọng O"
                      }
                    >
                      {isVowelOPlaying
                        ? "❚❚"
                        : "▶"}
                    </button>

                    {/* =================================================
                        NÚT PLAY Ô
                    ================================================= */}

                    <button
                      type="button"
                      className={
                        isVowelOhPlaying
                          ? "audio-play-button playing"
                          : "audio-play-button"
                      }
                      style={{
                        width: "80px",
                        height: "80px",
                        minWidth: "80px",
                        minHeight: "80px",
                        maxWidth: "80px",
                        maxHeight: "80px",

                        flex: "0 0 80px",

                        borderRadius: "12px",

                        border:
                          "2px solid var(--khmer-gold)",

                        backgroundColor:
                          "var(--khmer-gold)",

                        color: "#000",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        padding: 0,
                        margin: 0,

                        fontFamily:
                          '"Segoe UI", Arial, sans-serif',

                        fontSize:
                          isVowelOhPlaying
                            ? "28px"
                            : "34px",

                        fontWeight: 900,
                        lineHeight: 1,

                        cursor: "pointer",

                        boxShadow:
                          "0 5px 14px rgba(0, 0, 0, 0.18)",

                        transition:
                          "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                      onClick={() =>
                        playVowelAudio("Ô")
                      }
                      aria-label={
                        isVowelOhPlaying
                          ? "Tạm dừng"
                          : "Phát âm thanh giọng Ô"
                      }
                    >
                      {isVowelOhPlaying
                        ? "❚❚"
                        : "▶"}
                    </button>

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