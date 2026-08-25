"use client";

import { ExternalLink, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";

export type DocumentSearchItem = {
  id: string;
  title: string;
  url: string;
  productTitle: string;
  model: string;
  brand: string;
  category: string;
  productHref: string;
};

type DocumentsBrowserProps = {
  documents: DocumentSearchItem[];
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("ru");
}

export function DocumentsBrowser({ documents }: DocumentsBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const deferredQuery = useDeferredValue(query);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = normalize(deferredQuery);
    if (!normalizedQuery) return documents;

    return documents.filter((document) =>
      normalize(`${document.title} ${document.productTitle} ${document.model} ${document.brand}`).includes(normalizedQuery),
    );
  }, [deferredQuery, documents]);

  const groups = useMemo(() => {
    const grouped = new Map<string, DocumentSearchItem[]>();
    for (const document of filteredDocuments) {
      const items = grouped.get(document.productHref) ?? [];
      items.push(document);
      grouped.set(document.productHref, items);
    }
    return Array.from(grouped.values());
  }, [filteredDocuments]);

  const updateQuery = (value: string) => {
    setQuery(value);
    const parameters = new URLSearchParams(searchParams.toString());
    if (value.trim()) parameters.set("q", value.trim());
    else parameters.delete("q");
    const suffix = parameters.toString();
    router.replace(suffix ? `/docs?${suffix}` : "/docs", { scroll: false });
  };

  return (
    <div className="docs-browser">
      <div className="docs-search-panel">
        <div>
          <p className="section-kicker">Поиск документации</p>
          <h2>Найдите документ по прибору или названию</h2>
          <p>Введите производителя, модель газоанализатора или часть названия документа.</p>
        </div>
        <label className="docs-search-field">
          <Search aria-hidden="true" size={21} />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Например, СТА-КД1 или руководство"
            aria-label="Поиск документов"
          />
          {query ? (
            <button type="button" onClick={() => updateQuery("")} title="Очистить поиск">
              <X aria-hidden="true" size={18} />
              <span className="sr-only">Очистить поиск</span>
            </button>
          ) : null}
        </label>
      </div>

      <div className="docs-result-summary" aria-live="polite">
        <strong>Найдено документов: {filteredDocuments.length}</strong>
        <span>Моделей оборудования: {groups.length}</span>
      </div>

      {groups.length > 0 ? (
        <div className="docs-grid">
          {groups.map((items) => {
            const product = items[0];
            return (
              <article className="document-product-card" key={product.productHref}>
                <div className="document-product-head">
                  <div>
                    <span>{product.category} · {product.brand}</span>
                    <h2>{product.productTitle}</h2>
                  </div>
                  <Link href={product.productHref}>Карточка прибора</Link>
                </div>
                <div className="document-list">
                  {items.map((document) => (
                    <a href={document.url} target="_blank" rel="noopener noreferrer" key={document.id}>
                      <FileText aria-hidden="true" size={20} />
                      <span>{document.title}</span>
                      <ExternalLink aria-hidden="true" size={17} />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="docs-empty">
          <FileText aria-hidden="true" size={30} />
          <h2>Документ не найден</h2>
          <p>Проверьте название модели или сократите поисковый запрос.</p>
          <button className="button button-secondary" type="button" onClick={() => updateQuery("")}>Показать все документы</button>
        </div>
      )}
    </div>
  );
}
