"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/gm-admin", label: "Dashboard" },
  { href: "/gm-admin/menu", label: "Menu items" },
  { href: "/gm-admin/featured", label: "Homepage" },
  { href: "/gm-admin/categories", label: "Categories" },
  { href: "/gm-admin/specials", label: "Specials" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <ul className="flex min-w-max gap-1.5 md:min-w-0">
        {NAV.map((n) => {
          // /gm-admin is only active on an exact match; the rest own their subtree.
          const active = n.href === "/gm-admin" ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-navy text-white shadow-sm shadow-navy/20"
                    : "text-navy/65 hover:bg-white hover:text-navy"
                }`}
              >
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
