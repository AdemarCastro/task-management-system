.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-18s %s\n", $$1, $$2}'

setup: ## Prepare local env files
	cp -n .env.example .env || true

up: ## Start local stack
	docker compose up --build

down: ## Stop local stack
	docker compose down

migrate: ## Run backend migrations
	docker compose exec backend python manage.py migrate

backend-test: ## Run backend tests
	docker compose exec backend pytest --cov=apps --cov-report=term-missing

backend-lint: ## Run backend lint
	docker compose exec backend ruff check .
	docker compose exec backend ruff format --check .

frontend-test: ## Run frontend tests
	docker compose exec frontend npm run test

frontend-lint: ## Run frontend lint
	docker compose exec frontend npm run lint

ci: backend-lint backend-test frontend-lint frontend-test ## Run local quality gates
