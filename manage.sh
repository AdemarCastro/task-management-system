#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$ROOT_DIR/.env"
ENV_EXAMPLE="$ROOT_DIR/.env.example"

info() {
  printf "\n\033[1;34m%s\033[0m\n" "$1"
}

success() {
  printf "\n\033[1;32m%s\033[0m\n" "$1"
}

error() {
  printf "\n\033[1;31m%s\033[0m\n" "$1" >&2
}

confirm() {
  local message="$1"
  read -r -p "$message [s/N]: " answer
  [[ "$answer" == "s" || "$answer" == "S" ]]
}

check_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    error "Docker nao encontrado. Instale o Docker antes de continuar."
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    error "Docker Compose v2 nao encontrado."
    exit 1
  fi
}

init_project() {
  info "Inicializando ambiente..."
  check_docker

  if [[ ! -f "$ENV_FILE" ]]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    success "Arquivo .env criado a partir do .env.example."
  else
    info "Arquivo .env ja existe."
  fi

  docker compose build
  success "Ambiente inicializado."
}

start_project() {
  info "Subindo ambiente..."
  check_docker
  docker compose up --build
}

reset_environment() {
  info "Resetando ambiente..."
  check_docker

  if ! confirm "Isso vai recriar containers e volumes do banco. Continuar?"; then
    info "Operacao cancelada."
    return
  fi

  docker compose down -v --remove-orphans
  docker compose up --build
}

delete_environment() {
  info "Deletando ambiente..."
  check_docker

  if ! confirm "Isso vai remover containers, volumes e orfaos locais. Continuar?"; then
    info "Operacao cancelada."
    return
  fi

  docker compose down -v --remove-orphans
  success "Ambiente removido."
}

run_tests() {
  info "Executando testes..."
  check_docker

  docker compose up -d database backend frontend
  docker compose exec backend pytest --cov=apps --cov-report=term-missing
  docker compose exec frontend npm run test

  success "Testes finalizados."
}

run_migrations() {
  info "Executando migrations..."
  check_docker

  docker compose up -d database backend
  docker compose exec backend python manage.py makemigrations
  docker compose exec backend python manage.py migrate

  success "Migrations finalizadas."
}

show_menu() {
  clear
  echo "======================================"
  echo " Task Management System - Dev Menu"
  echo "======================================"
  echo "1) Init"
  echo "2) Start"
  echo "3) Reset do ambiente"
  echo "4) Delete do ambiente"
  echo "5) Teste"
  echo "6) Migrate"
  echo "0) Sair"
  echo "======================================"
}

main() {
  cd "$ROOT_DIR"

  while true; do
    show_menu
    read -r -p "Escolha uma opcao: " option

    case "$option" in
      1) init_project ;;
      2) start_project ;;
      3) reset_environment ;;
      4) delete_environment ;;
      5) run_tests ;;
      6) run_migrations ;;
      0)
        info "Saindo..."
        exit 0
        ;;
      *)
        error "Opcao invalida."
        ;;
    esac

    echo
    read -r -p "Pressione Enter para voltar ao menu..."
  done
}

main "$@"
