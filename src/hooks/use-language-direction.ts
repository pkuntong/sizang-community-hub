import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

// This hook helps handle RTL (Right-to-Left) text direction
export const useLanguageDirection = () => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  
  useEffect(() => {
    // Define languages that use RTL
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    
    // Check if current language is RTL
    const isRtl = rtlLanguages.includes(i18n.language);
    
    // Set direction
    setDirection(isRtl ? "rtl" : "ltr");
    
    // Set direction attribute on html element
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    
    // Add RTL class if needed for additional styling
    if (isRtl) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
    
    return () => {
      // Cleanup
      document.documentElement.removeAttribute("dir");
      document.documentElement.classList.remove("rtl");
    };
  }, [i18n.language]);
  
  return { direction, isRtl: direction === "rtl" };
};
