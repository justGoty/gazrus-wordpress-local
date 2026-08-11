# Production deployment

Новая версия каталога разворачивается отдельным контейнером `gazrus-next` и публикуется через существующий Traefik.

## Домены

- `газоанализатор.рус` — новая Next.js-версия.
- `new.газоанализатор.рус` — резервная WordPress-версия до отдельного решения владельца.

## Обновление

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
curl -fsS http://127.0.0.1:3000/api/health
curl -I https://xn--80aaaalzch0asjh0a0a.xn--p1acf/
```

Контейнер не публикует порт напрямую: внешний трафик принимает Traefik через сеть `dokploy-network`.
