"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Store,
  QrCode,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/restaurants", label: "Restaurantes", icon: Store },
  { href: "/admin/stands", label: "Stands", icon: QrCode },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-surface-alt border-r border-line flex md:flex-col">
      <div className="px-5 py-5 hidden md:flex items-center gap-2.5">
        <Image src="/icon.png" alt="Taply" width={30} height={30} className="shrink-0" />
        <div className="leading-tight">
          <p className="font-semibold text-ink tracking-tight text-sm">TAPLY</p>
          <p className="text-[11px] text-ink-muted">Panel administrativo</p>
        </div>
      </div>

      <nav className="flex md:flex-col flex-1 px-2 md:px-3 gap-1 py-2 md:py-0">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-gradient-soft text-brand-700"
                  : "text-ink-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-brand-gradient hidden md:block" />
              )}
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 hidden md:block">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
