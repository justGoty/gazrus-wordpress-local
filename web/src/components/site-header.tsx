"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/brand";

const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#selection", label: "Подбор" },
  { href: "/#documents", label: "Документы" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-link" href="/" aria-label="На главную">
          <Brand />
        </Link>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="icon-button header-search" href="/catalog" title="Поиск по каталогу">
            <Search aria-hidden="true" size={19} />
            <span className="sr-only">Поиск по каталогу</span>
          </Link>
          <a className="button button-primary header-quote" href="mailto:info@prscom.ru?subject=Запрос%20КП%20на%20газоанализатор">
            Запросить КП
          </a>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Мобильная навигация"
        data-open={open}
      >
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <a href="mailto:info@prscom.ru?subject=Запрос%20КП%20на%20газоанализатор">
          Запросить КП
        </a>
      </nav>
    </header>
  );
}
