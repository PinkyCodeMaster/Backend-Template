SHELL := /bin/bash

dev:
	@bun run dev

lint:
	@bun run lint

format:
	@bun run format

format-check:
	@bun run format:check

build:
	@bun run build

db-generate:
	@bun run db:generate

db-push:
	@bun run db:push

compose-up:
	@docker-compose up -d

compose-down:
	@docker-compose down
