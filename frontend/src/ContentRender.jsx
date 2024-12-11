import React, { useEffect, useState } from "react";

const ContentRenderer = ({ content }) => {

  useEffect(() => {
    if(typeof window?.MathJax !== "undefined"){
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [content]);

  return (
    // 렌더링된 콘텐츠
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default ContentRenderer;
