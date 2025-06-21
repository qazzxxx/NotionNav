import { useState } from "react";
import { HITOKOTO_API } from "@/config/constants";

interface HitokotoData {
  hitokoto: string;
  from: string;
}

export const useHitokoto = () => {
  const [data, setData] = useState<HitokotoData>({
    hitokoto: "",
    from: "",
  });

  const fetchHitokoto = async () => {
    try {
      const response = await fetch(HITOKOTO_API);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("获取一言失败:", error);
      setData({
        hitokoto: "加载失败",
        from: "系统",
      });
    }
  };

  return { data, fetchHitokoto };
};
