import { useState, useEffect } from "react";

interface WeatherData {
  code: string;
  now: {
    temp: string;
    text: string;
    icon: string;
    windDir: string;
    windScale: string;
    humidity: string;
  };
}

interface LocationData {
  code: string;
  location: Array<{
    id: string;
    name: string;
    adm2: string; // 城市
    adm1: string; // 省份
  }>;
}

const MAX_RETRIES = 1; // 最大重试次数

// 添加默认城市配置
const DEFAULT_LOCATION = {
  id: "101120911",
  name: "兰山",
  adm2: "临沂市",
  adm1: "山东省",
};

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData["now"] | null>(null);
  const [location, setLocation] = useState<LocationData["location"][0] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // 优化获取地理位置函数
  const getGeoLocation = async (
    retryCount = 0
  ): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("浏览器不支持地理位置"));
        return;
      }

      const options = {
        enableHighAccuracy: retryCount === 0, // 首次尝试高精度，重试时使用低精度
        timeout: 5000 + retryCount * 2000, // 重试时增加超时时间
        maximumAge: retryCount === 0 ? 30000 : 3600000, // 重试时放宽缓存时间
      };

      const handleSuccess = (position: GeolocationPosition) => {
        resolve(position);
      };

      const handleError = async (error: GeolocationPositionError) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "用户拒绝了位置请求权限";
            reject(new Error(errorMessage));
            break;
          case error.POSITION_UNAVAILABLE:
            if (retryCount < MAX_RETRIES) {
              console.warn(`位置获取失败，第 ${retryCount + 1} 次重试...`);
              try {
                // 递归重试
                const position = await getGeoLocation(retryCount + 1);
                resolve(position);
              } catch (retryError) {
                reject(retryError);
              }
            } else {
              errorMessage = "位置信息不可用，已达到最大重试次数";
              reject(new Error(errorMessage));
            }
            break;
          case error.TIMEOUT:
            errorMessage = "获取位置信息超时";
            reject(new Error(errorMessage));
            break;
          default:
            errorMessage = "获取位置信息失败";
            reject(new Error(errorMessage));
        }
      };

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    });
  };

  // 优化获取城市信息函数
  const getCityInfo = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://geoapi.qweather.com/v2/city/lookup?location=${longitude},${latitude}&key=8390c35ac5954999803052b9b55bc5ae`
      );
      const data: LocationData = await response.json();
      if (data.code === "200" && data.location?.length > 0) {
        setLocation(data.location[0]);
        return data.location[0].id;
      }
      throw new Error("未找到城市信息");
    } catch (error) {
      console.error("获取城市信息失败:", error);
      // 使用默认城市信息
      setLocation(DEFAULT_LOCATION);
      return DEFAULT_LOCATION.id;
    }
  };

  // 获取天气信息
  const fetchWeather = async (locationId: string) => {
    try {
      const response = await fetch(
        `https://jd33jh328f.re.qweatherapi.com/v7/weather/now?location=${locationId}&key=8390c35ac5954999803052b9b55bc5ae`
      );
      const data: WeatherData = await response.json();
      if (data.code === "200") {
        setWeather(data.now);
      }
    } catch (error) {
      console.error("获取天气失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initWeather = async () => {
      try {
        setLoading(true);
        let locationId: string;

        try {
          // 尝试获取位置
          const position = await getGeoLocation();
          locationId = await getCityInfo(
            position.coords.latitude,
            position.coords.longitude
          );
        } catch (locationError) {
          console.warn("定位失败，使用默认城市:", locationError);
          // 直接使用默认城市信息
          setLocation(DEFAULT_LOCATION);
          locationId = DEFAULT_LOCATION.id;
        }

        // 确保一定会获取天气信息
        if (!locationId) {
          locationId = DEFAULT_LOCATION.id;
          setLocation(DEFAULT_LOCATION);
        }

        await fetchWeather(locationId);
      } catch (error) {
        console.error("天气初始化失败:", error);
        // 即使初始化失败，也尝试获取默认城市天气
        if (!weather) {
          setLocation(DEFAULT_LOCATION);
          await fetchWeather(DEFAULT_LOCATION.id);
        }
      } finally {
        setLoading(false);
      }
    };

    initWeather();
    // 每30分钟更新一次
    const interval = setInterval(initWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
        className="rounded-2xl p-5 text-white"
      >
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-white/10 rounded w-24"></div>
          <div className="space-y-3">
            <div className="h-8 bg-white/10 rounded w-16"></div>
            <div className="h-4 bg-white/10 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather || !location) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(42, 42, 42, 0.42)" }}
      className="rounded-2xl p-5 text-white hover:bg-white/10 transition-all duration-300"
    >
      {/* 添加地区显示 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/50">
          {location.adm1} {location.adm2} {location.name}
        </span>
      </div>

      <div className="flex items-start space-x-6">
        {/* 左侧天气信息 */}
        <div className="flex flex-col items-center space-y-1">
          <i className={`qi-${weather.icon} text-5xl text-white/90`} />
          <span className="text-lg text-white/70">{weather.text}</span>
        </div>

        {/* 右侧详细信息 */}
        <div className="flex-1">
          <div className="text-4xl font-light mb-2">{weather.temp}°</div>
          <div className="space-y-1 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <span>
                <i className="qi-wind text-base" />
              </span>
              <span>{weather.windDir}</span>
              <span className="text-white/30">•</span>
              <span>{weather.windScale}级</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                <i className="qi-humidity text-base" />
              </span>
              <span>相对湿度 {weather.humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
