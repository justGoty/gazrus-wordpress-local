# SEO data contract

Эта папка является машинно-читаемым источником SEO-данных новой версии сайта.

- `site.json` — домен, бренд и общие metadata.
- `pages.json` — фиксированные URL, metadata, H1, индексация и состав контента.
- `templates.json` — правила динамических страниц и служебных URL.
- `semantic-core.json` — предварительные поисковые кластеры без выдуманной частотности.

Данные проверяются Zod-схемой из `web/src/lib/seo/schema.ts` при сборке. Страница попадает в `sitemap.xml` только при `implementation=implemented`, `seoStatus=ready`, `indexing=index` и `sitemap=true`.

Статус `not_validated` означает, что фразы сформированы по проектному контексту, но еще не проверены по Wordstat, Search Console, Яндекс Вебмастеру и фактической выдаче. Поля частотности не заполняются оценками.

Товарные metadata остаются в `web/content/catalog/products/*.json`, поскольку они зависят от проверенных характеристик конкретной модели. Правила их формирования находятся в `templates.json` и `docs/rebuild/SEO_CONTENT_STANDARD.md`.
