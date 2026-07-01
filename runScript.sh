#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# MultiEV - Development Server Launcher
# Starts the ML service (FastAPI), Backend (Express), and Frontend (React)
# as background processes and tears them all down cleanly on exit.
#
# Usage:
#   chmod +x start.sh
#   ./start.sh
#
# Prerequisites:
#   - pyenv with Python 3.12.2 and virtualenv myenv312 installed
#   - nvm with Node 20 installed
#   - ProtT5-XL model already cached (HF_HUB_OFFLINE=1 is set by default)
#     If running on a fresh machine, see the note below.
#
# Machine-specific config (PYTHON_BIN, ports, etc.) lives in a .env file
# next to this script. Copy .env.example to .env and fill in your paths -
# .env is gitignored so every machine can point at its own venv without
# touching this script.
#
# Note on model cache:
#   HF_HUB_OFFLINE=1 prevents any Hugging Face network calls at startup.
#   On a fresh machine where the model has never been downloaded, remove
#   that flag for the first run so the ~11GB model can be fetched and cached,
#   then add it back for all subsequent runs.
# -----------------------------------------------------------------------------

set -euo pipefail

# -- Resolve project root regardless of where the script is called from --------
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# -- Colour helpers ------------------------------------------------------------
# ANSI-C quoting ($'...') embeds the real ESC byte at parse time, so plain
# `echo`/`printf` renders color correctly without depending on `echo -e`
# support (which varies by shell and breaks silently if this script is ever
# invoked via sh/dash instead of bash).
RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'
CYAN=$'\033[0;36m'; BOLD=$'\033[1m'; RESET=$'\033[0m'

log_info()    { printf '%s\n' "${CYAN}[INFO]${RESET}  $*"; }
log_success() { printf '%s\n' "${GREEN}[OK]${RESET}    $*"; }
log_warn()    { printf '%s\n' "${YELLOW}[WARN]${RESET}  $*"; }
log_error()   { printf '%s\n' "${RED}[ERROR]${RESET} $*" >&2; }

separator() { printf '%s\n' "${BOLD}----------------------------------------${RESET}"; }

# -- Load .env if present ---------------------------------------------------
# Values are auto-exported while sourcing so plain KEY=value lines
# (no `export` prefix needed) in .env work fine.
ENV_FILE="$PROJECT_ROOT/.env"
if [[ -f "$ENV_FILE" ]]; then
  log_info "Loading environment from $ENV_FILE"
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
else
  log_warn ".env not found at $ENV_FILE - falling back to PATH lookup for python3"
  log_warn "Copy .env.example to .env and set PYTHON_BIN to avoid this."
fi

# -- Config --------------------------------------------------------------------
# PYTHON_BIN resolution order:
#   1. $PYTHON_BIN from .env (recommended - set this per machine)
#   2. $PYTHON_BIN already exported in the calling shell (inline override)
#   3. python3 found in PATH (covers pre-activated venvs / system python)
#
# Example overrides:
#   PYTHON_BIN=/opt/venv/bin/python ./start.sh          # explicit venv
#   source /opt/venv/bin/activate && ./start.sh          # pre-activated venv
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3 || true)}"
ML_SERVICE_DIR="$PROJECT_ROOT/ml_service/fastApi"
BACKEND_DIR="$PROJECT_ROOT/Backend"
FRONTEND_DIR="$PROJECT_ROOT"
ML_PORT="${ML_PORT:-8000}"
BACKEND_PORT="${BACKEND_PORT:-5001}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

# How long to wait (seconds) after launching each service before checking
# whether it's still alive. Catches immediate crashes (missing deps, bad
# interpreter, port in use) that `set -e` can't see through `&` backgrounding.
STARTUP_GRACE=2

# -- Pre-flight checks ---------------------------------------------------------
preflight_check() {
  separator
  log_info "Running pre-flight checks..."

  if [[ -z "$PYTHON_BIN" || ! -x "$PYTHON_BIN" ]]; then
    log_error "Python binary not found or not executable: '${PYTHON_BIN:-<unset>}'"
    log_error "Either:"
    log_error "  1. Set PYTHON_BIN in .env (recommended), e.g.:"
    log_error "       PYTHON_BIN=/home/you/.pyenv/versions/3.12.2/envs/myenv312/bin/python"
    log_error "  2. Activate your virtualenv before running this script, or"
    log_error "  3. Pass it inline:  PYTHON_BIN=/path/to/python ./start.sh"
    exit 1
  fi
  log_success "Python: $PYTHON_BIN  ($(${PYTHON_BIN} --version 2>&1))"

  if ! "$PYTHON_BIN" -c "import uvicorn, fastapi" &>/dev/null; then
    log_error "'$PYTHON_BIN' is missing uvicorn/fastapi."
    log_error "This usually means PYTHON_BIN is pointing at the wrong interpreter"
    log_error "(e.g. system python3 instead of your project virtualenv)."
    exit 1
  fi
  log_success "uvicorn/fastapi importable from \$PYTHON_BIN"

  if [[ ! -d "$ML_SERVICE_DIR" ]]; then
    log_error "ML service directory not found: $ML_SERVICE_DIR"
    exit 1
  fi
  log_success "ML service directory: $ML_SERVICE_DIR"

  if [[ ! -d "$BACKEND_DIR" ]]; then
    log_error "Backend directory not found: $BACKEND_DIR"
    exit 1
  fi
  log_success "Backend directory: $BACKEND_DIR"

  if ! command -v nvm &>/dev/null && [[ ! -s "$HOME/.nvm/nvm.sh" ]]; then
    log_error "nvm not found. Install from https://github.com/nvm-sh/nvm"
    exit 1
  fi
  log_success "nvm found"

  separator
}

# Verify a backgrounded process is still alive after STARTUP_GRACE seconds.
# Prevents the script from reporting "started" for a process that crashed
# immediately (set -e doesn't catch failures inside `... | pipe &`).
verify_alive() {
  local pid="$1" name="$2"
  sleep "$STARTUP_GRACE"
  if ! kill -0 "$pid" 2>/dev/null; then
    log_error "$name (PID $pid) exited immediately - check the logs above for the real error."
    exit 1
  fi
}

# -- Cleanup -------------------------------------------------------------------
ML_PID="" BACKEND_PID="" FRONTEND_PID=""

cleanup() {
  separator
  printf '\n%s\n' "${YELLOW}[STOP]${RESET}  Shutting down all services..."
  [[ -n "$ML_PID"       ]] && kill "$ML_PID"       2>/dev/null && log_info "ML service stopped       (PID $ML_PID)"
  [[ -n "$BACKEND_PID"  ]] && kill "$BACKEND_PID"  2>/dev/null && log_info "Backend stopped          (PID $BACKEND_PID)"
  [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null && log_info "Frontend stopped         (PID $FRONTEND_PID)"
  separator
  log_success "All services stopped. Goodbye."
}
trap cleanup EXIT INT TERM

# -- Main ----------------------------------------------------------------------
separator
printf '%s\n' "${BOLD}  MultiEV - Development Server${RESET}"
separator

preflight_check

# -- 1. ML Service (FastAPI + uvicorn) -----------------------------------------
log_info "Starting ML service on port $ML_PORT..."
cd "$ML_SERVICE_DIR"

HF_HUB_OFFLINE=1       \
HF_HUB_DISABLE_XET=1   \
KMP_DUPLICATE_LIB_OK=TRUE \
OMP_NUM_THREADS=1       \
MKL_NUM_THREADS=1       \
"$PYTHON_BIN" -m uvicorn app:app \
  --host 0.0.0.0        \
  --port "$ML_PORT"     \
  --reload              \
  --reload-dir .        \
  2>&1 | sed "s/^/${CYAN}[ML]${RESET}    /" &

ML_PID=$!
cd "$PROJECT_ROOT"
verify_alive "$ML_PID" "ML service"
log_success "ML service started (PID $ML_PID) -> http://localhost:$ML_PORT"

# -- 2. Backend (Node.js / Express) --------------------------------------------
log_info "Starting Backend..."
cd "$BACKEND_DIR"

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"
nvm use 20 --silent

nodemon server.js 2>&1 | sed "s/^/${GREEN}[BE]${RESET}    /" &
BACKEND_PID=$!
cd "$PROJECT_ROOT"
verify_alive "$BACKEND_PID" "Backend"
log_success "Backend started (PID $BACKEND_PID) -> http://localhost:$BACKEND_PORT"

# -- 3. Frontend (React / CRA) -------------------------------------------------
log_info "Starting Frontend..."
cd "$FRONTEND_DIR"

npm start 2>&1 | sed "s/^/${YELLOW}[FE]${RESET}    /" &
FRONTEND_PID=$!
verify_alive "$FRONTEND_PID" "Frontend"
log_success "Frontend started (PID $FRONTEND_PID) -> http://localhost:$FRONTEND_PORT"

# -- Ready ---------------------------------------------------------------------
separator
printf '%s\n' "${BOLD}  All services running. Press Ctrl+C to stop.${RESET}"
echo ""
printf '%s\n' "  ${CYAN}ML Service${RESET}   ->  http://localhost:$ML_PORT"
printf '%s\n' "  ${GREEN}Backend${RESET}      ->  http://localhost:$BACKEND_PORT"
printf '%s\n' "  ${YELLOW}Frontend${RESET}     ->  http://localhost:$FRONTEND_PORT"
separator

wait
