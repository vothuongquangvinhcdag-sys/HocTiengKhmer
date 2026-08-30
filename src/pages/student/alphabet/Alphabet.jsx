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
  { stt: 11, letter: "ដ", roman: "Đo", voice: "O", uppercase: null, handwriting: null },
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
  { stt: 33, letter: "អ", roman: "O", voice: "O", uppercase: null, handwriting: null },
];

/* =========================================================
   11 PHỤ ÂM BỔ SUNG
========================================================= */

const additionalConsonants = [
  { stt: 1, letter: "ង៉", roman: "Ngo", voice: "O", uppercase: null, handwriting: null },
  { stt: 2, letter: "ញ៉", roman: "Nho", voice: "O", uppercase: null, handwriting: null },
  { stt: 3, letter: "ម៉", roman: "Mo", voice: "O", uppercase: null, handwriting: null },
  { stt: 4, letter: "យ៉", roman: "Do", voice: "O", uppercase: null, handwriting: null },
  { stt: 5, letter: "រ៉", roman: "Ro", voice: "O", uppercase: null, handwriting: null },
  { stt: 6, letter: "វ៉", roman: "Vo", voice: "O", uppercase: null, handwriting: null },
  { stt: 7, letter: "ប៉", roman: "Po*", voice: "O", uppercase: null, handwriting: null },
  { stt: 8, letter: "ប៊", roman: "Bô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 9, letter: "ស៊", roman: "Sô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 10, letter: "ហ៊", roman: "Hô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 11, letter: "អ៊", roman: "Ô", voice: "Ô", uppercase: null, handwriting: null },
];

/* =========================================================
   25 NGUYÊN ÂM KHMER
========================================================= */

const vowels = [
  { stt: 1, symbol: "ា", romanO: "a", romanOh: "ia", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 2, symbol: "ិ", romanO: "ế", romanOh: "í", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 3, symbol: "ី", romanO: "ây", romanOh: "i", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 4, symbol: "ឹ", romanO: "ấ", romanOh: "ứ", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 5, symbol: "ឺ", romanO: "ơ", romanOh: "ư", note: "Âm dài", uppercase: null, handwriting: null },
  { stt: 6, symbol: "ុ", romanO: "ố", romanOh: "ú", note: "Âm ngắn", uppercase: null, handwriting: null },
  { stt: 7, symbol: "ូ", romanO: "ô", romanOh: "u", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 8, symbol: "ួ", romanO: "ua", romanOh: "ua", note: "", uppercase: null, handwriting: null },
  { stt: 9, symbol: "ើ", romanO: "ờ", romanOh: "ơ", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 10, symbol: "ឿ", romanO: "ưa", romanOh: "ưa", note: "Không đổi giọng", uppercase: null, handwriting: null },
  { stt: 11, symbol: "ៀ", romanO: "ia", romanOh: "ia", note: "Âm ê", uppercase: null, handwriting: null },
  { stt: 12, symbol: "េ", romanO: "ê", romanOh: "ê", note: "Âm e / ê", uppercase: null, handwriting: null },
  { stt: 13, symbol: "ែ", romanO: "ae", romanOh: "e", note: "Âm ay / ây", uppercase: null, handwriting: null },
  { stt: 14, symbol: "ៃ", romanO: "ay", romanOh: "ây", note: "Âm ao / âu", uppercase: null, handwriting: null },
  { stt: 15, symbol: "ោ", romanO: "ao", romanOh: "ô", note: "Âm au / âu", uppercase: null, handwriting: null },
  { stt: 16, symbol: "ៅ", romanO: "au", romanOh: "âu", note: "Nikkahit", uppercase: null, handwriting: null },
  { stt: 17, symbol: "ុំ", romanO: "ôm", romanOh: "um", note: "Dấu chấm tròn", uppercase: null, handwriting: null },
  { stt: 18, symbol: "ំ", romanO: "om", romanOh: "ôm", note: "Âm ăm / oăm", uppercase: null, handwriting: null },
  { stt: 19, symbol: "ាំ", romanO: "ăm", romanOh: "oăm", note: "Reahmuk", uppercase: null, handwriting: null },
  { stt: 20, symbol: "ះ", romanO: "ắs", romanOh: "ías", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 21, symbol: "ិះ", romanO: "ếs", romanOh: "ís", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 22, symbol: "េះ", romanO: "és", romanOh: "ếs", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 23, symbol: "ុះ", romanO: "ốs", romanOh: "ús", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 24, symbol: "ោះ", romanO: "ós", romanOh: "úas", note: "Ngắt hơi", uppercase: null, handwriting: null },
  { stt: 25, symbol: "ឹះ", romanO: "ấs", romanOh: "ứs", note: "Ngắt hơi", uppercase: null, handwriting: null },
];

/* =========================================================
   33 CHÂN CHỮ / GỬI CHÂN
========================================================= */

const subscriptConsonants = [
  { stt: 1, letter: "្ក", roman: "Chơng Co", voice: "O", uppercase: null, handwriting: null },
  { stt: 2, letter: "្ខ", roman: "Chơng Kho", voice: "O", uppercase: null, handwriting: null },
  { stt: 3, letter: "្គ", roman: "Chơng Cô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 4, letter: "្ឃ", roman: "Chơng Khô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 5, letter: "្ង", roman: "Chơng Ngô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 6, letter: "្ច", roman: "Chơng Cho", voice: "O", uppercase: null, handwriting: null },
  { stt: 7, letter: "្ឆ", roman: "Chơng Chho", voice: "O", uppercase: null, handwriting: null },
  { stt: 8, letter: "្ជ", roman: "Chơng Chô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 9, letter: "្ឈ", roman: "Chơng Chhô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 10, letter: "្ញ", roman: "Chơng Nhô*", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 11, letter: "ញ្ញ", roman: "Chơng Nhô*", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 12, letter: "្ដ", roman: "Chơng Đo", voice: "O", uppercase: null, handwriting: null },
  { stt: 13, letter: "្ឋ", roman: "Chơng Tho", voice: "O", uppercase: null, handwriting: null },
  { stt: 14, letter: "្ឌ", roman: "Chơng Đô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 15, letter: "្ឍ", roman: "Chơng Thô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 16, letter: "្ណ", roman: "Chơng No", voice: "O", uppercase: null, handwriting: null },
  { stt: 17, letter: "្ត", roman: "Chơng To", voice: "O", uppercase: null, handwriting: null },
  { stt: 18, letter: "្ថ", roman: "Chơng Tho", voice: "O", uppercase: null, handwriting: null },
  { stt: 19, letter: "្ទ", roman: "Chơng Tô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 20, letter: "្ធ", roman: "Chơng Thô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 21, letter: "្ន", roman: "Chơng Nô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 22, letter: "្ប", roman: "Chơng Bo", voice: "O", uppercase: null, handwriting: null },
  { stt: 23, letter: "្ផ", roman: "Chơng Pho", voice: "O", uppercase: null, handwriting: null },
  { stt: 24, letter: "្ព", roman: "Chơng Pô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 25, letter: "្ភ", roman: "Chơng Phô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 26, letter: "្ម", roman: "Chơng Mô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 27, letter: "្យ", roman: "Chơng Dô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 28, letter: "្រ", roman: "Chơng Rô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 29, letter: "្ល", roman: "Chơng Lô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 30, letter: "្វ", roman: "Chơng Vô", voice: "Ô", uppercase: null, handwriting: null },
  { stt: 31, letter: "្ស", roman: "Chơng So", voice: "O", uppercase: null, handwriting: null },
  { stt: 32, letter: "្ហ", roman: "Chơng Ho", voice: "O", uppercase: null, handwriting: null },
  { stt: 33, letter: "្អ", roman: "Chơng O", voice: "O", uppercase: null, handwriting: null },
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

  if (type === "consonant") {
    const fileName = `${item.letter}.mp3`;

    return `/audio/alphabet/consonants/${encodeURIComponent(
      fileName
    )}`;
  }

  if (type === "additional-consonant") {
    const fileName = `${item.letter}.mp3`;

    return `/audio/alphabet/additional-consonants/${encodeURIComponent(
      fileName
    )}`;
  }

  if (type === "subscript-consonant") {
    const fileName = `${item.letter}.mp3`;

    return `/audio/alphabet/subscript-consonants/${encodeURIComponent(
      fileName
    )}`;
  }

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

  const timerRef = useRef(null);

  const savingRef = useRef(false);

  /* =======================================================
     AUDIO
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
  ======================================================= */

  const stopAudio = () => {
    audioIdRef.current += 1;

    if (audioRef.current) {
      const oldAudio =
        audioRef.current;

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

      setIsAudioPlaying(false);

      setPlayingVoice(null);

      return;
    }

    stopAudio();

    const currentAudioId =
      audioIdRef.current + 1;

    audioIdRef.current =
      currentAudioId;

    const audio = new Audio();

    audio.preload = "auto";

    audioRef.current = audio;

    currentAudioUrlRef.current =
      audioUrl;

    setIsAudioPlaying(false);

    setPlayingVoice(voice);

    console.log(
      "🔊 AUDIO:",
      audioUrl
    );

    audio.onplay = () => {
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

    audio.onpause = () => {
      if (
        audioIdRef.current !==
        currentAudioId
      ) {
        return;
      }

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

      setIsAudioPlaying(false);

      setPlayingVoice(null);

      currentAudioUrlRef.current =
        null;

      audioRef.current = null;
    };

    audio.src = audioUrl;

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
     AUDIO PHỤ ÂM BỔ SUNG
  ======================================================= */

  const toggleAdditionalConsonantAudio =
    async () => {
      if (
        !selected ||
        selectedType !==
          "additional-consonant"
      ) {
        return;
      }

      const audioUrl =
        getAlphabetAudio(
          selected,
          "additional-consonant"
        );

      console.log(
        "🔊 AUDIO PHỤ ÂM BỔ SUNG:",
        audioUrl
      );

      await playAudioUrl(
        audioUrl,
        "additional-consonant"
      );
    };

  /* =======================================================
     AUDIO CHÂN CHỮ
  ======================================================= */

  const toggleSubscriptConsonantAudio =
    async () => {
      if (
        !selected ||
        selectedType !==
          "subscript-consonant"
      ) {
        return;
      }

      const audioUrl =
        getAlphabetAudio(
          selected,
          "subscript-consonant"
        );

      console.log(
        "🔊 AUDIO CHÂN CHỮ:",
        audioUrl
      );

      await playAudioUrl(
        audioUrl,
        "subscript-consonant"
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

  const openAdditionalConsonant = (
    item
  ) => {
    stopAudio();

    setSelected(item);

    setSelectedType(
      "additional-consonant"
    );
  };

  const openSubscriptConsonant = (
    item
  ) => {
    stopAudio();

    setSelected(item);

    setSelectedType(
      "subscript-consonant"
    );
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
    setIsAudioPlaying(false);

    setPlayingVoice(null);
  }, [selected]);

  /* =======================================================
     CLEANUP AUDIO
  ======================================================= */

  useEffect(() => {
    return () => {
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

      currentAudioUrlRef.current =
        null;
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

  const filteredAdditionalConsonants =
    voiceFilter === "all"
      ? additionalConsonants
      : additionalConsonants.filter(
          (item) =>
            item.voice ===
            voiceFilter
        );

  const filteredSubscriptConsonants =
    voiceFilter === "all"
      ? subscriptConsonants
      : subscriptConsonants.filter(
          (item) =>
            item.voice ===
            voiceFilter
        );

  /* =======================================================
     KIỂM TRA AUDIO
  ======================================================= */

  const isConsonantPlaying =
    selectedType === "consonant" &&
    isAudioPlaying;

  const isAdditionalConsonantPlaying =
    selectedType ===
      "additional-consonant" &&
    isAudioPlaying;

  const isSubscriptConsonantPlaying =
    selectedType ===
      "subscript-consonant" &&
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
            Tra cứu phụ âm, phụ âm bổ sung,
            nguyên âm và chân chữ tiếng Khmer
          </p>
        </div>

        <div className="alphabet-stats">

          <div className="alphabet-stat">
            <strong>33</strong>
            <span>Phụ âm</span>
          </div>
          
          <div className="alphabet-stat">
            <strong>25</strong>
            <span>Nguyên âm</span>
          </div>

          <div className="alphabet-stat">
            <strong>11</strong>
            <span>Phụ âm bổ sung</span>
          </div>

          <div className="alphabet-stat">
            <strong>32</strong>
            <span>Chân chữ</span>
          </div>

        </div>
      </header>

      {/* =================================================
          TABS
          ĐÃ ĐỔI THỨ TỰ:
          Phụ âm | Nguyên âm
          Phụ âm bổ sung | Chân chữ
      ================================================= */}

      <div className="alphabet-tabs">

        {/* PHỤ ÂM */}

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

            setVoiceFilter("all");
          }}
        >
          Phụ âm
          <span>33 chữ</span>
        </button>

        {/* NGUYÊN ÂM */}

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

            setVoiceFilter("all");
          }}
        >
          Nguyên âm
          <span>25 âm</span>
        </button>

        {/* PHỤ ÂM BỔ SUNG */}

        <button
          type="button"
          className={
            tab ===
            "additional-consonants"
              ? "alphabet-tab active"
              : "alphabet-tab"
          }
          onClick={() => {
            stopAudio();

            setTab(
              "additional-consonants"
            );

            setSelected(null);

            setSelectedType(null);

            setVoiceFilter("all");
          }}
        >
          Phụ âm bổ sung
          <span>11 chữ</span>
        </button>

        {/* CHÂN CHỮ */}

        <button
          type="button"
          className={
            tab === "subscript-consonants"
              ? "alphabet-tab active"
              : "alphabet-tab"
          }
          onClick={() => {
            stopAudio();

            setTab(
              "subscript-consonants"
            );

            setSelected(null);

            setSelectedType(null);

            setVoiceFilter("all");
          }}
        >
          Chân chữ
          <span>32 chân</span>
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
              Đọc như chữ S tiếng Việt nhưng
              có hơi bật mạnh.
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
          PHỤ ÂM BỔ SUNG
      ================================================= */}

      {tab ===
        "additional-consonants" && (
        <section>

          <div className="alphabet-toolbar">

            <div>
              <h2>
                11 PHỤ ÂM BỔ SUNG
              </h2>

              <p>
                Các phụ âm được biến đổi giọng
                bằng dấu bổ sung.
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

            {filteredAdditionalConsonants.map(
              (item) => (
                <button
                  type="button"
                  key={item.stt}
                  className="consonant-card"
                  onClick={() =>
                    openAdditionalConsonant(
                      item
                    )
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
              📌 Ghi chú phụ âm bổ sung
            </h3>

            <p>
              <strong>
                Dấu " / ៉:
              </strong>{" "}
              Có thể dùng để biến phụ âm
              giọng Ô thành giọng O.
            </p>

            <p>
              <strong>
                Dấu ៊:
              </strong>{" "}
              Có thể dùng để biến phụ âm
              giọng O thành giọng Ô.
            </p>

            <p>
              <strong>
                Ví dụ:
              </strong>{" "}
              ប → ប៉ và ស → ស៊.
            </p>

            <p>
              <strong>
                Lưu ý:
              </strong>{" "}
              Một số trường hợp khi ghép với
              nguyên âm sẽ có quy tắc biến đổi
              dấu riêng.
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
                25 NGUYÊN ÂM KHMER
              </h2>

              <p>
                Cách đọc phụ thuộc vào nhóm giọng
                của phụ âm đi kèm.
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
                  Một số nguyên âm giữ nguyên
                  cách đọc giữa hai nhóm giọng.
                </p>
              </div>

            </div>
          </div>

        </section>
      )}

      {/* =================================================
          CHÂN CHỮ
      ================================================= */}

      {tab ===
        "subscript-consonants" && (
        <section>

          <div className="alphabet-toolbar">

            <div>
              <h2>
                33 CHÂN CHỮ / GỬI CHÂN
              </h2>

              <p>
                Chân chữ được ghép bên dưới phụ âm
                chính để tạo thành cụm phụ âm Khmer.
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

            {filteredSubscriptConsonants.map(
              (item) => (
                <button
                  type="button"
                  key={`${item.stt}-${item.letter}`}
                  className="consonant-card"
                  onClick={() =>
                    openSubscriptConsonant(
                      item
                    )
                  }
                  aria-label={`Xem chi tiết chân chữ ${item.letter}`}
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
              📌 Quy tắc hòa giọng khi gửi chân
            </h3>

            <p>
              <strong>
                Giọng của chân chữ:
              </strong>{" "}
              Nguyên âm đi kèm sẽ được đọc theo
              giọng của chân chữ.
            </p>

            <p>
              <strong>
                Chân O:
              </strong>{" "}
              Nguyên âm đọc theo Giọng O.
            </p>

            <p>
              <strong>
                Chân Ô:
              </strong>{" "}
              Nguyên âm đọc theo Giọng Ô.
            </p>

            <p>
              <strong>
                Lưu ý:
              </strong>{" "}
              Khi ghép thực tế, một số chân chữ
              có quy tắc hòa giọng đặc biệt.
            </p>

            <p>
              <strong>
                Đặc biệt:
              </strong>{" "}
              Phụ âm ឡ (Lo) không có chân chữ
              tương ứng.
            </p>

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

            {(selectedType ===
              "consonant" ||
              selectedType ===
                "additional-consonant" ||
              selectedType ===
                "subscript-consonant") && (

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

                  <div className="alphabet-detail-card detail-card-normal">

                    <div className="alphabet-detail-card-title">

                      <span className="detail-icon">
                        ✍️
                      </span>

                      <span>
                        {selectedType ===
                        "subscript-consonant"
                          ? "Chân chữ"
                          : "Chữ thường"}
                      </span>

                    </div>

                    <div className="alphabet-detail-card-value normal-khmer-value">
                      {selected.letter}
                    </div>

                  </div>

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

                <div className="modal-audio-divider">
                  - - - - - - 🔊 Giọng đọc - - - - - -
                </div>

                <div className="modal-audio-area">

                  <button
                    type="button"
                    className={
                      (
                        selectedType ===
                          "consonant" &&
                        isConsonantPlaying
                      ) ||
                      (
                        selectedType ===
                          "additional-consonant" &&
                        isAdditionalConsonantPlaying
                      ) ||
                      (
                        selectedType ===
                          "subscript-consonant" &&
                        isSubscriptConsonantPlaying
                      )
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
                        "2px solid transparent",
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
                        (
                          selectedType ===
                            "consonant" &&
                          isConsonantPlaying
                        ) ||
                        (
                          selectedType ===
                            "additional-consonant" &&
                          isAdditionalConsonantPlaying
                        ) ||
                        (
                          selectedType ===
                            "subscript-consonant" &&
                          isSubscriptConsonantPlaying
                        )
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
                    onClick={() => {

                      if (
                        selectedType ===
                        "consonant"
                      ) {
                        toggleConsonantAudio();
                      }

                      if (
                        selectedType ===
                        "additional-consonant"
                      ) {
                        toggleAdditionalConsonantAudio();
                      }

                      if (
                        selectedType ===
                        "subscript-consonant"
                      ) {
                        toggleSubscriptConsonantAudio();
                      }

                    }}
                    aria-label={
                      isAudioPlaying
                        ? "Tạm dừng"
                        : "Phát âm thanh"
                    }
                  >
                    {isAudioPlaying
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