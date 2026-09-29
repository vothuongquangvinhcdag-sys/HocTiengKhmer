import {
  useEffect,
  useState,
} from "react";

import StageResult from "../../components/StageResult";

import {
  startStage,
  recordStagePlay,
  recordStageScore,
  completeStage,
} from "../../data/gameProgress";

import { stage1Data } from "./data/stage1Data";

import "../../shared/GameStage.css";
import "./Stage1.css";


const GAME_ID = 3;
const STAGE_ID = 1;

const MAX_ATTEMPTS = 3;
const TOTAL_QUESTIONS = 10;
const BASE_SCORE = 10;


const shuffle = (items) => {
  const copy = [...items];

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
   TẠO CÂU HỎI TỪ 1 CẶP
========================================================= */

const createQuestion = (
  pair
) => {

  const otherPool =
    stage1Data.filter(
      (item) =>
        item.base !== pair.base
    );

  const other =
    shuffle(
      otherPool
    )[0];

  const useAdditional =
    Math.random() < 0.5;

  const answer =
    useAdditional
      ? pair.added
      : pair.base;

  const roman =
    useAdditional
      ? pair.addedRoman
      : pair.baseRoman;


  const options =
    other
      ? shuffle([
          pair.base,
          pair.added,
          other.base,
          other.added,
        ])
      : shuffle([
          pair.base,
          pair.added,
        ]);


  return {
    sourceBase:
      pair.base,

    roman,

    answer,

    options,
  };
};


/* =========================================================
   10 CÂU BAN ĐẦU
========================================================= */

const createQuestions = () => {

  const selected =
    shuffle(
      stage1Data
    ).slice(
      0,
      Math.min(
        TOTAL_QUESTIONS,
        stage1Data.length
      )
    );

  return selected.map(
    createQuestion
  );
};


/* =========================================================
   STAGE 1
========================================================= */

const Stage1 = ({
  navigate,
}) => {

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

    startStage(
      GAME_ID,
      STAGE_ID
    );

  }, []);


  /* =======================================================
     THẮNG
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
     THUA
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

      const usedBases =
        questions.map(
          (question) =>
            question.sourceBase
        );

      let available =
        stage1Data.filter(
          (item) =>
            !usedBases.includes(
              item.base
            )
        );


      if (
        available.length === 0
      ) {
        available =
          stage1Data.filter(
            (item) =>
              item.base !==
              currentQuestion?.sourceBase
          );
      }


      if (
        available.length === 0
      ) {
        return;
      }


      const pair =
        shuffle(
          available
        )[0];


      const newQuestion =
        createQuestion(
          pair
        );


      setQuestions(
        (current) => {

          const updated =
            [...current];

          updated[
            questionIndex
          ] = newQuestion;

          return updated;
        }
      );
    };


  /* =======================================================
     TRẢ LỜI
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
       ĐÚNG
    ===================================================== */

    if (correct) {

      const nextCombo =
        combo + 1;

      const gainedScore =
        nextCombo *
        BASE_SCORE;

      const nextScore =
        score +
        gainedScore;


      setCombo(
        nextCombo
      );

      setScore(
        nextScore
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
              nextScore
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
       SAI
    ===================================================== */

    playSound(
      "wrong"
    );

    setCombo(0);


    window.setTimeout(
      () => {

        const nextAttempts =
          attemptsLeft - 1;


        setAttemptsLeft(
          nextAttempts
        );


        if (
          nextAttempts <= 0
        ) {

          handleLose(
            score
          );

          return;
        }


        /*
         * SAI:
         * - KHÔNG tăng questionIndex
         * - thay câu khác
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


  /* =======================================================
     RESULT
  ======================================================= */

  if (result) {

    return (

      <div className="game-stage-page game-stage-1">

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
                "/game/3/stage/2"
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

    <div className="game-stage-page game-stage-1 game3-stage1">

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
          STAGE 1
        </h1>

        <p>
          NHÌN PHIÊN ÂM, CHỌN PHỤ ÂM KHMER TƯƠNG ỨNG
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
              HÃY CHỌN CHỮ KHMER TƯƠNG ỨNG
            </span>

            <div className="game3-stage1-roman">
              {question.roman}
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

                  lang="km"

                  onClick={() =>
                    handleAnswer(
                      option
                    )
                  }
                >

                  <span className="stage1-option-character">
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


export default Stage1;