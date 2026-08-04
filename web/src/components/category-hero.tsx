"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { categories } from "@/data/categories";

type CategoryHeroProps = {
  pageHeading: string;
};

export function CategoryHero({ pageHeading }: CategoryHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectPrevious = () => {
    setActiveIndex((current) => (current - 1 + categories.length) % categories.length);
  };

  const selectNext = () => {
    setActiveIndex((current) => (current + 1) % categories.length);
  };

  return (
    <section className="hero" id="top" aria-label="Основные направления каталога">
      <div className="hero-media" aria-hidden="true">
        {categories.map((category, index) => (
          <div
            className="hero-image"
            data-active={index === activeIndex}
            key={category.id}
          >
            <Image
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              src={category.image}
            />
          </div>
        ))}
        <div className="hero-shade" />
      </div>

      <div className="hero-inner">
        <h1 className="sr-only">{pageHeading}</h1>
        <div className="hero-slides" aria-live="polite">
          {categories.map((category, index) => (
            <article
              className="hero-copy"
              data-active={index === activeIndex}
              aria-hidden={index !== activeIndex}
              key={category.id}
            >
              <p className={`eyebrow eyebrow-${category.accent}`}>
                Каталог промышленного газового контроля
              </p>
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

        <div className="hero-navigation">
          <div className="hero-tabs" role="tablist" aria-label="Выбор направления">
            {categories.map((category, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={`hero-tab hero-tab-${category.accent}`}
                data-active={index === activeIndex}
                key={category.id}
                onClick={() => setActiveIndex(index)}
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
