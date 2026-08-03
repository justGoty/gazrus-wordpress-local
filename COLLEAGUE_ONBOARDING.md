# Подключение коллеги к проекту Газрус

Этот файл можно дать коллеге или другому чатботу. Цель: подключить второй компьютер к публичному GitHub-репозиторию и локально поднять WordPress-проект `gazrus-wordpress-local`.

## Репозиторий

```text
https://github.com/justGoty/gazrus-wordpress-local
```

Рабочая модель: изменения можно отправлять напрямую в `master`.

## 1. Выдать доступ на запись

Это выполняет владелец репозитория на своем ПК.

Нужен GitHub-логин коллеги, например:

```text
COLLEAGUE_GITHUB_LOGIN
```

Команда через GitHub CLI:

```powershell
gh api `
  -X PUT `
  repos/justGoty/gazrus-wordpress-local/collaborators/COLLEAGUE_GITHUB_LOGIN `
  -f permission=push
```

После этого коллега должна принять приглашение на GitHub.

Проверка доступа:

```powershell
gh api repos/justGoty/gazrus-wordpress-local/collaborators/COLLEAGUE_GITHUB_LOGIN/permission
```

## 2. Подготовить ПК коллеги

Установить:

- Git;
- GitHub CLI;
- Docker Desktop;
- WSL 2, если это Windows.

Проверить:

```powershell
git --version
gh --version
docker --version
docker compose version
```

Авторизоваться в GitHub:

```powershell
gh auth login
gh auth status
```

Рекомендуемые настройки Git:

```powershell
git config --global user.name "COLLEAGUE_NAME"
git config --global user.email "COLLEAGUE_EMAIL"
```

## 3. Скачать проект

```powershell
git clone https://github.com/justGoty/gazrus-wordpress-local.git
cd gazrus-wordpress-local
```

## 4. Запустить сайт локально

```powershell
docker compose up -d
```

Открыть сайт:

```text
http://localhost:8089
```

Админка:

```text
http://localhost:8089/wp-admin/
```

Если база не была передана отдельно, WordPress может открыть стандартную установку. Это нормально: публичный репозиторий не содержит приватную базу, серверные бэкапы и `uploads`.

## 5. Как работать напрямую через master

Перед началом работы всегда подтянуть свежие изменения:

```powershell
git checkout master
git pull origin master
```

После правок проверить измененные файлы:

```powershell
git status
```

Добавить изменения:

```powershell
git add .
```

Сделать понятный коммит:

```powershell
git commit -m "Кратко описать изменение"
```

Отправить в GitHub:

```powershell
git push origin master
```

## 6. Что нельзя отправлять в GitHub

Нельзя коммитить:

- пароли;
- доступы к серверу, Beget, Reg.ru, Dokploy, почте и админке;
- `.env`;
- SQL-дампы;
- папки `backup/`, `db/`, `output/`;
- приватные медиа из `wp-content/uploads/`;
- архивы сайта и базы.

Если случайно появился приватный файл, не делать `git add .` вслепую. Сначала проверить:

```powershell
git status
```

## 7. Если нужно передать полную копию сайта

Контент WordPress, база данных и медиа передаются отдельно приватным способом. В GitHub хранится только кодовая часть проекта: тема, плагин, локальное Docker-окружение и рабочая документация.

Для импорта приватной базы смотреть `README.md`, раздел `Импорт приватной базы`.

## 8. Задача для другого чатбота

Если этот файл передан другому чатботу, порядок действий такой:

1. Проверить, что Git, GitHub CLI, Docker Desktop и WSL 2 установлены.
2. Авторизовать коллегу через `gh auth login`.
3. Клонировать `https://github.com/justGoty/gazrus-wordpress-local`.
4. Запустить `docker compose up -d`.
5. Открыть `http://localhost:8089`.
6. Проверить `git status`.
7. Перед любым коммитом убедиться, что не добавляются приватные файлы.
8. Работать напрямую в `master`, но перед началом каждой задачи делать `git pull origin master`.
