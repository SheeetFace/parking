# parking
> [!WARNING]
> **`.env` настройки ниже**

## База данных: MySQL в облаке от Aiven.io

### ORM:
**Prisma** (используется на backend для работы с базой)

### Frontend:
- React + Vite + TypeScript

### Backend:
- NestJS + TypeScript

## Работа с базой данных

База размещена в облаке **Aiven**. В случае недоступности базы (что маловероятно), пожалуйста, сообщите мне для перезапуска.

### Управление содержимым базы через Prisma Studio
Перейдите в папку `backend` и запустите команду:
```
npx prisma studio
```
Это откроет веб-интерфейс для онлайн-просмотра и редактирования данных.

# backend env
```
NODE_ENV='development'

COOKIE_DOMAIN = 'localhost'

JWT_SECRET=3b764169e35240cd9e99c70ee4b61bfb
JWT_ACCESS_TOKEN_TTL=1h
JWT_REFRESH_TOKEN_TTL=7d

DB_HOST = 'mysql-23e7e1ef-amdev.d.aivencloud.com'
DB_PORT = '27055'
DB_USERNAME = 'avnadmin'
DB_PASSWORD = 'AVNS_5M7oB6bhq7PsJc_2JyQ'
DB_NAME = 'defaultdb'

DATABASE_URL="mysql://avnadmin:AVNS_5M7oB6bhq7PsJc_2JyQ@mysql-23e7e1ef-amdev.d.aivencloud.com:27055/defaultdb"
```

# frontend env
```
VITE_API_URL="http://localhost:3000/api/"
```