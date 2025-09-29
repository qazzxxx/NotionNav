import { useEffect, useState, useRef } from 'react';
import LiquidGlassWrapper from './LiquidGlassWrapper';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  url,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理iframe加载状态
  const handleIframeLoad = () => {
    setLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 处理iframe加载错误
  const handleIframeError = () => {
    setLoadError(true);
    setLoading(false);
  };

  // 在新标签页中打开链接
  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  useEffect(() => {
    const scrollContainer = document.getElementById('main-content') || document.body;
    if (isOpen) {
      scrollContainer.style.overflow = 'hidden';
      setLoading(true);
      setLoadError(false);
      
      // 设置超时检测，如果5秒内iframe没有加载完成或报错，则认为可能被阻止
      timeoutRef.current = setTimeout(() => {
        // 检查iframe是否成功加载内容
        try {
          const iframe = iframeRef.current;
          if (iframe) {
            // 尝试访问iframe内容，如果被阻止会抛出错误
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc || iframeDoc.body.innerHTML === '') {
              setLoadError(true);
              setLoading(false);
            }
          }
        } catch (error) {
          // 访问被阻止，设置错误状态
          setLoadError(true);
          setLoading(false);
        }
      }, 5000);
    } else {
      scrollContainer.style.overflow = '';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    
    return () => {
      scrollContainer.style.overflow = '';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
        style={{position: "fixed", top: 0}}
      />
      
      {/* 嵌入层 */}
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
        <div className="w-[90vw] h-[85vh]">
          <div className="flex flex-col h-full rounded-xl overflow-hidden">
            {/* 顶部栏 */}
            <div className="flex justify-between items-center p-3 bg-black/30">
              <div className="flex items-center space-x-2 max-w-[80%]">
                <h2 className="text-lg font-semibold text-white truncate">{url}</h2>
                {loading && (
                  <div className="animate-spin h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={openInNewTab}
                  className="text-white/70 hover:text-white transition-colors"
                  title="在新标签页中打开"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors"
                  title="关闭"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* iframe内容 */}
            <div className="flex-1 bg-white relative">
              {loadError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">无法嵌入此网页</h3>
                  <p className="text-gray-600 mb-4">该网站可能禁止了在iframe中嵌入其内容</p>
                  <button
                    onClick={openInNewTab}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    在新标签页中打开
                  </button>
                </div>
              ) : (
                <iframe 
                  ref={iframeRef}
                  src={url} 
                  className="w-full h-full border-0" 
                  title="Embedded content"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              )}
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-gray-600">正在加载...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmbedModal;