"use client";

import { ArrowRight, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, type CategoryId } from "@/data/categories";
import type { Brand, Gas, Product } from "@/lib/catalog/schema";

type CatalogBrowserProps = {
  gases: Gas[];
  products: Product[];
  brands: Brand[];
};

function isCategory(value: string | null): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export function CatalogBrowser({ gases, products, brands }: CatalogBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const category: CategoryId | "all" = isCategory(requestedCategory) ? requestedCategory : "all";
  const [query, setQuery] = useState("");
  const [gas, setGas] = useState("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesGas = gas === "all" || product.gases.includes(gas);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.title} ${product.model}`.toLocaleLowerCase("ru").includes(normalizedQuery);

      return matchesCategory && matchesGas && matchesQuery;
    });
  }, [category, gas, products, query]);

  const selectCategory = (nextCategory: CategoryId | "all") => {
    router.replace(nextCategory === "all" ? "/catalog" : `/catalog?category=${nextCategory}`, {
      scroll: false,
    });
  };

  const resetFilters = () => {
    setQuery("");
    setGas("all");
    router.replace("/catalog", { scroll: false });
  };

  return (
    <div className="catalog-layout">
      <aside className="catalog-filter-panel" aria-label="Фильтры каталога">
        <div className="filter-panel-title">
          <SlidersHorizontal aria-hidden="true" size={20} />
          <strong>Фильтры</strong>
        </div>

        <label className="catalog-field">
          <span>Модель или название</span>
          <span className="search-field">
            <Search aria-hidden="true" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, GX-3R" />
          </span>
        </label>

        <label className="catalog-field">
          <span>Контролируемый газ</span>
          <select value={gas} onChange={(event) => setGas(event.target.value)}>
            <option value="all">Все газы</option>
            {gases.map((item) => (
              <option value={item.id} key={item.id}>
                {item.formula} — {item.name}
              </option>
            ))}
          </select>
        </label>

        <button className="filter-reset" type="button" onClick={resetFilters}>
          <RotateCcw aria-hidden="true" size={16} />
          Сбросить
        </button>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <div className="category-segment" aria-label="Категории каталога">
          <button type="button" data-active={category === "all"} onClick={() => selectCategory("all")}>
            Все направления
          </button>
          {categories.map((item) => (
            <button
              type="button"
              data-active={category === item.id}
              onClick={() => selectCategory(item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="catalog-result-bar">
          <strong>Найдено: {filteredProducts.length}</strong>
          <span>Характеристики публикуются после проверки по документации</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} gases={gases} brands={brands} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <div>
              <p className="section-kicker">Каталог наполняется</p>
              <h2>Подберем прибор до публикации карточек</h2>
              <p>
                Уже можно отправить газ, диапазон и условия эксплуатации. В ответе будут только проверенные модели и характеристики.
              </p>
            </div>
            <a className="button button-primary" href="mailto:info@prscom.ru?subject=Запрос%20на%20подбор%20газоанализатора">
              Отправить запрос
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
