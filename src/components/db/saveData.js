// saveData.js  
import axios from "axios";  
  
export const saveDataToDb = async (data) => {  
  try {  
    // data.tasks = JSON.stringify(data.tasks);
    const url = `https://mturk-function-app-node.azurewebsites.net/api/mturk-insert-response`;  
    const response = await axios.post(url, data);  
    return response;  
  } catch (e) {  
    console.log(e);  
    return {  
      code: 500,  
      message: "Failed to save data to database",  
    };  
  }  
};  
