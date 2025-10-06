.PHONY: help up down logs clean restart install

help:
	@echo "Comandos disponíveis:"
	@echo "  make up       - Iniciar containers"
	@echo "  make down     - Parar containers"
	@echo "  make logs     - Ver logs"
	@echo "  make clean    - Limpar tudo"
	@echo "  make restart  - Reiniciar"
	@echo "  make install  - Instalar dependências"

up:
	docker-compose up --build

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	rm -rf backend/node_modules frontend/node_modules

restart: down up

install:
	cd backend && npm install
	cd frontend && npm install
