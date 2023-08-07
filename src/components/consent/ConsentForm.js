import React, { useState } from 'react';  
import './ConsentForm.css';
import Footer from '../footer/Footer';  
  
const ConsentForm = ({ onConsent }) => {  
  const [consentGiven, setConsentGiven] = useState(false);  
  
  const handleSubmit = () => {  
    if (consentGiven) {  
      onConsent();  
    } else {  
      alert("Please give your consent to proceed.");  
    }  
  };  
  
  return (  
    <div class="position-relative">
      <div className='container-fluid'>
        <div className="consent-form">  
          <h1>Microsoft Research Project Participation Consent Form</h1>  
          
          <h2>INTRODUCTION</h2>
          <p>Thank you for taking the time to consider volunteering in a Microsoft Corporation research project. This form explains what would happen if you 
            join this research project. Please read it carefully and take as much time as you need. Email the study team to ask about anything that is not 
            clear. Participation in this study is voluntary and you may withdraw at any time.</p>
          
          <h2>TITLE OF RESEARCH PROJECT</h2>
          <p>Solving multiple choice word problems</p>
          
          <h2>PRINCIPAL INVESTIGATOR</h2>
          <p>Dan Goldstein</p>
          
          <h2>PURPOSE</h2>
          <p>The purpose of this project is to study how people solve multiple choice word problems commonly found on standardized tests. </p>
          
          <h2>PROCEDURES</h2>
          <p>During this project, you will be asked to try solving some multiple choice word problems in an online environment. We will record your answers. 
            Approximately 500 participants will be involved in this study. </p>
          
          <h2>PERSONAL INFORMATION</h2>
          <p><b>Personal information we collect.</b> Aside from your platform
                  specific ID (e.g., Mechanical Turk ID etc.), no personal information
                  will be collected during this study. Your platform specific ID can
                  only be linked to your name by the platform, not by researchers, and
                  the platform will not have access to your responses to this task. Your
                  ID number will not be shared outside of Microsoft Research and the
                  confines of this study without your permission, and will be promptly
                  deleted after compensation has been successfully provided (30 days or
                  less). De-identified data may be used for future research or given to
                  another investigator for future use without additional consent.</p>
          <p><b>How you can access and control your information.</b> Once your Mechanical Turk ID 
          is disassociated from your responses we may not be able to remove your data from the study without re-identifying you.
                  Microsoft Research is ultimately responsible for determining the
                  purposes and uses of data collected through this study.
                  For additional information or concerns about how Microsoft handles
                  your personal information, please see the{' '}
                  <a
                    href="https://privacy.microsoft.com/en-us/privacystatement"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Microsoft Privacy Statement{' '}
                  </a>
                  (
                  <a
                    href="https://privacy.microsoft.com/en-us/privacystatement"
                    rel="noreferrer"
                    target="_blank"
                  >
                    https://privacy.microsoft.com/en-us/privacystatement
                  </a>).</p>
        
          <h2>BENEFITS AND RISKS</h2>
          <p> <b>Benefits: </b> There are no direct benefits to you that might 
          reasonably be expected as a result of being in this study. The research 
          team expects to learn about solving mathematical word problems from the
          results of this research, as well as any public benefit that may come 
          from these research results being shared with the greater scientific community. </p>
          <p><b>Risk: </b> If you are unable to submit a HIT due to technical
                  difficulties on your end, there is a risk of loss of payment. To
                  mitigate, participants can reach out to the research team for input on
                  resolving any difficulties encountered.</p>
          
          <h2>PAYMENT FOR PARTICIPATION</h2>
          <p>You will receive compensation after completing the entire study based on the amount and type of questions you complete. 
            The amount you can expect to earn has been clearly communicated to you before the start of the study.</p>
          <p>Your data and/or samples may be used to make new products, tests or findings. These may have value and may be developed 
            and owned by Microsoft and/or others. If this happens, there are no plans to pay you.</p>
          
          <h2>CONTACT INFORMATION</h2>
          <p>Should you have any questions concerning this project, or if you are injured as a result of being in this study, please contact us at dgg@microsoft.com.
            Should you have any questions about your rights as a research subject, please contact Microsoft Research Ethics Program Feedback at MSRStudyfeedback@microsoft.com.</p>
          
          <h2>CONSENT</h2>
          By clicking “I agree” below, you confirm that the study was explained to you, you had a chance to ask questions before beginning the study, and all your questions 
          were answered satisfactorily. By clicking “I agree” below, you voluntarily consent to participate, and you do not give up any legal rights you have as a 
          study participant. <br></br>
          
          You will be provided a link to download this form. On behalf of Microsoft, we thank you for your contribution and look forward to your research session.
          <p></p>
          <b>If you agree to participate, please click the continue button below. If you don't, please close this HIT.</b>
          <br></br>
          <label>  
            <input  
              type="checkbox"  
              checked={consentGiven}  
              onChange={() => setConsentGiven(!consentGiven)}  
            />  
            <b>I agree to this consent form</b>  
          </label>  
          <button onClick={handleSubmit}>Submit</button>
          <Footer />  
        </div>  
      </div>
    </div>
  );  
};  
  
export default ConsentForm;  
