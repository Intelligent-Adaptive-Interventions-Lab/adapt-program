import React, { useState, useEffect, useRef } from 'react';
import Quiz from './components/quizApp/Quiz';  
import Control from './components/quizApp/Control'; 
import questionsData from './components/quizApp/questions.json';
import './App.css';
import SettingsContext from './components/quizApp/SettingsContext';
import Answer from './components/quizApp/Answer';
import './components/quizApp/Content.css';
import ConsentForm from './components/consent/ConsentForm';
import CustomCaptcha from './components/captcha/CustomCaptcha';
import Introduction from './components/intro/Introduction';
import Survey from './components/survey/Survey';
import { useMturkDataState } from './components/mturk/MturkDataState';

function shuffleTypes(types) {  
	for (let i = types.length - 1; i > 0; i--) {  
	  const j = Math.floor(Math.random() * (i + 1));  
	  [types[i], types[j]] = [types[j], types[i]];  
	}  
	return types;  
  }  

function shuffleSets(sets) {  
	for (let i = sets.length - 1; i > 0; i--) {  
	  const j = Math.floor(Math.random() * (i + 1));  
	  [sets[i], sets[j]] = [sets[j], sets[i]];  
	}  
	return sets;  
  } 

export default function App() {

	const [preview, setPreview] = useState(false);

	const { saveParams, updateQuestionMetadata, updateNavigationData} = useMturkDataState();
  
	const [surveyResponses, setSurveyResponses] = useState({});
	const [surveyData, setSurveyData] = useState({});
	
	const [settings, setSettings] = useState({  
		showSolutionFirst: "No",  
		answerFeedbackType: "old school",  
		systemPrompt: "",  
		isPersonalizedAdaptive: false,  
	  });
	
	const [containerDimensions, setContainerDimensions] = useState({  
		width: 0,  
		height: 0,  
	  });
	
	const contentContainerRef = useRef();    
	
	const [answer, setAnswer] = useState(null);
	const [showAnswerComponent, setShowAnswerComponent] = useState(false);
	const [answerData, setAnswerData] = useState({});
	const [quizPhase, setQuizPhase] = useState("train");  
	const [startReading, setStartReading] = useState(false);
	const [currentPage, setCurrentPage] = useState("captcha");
	const [quizSubmitted, setQuizSubmitted] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");  
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [currentQuestion, setCurrentQuestion] = useState(0); 
	const [submitDisabled, setSubmitDisabled] = useState(false);  
  
	const [acceptedHIT, setAcceptedHIT] = useState(false);

	const [shuffledQuestionTypes] = useState(() => shuffleTypes(["1", "2", "3", "4"]).slice(0, 2)); 
	
	const [setsOrder, setSetsOrder] = useState(() => shuffleSets(["set1", "set2"]));

	const firstSetQuestions = questionsData[setsOrder[0]]  
	.filter((question) => shuffledQuestionTypes.includes(question.type))
	.sort((a, b) => shuffledQuestionTypes.indexOf(a.type) - shuffledQuestionTypes.indexOf(b.type));  

	const secondSetQuestions = questionsData[setsOrder[1]]  
	.filter((question) => shuffledQuestionTypes.includes(question.type))
	.sort((a, b) => shuffledQuestionTypes.indexOf(a.type) - shuffledQuestionTypes.indexOf(b.type));  
 

	const questions = quizPhase === "train" ? firstSetQuestions : secondSetQuestions;  
	  
	const [answerComplete, setAnswerComplete] = useState(false);  
	const [topBoxMessage, setTopBoxMessage] = useState('');

	const getUrlParams = () => {  
		const urlParams = new URLSearchParams(window.location.search);  
		const showSolutionFirstParam = urlParams.get("showSolutionFirst");  
		const answerFeedbackTypeParam = urlParams.get("answerFeedbackType");  
		
		const showSolutionFirstValues = showSolutionFirstParam  
		  ? showSolutionFirstParam.split(",")  
		  : null;  
		const answerFeedbackTypeValues = answerFeedbackTypeParam  
		  ? answerFeedbackTypeParam.split(",")  
		  : null;  
		
		return {  
		  showSolutionFirst: showSolutionFirstValues,  
		  answerFeedbackType: answerFeedbackTypeValues,  
		};  
	  };	  
  
	const handlePageChange = async (pageName) => {  
		if (pageName === "quiz") {  
		  await updateNavigationData({  
			page: "arm-info",  
			showSolutionFirst: settings.showSolutionFirst,  
			answerFeedbackType: settings.answerFeedbackType,  
			timestamp: new Date().toISOString(),  
		  });
		  await updateNavigationData({
			page: "question-order",
			questionOrder: shuffledQuestionTypes,
		  })  
		}  
		
		await updateNavigationData({  
		  page: pageName,  
		  timestamp: new Date().toISOString(),  
		});  
		
		setCurrentPage(pageName);  
	  };					  
	
	  const generateRandomSettings = () => {  
		const urlParams = getUrlParams();  
		
		const showSolutionFirstOptions = ["Yes", "No"];
		// const showSolutionFirstOptions = ["No"];   
		const answerFeedbackTypeOptions = [  
		  "old school",  
		  "vanilla LLM",  
		  "customized LLM",  
		];  
		
		const randomShowSolutionFirst =  
		  (urlParams.showSolutionFirst &&  
			urlParams.showSolutionFirst[  
			  Math.floor(Math.random() * urlParams.showSolutionFirst.length)  
			]) ||  
		  showSolutionFirstOptions[  
			Math.floor(Math.random() * showSolutionFirstOptions.length)  
		  ];  
		
		const randomAnswerFeedbackType =  
		  (urlParams.answerFeedbackType &&  
			urlParams.answerFeedbackType[  
			  Math.floor(Math.random() * urlParams.answerFeedbackType.length)  
			]) ||  
		  answerFeedbackTypeOptions[  
			Math.floor(Math.random() * answerFeedbackTypeOptions.length)  
		  ];  
		
		return {  
		  showSolutionFirst: randomShowSolutionFirst,  
		  answerFeedbackType: randomAnswerFeedbackType,  
		};  
	  };

	  useEffect(() => {  
		if (!preview) {  
		  setSettings(prevSettings => ({  
			...prevSettings,  
			...generateRandomSettings(),  
		  }));  
		}  
	  }, [preview]); 

	  useEffect(() => {  
		const urlParams = new URLSearchParams(window.location.search);  
		const assignmentId = urlParams.get("assignmentId") || "test";
		setAcceptedHIT(assignmentId !== "ASSIGNMENT_ID_NOT_AVAILABLE");  
		const hitId = urlParams.get("hitId") || "test";  
		const turkSubmitTo = urlParams.get("turkSubmitTo") || "test";  
		const workerId = urlParams.get("workerId") || "test" + Math.floor(Math.random() * 10000);  
		
		saveParams(assignmentId, hitId, turkSubmitTo, workerId);  
	  }, []); 
	
	  useEffect(() => {  
		if (contentContainerRef.current) {  
		  const { offsetWidth, offsetHeight } = contentContainerRef.current;  
		  setContainerDimensions({ width: offsetWidth, height: offsetHeight });  
		}  
	  }, [currentPage]);

	  return (  
		<SettingsContext.Provider value={{ settings, setSettings, setStartReading }}>  
		  {/* <div className='app'> */}
		  <div>
		  {!acceptedHIT ? (
			<div>In this study, you will be asked to answer multiple choice word problems 
				commonly found on standardized tests. We estimate this task will take around 13 minutes. 
				You must accept this HIT to continue.</div>
		  ) : (
			<> 
			{currentPage === "captcha" && (  
			  <CustomCaptcha onCaptchaSuccess={() => handlePageChange("consent")} />  
			)}  
			{currentPage === "consent" && (  
			  <ConsentForm onConsent={() => handlePageChange("introduction")} />  
			)}  
			{currentPage === 'introduction' && (  
			  <Introduction  
				onStartQuiz={() => handlePageChange('quiz')}  
				preview={preview}  
				setStartReading={setStartReading}  
			  />  
			)}  
			{currentPage === "quiz" && (  
			  <>  
				{preview && <Control />}  
				<div className="container-fluid px-2 py-2 m-0" ref={contentContainerRef}>  
				  <Quiz  
					questions={questions}  
					onShowAnswerClick={setAnswer}  
					setShowAnswerComponent={setShowAnswerComponent}  
					setAnswerData={setAnswerData}  
					setQuizPhase={setQuizPhase}  
					quizPhase={quizPhase}  
					startReading={startReading}  
					setStartReading={setStartReading}  
					setCurrentPage={handlePageChange}
					answerComplete={answerComplete}
					setQuizSubmitted={setQuizSubmitted}
					setSelectedOption={setSelectedOption}
					setCorrectAnswer={setCorrectAnswer}
					updateCurrentQuestion={setCurrentQuestion}
					setTopBoxMessage={setTopBoxMessage}
					submitDisabled={submitDisabled}  
				  />  
				  {/* <Answer  
					answer={answer}  
					showAnswerComponent={showAnswerComponent}  
					vanillaLLM={answerData.vanillaLLM}
					answerData={answerData}  
					answerFeedbackType={settings.answerFeedbackType}
					showSolutionFirst={settings.showSolutionFirst}  
					quizPhase={quizPhase}
					containerDimensions={containerDimensions}
					onAnswerComplete={setAnswerComplete}
					setSubmitDisabled={setSubmitDisabled}
					submitted={quizSubmitted}
					currentQuestion={currentQuestion}
					topBoxMessage={topBoxMessage}  
				  />   */}
				</div>  
			  </>  
			)}  
			{currentPage === 'survey' && (  
			  <Survey 
			  combinedData={surveyResponses} 
			  onSubmit={async (surveyQuestions, likertResponses, openEndedResponses) => {
				const surveyResponses = { ...likertResponses, ...openEndedResponses };  
				const combinedData = surveyQuestions.map((question) => ({  
					...question,  
					response: surveyResponses[question.id],  
				}));
				await setSurveyResponses(combinedData);  
				setCurrentPage("finished");  
				}}  
			/>  
			)}
			 {currentPage === "finished" && (  
					<div>  
					<h2>Thanks for completing this HIT. Your responses have been recorded. You may now close this window.</h2>  
					</div> 
			)}
			</>
		  )}
		  </div>  
		</SettingsContext.Provider>  
	  );  		 
}