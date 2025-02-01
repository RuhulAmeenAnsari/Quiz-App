import { useState } from "react";
import "./App.css";
import Quiz from "./components/Quiz";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <>
      {!quizStarted ? (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <button
            onClick={handleStartQuiz}
            className="px-6 py-3 text-xl font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <Quiz />
      )}
    </>
  );
}

export default App;
