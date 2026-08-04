# Новая версия Газоанализатор.рус

Отдельное приложение инженерного B2B-каталога. WordPress-прототип в корне репозитория сохраняется как источник контента и не является зависимостью этого приложения.

## Локальный запуск

Требования: Node.js 22 и pnpm 11.9.0.

```powershell
cd web
pnpm install --frozen-lockfile
pnpm dev -p 8090
```

Сайт: `http://localhost:8090/`.

## Проверки

```powershell
pnpm lint
pnpm build
```

Полная проверка репозитория запускается из корня:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\check.ps1
```

## Контейнер

```powershell
docker build -t gazrus-web ./web
docker run --rm -p 8090:3000 -e APP_REVISION=local gazrus-web
```

Healthcheck: `http://localhost:8090/api/health`.

## Текущая граница

- Реализована адаптивная главная страница с тремя товарными направлениями.
- SEO-данные страниц, шаблоны и предварительное семантическое ядро находятся в `content/seo/` и проходят Zod-проверку при сборке.
- `public/robots.txt` закрывает служебные и фасетные URL, а `src/app/sitemap.ts` публикует только готовые страницы и проверенные товары.
- Смена hero-сцен ручная, без автопрокрутки и изменения высоты блока.
- Быстрый подбор пока формирует письмо через почтовый клиент.
- Серверная форма с журналом и повторной доставкой описана в `../docs/rebuild/LEAD_DELIVERY.md` и является следующим отдельным этапом.
- Товарные данные будут храниться по контракту `../docs/rebuild/CATALOG_CONTRACT.md`.
