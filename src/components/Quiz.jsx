import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(15);
  const [badge, setBadge] = useState('');

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      if (timer > 0) {
        const countdown = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(countdown);
      } else {
        handleNextClick();
      }
    }
  }, [timer, quizStarted, quizCompleted]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option.is_correct) {
      setIsAnswerCorrect(true);
      setScore(prevScore => prevScore + 1);
      if (score + 1 === 3) setBadge('Bronze');
      if (score + 1 === 5) setBadge('Silver');
      if (score + 1 === 7) setBadge('Gold');
    } else {
      setIsAnswerCorrect(false);
    }
  };

  const handleNextClick = () => {
    if (index < questions.length - 1) {
      setIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setTimer(15);
    } else {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const API = await axios.get("https://thingproxy.freeboard.io/fetch/https://api.jsonserve.com/Uw5CrX");
        const res = API.data;
        setQuestions(res.questions);
      } catch (error) {
        console.error("Error fetching the API:", error);
        setError("Failed to load questions. Please try again later.");
      }
    };

    fetchAPI();
  }, []);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimer(15);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white'>
      <div className='p-10 w-full max-w-2xl bg-black bg-opacity-70 rounded-3xl shadow-2xl text-center'>
        {!quizStarted ? (
          <>
            <h1 className='text-6xl font-bold mb-10 animate-pulse'>Quiz Game</h1>
            <button 
              onClick={startQuiz}
              className='px-8 py-4 bg-blue-500 hover:bg-blue-700 text-white rounded-xl text-2xl font-bold transition-transform transform hover:scale-110'
            >
              Start Quiz
            </button>
          </>
        ) : error ? (
          <div className='text-red-400'>
            <h1 className='text-4xl font-bold mb-4'>Error</h1>
            <p className='text-2xl'>{error}</p>
          </div>
        ) : quizCompleted ? (
          <div>
            <h1 className='text-4xl font-bold mb-4 animate-bounce'>Quiz Completed!</h1>
            <p className='text-3xl'>Your Score: <span className='font-extrabold text-green-400'>{score}</span> / {questions.length}</p>
            {badge && <p className='text-2xl mt-4'>You've earned a <span className='font-bold text-yellow-400'>{badge} Badge!</span></p>}
            <button 
              onClick={() => window.location.reload()}
              className='mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-xl transition-transform transform hover:scale-110'
            >
              Play Again
            </button>
          </div>
        ) : (
          questions.length > 0 ? (
            <div className='p-5 border-4 border-white rounded-2xl shadow-lg bg-gray-900 bg-opacity-80'>
              <h2 className='text-3xl font-semibold mb-6'>{questions[index].description}</h2>
              <div className='text-2xl font-bold mb-4'>Time Left: <span className='text-red-400'>{timer}s</span></div>
              <div className='w-full bg-gray-400 h-4 rounded-full mb-4'>
                <div 
                  className='bg-green-500 h-4 rounded-full transition-all duration-500' 
                  style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <ul className='space-y-4'>
                {questions[index].options.map((option) => (
                  <li
                    key={option.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer text-xl transition-all duration-300 transform hover:scale-105 ${
                      selectedOption
                        ? option.id === selectedOption.id
                          ? option.is_correct
                            ? 'bg-green-400 border-green-600'
                            : 'bg-red-400 border-red-600'
                          : option.is_correct
                            ? 'bg-green-400 border-green-600'
                            : 'bg-gray-500 border-gray-600'
                        : 'hover:bg-blue-400 border-white'
                    }`}
                    onClick={() => !selectedOption && handleOptionClick(option)}
                  >
                    {option.description}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleNextClick}
                disabled={!selectedOption}
                className={`mt-8 px-8 py-3 text-xl font-bold rounded-xl transition-transform transform ${
                  selectedOption
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-110'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          ) : (
            <h1 className='text-4xl animate-spin'>Loading...</h1>
          )
        )}
      </div>
    </div>
  );
}

export default Quiz;
