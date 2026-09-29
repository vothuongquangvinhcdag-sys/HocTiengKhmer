import {
  useEffect,
  useState,
} from "react";

import StageResult from "../../components/StageResult";

import {
  isStageCompleted,
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import { stage3Data } from "./data/stage3Data";

import "../../shared/GameStage.css";
import "./Stage3.css";


const GAME_ID = 3;
const STAGE_ID = 3;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;


/* =========================================================
   SHUFFLE
========================================================= */

const shuffle = (
  items
) => {

  const copy =
    [...items];

  for (
    let i = copy.length - 1;
    i > 0;
    i -= 1
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j],
    ] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
};


/* =========================================================
   SOUND
========================================================= */

const playSound = (
  name
) => {

  try {

    const audio =
      new Audio(
        `/audio/games/${name}.mp3`
      );

    audio.currentTime = 0;
    audio.volume = 0.9;

    audio
      .play()
      .catch(() => {});

  } catch {
    /* Không làm game lỗi */
  }
};


/* =========================================================
   CREATE OPTIONS
========================================================= */

const createOptions = (
  correctRoman
) => {

  const romans = [
    ...new Set(
      stage3Data.map(
        (item) =>
          item.roman
      )
    ),
  ];


  const distractors =
    shuffle(
      romans.filter(
        (roman) =>
          roman !==
          correctRoman
      )
    ).slice(
      0,
      3
    );


  return shuffle([
    correctRoman,
    ...distractors,
  ]);
};


/* =========================================================
   CREATE QUESTION
========================================================= */

const createQuestion = (
  item
) => {

  return {

    sourceLetter:
      item.letter,

    khmer:
      item.letter,

    answer:
      item.roman,

    options:
      createOptions(
        item.roman
      ),
  };
};


/* =========================================================
   10 CÂU BAN ĐẦU
========================================================= */

const createQuestions = () => {

  return shuffle(
    stage3Data
  )
    .slice(
      0,
      Math.min(
        TOTAL_QUESTIONS,
        stage3Data.length
      )
    )
    .map(
      createQuestion
    );
};


/* =========================================================
   STAGE 3
========================================================= */

const Stage3 = ({
  navigate,
}) => {

  const stage2Completed =
    isStageCompleted(
      GAME_ID,
      2
    );


  const [
    questions,
    setQuestions,
  ] = useState(
    createQuestions
  );

  const [
    attemptsLeft,
    setAttemptsLeft,
  ] = useState(
    MAX_ATTEMPTS
  );

  const [
    score,
    setScore,
  ] = useState(0);

  const [
    combo,
    setCombo,
  ] = useState(0);

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    isFirstWin,
    setIsFirstWin,
  ] = useState(false);

  const [
    answerLocked,
    setAnswerLocked,
  ] = useState(false);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState(null);


  /* =======================================================
     START
  ======================================================= */

  useEffect(() => {

    if (!stage2Completed) {

      navigate(
        "/game/3"
      );

      return;
    }


    startStage(
      GAME_ID,
      STAGE_ID
    );

  }, [
    navigate,
    stage2Completed,
  ]);


  /* =======================================================
     WIN
  ======================================================= */

  const handleWin = (
    finalScore
  ) => {

    playSound(
      "stage-complete"
    );

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    const completed =
      completeStage(
        GAME_ID,
        STAGE_ID
      );

    setScore(
      finalScore
    );

    setIsFirstWin(
      completed.isFirstWin
    );

    setResult(
      "win"
    );
  };


  /* =======================================================
     LOSE
  ======================================================= */

  const handleLose = (
    finalScore
  ) => {

    playSound(
      "stage-fail"
    );

    recordStagePlay(
      GAME_ID,
      STAGE_ID
    );

    recordStageScore(
      GAME_ID,
      STAGE_ID,
      finalScore
    );

    setResult(
      "lose"
    );
  };


  /* =======================================================
     THAY CÂU HIỆN TẠI
  ======================================================= */

  const replaceCurrentQuestion =
    () => {

      const currentQuestion =
        questions[
          questionIndex
        ];


      const usedLetters =
        questions.map(
          (question) =>
            question.sourceLetter
        );


      let available =
        stage3Data.filter(
          (item) =>
            !usedLetters.includes(
              item.letter
            )
        );


      if (
        available.length === 0
      ) {

        available =
          stage3Data.filter(
            (item) =>
              item.letter !==
              currentQuestion
                ?.sourceLetter
          );
      }


      if (
        available.length === 0
      ) {
        return;
      }


      const item =
        shuffle(
          available
        )[0];


      const newQuestion =
        createQuestion(
          item
        );


      setQuestions(
        (current) => {

          const updated =
            [...current];

          updated[
            questionIndex
          ] =
            newQuestion;

          return updated;
        }
      );
    };


  /* =======================================================
     ANSWER
  ======================================================= */

  const handleAnswer = (
    option
  ) => {

    if (
      answerLocked ||
      result
    ) {
      return;
    }


    const question =
      questions[
        questionIndex
      ];

    if (!question) {
      return;
    }


    setAnswerLocked(
      true
    );

    setSelectedAnswer(
      option
    );


    const correct =
      option ===
      question.answer;


    /* =====================================================
       CORRECT
    ===================================================== */

    if (correct) {

      const nextCombo =
        combo + 1;

      const gainedScore =
        nextCombo *
        BASE_SCORE;

      const newScore =
        score +
        gainedScore;


      setCombo(
        nextCombo
      );

      setScore(
        newScore
      );


      playSound(
        "correct"
      );


      window.setTimeout(
        () => {

          if (
            questionIndex >=
            TOTAL_QUESTIONS - 1
          ) {

            handleWin(
              newScore
            );

            return;
          }


          setQuestionIndex(
            (current) =>
              current + 1
          );


          setSelectedAnswer(
            null
          );


          setAnswerLocked(
            false
          );

        },
        500
      );


      return;
    }


    /* =====================================================
       WRONG
    ===================================================== */

    playSound(
      "wrong"
    );

    setCombo(0);


    window.setTimeout(
      () => {

        const newAttemptsLeft =
          attemptsLeft - 1;


        setAttemptsLeft(
          newAttemptsLeft
        );


        if (
          newAttemptsLeft <= 0
        ) {

          handleLose(
            score
          );

          return;
        }


        /*
         * Sai không tăng số câu.
         * Chỉ thay câu hiện tại.
         */

        replaceCurrentQuestion();


        setSelectedAnswer(
          null
        );


        setAnswerLocked(
          false
        );

      },
      500
    );
  };


  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {

    setQuestions(
      createQuestions()
    );

    setAttemptsLeft(
      MAX_ATTEMPTS
    );

    setScore(0);

    setCombo(0);

    setQuestionIndex(0);

    setResult(null);

    setIsFirstWin(false);

    setAnswerLocked(false);

    setSelectedAnswer(null);


    startStage(
      GAME_ID,
      STAGE_ID
    );
  };


  if (!stage2Completed) {
    return null;
  }


  if (result) {

    return (

      <div className="game-stage-page game-stage-3">

        <main className="game-stage-content">

          <StageResult
            gameId={
              GAME_ID
            }

            result={
              result
            }

            stageId={
              STAGE_ID
            }

            isFirstWin={
              isFirstWin
            }

            onRetry={
              handleRetry
            }

            onContinue={() =>
              navigate(
                "/game/3/stage/4"
              )
            }

            onBack={() =>
              navigate(
                "/game/3"
              )
            }
          />

        </main>

      </div>
    );
  }


  const question =
    questions[
      questionIndex
    ];


  if (!question) {
    return null;
  }


  return (

    <div className="game-stage-page game-stage-3 game3-stage3">

      <header className="game-stage-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/game/3"
            )
          }
        >
          ← DANH SÁCH STAGE
        </button>

      </header>


      <main className="game-stage-content">

        <div className="game-stage-icon">
          🎮
        </div>

        <div className="game-stage-khmer">
          ហ្គេម ៣
        </div>

        <h1>
          STAGE 3
        </h1>

        <p>
          NHÌN CHỮ GHÉP CHÂN, CHỌN PHIÊN ÂM TƯƠNG ỨNG
        </p>


        <div className="stage-play-info">

          <strong>
            LƯỢT CHƠI CÒN LẠI:{" "}
            {attemptsLeft}/
            {MAX_ATTEMPTS}
          </strong>

          <span>
            CÂU{" "}
            {questionIndex + 1}
            {" / "}
            {TOTAL_QUESTIONS}
          </span>

          <span>
            ĐIỂM:{" "}
            {score}
          </span>

          <span>
            COMBO:{" "}
            {combo}
          </span>

        </div>


        <section
          className="stage-game-area"
          aria-label={
            `Câu hỏi ${
              questionIndex + 1
            }`
          }
        >

          <div className="stage-question">

            <span className="stage-question-label">
              HÃY CHỌN PHIÊN ÂM CỦA CHỮ GHÉP CHÂN
            </span>


            <div
              className="stage3-question-expression"
              lang="km"
            >

              <span className="stage-khmer-cluster">
                {question.khmer}
              </span>

            </div>

          </div>


          <div className="stage-options">

            {question.options.map(
              (
                option,
                index
              ) => (

                <button
                  type="button"

                  key={
                    `${option}-${index}`
                  }

                  className={`stage-option ${
                    selectedAnswer ===
                    option
                      ? `selected ${
                          option ===
                          question.answer
                            ? "correct"
                            : "wrong"
                        }`
                      : ""
                  }`}

                  disabled={
                    answerLocked
                  }

                  onClick={() =>
                    handleAnswer(
                      option
                    )
                  }
                >

                  <span className="stage3-option-roman">
                    {option}
                  </span>

                </button>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
};


export default Stage3;