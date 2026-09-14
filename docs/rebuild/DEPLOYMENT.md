# Production deployment

Новая версия каталога разворачивается отдельным контейнером `gazrus-next` и публикуется через существующий Traefik.

## Домены

- `газоанализатор.рус` — новая Next.js-версия.
- `new.газоанализатор.рус` — резервная WordPress-версия до отдельного решения владельца.

## Обновление

Штатный способ — ручной workflow `Deploy production` в GitHub Actions. Доступ к серверу хранится в зашифрованных secrets:

- `PRODUCTION_HOST`;
- `PRODUCTION_USER`;
- `PRODUCTION_PASSWORD`.

Workflow обновляет ветку `master`, пересобирает `gazrus-next`, ожидает статус `healthy` и проверяет публичный `/api/health`.

Резервной ручной командой на сервере остается:

```bash
cd /opt/gazrus-next
git fetch origin master
git pull --ff-only origin master
docker compose -f deploy/docker-compose.production.yml up -d --build
```

## Проверка

```bash
docker inspect --format='{{.State.Health.Status}}' gazrus-next
docker logs --tail 100 gazrus-next
docker exec gazrus-next node -e "fetch('http://127.0.0.1:3000/api/health').then(async r => { console.log(await r.text()); process.exit(r.ok ? 0 : 1); }).catch(() => process.exit(1))"
curl -fsS https://xn--80aaaalzch0asjh0a0a.xn--p1acf/api/health
curl -I https://xn--80aaaalzch0asjh0a0a.xn--p1acf/
```

Контейнер не публикует порт напрямую: внешний трафик принимает Traefik через сеть `dokploy-network`.

Порт `3000` на хосте занят Dokploy, а не сайтом. Запрос к нему не проверяет `gazrus-next`. Поле `revision` в health берется из `APP_REVISION` и может отставать от кода: его нельзя считать единственным доказательством опубликованной версии.

## После включения сервера

1. Проверить `uptime`, `systemctl is-active docker`, `systemctl is-enabled docker` и `docker ps -a`. Сначала установить фактическое состояние, не запускать новый деплой для обычного восстановления после остановки VPS.
2. Проверить `gazrus-next` и `dokploy-traefik`. Сайт использует политику `unless-stopped`, прокси `always`. Если существующий контейнер сайта остановлен, после проверки его состояния достаточно `docker start gazrus-next`. Не пересоздавать базы, сети, volumes или все сервисы Dokploy.
3. Выполнить проверки выше. При расхождении внутренней и внешней доступности проверить HTTPS через локальный прокси: `curl -I --resolve xn--80aaaalzch0asjh0a0a.xn--p1acf:443:127.0.0.1 https://xn--80aaaalzch0asjh0a0a.xn--p1acf/`. Проверку TLS не отключать.
4. Проверить сайт снаружи: главную, каталог, карточку товара, контакты, документы, `robots.txt` и `sitemap.xml`. В браузере проверить изображения и открытие форм без реальной отправки. Ответ HTTP и открытие формы не подтверждают доставку письма.

Проверено 14.09.2026: после возобновления работы VPS Docker, `gazrus-next` и Traefik запустились автоматически. Контейнер сайта `healthy`, счетчик перезапусков `0`, Docker включен в автозагрузку. На основном домене подтверждены HTTP 200 и загрузка страниц в браузере. Ручной перезапуск, изменение конфигурации, пересборка и миграции не потребовались; код в `/opt/gazrus-next` остался на `c33561f`. Устаревшее значение health `676eaf1` не означает откат сайта.
