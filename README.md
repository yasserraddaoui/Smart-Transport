# Smart Transport System - Tunisie

Plateforme professionnelle de gestion du transport public en Tunisie, basee sur une architecture microservices moderne.

## Services

- API Gateway (Spring Cloud Gateway) : `http://localhost:8080`
- Auth Service (Spring Boot) : `http://localhost:8081`
- Bus Service (Spring Boot) : `http://localhost:8082`
- Driver Service (Node.js + Express) : `http://localhost:8083`
- GPS Service (Python + FastAPI) : `http://localhost:8084`
- Ticketing/Billing SOAP (.NET) : `http://localhost:8085/ticketing`

## Demarrage rapide

```bash
docker-compose up --build
```

Acces UI : `http://localhost:5173` (React/Vite)

Comptes par defaut (Auth Service) :
- `admin.tn / Admin123!`
- `driver.tn / Driver123!`
- `user.tn / User123!`

## Endpoints principaux (Gateway)

- `POST /auth/login`
- `POST /auth/register`
- `GET /bus`
- `GET /driver`
- `GET /gps/locations`
- SOAP `POST /ticketing`

## Contexte tunisien

Les exemples, trajets, villes, coordonnees GPS et donnees sont adaptes exclusivement a la Tunisie.
