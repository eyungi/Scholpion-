import React, { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";

const ContentRenderer = ({ content }) => {
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    // 수식 변환 처리
    const mathElements = tempDiv.querySelectorAll("mathjax");
    mathElements.forEach((element) => {
      const formula = element.textContent.trim();
      element.innerHTML = `\\(${formula}\\)`; // MathJax가 처리 가능한 포맷으로 변환
    });

    setProcessedContent(tempDiv.innerHTML); // 가공된 HTML 저장
  }, [content]);

  useEffect(() => {
    // MathJax가 DOM에 대해 수식을 렌더링하도록 호출
    if (window.MathJax) {
      window.MathJax.typesetPromise();
    }
  }, [processedContent]);

  return (
    // 렌더링된 콘텐츠
    <div dangerouslySetInnerHTML={{ __html: processedContent }} />
  );
};

export default ContentRenderer;
