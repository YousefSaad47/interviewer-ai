# Form Builder - Resume Builder & ATS System

This is a **FastAPI** backend module for the Interviewer AI platform. It provides resume generation, ATS analysis, job matching, and secure file management.

---

## **Getting Started**

### **Prerequisites**
- Python 3.11+
- [UV](https://github.com/astral-sh/uv) (recommended) or pip

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/YousefSaad47/interviewer-ai.git
cd interviewer-ai/apps/form-builder

# 2. Install UV (if not installed)
# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh
# Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 3. Install dependencies
uv sync

# 4. Set up environment variables
cp .env_example .env
# Edit .env with your configuration
```

### **Run the Development Server**

```bash
uv run uvicorn src.main:app --reload
```

### **Open API Documentation**

```
http://127.0.0.1:8000/docs
```

---
## **Learn More**

- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Learn about FastAPI features and API.
- [Pydantic Documentation](https://docs.pydantic.dev/) - Data validation using Python type hints.
- [UV Documentation](https://docs.astral.sh/uv/) - Fast Python package installer.
- [Render Documentation](https://render.com/docs) - Deploy your application.

---

