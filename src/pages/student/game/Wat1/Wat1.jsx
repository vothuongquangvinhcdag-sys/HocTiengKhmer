import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Wat1.css";

import Wat1Intro from "./Wat1Intro";
import ChallengeMenu from "./ChallengeMenu";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import FinalStage from "./FinalStage";
import ChallengeResult from "./ChallengeResult";

/* =========================================================
   WAT 1 — WAT ÁK-SÂ
   ĐẢO BẢNG CHỮ CÁI

   LUỒNG:

   INTRO
      ↓
   MENU
      ↓
   STAGE 1
      ↓ THẮNG
   STAGE 2
      ↓ THẮNG
   STAGE 3
      ↓ THẮNG
   FINAL
      ↓ THẮNG
   HOÀN THÀNH WAT 1

   QUY TẮC:

   - Stage 1 mở mặc định.
   - Thắng Stage 1 → mở Stage 2.
   - Thắng Stage 2 → mở Stage 3.
   - Thắng Stage 3 → mở Final.
   - Thắng Final → hoàn thành WAT 1.
   - Đã mở thì không khóa lại.
   - Đã hoàn thành thì có thể chơi lại.
   - Thua không làm mất unlock.
   - Tiến trình lưu riêng từng user.
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_PREFIX = "khmer_wat1_progress";


/* =========================================================
   CHALLENGE IDS
========================================================= */

const CHALLENGE_IDS = [
  "stage1",
  "stage2",
  "stage3",
  "final",
];


/* =========================================================
   INITIAL PROGRESS
========================================================= */

const createInitialProgress = () => ({
  stage1: {
    unlocked: true,
    completed: false,
  },

  stage2: {
    unlocked: false,
    completed: false,
  },

  stage3: {
    unlocked: false,
    completed: false,
  },

  final: {
    unlocked: false,
    completed: false,
  },

  wat1Completed: false,

  keyObtained: false,
});


/* =========================================================
   STORAGE KEY
========================================================= */

function getStorageKey(profile) {
  const userId =
    profile?.id ||
    profile?.user_id ||
    profile?.username ||
    profile?.email ||
    "guest";

  return `${STORAGE_PREFIX}_${String(userId)}`;
}


/* =========================================================
   NORMALIZE PROGRESS
========================================================= */

function normalizeProgress(savedProgress) {
  const initial = createInitialProgress();

  if (
    !savedProgress ||
    typeof savedProgress !== "object"
  ) {
    return initial;
  }

  const progress = {
    ...initial,

    ...savedProgress,

    stage1: {
      ...initial.stage1,
      ...(savedProgress.stage1 || {}),
    },

    stage2: {
      ...initial.stage2,
      ...(savedProgress.stage2 || {}),
    },

    stage3: {
      ...initial.stage3,
      ...(savedProgress.stage3 || {}),
    },

    final: {
      ...initial.final,
      ...(savedProgress.final || {}),
    },
  };


  /* =======================================================
     CHUẨN HÓA BOOLEAN
  ======================================================= */

  progress.stage1.unlocked =
    Boolean(progress.stage1.unlocked);

  progress.stage1.completed =
    Boolean(progress.stage1.completed);

  progress.stage2.unlocked =
    Boolean(progress.stage2.unlocked);

  progress.stage2.completed =
    Boolean(progress.stage2.completed);

  progress.stage3.unlocked =
    Boolean(progress.stage3.unlocked);

  progress.stage3.completed =
    Boolean(progress.stage3.completed);

  progress.final.unlocked =
    Boolean(progress.final.unlocked);

  progress.final.completed =
    Boolean(progress.final.completed);

  progress.wat1Completed =
    Boolean(progress.wat1Completed);

  progress.keyObtained =
    Boolean(progress.keyObtained);


  /* =======================================================
     STAGE 1
  ======================================================= */

  progress.stage1.unlocked = true;


  /* =======================================================
     STAGE 2
  ======================================================= */

  if (progress.stage1.completed) {
    progress.stage2.unlocked = true;
  }


  /* =======================================================
     STAGE 3
  ======================================================= */

  if (progress.stage2.completed) {
    progress.stage2.unlocked = true;
    progress.stage3.unlocked = true;
  }


  /* =======================================================
     FINAL
  ======================================================= */

  if (progress.stage3.completed) {
    progress.stage2.unlocked = true;
    progress.stage3.unlocked = true;
    progress.final.unlocked = true;
  }


  /* =======================================================
     WAT 1 COMPLETED
  ======================================================= */

  if (progress.final.completed) {
    progress.stage2.unlocked = true;
    progress.stage3.unlocked = true;
    progress.final.unlocked = true;

    progress.wat1Completed = true;
    progress.keyObtained = true;
  }


  return progress;
}


/* =========================================================
   LOAD PROGRESS
========================================================= */

function loadProgress(profile) {
  try {
    const key = getStorageKey(profile);

    const saved = localStorage.getItem(key);

    if (!saved) {
      return createInitialProgress();
    }

    const parsed = JSON.parse(saved);

    return normalizeProgress(parsed);

  } catch (error) {
    console.error(
      "WAT 1: Không thể đọc tiến trình:",
      error
    );

    return createInitialProgress();
  }
}


/* =========================================================
   SAVE PROGRESS
========================================================= */

function saveProgress(profile, progress) {
  try {
    const key = getStorageKey(profile);

    const normalized =
      normalizeProgress(progress);

    localStorage.setItem(
      key,
      JSON.stringify(normalized)
    );

    console.log(
      "WAT 1: Đã lưu progress:",
      normalized
    );

  } catch (error) {
    console.error(
      "WAT 1: Không thể lưu tiến trình:",
      error
    );
  }
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Wat1({
  profile,
  onBackToGame,
  navigate,
  onWat1Completed,
}) {

  /* =======================================================
     STORAGE KEY
  ======================================================= */

  const storageKey = useMemo(
    () => getStorageKey(profile),
    [
      profile?.id,
      profile?.user_id,
      profile?.username,
      profile?.email,
    ]
  );


  /* =======================================================
     SCREEN
  ======================================================= */

  const [screen, setScreen] =
    useState("intro");


  /* =======================================================
     PROGRESS
  ======================================================= */

  const [progress, setProgress] =
    useState(() =>
      loadProgress(profile)
    );


  /* =======================================================
     RESULT
  ======================================================= */

  const [result, setResult] =
    useState(null);


  /* =======================================================
     CURRENT CHALLENGE
  ======================================================= */

  const [
    currentChallenge,
    setCurrentChallenge,
  ] = useState(null);


  /* =======================================================
     LOAD USER PROGRESS
  ======================================================= */

  useEffect(() => {
    const nextProgress =
      loadProgress(profile);

    setProgress(nextProgress);

    setResult(null);

    setCurrentChallenge(null);

    setScreen("intro");

  }, [storageKey]);


  /* =======================================================
     AUTO SAVE
  ======================================================= */

  useEffect(() => {
    saveProgress(
      profile,
      progress
    );
  }, [
    storageKey,
    profile,
    progress,
  ]);


  /* =======================================================
     SYNC WAT 1 COMPLETION
  ======================================================= */

  useEffect(() => {
    if (
      progress.wat1Completed &&
      typeof onWat1Completed ===
        "function"
    ) {
      onWat1Completed(progress);
    }
  }, [
    progress.wat1Completed,
    onWat1Completed,
    progress,
  ]);


  /* =======================================================
     BACK TO GAME
  ======================================================= */

  const handleBackToGame =
    useCallback(() => {

      if (
        typeof onBackToGame ===
        "function"
      ) {
        onBackToGame();
        return;
      }

      if (
        typeof navigate ===
        "function"
      ) {
        navigate("/game");
        return;
      }

      if (
        typeof window !==
        "undefined"
      ) {
        window.history.back();
      }

    }, [
      onBackToGame,
      navigate,
    ]);


  /* =======================================================
     INTRO → MENU
  ======================================================= */

  const handleStartChallenges =
    useCallback(() => {

      const latestProgress =
        loadProgress(profile);

      setProgress(latestProgress);

      setResult(null);

      setCurrentChallenge(null);

      setScreen("menu");

    }, [
      profile,
    ]);


  /* =======================================================
     MENU → INTRO
  ======================================================= */

  const handleBackToIntro =
    useCallback(() => {

      setResult(null);

      setCurrentChallenge(null);

      setScreen("intro");

    }, []);


  /* =======================================================
     STAGE → MENU
  ======================================================= */

  const handleBackToMenu =
    useCallback(() => {

      const latestProgress =
        loadProgress(profile);

      setProgress(latestProgress);

      setResult(null);

      setCurrentChallenge(null);

      setScreen("menu");

    }, [
      profile,
    ]);


  /* =======================================================
     START CHALLENGE
  ======================================================= */

  const startChallenge =
    useCallback(
      (challengeId) => {

        if (
          !CHALLENGE_IDS.includes(
            challengeId
          )
        ) {
          console.warn(
            "WAT 1: Challenge không hợp lệ:",
            challengeId
          );

          return;
        }


        /* ===============================================
           LOAD PROGRESS MỚI NHẤT
        =============================================== */

        const latestProgress =
          loadProgress(profile);

        setProgress(latestProgress);


        /* ===============================================
           LẤY CHALLENGE
        =============================================== */

        const challenge =
          latestProgress[
            challengeId
          ];


        if (!challenge) {
          console.warn(
            "WAT 1: Không tìm thấy challenge:",
            challengeId
          );

          return;
        }


        /* ===============================================
           KIỂM TRA UNLOCK
        =============================================== */

        if (!challenge.unlocked) {
          console.warn(
            `WAT 1: ${challengeId} chưa được mở khóa.`,
            latestProgress
          );

          return;
        }


        /* ===============================================
           START
        =============================================== */

        setCurrentChallenge(
          challengeId
        );

        setResult(null);

        setScreen(
          challengeId
        );

      },
      [
        profile,
      ]
    );


  /* =======================================================
     HANDLE CHALLENGE RESULT
  ======================================================= */

  const handleChallengeResult =
    useCallback(
      (resultData = {}) => {

        const {
          challengeId,
          won,
          result: resultValue,
          score = 0,
          xp = 0,
          combo = 0,
          ...extra
        } = resultData;


        /* ===============================================
           VALIDATE CHALLENGE
        =============================================== */

        if (!challengeId) {
          console.error(
            "WAT 1: Thiếu challengeId.",
            resultData
          );

          return;
        }


        if (
          !CHALLENGE_IDS.includes(
            challengeId
          )
        ) {
          console.error(
            "WAT 1: challengeId không hợp lệ:",
            challengeId
          );

          return;
        }


        /* ===============================================
           CHUẨN HÓA RESULT
        =============================================== */

        const hasWon =
          won === true ||
          won === "true" ||
          won === 1 ||
          resultValue === "win";


        /* ===============================================
           LOAD PROGRESS MỚI NHẤT
        =============================================== */

        const currentProgress =
          loadProgress(profile);


        /* ===============================================
           COPY PROGRESS
        =============================================== */

        const nextProgress = {
          ...currentProgress,

          stage1: {
            ...currentProgress.stage1,
          },

          stage2: {
            ...currentProgress.stage2,
          },

          stage3: {
            ...currentProgress.stage3,
          },

          final: {
            ...currentProgress.final,
          },
        };


        /* ===============================================
           THẮNG
        =============================================== */

        if (hasWon) {

          /* =============================================
             STAGE 1
          ============================================= */

          if (
            challengeId === "stage1"
          ) {

            nextProgress.stage1 = {
              ...nextProgress.stage1,

              unlocked: true,

              completed: true,
            };

            nextProgress.stage2 = {
              ...nextProgress.stage2,

              unlocked: true,
            };

            console.log(
              "WAT 1: STAGE 1 THẮNG → STAGE 2 MỞ"
            );
          }


          /* =============================================
             STAGE 2
          ============================================= */

          if (
            challengeId === "stage2"
          ) {

            nextProgress.stage2 = {
              ...nextProgress.stage2,

              unlocked: true,

              completed: true,
            };

            nextProgress.stage3 = {
              ...nextProgress.stage3,

              unlocked: true,
            };

            console.log(
              "WAT 1: STAGE 2 THẮNG → STAGE 3 MỞ"
            );
          }


          /* =============================================
             STAGE 3
          ============================================= */

          if (
            challengeId === "stage3"
          ) {

            nextProgress.stage3 = {
              ...nextProgress.stage3,

              unlocked: true,

              completed: true,
            };

            nextProgress.final = {
              ...nextProgress.final,

              unlocked: true,
            };

            console.log(
              "WAT 1: STAGE 3 THẮNG → FINAL MỞ"
            );
          }


          /* =============================================
             FINAL
          ============================================= */

          if (
            challengeId === "final"
          ) {

            nextProgress.final = {
              ...nextProgress.final,

              unlocked: true,

              completed: true,
            };

            nextProgress.wat1Completed =
              true;

            nextProgress.keyObtained =
              true;

            console.log(
              "WAT 1: FINAL THẮNG → WAT 1 HOÀN THÀNH"
            );

            console.log(
              "🔑 CHÌA KHÓA ÁK-SÂ ĐÃ NHẬN"
            );

            console.log(
              "🚪 WAT 2 ĐƯỢC MỞ KHÓA"
            );
          }
        }


        /* ===============================================
           NORMALIZE
        =============================================== */

        const finalProgress =
          normalizeProgress(
            nextProgress
          );


        /* ===============================================
           SAVE NGAY
        =============================================== */

        saveProgress(
          profile,
          finalProgress
        );


        /* ===============================================
           UPDATE STATE
        =============================================== */

        setProgress(
          finalProgress
        );


        /* ===============================================
           RESULT
        =============================================== */

        setResult({
          challengeId,

          won: hasWon,

          score:
            Number(score) || 0,

          xp:
            Number(xp) || 0,

          combo:
            Number(combo) || 0,

          ...extra,

        });


        setCurrentChallenge(
          challengeId
        );


        /* ===============================================
           RESULT SCREEN
        =============================================== */

        setScreen(
          "result"
        );


        /* ===============================================
           DEBUG
        =============================================== */

        console.log(
          "===================================="
        );

        console.log(
          "WAT 1 — CHALLENGE RESULT"
        );

        console.log(
          "Challenge:",
          challengeId
        );

        console.log(
          "Won:",
          hasWon
        );

        console.log(
          "Progress:",
          finalProgress
        );

        console.log(
          "===================================="
        );

      },
      [
        profile,
      ]
    );


  /* =======================================================
     RESULT → MENU
  ======================================================= */

  const handleContinueFromResult =
    useCallback(() => {

      const latestProgress =
        loadProgress(profile);

      setProgress(
        latestProgress
      );

      setResult(null);

      setCurrentChallenge(null);

      setScreen("menu");

    }, [
      profile,
    ]);


  /* =======================================================
     RESULT → MENU / RETRY
  ======================================================= */

  const handleRetryFromResult =
    useCallback(() => {

      const latestProgress =
        loadProgress(profile);

      setProgress(
        latestProgress
      );

      setResult(null);

      setCurrentChallenge(null);

      setScreen("menu");

    }, [
      profile,
    ]);


  /* =======================================================
     INTRO
  ======================================================= */

  if (screen === "intro") {
    return (
      <Wat1Intro
        profile={profile}

        onBackToGame={
          handleBackToGame
        }

        onStartChallenges={
          handleStartChallenges
        }
      />
    );
  }


  /* =======================================================
     MENU
  ======================================================= */

  if (screen === "menu") {
    return (
      <ChallengeMenu
        progress={progress}

        profile={profile}

        onBackToIntro={
          handleBackToIntro
        }

        onBackToGame={
          handleBackToGame
        }

        onStartChallenge={
          startChallenge
        }
      />
    );
  }


  /* =======================================================
     STAGE 1
  ======================================================= */

  if (screen === "stage1") {
    return (
      <Stage1
        profile={profile}

        onBackToMenu={
          handleBackToMenu
        }

        onComplete={
          (resultData = {}) =>
            handleChallengeResult({
              challengeId: "stage1",
              ...resultData,
            })
        }
      />
    );
  }


  /* =======================================================
     STAGE 2
  ======================================================= */

  if (screen === "stage2") {
    return (
      <Stage2
        profile={profile}

        onBackToMenu={
          handleBackToMenu
        }

        onComplete={
          (resultData = {}) =>
            handleChallengeResult({
              challengeId: "stage2",
              ...resultData,
            })
        }
      />
    );
  }


  /* =======================================================
     STAGE 3
  ======================================================= */

  if (screen === "stage3") {
    return (
      <Stage3
        profile={profile}

        onBackToMenu={
          handleBackToMenu
        }

        onComplete={
          (resultData = {}) =>
            handleChallengeResult({
              challengeId: "stage3",
              ...resultData,
            })
        }
      />
    );
  }


  /* =======================================================
     FINAL
  ======================================================= */

  if (screen === "final") {
    return (
      <FinalStage
        profile={profile}

        onBackToMenu={
          handleBackToMenu
        }

        onComplete={
          (resultData = {}) =>
            handleChallengeResult({
              challengeId: "final",
              ...resultData,
            })
        }
      />
    );
  }


  /* =======================================================
     RESULT
  ======================================================= */

  if (screen === "result") {

    if (!result) {
      return (
        <ChallengeMenu
          progress={progress}

          profile={profile}

          onBackToIntro={
            handleBackToIntro
          }

          onBackToGame={
            handleBackToGame
          }

          onStartChallenge={
            startChallenge
          }
        />
      );
    }

    return (
      <ChallengeResult
        result={result}

        progress={progress}

        onContinue={
          handleContinueFromResult
        }

        onBackToMenu={
          handleRetryFromResult
        }
      />
    );
  }


  /* =======================================================
     FALLBACK
  ======================================================= */

  return (
    <Wat1Intro
      profile={profile}

      onBackToGame={
        handleBackToGame
      }

      onStartChallenges={
        handleStartChallenges
      }
    />
  );
}