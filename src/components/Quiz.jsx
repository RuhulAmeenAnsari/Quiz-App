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

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option.is_correct) {
      setIsAnswerCorrect(true);
      setScore(prevScore => prevScore + 1);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  const handleNextClick = () => {
    if (index < questions.length - 1) {
      setIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
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

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white'>
      <div className='p-10 w-full max-w-2xl bg-black bg-opacity-70 rounded-3xl shadow-2xl text-center'>
        <h1 className='text-6xl font-bold mb-10 animate-pulse'>Quiz Game</h1>

        {error ? (
          <div className='text-red-400'>
            <h1 className='text-4xl font-bold mb-4'>Error</h1>
            <p className='text-2xl'>{error}</p>
          </div>
        ) : quizCompleted ? (
          <div>
            <h1 className='text-4xl font-bold mb-4 animate-bounce'>Quiz Completed!</h1>
            <p className='text-3xl'>Your Score: <span className='font-extrabold text-green-400'>{score}</span> / {questions.length}</p>
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