import React, { useState, useEffect } from "react";
import ApiClient from "../components/ApiClient";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useNavigate } from "react-router-dom";


const formatToLatex = (expression) => {
  if (typeof expression !== "string") return expression;

  return expression
    .replace(/\(\s*(sqrt\([^\)]+\))\s*\)\s*\/\s*(\d+)/g, "\\frac{$1}{$2}")
    .replace(/sqrt\(([^)]+)\)\s*\/\s*(\d+)/g, "\\frac{\\sqrt{$1}}{$2}")
    .replace(/undefined/g, "\\text{неопределено}")
    .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/(\d+)\s*\*\s*sp\.pi/g, "$1\\pi")
    .replace(/pi/g, "\\pi")
    .replace(/(\d+)\s*\*\s*π/g, "$1\\pi")
    .replace(/\((.*?)\/(.*?)\)/g, "\\frac{$1}{$2}")
    .replace(/\b(\d+)\/(\d+)\b/g, "\\frac{$1}{$2}")
    .replace(/(\d+)\s*\/\s*(\d+)\s*\*\s*π/g, "\\frac{$1\\pi}{$2}")
    .replace(/(\d+)\s*\*\s*\\pi/g, "$1\\pi");
};
const Home = () => {
  const [questionData, setQuestionData] = useState(null);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/register");
        return;
      }
  
      const response = await ApiClient.get("/api/get_question", {
        headers: {
          accept: "application/json",
          token: token,
        },
      });
      setQuestionData(response.data);
      setTimer(10);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/register");
      } else {
        console.error("Ошибка при получении вопроса:", error);
      }
    }
  };
  const handleAnswer = (answer) => {
    if (answer === questionData.correct_answer) {
      alert("Правильный ответ!");
    } else {
      alert("Неправильный ответ. Попробуйте снова!");
    }
    fetchQuestion();
  };

  useEffect(() => {
    fetchQuestion();

    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          fetchQuestion();
          return 10;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!questionData) return <p>Загрузка вопроса...</p>;

  return (
    <MathJaxContext>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Ответьте на вопрос</h2>
          <p className="text-xl mb-6">
            <MathJax>{`\\(${formatToLatex(questionData.question)}\\)`}</MathJax>
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {questionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                <MathJax>{`\\(${formatToLatex(option)}\\)`}</MathJax>
              </button>
            ))}
          </div>
          <p className="text-gray-500">Времени на ответ: {timer} секунд</p>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default Home;