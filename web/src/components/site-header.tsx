"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { QuoteRequestButton } from "@/components/quote-request";

const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/#selection", label: "Подбор" },
  { href: "/calculators/gas-converter", label: "Конвертер" },
  { href: "/docs", label: "Документы" },
  { href: "/contacts", label: "Контакты" },
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
          <a className="header-phone" href="tel:+74957486258" title="Позвонить: +7 (495) 748-62-58" aria-label="Позвонить: +7 (495) 748-62-58">
            <Phone aria-hidden="true" size={18} />
            <span>+7 (495) 748-62-58</span>
          </a>
          <QuoteRequestButton className="button button-primary header-quote" subject="Запрос КП на газоанализатор" source="Шапка сайта">
            Запросить КП
          </QuoteRequestButton>
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
        inert={!open}
      >
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <QuoteRequestButton className="mobile-nav-quote" subject="Запрос КП на газоанализатор" source="Мобильное меню" onOpen={() => setOpen(false)}>
          Запросить КП
        </QuoteRequestButton>
      </nav>
    </header>
  );
}
