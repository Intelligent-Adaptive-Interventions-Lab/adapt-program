import React from 'react';  
import './Footer.css';  
  
const Footer = () => {  
  return (  
    <footer className="footer">  
      <div className="container">  
        <p>  
          <a href="mailto:dgg@microsoft.com">Contact Us</a>  
          <span className="separator">|</span>  
          <a href="https://go.microsoft.com/fwlink/?LinkId=521839" target="_blank" rel="noreferrer">  
            Privacy & Cookies  
          </a>  
          <span className="separator">|</span>  
          <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx" target="_blank" rel="noreferrer">  
            Terms of Use  
          </a>  
          <span className="separator">|</span>  
          <a href="https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks" target="_blank" rel="noreferrer">  
            Trademarks  
          </a>  
          <span className="separator">|</span>© 2023 Microsoft  
        </p>  
      </div>  
    </footer>  
  );  
};  
  
export default Footer;  
