"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function FloatingAvatar() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击其他区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 阻止默认右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 shadow-lg transition-transform hover:scale-105 hover:bg-neutral-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50" ref={menuRef}>
      <Link
        href="/profile"
        onContextMenu={handleContextMenu}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 shadow-lg transition-transform hover:scale-105"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="text-lg font-medium text-neutral-600">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
      </Link>

      {/* 右键菜单 */}
      {showMenu && (
        <div className="absolute bottom-full left-0 mb-2 min-w-[120px] rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
          <div className="border-b border-neutral-100 px-4 pb-2">
            <p className="font-medium text-neutral-900">{user.username}</p>
            <p className="text-xs text-neutral-500">{user.role}</p>
          </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
