import create from "zustand";  
import { devtools } from "zustand/middleware";
import { saveDataToDb } from "../db/saveData";  
  
export const useMturkDataState = create(  
  devtools((set) => ({  
    assignmentId: "",  
    hitId: "",  
    turkSubmitTo: "",  
    workerId: "",  
    navigationData: [],  
    questionMetadata: [],  
    surveyResponses: [],  
    saveParams: (  
      assignmentId,  
      hitId,  
      turkSubmitTo,  
      workerId  
    ) => {  
      set(  
        (state) => ({  
          ...state,  
          assignmentId,  
          hitId,  
          turkSubmitTo,  
          workerId,  
        }),  
        false,  
        "saveParams"  
      );  
    },  
    setNavigationData: (navigationData) => {  
      set((state) => ({ ...state, navigationData }));  
    },  
    setQuestionMetadata: (questionMetadata) => {  
      set((state) => ({ ...state, questionMetadata }));  
    },  
    setSurveyResponses: (surveyResponses) => {  
      set((state) => ({ ...state, surveyResponses }));  
    },
    updateQuestionMetadata: (newData) =>  
      set((state) => {  
        const updatedQuestionMetadata = [...state.questionMetadata, newData];  
        saveDataToDb({  
          assignmentId: state.assignmentId,  
          hitId: state.hitId,  
          turkSubmitTo: state.turkSubmitTo,  
          workerId: state.workerId,  
          tasks: updatedQuestionMetadata,  
        });  
        return {  
          ...state,  
          questionMetadata: updatedQuestionMetadata,  
        };  
      }),  
    updateNavigationData: (newData) =>  
      set((state) => {  
        const updatedNavigationData = [...state.navigationData, newData];  
        saveDataToDb({  
          assignmentId: state.assignmentId,  
          hitId: state.hitId,  
          turkSubmitTo: state.turkSubmitTo,  
          workerId: state.workerId,  
          tasks: updatedNavigationData,  
        });  
        return {  
          ...state,  
          navigationData: updatedNavigationData,  
        };  
      }),  
 
  })),  
  { name: "MturkDataState" }  
);  
