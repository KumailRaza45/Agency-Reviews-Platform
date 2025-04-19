import React, { useState, useEffect } from 'react';

const HTMLRenderer = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchHTMLContent = async () => {
      try {
        const response = await fetch('/widgets.html');
        const content = await response.text();
        console.log('HTML Content:', content);
        setHtmlContent(content);
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    fetchHTMLContent();
  }, []);


  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default HTMLRenderer;
