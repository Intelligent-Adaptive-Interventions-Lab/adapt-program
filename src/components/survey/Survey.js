import React, { useState } from 'react';  
import './Survey.css';  
import Footer from '../footer/Footer';  
import { useMturkDataState } from '../mturk/MturkDataState';  
  
const Survey = ({ onSubmit, combinedData }) => {  
  const [likertResponses, setLikertResponses] = useState({  
    question1: '',  
    question2: '',  
    question3: '',  
  });  
  
  const [openEndedResponses, setOpenEndedResponses] = useState({  
    question4: '',  
    question5: '',  
  });  
  
  const [question6Responses, setQuestion6Responses] = useState({  
    B: false,
    D: false,  
    E: false,  
    F: false,  
  });  
  
  const handleLikertChange = (event, question) => {  
    setLikertResponses({ ...likertResponses, [question]: event.target.value });  
  };  
  
  const handleOpenEndedChange = (event, question) => {  
    setOpenEndedResponses({  
      ...openEndedResponses,  
      [question]: event.target.value,  
    });  
  };  
  
  const {  
    assignmentId,  
    hitId,  
    turkSubmitTo,  
    workerId,  
    navigationData,  
    questionMetadata,  
    saveSurveyResponses,  
  } = useMturkDataState();  
  
  const handleSubmit = (event) => {  
    const allResponses = { ...likertResponses, ...openEndedResponses };  
    const allAnswered = Object.values(allResponses).every(  
      (response) => response !== ""  
    ) && Object.values(question6Responses).some((checked) => checked === true);      
    
    if (!allAnswered) {  
      alert('Please answer all the questions to proceed.');  
      event.preventDefault(); // Prevent form submission if not all questions are answered  
    } else {  
      const surveyQuestions = [  
        {  
          id: 'question1',  
          text: 'How difficult did you find the test question(s)?',  
        },  
        {  
          id: 'question2',  
          text: 'How many of the 2 test questions do you think you got right?',  
        },  
        {  
          id: 'question3',  
          text: 'How much did you learn from the practice problem(s)?',  
        },  
        {  
          id: 'question4',  
          text: 'What were the pros and cons for the answers you saw during the practice problem(s)?',  
        },  
        {  
          id: 'question5',  
          text: 'Did you have any technical issues during the HIT?',  
        },
        {  
          id: 'question6',  
          text: 'Which of the following appeared as answer choices in the experiment today (check all that apply)',  
        },  
      ];  
    
      const combinedData = surveyQuestions.map((question) => ({  
        ...question,  
        response:  
          question.id !== "question6"  
            ? allResponses[question.id]  
            : question6Responses,  
      }));      
    
      const data = {  
        assignmentId,  
        hitId,  
        workerId,  
        navigationData: navigationData,  
        questionMetadata: questionMetadata,  
        surveyResponses: combinedData,  
        ts_submitted_: new Date().toISOString(),  
      };  
    
      // Update the hidden input field with the latest data object  
      document.querySelector('input[name="data"]').value = JSON.stringify(data);  
    }  
  };    
  
  const data = {  
    assignmentId,  
    hitId,  
    workerId,  
    navigationData: navigationData,  
    questionMetadata: questionMetadata,  
    surveyResponses: combinedData,  
    ts_submitted_: new Date().toISOString(),  
  };  
  
  return (  
    <div className="survey-container">  
      <h2>Please answer the following questions. You must complete these and click submit below to complete the HIT and get paid.</h2>  
      <form  
        action={`${turkSubmitTo}/mturk/externalSubmit`}  
        method="POST"  
        onSubmit={handleSubmit}  
      >  
        {/* Hidden input fields for parameters */}  
        <input type="hidden" name="assignmentId" value={assignmentId} />  
        <input type="hidden" name="hitId" value={hitId} />  
        <input type="hidden" name="workerId" value={workerId} />  
        <input  
          type="hidden"  
          name="ts_submitted_"  
          value={new Date().toISOString()}  
        />  
        <input type="hidden" name="data" value={JSON.stringify(data)} />  
  
        {/* Survey input elements */}  
        <div>  
        <p>How difficult did you find the test questions?</p>  
        {['Very easy', 'Somewhat easy', 'Somewhat difficult', 'Very difficult'].map((option) => (  
          <label key={option}>  
            <input  
              type="radio"  
              name="difficulty"  
              value={option}  
              onChange={(e) => handleLikertChange(e, 'question1')}  
            />  
            {option}  
          </label>  
        ))}  
      </div>  
  
      <div>  
        <p>How many of the 2 test questions do you think you got right?</p>  
        {["0", "1", "2"].map((option) => (  
          <label key={option}>  
            <input  
              type="radio"  
              name="correct-questions"  
              value={option}  
              onChange={(e) => handleLikertChange(e, 'question2')}  
            />  
            {option}  
          </label>  
        ))}  
      </div>  
  
      <div>  
        <p>How much did you learn from the practice problems?</p>  
        {['Nothing', 'A little', 'A lot'].map((option) => (  
          <label key={option}>  
            <input  
              type="radio"  
              name="learned"  
              value={option}  
              onChange={(e) => handleLikertChange(e, 'question3')}  
            />  
            {option}  
          </label>  
        ))}  
      </div>
      <div>  
          <p>  
            Which of the following appeared as answer choices in the experiment today  
            (check all that apply)  
          </p>  
          {[   
            { id: "B", text: "30 acres" },   
            { id: "D", text: "8 ounces" },  
            { id: "E", text: "12 volts" },  
            { id: "F", text: "None of the above" },  
          ].map((option) => (  
            <label key={option.id}>  
              <input  
                type="checkbox"  
                name="question6"  
                value={option.id}  
                onChange={(e) =>  
                  setQuestion6Responses({  
                    ...question6Responses,  
                    [option.id]: e.target.checked,  
                  })  
                }  
              />  
              {option.text}  
            </label>  
          ))}  
        </div>  
      <div>  
        <p>What were the pros and cons for the answers you saw during the practice problems?</p>  
        <textarea  
          rows="4"  
          cols="50"  
          onChange={(e) => handleOpenEndedChange(e, 'question4')}  
        ></textarea>  
      </div>  
  
      <div>  
        <p>Did you have any technical issues during the HIT?</p>  
        <textarea  
          rows="4"  
          cols="50"  
          onChange={(e) => handleOpenEndedChange(e, 'question5')}  
        ></textarea>  
      </div>    
  
        <button type="submit">Submit</button>  
      </form>  
      <Footer />  
    </div>  
  );  
};  
  
export default Survey;  
