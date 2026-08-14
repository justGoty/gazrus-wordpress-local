"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, useRef, useState } from "react";
import { categories } from "@/data/categories";

type CategoryHeroProps = {
  pageHeading: string;
};

export function CategoryHero({ pageHeading }: CategoryHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectPrevious = () => {
    setActiveIndex((current) => (current - 1 + categories.length) % categories.length);
  };

  const selectNext = () => {
    setActiveIndex((current) => (current + 1) % categories.length);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;

    event.preventDefault();
    const nextIndex = (index + direction + categories.length) % categories.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="hero" id="top" aria-label="Основные направления каталога">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-image">
          <picture>
            <source media="(max-width: 760px)" srcSet="/images/hero-industrial-lab-mobile-v1.webp" />
            <img
              alt=""
              decoding="async"
              fetchPriority="high"
              src="/images/hero-industrial-lab-v1.webp"
            />
          </picture>
        </div>
        <div className="hero-shade" />
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <h1>{pageHeading}</h1>
          <div className="hero-slides" aria-live="polite">
            {categories.map((category, index) => (
              <article
                className="hero-copy"
                data-active={index === activeIndex}
                data-slide={category.id}
                aria-hidden={index !== activeIndex}
                aria-labelledby={`hero-tab-${category.id}`}
                id={`hero-panel-${category.id}`}
                role="tabpanel"
                key={category.id}
              >
                <h2>{category.title}</h2>
                <p className="hero-description">{category.description}</p>
                <p className="hero-focus">{category.focus}</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#selection">
                    Начать подбор
                    <ArrowRight aria-hidden="true" size={18} />
                  </a>
                  <Link className="button button-ghost" href={`/catalog/${category.id}`}>
                    Смотреть каталог
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-navigation">
          <div className="hero-tabs" role="tablist" aria-label="Выбор направления">
            {categories.map((category, index) => (
              <button
                role="tab"
                type="button"
                aria-selected={index === activeIndex}
                aria-controls={`hero-panel-${category.id}`}
                className={`hero-tab hero-tab-${category.accent}`}
                data-active={index === activeIndex}
                id={`hero-tab-${category.id}`}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(element) => { tabRefs.current[index] = element; }}
                tabIndex={index === activeIndex ? 0 : -1}
                key={category.id}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="hero-arrows" aria-label="Переключение направлений">
            <button className="icon-button icon-button-inverse" type="button" onClick={selectPrevious} title="Предыдущее направление">
              <ChevronLeft aria-hidden="true" size={21} />
              <span className="sr-only">Предыдущее направление</span>
            </button>
            <button className="icon-button icon-button-inverse" type="button" onClick={selectNext} title="Следующее направление">
              <ChevronRight aria-hidden="true" size={21} />
              <span className="sr-only">Следующее направление</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
