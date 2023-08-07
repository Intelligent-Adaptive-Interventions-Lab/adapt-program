import React, { useState, useContext } from 'react';  
import Footer from '../footer/Footer';
import Control from '../quizApp/Control';
import SettingsContext from '../quizApp/SettingsContext';  
import './Introduction.css';
  
const Introduction = ({ onStartQuiz, preview, setStartReading }) => {  
  const [isReady, setIsReady] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);   
  
  const handleCheckboxChange = (event) => {  
    setIsReady(event.target.checked);  
  };  
  
  const handleSubmit = () => {  
    if (isReady) {  
      if (!preview) {  
        onStartQuiz();  
        setStartReading(true);  
      } else {  
        onStartQuiz();  
      }  
    } else {  
      alert("Please confirm your understanding of instructions to proceed.");  
    }  
  };  
  

  const handleSettingsChange = (newSettings) => {  
    setSettings(newSettings);  
  };  
  
  return (  
      <div className='container-fluid position-absolute top-50 start-50 translate-middle'>
        <div className="introduction-container">
          <SettingsContext.Provider value={{ settings, setSettings }}>    
            {preview && <Control onSettingsChange={handleSettingsChange}/>}
          </SettingsContext.Provider>  
          <h1>Introduction</h1>  
          <p>  
            In this HIT you will complete a sequence of 2 tasks, where each task  
            involves solving a multiple-choice word problem commonly found on  
            standardized tests. The HIT is divided into 2 rounds, practice and  
            test.  
          </p>  
          <p>  
            {' '}  
            In the practice round, you will be given 2 questions to practice on.  
            At the start of every question, you are assigned a “reading”  
            time (indicated by the blue progress bar), during which you are  
            expected to read the question.  
          </p>
          <p>After the practice round, you will answer similar questions in a 
            test round to see what you learned in the practice round.
          </p> 
          {/* Add your image here */}  
          {/* <img src={process.env.PUBLIC_URL + '/pictures/timer.png'} alt="picture showing timer and general interface for questions" /> */}
          <div>  
            {settings.showSolutionFirst === 'Yes' &&  
                settings.answerFeedbackType === 'old school' && 
                <div>
                    <h3>Before answering each problem in practice round, you will see the correct answer.</h3>
                </div>
            }  
            {settings.showSolutionFirst === 'No' &&  
                settings.answerFeedbackType === 'old school' && 
                <div>
                    <h3>After answering each problem in practice round, you will see the correct answer.</h3>
                </div>
            }  
            {settings.showSolutionFirst === 'Yes' &&  
                settings.answerFeedbackType !== 'old school' && 
                <div>
                    <h3>Before answering each problem in practice round, you will see the correct answer with an AI-generated explanation. </h3>
                </div>
            }  
            {settings.showSolutionFirst === 'No' &&  
                settings.answerFeedbackType !== 'old school' && 
                <div>
                    <h3>After answering each problem in practice round, you will see the correct answer with an AI-generated explanation.</h3>
                </div>
            }  
          </div>   
          <div> 
          <label htmlFor="ready-checkbox">  
            <input  
              type="checkbox"  
              id="ready-checkbox"  
              checked={isReady}  
              onChange={handleCheckboxChange}  
            />           
              <b>  
                I understand the instructions above and am ready to continue.  
              </b>  
            </label>  
          </div>  
          <button onClick={handleSubmit}>  
            Continue to practice problems 
          </button>  
          <Footer />  
        </div> 
      </div> 
  );  
};  
  
export default Introduction;  
