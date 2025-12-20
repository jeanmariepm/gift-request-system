.PHONY: help up down build clean logs shell db-shell

# Default target
help:
	@echo "🎁 Gift Request System - Make Commands"
	@echo "====================================="
	@echo "make up      - Start the application with Docker"
	@echo "make down    - Stop all containers"
	@echo "make build   - Build containers"
	@echo "make clean   - Stop and remove containers, volumes"
	@echo "make logs    - Show application logs"
	@echo "make shell   - Open shell in app container"
	@echo "make db-shell - Open PostgreSQL shell"
	@echo ""
	@echo "🔗 Test URLs after 'make up':"
	@echo "   User:  http://localhost:3000/?token=gift_access_dev_d7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2&userId=123&userName=John%20Doe"
	@echo "   Admin: http://localhost:3000/admin?adminToken=admin_access_dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

up:
	@echo "🐳 Starting Gift Request System..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

down:
	@echo "🛑 Stopping containers..."
	docker-compose down

build:
	@echo "🔨 Building containers..."
	docker-compose build

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

logs:
	@echo "📋 Showing logs..."
	docker-compose logs -f

shell:
	@echo "🐚 Opening shell in app container..."
	docker-compose exec app sh

db-shell:
	@echo "🗄️  Opening PostgreSQL shell..."
	docker-compose exec db psql -U postgres -d gifts_dev