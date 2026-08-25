"use client";

import { ArrowRight, Check, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, type CategoryId } from "@/data/categories";
import type { Brand, Gas, Product } from "@/lib/catalog/schema";

type CatalogBrowserProps = {
  gases: Gas[];
  products: Product[];
  brands: Brand[];
  initialCategory?: CategoryId;
};

function isCategory(value: string | null): value is CategoryId {
  return categories.some((category) => category.id === value);
}

function parseMultiple(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function CatalogBrowser({ gases, products, brands, initialCategory }: CatalogBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const category: CategoryId | "all" = initialCategory ?? (isCategory(requestedCategory) ? requestedCategory : "all");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedGases, setSelectedGases] = useState(() => parseMultiple(searchParams.get("gas")));
  const [selectedBrands, setSelectedBrands] = useState(() => parseMultiple(searchParams.get("brand")));
  const [documentsOnly, setDocumentsOnly] = useState(searchParams.get("docs") === "yes");
  const deferredQuery = useDeferredValue(query);

  const categoryProducts = useMemo(
    () => products.filter((product) => category === "all" || product.category === category),
    [category, products],
  );
  const brandById = useMemo(() => new Map(brands.map((brand) => [brand.id, brand])), [brands]);
  const gasById = useMemo(() => new Map(gases.map((gas) => [gas.id, gas])), [gases]);
  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of categoryProducts) counts.set(product.brandId, (counts.get(product.brandId) ?? 0) + 1);
    return brands.filter((brand) => counts.has(brand.id)).map((brand) => ({ ...brand, count: counts.get(brand.id) ?? 0 }));
  }, [brands, categoryProducts]);
  const availableGases = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of categoryProducts) {
      for (const gas of new Set(product.gases)) counts.set(gas, (counts.get(gas) ?? 0) + 1);
    }
    return gases.filter((gas) => counts.has(gas.id)).map((gas) => ({ ...gas, count: counts.get(gas.id) ?? 0 }));
  }, [categoryProducts, gases]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase("ru");

    return categoryProducts.filter((product) => {
      const matchesGas = selectedGases.length === 0 || selectedGases.every((gas) => product.gases.includes(gas));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandId);
      const matchesDocuments = !documentsOnly || product.documents.length > 0;
      const brandName = brandById.get(product.brandId)?.name ?? product.brandId;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.title} ${product.model} ${brandName} ${product.summary}`.toLocaleLowerCase("ru").includes(normalizedQuery);

      return matchesGas && matchesBrand && matchesDocuments && matchesQuery;
    });
  }, [brandById, categoryProducts, deferredQuery, documentsOnly, selectedBrands, selectedGases]);

  const activeFilterCount = selectedGases.length + selectedBrands.length + (documentsOnly ? 1 : 0) + (query.trim() ? 1 : 0);

  const replaceUrl = (next: { query?: string; gases?: string[]; brands?: string[]; docs?: boolean; category?: CategoryId | "all" }) => {
    const parameters = new URLSearchParams();
    const nextQuery = next.query ?? query;
    const nextGases = next.gases ?? selectedGases;
    const nextBrands = next.brands ?? selectedBrands;
    const nextDocs = next.docs ?? documentsOnly;
    const nextCategory = next.category ?? category;

    if (nextQuery.trim()) parameters.set("q", nextQuery.trim());
    if (nextGases.length) parameters.set("gas", nextGases.join(","));
    if (nextBrands.length) parameters.set("brand", nextBrands.join(","));
    if (nextDocs) parameters.set("docs", "yes");

    const path = nextCategory === "all" ? "/catalog" : `/catalog/${nextCategory}`;
    const suffix = parameters.toString();
    router.replace(suffix ? `${path}?${suffix}` : path, { scroll: false });
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    replaceUrl({ query: value });
  };

  const toggleGas = (gasId: string) => {
    const nextGases = selectedGases.includes(gasId) ? selectedGases.filter((item) => item !== gasId) : [...selectedGases, gasId];
    setSelectedGases(nextGases);
    replaceUrl({ gases: nextGases });
  };

  const toggleBrand = (brandId: string) => {
    const nextBrands = selectedBrands.includes(brandId) ? selectedBrands.filter((item) => item !== brandId) : [...selectedBrands, brandId];
    setSelectedBrands(nextBrands);
    replaceUrl({ brands: nextBrands });
  };

  const toggleDocuments = () => {
    const nextValue = !documentsOnly;
    setDocumentsOnly(nextValue);
    replaceUrl({ docs: nextValue });
  };

  const selectCategory = (nextCategory: CategoryId | "all") => replaceUrl({ category: nextCategory });

  const resetFilters = () => {
    setQuery("");
    setSelectedGases([]);
    setSelectedBrands([]);
    setDocumentsOnly(false);
    router.replace(initialCategory ? `/catalog/${initialCategory}` : "/catalog", { scroll: false });
  };

  return (
    <div className="catalog-layout">
      <aside className="catalog-filter-panel" aria-label="Фильтры каталога">
        <div className="filter-panel-title">
          <span className="filter-title-icon"><SlidersHorizontal aria-hidden="true" size={20} /></span>
          <span>
            <strong>Фильтры каталога</strong>
            <small>{activeFilterCount ? `Выбрано: ${activeFilterCount}` : "Подбор по параметрам"}</small>
          </span>
        </div>

        <label className="catalog-field">
          <span>Модель, название или производитель</span>
          <span className="search-field">
            <Search aria-hidden="true" size={18} />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Например, GX-3R" />
            {query ? <button type="button" onClick={() => updateQuery("")} title="Очистить поиск"><X aria-hidden="true" size={16} /><span className="sr-only">Очистить поиск</span></button> : null}
          </span>
        </label>

        <fieldset className="catalog-filter-group">
          <legend>Контролируемый газ</legend>
          <div className="catalog-option-list">
            {availableGases.map((item) => (
              <label className="catalog-option" key={item.id}>
                <input type="checkbox" checked={selectedGases.includes(item.id)} onChange={() => toggleGas(item.id)} />
                <span className="catalog-option-check"><Check aria-hidden="true" size={13} /></span>
                <span>{item.formula} — {item.name}</span>
                <small>{item.count}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="catalog-filter-group">
          <legend>Производитель</legend>
          <div className="catalog-option-list">
            {availableBrands.map((item) => (
              <label className="catalog-option" key={item.id}>
                <input type="checkbox" checked={selectedBrands.includes(item.id)} onChange={() => toggleBrand(item.id)} />
                <span className="catalog-option-check"><Check aria-hidden="true" size={13} /></span>
                <span>{item.name}</span>
                <small>{item.count}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="catalog-document-toggle">
          <input type="checkbox" checked={documentsOnly} onChange={toggleDocuments} />
          <span><strong>С документацией</strong><small>В карточке опубликованы руководства, паспорта или сертификаты</small></span>
        </label>

        <button className="filter-reset" type="button" onClick={resetFilters} disabled={activeFilterCount === 0}>
          <RotateCcw aria-hidden="true" size={16} />Сбросить все
        </button>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <div className="category-segment" aria-label="Категории каталога">
          <button type="button" data-active={category === "all"} onClick={() => selectCategory("all")}>Все направления</button>
          {categories.map((item) => <button type="button" data-active={category === item.id} onClick={() => selectCategory(item.id)} key={item.id}>{item.label}</button>)}
        </div>

        <div className="catalog-result-bar">
          <div><strong>Найдено: {filteredProducts.length}</strong><span>из {categoryProducts.length} моделей</span></div>
          <span>Характеристики публикуются после проверки по документации</span>
        </div>

        {activeFilterCount > 0 ? (
          <div className="active-filter-list" aria-label="Выбранные фильтры">
            {query.trim() ? <button type="button" onClick={() => updateQuery("")}>Поиск: {query}<X aria-hidden="true" size={14} /></button> : null}
            {selectedGases.map((gasId) => <button type="button" onClick={() => toggleGas(gasId)} key={gasId}>{gasById.get(gasId)?.formula ?? gasId}<X aria-hidden="true" size={14} /></button>)}
            {selectedBrands.map((brandId) => <button type="button" onClick={() => toggleBrand(brandId)} key={brandId}>{brandById.get(brandId)?.name ?? brandId}<X aria-hidden="true" size={14} /></button>)}
            {documentsOnly ? <button type="button" onClick={toggleDocuments}>С документацией<X aria-hidden="true" size={14} /></button> : null}
          </div>
        ) : null}

        {filteredProducts.length > 0 ? (
          <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} gases={gases} brands={brands} />)}</div>
        ) : (
          <div className="catalog-empty">
            <div><p className="section-kicker">Ничего не найдено</p><h2>Измените параметры подбора</h2><p>Уберите одно из ограничений или отправьте задачу инженеру — подберем модель вне опубликованной части каталога.</p></div>
            <div className="catalog-empty-actions"><button className="button button-secondary" type="button" onClick={resetFilters}>Сбросить фильтры</button><a className="button button-primary" href="mailto:info@prscom.ru?subject=Запрос%20на%20подбор%20газоанализатора">Отправить запрос<ArrowRight aria-hidden="true" size={18} /></a></div>
          </div>
        )}
      </section>
    </div>
  );
}
