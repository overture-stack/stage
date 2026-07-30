SHELL := /bin/bash
.DEFAULT_GOAL := help
COMPOSE := docker compose -f ./docker-compose.yml

help:
	@echo "=========== Stage complementary services ==========="
	@echo ""
	@echo "  make up      - Start OpenSearch and Arranger, load the mock data"
	@echo "  make down    - Stop the services, keeping the loaded data"
	@echo "  make status  - Show what is running"
	@echo "  make logs    - Follow the Arranger and OpenSearch logs"
	@echo "  make reset   - DANGER: stop and delete the search engine volume"
	@echo ""
	@echo "  Once up, Arranger is at http://localhost:5050/graphql"
	@echo "  Run Stage against it with: npm run dev -- -p 3001"
	@echo "  Walkthrough: docs/setup.md"
	@echo "===================================================="

# Start the stack and wait for Arranger to be serving the donor catalogue.
up:
	@$(COMPOSE) up -d --wait
	@echo ""
	@printf "\033[1;32mComplementary services ready\033[0m\n"
	@echo "  OpenSearch  http://localhost:9200"
	@echo "  Arranger    http://localhost:5050/graphql"
	@echo ""
	@echo "Next: copy .env.schema to .env (see docs/setup.md), then npm run dev -- -p 3001"

down:
	@$(COMPOSE) down

status:
	@$(COMPOSE) ps

logs:
	@$(COMPOSE) logs -f arranger opensearch

# Remove the containers and the OpenSearch volume; the next `make up` reloads the data.
reset:
	@printf "\033[1;31mThis deletes the search engine volume and everything indexed in it.\033[0m\n"
	@read -p "Type 'DELETE' to confirm: " confirm; \
	if [ "$$confirm" = "DELETE" ]; then \
		$(COMPOSE) down -v; \
		printf "\033[1;32mReset complete. Run 'make up' to rebuild and reload.\033[0m\n"; \
	else \
		printf "\033[1;32mReset cancelled. Nothing was deleted.\033[0m\n"; \
	fi

.PHONY: help up down status logs reset
