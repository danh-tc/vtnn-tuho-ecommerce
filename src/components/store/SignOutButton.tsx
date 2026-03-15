"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      className="rethink-account__action-btn rethink-account__action-btn--danger"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut size={18} />
      Đăng xuất
    </button>
  );
}
