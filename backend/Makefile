MIGRATIONS_DIR = migrations
CONTAINER = rfp_postgres
DB_USER = rfp_user
DB_NAME = rfp_system

migrate:
	@echo "Running migrations..."
	for file in $(MIGRATIONS_DIR)/*.sql ; do \
		echo "Applying $$file"; \
		docker exec -i $(CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) < $$file; \
	done
