import { useState } from "react";
import { HITOKOTO_API } from "@/config/constants";

import { getNotionData } from "@/lib/notion/getNotionData";

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
      const notionresponse = await getNotionData();

      console.log("从 Notion 获取到的数据:", notionresponse);

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
