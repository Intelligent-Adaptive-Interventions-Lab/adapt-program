import React from 'react';  
import ReCAPTCHA from "react-google-recaptcha";  
  
const CaptchaPage = ({ onCaptchaSuccess }) => {  
  const handleCaptchaChange = (value) => {  
    if (value) {  
      onCaptchaSuccess();  
    }  
  };  
  
  return (  
    <div className="captcha-page">  
      <h2>Please complete the captcha to proceed:</h2>  
      <ReCAPTCHA sitekey="your-recaptcha-site-key" onChange={handleCaptchaChange} />  
    </div>  
  );  
};  
  
export default CaptchaPage;  
