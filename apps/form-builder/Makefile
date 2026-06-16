.PHONY: help
help: # Run `make help` to get help on the make commands
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: type-check
type-check: ## Run type checking
	@uvx ty check

.PHONY: format
format: ## Format code with ruff
	@uvx ruff format .

.PHONY: format-check
format-check: ## Check code formatting with ruff
	@uvx ruff format --check .

.PHONY: lint
lint: ## Lint code with ruff
	@uvx ruff check .

.PHONY: lint-fix
lint-fix: ## Fix linting issues with ruff
	@uvx ruff check --fix .

CLEAN_PATTERNS := \
    __pycache__ \
    .mypy_cache \
    .ruff_cache \
    .pytest_cache \
    *.egg-info \
		.venv

.PHONY: clean
clean: ## Clean Python cache and build artifacts
	@echo "Cleaning Python cache and build artifacts..."
	@for pattern in $(CLEAN_PATTERNS); do \
		find . -name "$$pattern" -exec rm -rf {} + 2>/dev/null || true; \
	done
	@echo "Clean complete."
