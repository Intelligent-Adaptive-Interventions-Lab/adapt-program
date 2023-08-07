import React, { useState, useEffect, useRef } from 'react';
import './CustomCaptcha.css';
import Footer from '../footer/Footer';  
  
const CustomCaptcha = ({ onCaptchaSuccess }) => {  
  const [captchaMessage, setCaptchaMessage] = useState("");  
  const [inputCaptcha, setInputCaptcha] = useState("");  
  const canvasRef = useRef(null);  
  
  useEffect(() => {  
    generateCaptchaCheck();  
  }, []);  
  
  const generateCaptchaCheck = () => {  
    let captcha_text = "";  
    const c_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";  
    for (let i = 1; i < 5; i++) {  
      captcha_text += c_chars.charAt(Math.random() * c_chars.length);  
    }  
    setCaptchaMessage(captcha_text);  
  };  
  
  const handleSubmit = () => {  
    if (inputCaptcha === "") {  
      alert("Please input something.");  
    } else if (inputCaptcha !== captchaMessage) {  
      alert("Check doesn't match. Please try again");  
      setInputCaptcha("");  
      generateCaptchaCheck();  
    } else {  
      onCaptchaSuccess();  
    }  
  };  
  
  useEffect(() => {  
    if (canvasRef.current) {  
      const canvas = canvasRef.current;  
      const ctx = canvas.getContext("2d");  
      if (ctx) {  
        ctx.clearRect(0, 0, canvas.width, canvas.height);  
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";  
        ctx.fillText(captchaMessage, 10, 50);  
        ctx.beginPath();  
        ctx.moveTo(0, 40);  
        ctx.lineTo(80, 40);  
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";  
        ctx.stroke();  
        ctx.beginPath();  
        ctx.moveTo(0, 40);  
        ctx.lineTo(80, 30);  
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";  
        ctx.stroke();  
      }  
    }  
  }, [captchaMessage]);  
  
  return (  
    <div className='container position-absolute top-50 start-50 translate-middle'>
      <div className="custom-captcha">  
        <h2>Input the code that appears in the box below:</h2>  
        <canvas ref={canvasRef} height="75" width="100" />  
        <div>  
          <input  
            type="text"  
            value={inputCaptcha}  
            onChange={(e) => setInputCaptcha(e.target.value)}  
          />  
        </div>  
        <button onClick={handleSubmit}>Submit</button>
        <Footer />  
      </div>  
    </div>
  );  
};  
  
export default CustomCaptcha;  
