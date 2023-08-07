import React, { useState, useContext } from 'react';  
import './Control.css';
import SettingsContext from './SettingsContext';  

  
const Control = ({ onSettingsChange }) => {  
    const [showSolutionFirst, setShowSolutionFirst] = useState("No");  
    const [answerFeedbackType, setAnswerFeedbackType] = useState("old school");  
    const [systemPrompt, setSystemPrompt] = useState("");  
    const [isPersonalizedAdaptive, setIsPersonalizedAdaptive] = useState(false);  
    const { setSettings, setStartReading } = useContext(SettingsContext);
    // const {settings, setSettings} = useContext(SettingsContext);
    
    const handleSubmit = () => {  
        setSettings({  
          showSolutionFirst,  
          answerFeedbackType,  
          systemPrompt,  
          isPersonalizedAdaptive,  
        });

        if (onSettingsChange) {  
            onSettingsChange({  
              showSolutionFirst,  
              answerFeedbackType,  
            });
        }
        setStartReading(true);
      }; 
  
    return (  
        <div className="control-panel">  
            <div className="dropdowns">  
                <label htmlFor="show-solution-first">Show solution first:</label>  
                <select  
                    id="show-solution-first"  
                    value={showSolutionFirst}  
                    onChange={(e) => setShowSolutionFirst(e.target.value)}  
                >  
                    <option value="Yes">Yes</option>  
                    <option value="No">No</option>  
                </select>  
  
                <label htmlFor="answer-feedback-type">Answer/Feedback type:</label>  
                <select  
                    id="answer-feedback-type"  
                    value={answerFeedbackType}  
                    onChange={(e) => setAnswerFeedbackType(e.target.value)}  
                >  
                    <option value="old school">Old School</option>  
                    <option value="vanilla LLM">Vanilla LLM</option>  
                    <option value="customized LLM">Customized LLM</option>  
                </select>  
            </div>  
  
            {answerFeedbackType === "customized LLM" && (  
                <div className="customized-llm">  
                    <label htmlFor="system-prompt">System Prompt:</label>  
                    <textarea  
                        id="system-prompt"  
                        value={systemPrompt}  
                        onChange={(e) => setSystemPrompt(e.target.value)}  
                        rows="5" // Set the number of rows to make the textarea larger  
                        cols="50" // Set the number of columns to make the textarea larger  
                    />
  
                    <label htmlFor="personalized-adaptive">  
                        Personalized/Adaptive?  
                    </label>  
                    <input  
                        type="checkbox"  
                        id="personalized-adaptive"  
                        checked={isPersonalizedAdaptive}  
                        onChange={(e) => setIsPersonalizedAdaptive(e.target.checked)}  
                    />  
                </div>  
            )}  
  
            <button onClick={handleSubmit}>Submit</button>  
        </div>  
    );  
};


  
export default Control;  
