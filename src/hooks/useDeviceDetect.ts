import { useState } from "react";

export const useDeviceDetect = () => {
  const [isApple] = useState(true);

  // useEffect(() => {
  //   const isAppleDevice = () => {
  //     if (typeof window === "undefined") return true;
  //     const userAgent = navigator.userAgent.toLowerCase();
  //     return /(iphone|ipad|ipod)/i.test(userAgent);
  //   };
  //   setIsApple(isAppleDevice());
  // }, []);

  return isApple;
};
