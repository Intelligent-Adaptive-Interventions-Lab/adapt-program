import React, { useState, useContext, useEffect, useRef } from 'react';  
import SettingsContext from './SettingsContext';
import './Quiz.css';
import { useMturkDataState } from '../mturk/MturkDataState';
import PageVisibility from "react-page-visibility";
// import SnakeGame from 'react-snake-game';

import CodeEditorWindow from '../codeEditorCompiler/CodeEditorWindow';
import { languageOptions } from "../../constants/languageOptions";
import { defineTheme } from "../../lib/defineTheme";
import CustomInput from "../codeEditorCompiler/CustomInput";
import axios from "axios";
import OutputWindow from "../codeEditorCompiler/OutputWindow";
import OutputDetails from "../codeEditorCompiler/OutputDetails";



const Quiz = ({ questions, onShowAnswerClick, setShowAnswerComponent, setAnswerData, setQuizPhase, quizPhase, startReading, submitDisabled, 
	setStartReading, setCurrentPage, answerComplete, setQuizSubmitted, setSelectedOption, setCorrectAnswer, updateCurrentQuestion, setTopBoxMessage }) => {  
    function getCorrectAnswer(question) {  
		for (let answerOption of question.answerOptions) {  
		  if (answerOption.isCorrect) {  
			return answerOption.answerText;  
		  }  
		}  
	}

	const quizContainerRef = useRef();
    const { settings } = useContext(SettingsContext);
	const [selected, setSelected] = useState(null);  
	const [submitted, setSubmitted] = useState(false);
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [showNextButton, setShowNextButton] = useState(false);
	const [progress, setProgress] = useState(0);     
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [correctAnswerText, setCorrectAnswerText] = useState('');
	const [showHintPopup, setShowHintPopup] = useState(false);
	const [hintText, setHintText] = useState('');
    const [showAnswerClicked, setShowAnswerClicked] = useState(false);
    const [answer, setAnswer] = useState(null); 
    const [showWarning, setShowWarning] = useState(false);
    const [aiAnswerEnabled, setAiAnswerEnabled] = useState(false);
    const [trainingFinished, setTrainingFinished] = useState(false);
	const [readingTime, setReadingTime] = useState(true);
	const [progressPercentage, setProgressPercentage] = useState(0);
	const [readyForAnswer, setReadyForAnswer] = useState(false);
	const [showAnswerAfterReading, setShowAnswerAfterReading] = useState(false); 
	const [showTestButton, setShowTestButton] = useState(false);  
	const [roughWork, setRoughWork] = useState("");
	const [countdown, setCountdown] = useState(60);

	// states for code editor
	const [code, setCode] = useState('print("Hello world!")');
	const [language, setLanguage] = useState(languageOptions[0]);
	const [theme, setTheme] = useState("cobalt");

	// states for custom input
	const [customInput, setCustomInput] = useState("");

	// states for compilation of code in the code editor
	const [processing, setProcessing] = useState(null);
	const [outputDetails, setOutputDetails] = useState(null);

	// states for results and test cases
	const [outputResults, showOutputResults] = useState(true)
	const [testCases, showTestCases] = useState(false)

	const WRAPPER_STYLE = {
		margin : '30px auto',
		height : 400,
		width  : 700
	};
	
	const { updateQuestionMetadata } = useMturkDataState();
	const [questionLoadTime, setQuestionLoadTime] = useState(new Date().toISOString());	  
	const [hiddenTime, setHiddenTime] = useState(0);
	const [hiddenStartTime, setHiddenStartTime] = useState(null); 

	const startCountdown = () => {  
		const countdownInterval = setInterval(() => {  
		  setCountdown((prevCountdown) => prevCountdown - 1);  
		}, 1000);  
		
		setTimeout(() => {  
		  clearInterval(countdownInterval);  
		}, 60000);  
	  };	  

	const handleVisibilityChange = (isVisible) => {  
		if (!isVisible) {  
		  setHiddenStartTime(new Date().getTime());  
		} else {  
		  if (hiddenStartTime !== null) {  
			const currentTime = new Date().getTime();  
			setHiddenTime((prevHiddenTime) => prevHiddenTime + (currentTime - hiddenStartTime));  
			setHiddenStartTime(null);  
		  }  
		}  
	  };  			

	const storeQuestionMetadata = (selectedOption, correct) => {  
		updateQuestionMetadata({  
		  page: "question",  
		  phase: quizPhase,  
		  questionIndex: currentQuestion,  
		  questionText: questions[currentQuestion].questionText,  
		  questionType: questions[currentQuestion].type,  
		  selectedOption,  
		  correct,  
		  roughWork,
		  questionLoadTime,  
		  questionSubmitTime: new Date().toISOString(),
		  hid: hiddenTime > 0 ? "yes" : "no",
		  hidTime: Math.round(hiddenTime / 1000),  
		});  
	  };

	  useEffect(() => {  
		if (currentQuestion === questions.length && quizPhase === "train") {  
		  startCountdown();  
		}  
	  }, [currentQuestion, questions.length, quizPhase]);	  
	
	  useEffect(() => {  
        const handleKeyDown = (event) => {  
            if (!showTestButton && (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight")) {  
                event.preventDefault();  
            }  
        };  
        window.addEventListener("keydown", handleKeyDown);  
  
        return () => {  
            window.removeEventListener("keydown", handleKeyDown);  
        };  
    }, [showTestButton]); 
 
	useEffect(() => {    
		if (startReading && currentQuestion !== questions.length) {
			setReadingTime(true); 
			setProgressPercentage(0);    
			const progressInterval = setInterval(() => {    
				setProgressPercentage((prevProgress) => prevProgress + 5);    
			}, 1000);    
	  
			const timer = setTimeout(() => {    
				setReadingTime(false);    
				setStartReading(false);    
				clearInterval(progressInterval);    
				setReadyForAnswer(true);    
			}, 12000);    
	  
			return () => {    
				clearTimeout(timer);    
				clearInterval(progressInterval);    
			};    
		}    
	}, [    
		currentQuestion,    
		questions.length,    
		startReading,    
		setStartReading,     
	]);  
	
	useEffect(() => {  
		if (startReading) {  
		  setReadingTime(true);
		//   setShowWarning(true);  
		  const timer = setTimeout(() => {  
			setReadingTime(false);  
		  }, 12000); // 12 seconds  
		  return () => clearTimeout(timer);  
		}  
	  }, [startReading]);  
	
	useEffect(() => {  
		if (settings.showSolutionFirst === "Yes" && readyForAnswer && !submitted && !readingTime) {  
		  handleAskAIButtonClick();  
		}  
	  }, [settings.showSolutionFirst, readyForAnswer, submitted, readingTime]);
	
	useEffect(() => {  
		if (!readingTime && showAnswerAfterReading) {  
		  handleAskAIButtonClick();  
		  setShowAnswerAfterReading(false);  
		}  
	  }, [readingTime, showAnswerAfterReading]);
	
	useEffect(() => {  
		if (currentQuestion === questions.length && quizPhase === "train") {  
			const timer = setTimeout(() => {  
				setShowTestButton(true);  
			}, 60000); // Show button after 60 seconds  
	
			return () => clearTimeout(timer);  
		}  
	}, [currentQuestion, questions.length, quizPhase]);  

	// set the theme of codeEditor
	useEffect(() => {
		defineTheme("cobalt").then((_) =>
		  setTheme({ value: "cobalt", label: "Cobalt" })
		);
	  }, []);
	
	const handleAnswerButtonClick = (index) => {  
		if (readingTime) {  
		  setShowWarning(true);
		  return;  
		}
		setShowWarning(false);
		setSelected(index);  
	  };

    const onStartTest = () => {  
        setQuizPhase("test");  
        setCurrentQuestion(0);
		setQuestionLoadTime(new Date().toISOString());  
    };
	
	  const updateTopBoxMessage = () => {  
		if (questions[currentQuestion]) {  
		  const selectedOption = questions[currentQuestion].answerOptions[selected]?.answerText;  
		  const correctAnswer = getCorrectAnswer(questions[currentQuestion]);  
		  const isCorrect = selectedOption === correctAnswer;  
		  const icon = isCorrect  
			? '<span class="icon-checkmark">✅</span>' // checkmark  
			: '<span class="icon-cross">❌</span>'; // cross  
		
		  if (submitted) {  
			const userAnswerStyle = isCorrect ? 'font-weight: bold;' : 'font-weight: bold;';  
			const correctAnswerStyle = 'font-weight: bold;';  
			const message = `${icon} You chose <span style="${userAnswerStyle}">${selectedOption}</span>. ${  
			  isCorrect  
				? "That's correct."  
				: `That's incorrect. The correct answer is <span style="${correctAnswerStyle}">${correctAnswer}</span>.`  
			}`;  
		
			setTopBoxMessage(message);  
		  } else if (settings.showSolutionFirst) {  
			setTopBoxMessage(`The correct answer is <span style="font-weight: bold;">${correctAnswer}</span>.`);  
		  } else {  
			setTopBoxMessage('');  
		  }  
		}  
	  };  	  
	
	const handleAskAIButtonClick = () => {  
		if (settings.showSolutionFirst === "Yes" && readingTime) {  
		return;  
		}  
		setHintText('');  
		setShowAnswerClicked(true);
		if (quizPhase === "train") {  
			setShowAnswerComponent(true);
		} else if (quizPhase === "test") {
			setReadingTime(false);
		} 
		
		let displayAnswer = "";  
		if (settings.answerFeedbackType === "vanilla LLM" && questions[currentQuestion].vanillaLLM) {  
			displayAnswer = questions[currentQuestion].vanillaLLM;  
		} else if (settings.answerFeedbackType === "customized LLM") {
			displayAnswer = questions[currentQuestion].customizedLLM;
		} else {  
		const correctAnswer = questions[currentQuestion].answerOptions.find(  
			(option) => option.isCorrect === true  
		);  
		if (correctAnswer) {  
			displayAnswer = correctAnswer.answerText;  
		}  
		}
	  
		onShowAnswerClick(displayAnswer);  
	};  
	 
	const handleSubmitButtonClick = () => {  
		// if (selected === null) {  
		// setShowWarning(true); // TODO: remember to change this
		// return;  
		// }  
		setShowWarning(false);  
		setSubmitted(true);  
		setNextButtonDisabled(true); // Disable the next button  
		setProgress(0); // Reset progress  
		setQuizSubmitted(true);
		setSelectedOption(questions[currentQuestion].answerOptions[selected]?.answerText);  
  		setCorrectAnswer(getCorrectAnswer(questions[currentQuestion]));

		const selectedOption = questions[currentQuestion].answerOptions[selected].answerText;  
		const correct = isAnswerCorrect(selected);  
		storeQuestionMetadata(selectedOption, correct);
		
		if (settings.showSolutionFirst === "Yes" && !readyForAnswer) {  
		return;  
		}  
		
		if (quizPhase === "train") {  
			setShowAnswerComponent(true);
		}
		
		// Update the answer in the Answer component  
		let displayAnswer = "";  
		if (settings.answerFeedbackType === "vanilla LLM" && questions[currentQuestion].vanillaLLM) {  
		displayAnswer = questions[currentQuestion].vanillaLLM;  
		} else if (settings.answerFeedbackType === "customized LLM") {
			displayAnswer = questions[currentQuestion].customizedLLM;
		} else {  
		const correctAnswer = questions[currentQuestion].answerOptions.find(  
			(option) => option.isCorrect === true  
		);  
		if (correctAnswer) {  
			displayAnswer = correctAnswer.answerText;  
		}  
		}  
		onShowAnswerClick(displayAnswer);  
		
		const newAnswerData = {  
			vanillaLLM: questions[currentQuestion].vanillaLLM,  
			selectedOption: questions[currentQuestion].answerOptions[selected]?.answerText,  
			correctAnswer: getCorrectAnswer(questions[currentQuestion]),  
		  };  
		  setAnswerData(newAnswerData);  
		//   console.log("Updated answerData:", newAnswerData);
   
		if (quizPhase === "train") {  
			// Update progress every 100ms  
			const interval = setInterval(() => {  
			  setProgress((prevProgress) => prevProgress + 2);  
			}, 1);  
			
			// Clear interval and enable the next button after 5 seconds  
			setTimeout(() => {  
			  setNextButtonDisabled(false); // Enable the next button  
			  setShowNextButton(true); // Hide the next button initially  
			  clearInterval(interval); // Clear the progress interval  
			}, 50);  
		  } else {  
			handleNextButtonClick();  
		  }
		  
		  updateTopBoxMessage();
	};

	useEffect(() => {  
		updateTopBoxMessage();  
	  }, [currentQuestion, submitted]);
	
	useEffect(() => {  
		if (submitted && answerComplete) {  
		  const interval = setInterval(() => {  
			setProgress((prevProgress) => prevProgress + 2);  
		  }, 1);  
		
		  setTimeout(() => {  
			setNextButtonDisabled(false);  
			setShowNextButton(true);  
			clearInterval(interval);  
		  }, 50);  
		}  
	  }, [submitted, answerComplete]);
	
	  useEffect(() => {  
		updateCurrentQuestion(currentQuestion);  
	  }, [currentQuestion, updateCurrentQuestion]);	

	  useEffect(() => {  
		if (  
		  !(settings.showSolutionFirst === "Yes" && settings.answerFeedbackType === "old school")  
		) {  
		  setTopBoxMessage(''); // Reset topBoxMessage when currentQuestion changes  
		}  
	  }, [currentQuestion, settings.showSolutionFirst, settings.answerFeedbackType]);  
	  ;  	  

	// Handle next button click  
	const handleNextButtonClick = () => {  
		setSelected(null);  
		setSubmitted(false);  
		setCurrentQuestion(currentQuestion + 1);
		setShowNextButton(false);
		setProgress(0);
        setShowAnswerClicked(false);
        setShowAnswerComponent(false);
		setReadyForAnswer(false);
		setStartReading(true);
		setRoughWork("");
		setHiddenTime(0); // Reset hidden time 
		setQuestionLoadTime(new Date().toISOString()); // Update question load time
        if (currentQuestion + 1 === questions.length && quizPhase === "train") {  
                // onStartTest();
                // setCurrentQuestion(0);  
          } else if (currentQuestion + 1 < questions.length) {  
            setCurrentQuestion(currentQuestion + 1);  
          }   
	  };


	// handle the change in cod editor  
	const onChange = (action, data) => {
		switch (action) {
			case "code": {
				setCode(data);
				break;
		  	}
		  	default: {
				console.warn("case not handled!", action, data);
		  	}
		}
	};

	// handle the compilation of the code in the code editor
	const handleCompile = () => {
		setProcessing(true);
		const formData = {
		  	language_id: language.id,
		  	// encode source code in base64
		  	source_code: btoa(code),
		  	stdin: btoa(customInput),
		};
		const options = {
		  	method: "POST",
		  	url: process.env.REACT_APP_RAPID_API_URL,
		  	params: { base64_encoded: "true", fields: "*" },
		  	headers: {
				"content-type": "application/json",
				"Content-Type": "application/json",
				"X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
				"X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
		  	},
		  	data: formData,
		};
	
		axios
			.request(options)
			.then(function (response) {
				console.log("res.data", response.data);
				const token = response.data.token;
				checkStatus(token);
			})
			.catch((err) => {
				let error = err.response ? err.response.data : err;
				// get error status
				let status = err.response.status;
				console.log("status", status);
				if (status === 429) {
					console.log("too many requests", status);
					document.getElementById('msgCompileSuccessOrFail').innerHTML = `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`;
				}
				setProcessing(false);
				console.log("catch block...", error);
			});
	};

	// check the compilation status from the compilation result
	const checkStatus = async (token) => {
		const options = {
			method: "GET",
			url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
			params: { base64_encoded: "true", fields: "*" },
			headers: {
				"X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
				"X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
		  	},
		};
		try {
			let response = await axios.request(options);
			let statusId = response.data.status?.id;
		
			// Processed - we have a result
			if (statusId === 1 || statusId === 2) {
				// still processing
				setTimeout(() => {
				checkStatus(token);
				}, 2000);
				return;
			} else {
				setProcessing(false);
				setOutputDetails(response.data);
				document.getElementById('msgCompileSuccessOrFail').innerHTML = `Compiled Successfully!`
				console.log("response.data", response.data);
				return;
			}
		} catch (err) {
			console.log("err", err);
			setProcessing(false);
			document.getElementById('msgCompileSuccessOrFail').innerHTML = `Compiling Failed!`;
		}
	};


	// Check if the answer is correct  
	const isAnswerCorrect = (index) => {  
		return questions[currentQuestion].answerOptions[index].isCorrect;  
	  };
    
    if (currentQuestion === questions.length && quizPhase === "train"){  
        return ( 
            <div> 
                <div className="training-finished"> 
                <h2>Congratulations! You have completed the practice problems.</h2>  
            	</div>
                {!showTestButton && (  
					<div className="tetris-container" style={WRAPPER_STYLE}>
						<h4>To give yourself a break before moving on to the test problems, you have 1 minute to play Snake.</h4>
						<h3>Remaining time : {countdown} seconds</h3>  
					</div>  
				)}  
				{showTestButton && (  
					<button onClick={onStartTest}>Continue to test problems</button>  
				)}     
            </div>  
          );
        } else if (currentQuestion === questions.length && quizPhase === "test") {
            return (
			<div className="test-finished">  
				<h2>Congratulations, you are almost done! Please click below for a short survey before completing the HIT.</h2>  
				<button onClick={() => setCurrentPage("survey")}>Continue to survey</button>  
			</div>
		  )
        }
    else {          
    return (
		<PageVisibility onChange={handleVisibilityChange}>
		{/* <div className='app'> */}

			<div className='row p-0'>
				<div className='col-6'>		
				<div className='d-flex flex-column'>		
					<div className='p-0'>
						{/* HINT: replace "false" with logic to display the  score when the user has answered all the questions */}
						{false ? (
							<div className='container p-0'>You scored 1 out of {questions.length}</div>
						) : (
							<div className='container p-0' ref={quizContainerRef}>
								<div className='container p-0'>
									<div className='container my-1 p-0'>
										<span>Question {currentQuestion+1}</span>/{questions.length}
									</div>
										<div className="container p-0">  
										{readingTime && (  
										<>  
										<div>Please start by reading the question.</div>  
										<div  
											className="container bg-white p-0"  
											style={{  
											visibility: readingTime ? "visible" : "hidden", 
											height: "10px"
											}}  
										>  
											<div  
											className="progress-bar"  
											style={{  
												width: `${progressPercentage}%`,  
												height: "5px",  
												background: "blue",  
											}}  
											></div>  
										</div>  
										</>  
									)}  
									</div>
									<div className='container my-1 p-0'>
										<p>Complete the following functions:</p>
									</div>
								</div>

								{!showNextButton && !submitted && !readingTime && (    
									<div className='submit-ask-ai'>    
										<button className='submit-button' onClick={handleSubmitButtonClick} disabled={submitDisabled}>Submit</button>    
									</div>     
									)}   

								{showWarning && (  
									<div className="warning-message">  
										{readingTime  
											? "Please finish reading the question."  
											: "Please select your answer before submitting."}  
									</div>  
								)} 
								{submitted && (  
								<>  
									{showNextButton ? (  
									<button  
										className='next-button'  
										onClick={handleNextButtonClick}
										disabled={submitDisabled}  
									>  
										Next Question  
									</button>  
									) : (  
										<div className='progress-bar-container'>  
										<div  
										className='progress-bar'  
										style={{ width: `${progress}%`, height: '5px', background: 'green' }}  
										></div>  
									</div>   
									)}  
								</>  
								)}
							</div>
						)}
					</div>
					<div className='pt-2'>
						<CodeEditorWindow
							code={code}
							onChange={onChange}
							language={language?.value}
							theme={theme.value}
						/>
						</div>
					<div className='p-0'>
						<button
							onClick={handleCompile}
							disabled={!code}
							class="mt-4 btn btn-light border border-gray p-2 fw-bold bg-white flex-shrink-0"
						>
						{processing ? "Processing..." : "Run"}
						</button>
					</div>

					<div className='pt-2'>
						<ul class="nav nav-tabs flex-column flex-sm-row">
							<li class="nav-item">
								<button 
									class="nav-link rounded-bottom-0 text-white"
									onClick={() => {
										showOutputResults(true);
										showTestCases(false)
									}}
								>
									Results
								</button>
							</li>
							<li class="nav-item">
								<button 
									class="nav-link rounded-bottom-0 text-white"
									onClick={() => {
										showOutputResults(false);
										showTestCases(true)
									}}
								>
									Test cases
								</button>
							</li>
						</ul>
						
					</div>

					{outputResults && <OutputWindow outputDetails={outputDetails} />}
					{testCases && 
					<div className='container p-0 m-0 col-12 border border-top-0 border-white bg-black rounded-bottom-2'>
						<br /><br /><br /><br />
					</div>}
					
				</div>
				</div>
				
				<div className='col-6'>   
					<div className='container text-white'>
						Area for solution
					</div>
				</div>
			</div>

	</PageVisibility>
		);
    }  
};

export default Quiz;



