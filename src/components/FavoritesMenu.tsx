import { NavMenuItem } from "@/types";
import { Avatar } from "./Avatar";

interface FavoritesMenuProps {
  userRole: string;
  isLan: boolean;
  favorites: NavMenuItem[];
  removeFavorite: (href: string) => void;
}

export const FavoritesMenu = ({
  userRole,
  isLan,
  favorites,
  removeFavorite,
}: FavoritesMenuProps) => {
  // 过滤用户有权限访问的收藏
  const userFavorites = favorites.filter(
    (item) =>
      item.roles?.includes(userRole) || !item.roles || item.roles.length === 0
  );

  if (userFavorites.length === 0) {
    return null;
  }

  const handleRemoveFavorite = (href: string) => {
    removeFavorite(href);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          常用
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {userFavorites.map((item) => {
          const url = isLan ? item.lanHref || item.href : item.href;

          return (
            <div
              key={item.href}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-white/20"
            >
              {/* 移除按钮 - 优化样式 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(item.href);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white/80 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-medium shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/40"
                title="移除收藏"
              >
                ×
              </button>

              {/* 菜单项内容 */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center"
              >
                <div className="flex flex-col items-center space-y-2">
                  {/* 图标 */}
                  <div className="relative">
                    <Avatar
                      src={item.avatar}
                      alt={item.title}
                      href={item.href}
                      size={32}
                      className="rounded-lg"
                    />
                  </div>

                  {/* 标题 */}
                  <div className="text-center">
                    <div className="text-white text-sm font-medium truncate">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-gray-400 text-xs truncate mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
