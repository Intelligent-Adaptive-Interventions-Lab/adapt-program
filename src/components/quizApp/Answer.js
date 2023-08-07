// Answer.js  
import React, { useState, useEffect, useRef } from 'react';  
import './Answer.css';
  
const Answer = ({ answer, showAnswerComponent, vanillaLLM, answerFeedbackType, showSolutionFirst, 
  answerData, quizPhase, containerDimensions, onAnswerComplete, submitted, currentQuestion, topBoxMessage, setSubmitDisabled }) => {
  const [currentText, setCurrentText] = useState('');  
  const [charIndex, setCharIndex] = useState(0);
  const displayAnswer = answerFeedbackType === "vanilla LLM" && vanillaLLM ? currentText : currentText;
  const [selectedOption, setSelectedOption] = useState("");  
  const [correctAnswer, setCorrectAnswer] = useState("");  
  // const [submitDisabled, setSubmitDisabled] = useState(true);  

  const currentCharIndex = useRef(0);

  const answerContainerRef = useRef();
  const bottomBoxRef = useRef();

  const isOldSchool = answerFeedbackType === "old school";  
  const showAnswerFirst = showSolutionFirst === "Yes";  
  const showTopBox = submitted || (showAnswerFirst && isOldSchool);
  const showBottomBox = !isOldSchool;
  
  useEffect(() => {  
    if (showAnswerComponent && quizPhase !== 'test') {  
      // Auto-scroll to the bottom  
      if (bottomBoxRef.current) {  
        bottomBoxRef.current.scrollTop = bottomBoxRef.current.scrollHeight;  
      }  
    
      // Scroll back to the top once the answer has fully rendered  
      if (currentText === answer) {  
        setTimeout(() => {  
          if (bottomBoxRef.current) {  
            bottomBoxRef.current.scrollTop = 0;  
          }  
        }, 1000); // Adjust this delay as needed  
      }  
    }  
  }, [currentText, showAnswerComponent, quizPhase, answer]);  
  
  useEffect(() => {
    if (showAnswerComponent && quizPhase !== "test") {  
    const typeAnswer = () => {  
      if (currentCharIndex.current < answer.length) {  
        let nextChar = answer[currentCharIndex.current];  
        let newText = currentText + nextChar;  
        currentCharIndex.current++;  
    
        // If the next character is '<', include the entire HTML tag
        if (nextChar === '<') {  
          let tag = '';  
          while (  
            nextChar !== '>' &&  
            currentCharIndex.current < answer.length  
          ) {  
            nextChar = answer[currentCharIndex.current];  
            tag += nextChar;  
            currentCharIndex.current++;  
          }  
          newText += tag;  
        }  
    
        setCurrentText(newText);
        setSubmitDisabled(true);  
      } else {
        setSubmitDisabled(false);
        if (typeof onAnswerComplete === 'function') {  
          onAnswerComplete(false);  
        }
      }  
    };  
    
    if (answer) {  
      if (currentCharIndex.current === 0) {  
        setCurrentText('');  
      }  
      const timeoutId = setTimeout(typeAnswer, 5);  
      return () => clearTimeout(timeoutId);  
    } else {  
      setCurrentText('');  
      currentCharIndex.current = 0;  
    }
    }  
  }, [answer, currentText, showAnswerComponent, quizPhase]);  
    
  useEffect(() => { 
    if (showAnswerComponent && quizPhase !== "test") { 
    setCurrentText('');  
    currentCharIndex.current = 0;
    }  
  }, [answer]);
  
  if (!showAnswerComponent || quizPhase === "test") {  
        return null;  
      }  
      return (  
        <div className="answer-container" ref={answerContainerRef} style={{ height: containerDimensions.height }}>  
          {showTopBox && (  
            <div  
              className="top-box fade-in"  
              dangerouslySetInnerHTML={{  
                __html: `<p>${topBoxMessage}</p>`,  
              }}  
          ></div>  
          )}    
          {showBottomBox && (  
            <>  
              <h3>Here's an AI-generated solution:</h3>  
              <div className="bottom-box" ref={bottomBoxRef}>  
                {currentText ? (  
                  <div className="answer-text" dangerouslySetInnerHTML={{ __html: currentText }}></div>  
                ) : (  
                  <div className="no-answer-text">No answer yet</div>  
                )}  
              </div>  
            </>  
          )}  
        </div>  
      );  
       
};  
  
export default Answer;  