# Python Project Setup Guide (GitHub Ready)

A complete production-style setup guide for creating a fresh Python project using:

- `pyenv` for Python version management
- `.venv` for isolated virtual environments
- `pip` for dependency management
- `requirements.txt` for dependency pinning
- `git` + GitHub for version control

This setup follows modern Python development best practices.

---

# Final Project Structure

```text
my-python-app/
│
├── .gitignore
├── .python-version
├── README.md
├── requirements.txt
├── src/
│   └── main.py
├── tests/
└── .venv/
```

> NOTE:
> `.venv/` should NEVER be committed to GitHub.

---

# 1. Install Homebrew (macOS Only)

If Homebrew is not installed:

Official website:

https://brew.sh

Install:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify:

```bash
brew --version
```

Example:

```bash
Homebrew 4.5.1
```

---

# 2. Install pyenv

`pyenv` allows multiple Python versions on the same machine.

Install:

```bash
brew update
brew install pyenv
```

Verify:

```bash
pyenv --version
```

Example:

```bash
pyenv 2.6.0
```

---

# 3. Configure pyenv

Open shell config:

## ZSH (Default macOS shell)

```bash
nano ~/.zshrc
```

Add these lines:

```bash
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"

eval "$(pyenv init - zsh)"
```

Save file.

Reload shell:

```bash
source ~/.zshrc
```

Verify:

```bash
pyenv versions
```

---

# 4. Install Python Version

See available versions:

```bash
pyenv install --list
```

Choose a stable version.

Example:

```bash
3.12.3
```

Install:

```bash
pyenv install 3.12.3
```

Verify installed versions:

```bash
pyenv versions
```

Example:

```bash
system
3.11.9
3.12.3
```

---

# 5. Create Project Folder

```bash
mkdir my-python-app
cd my-python-app
```

---

# 6. Set Local Python Version

Inside project:

```bash
pyenv local 3.12.3
```

This creates:

```text
.python-version
```

Verify:

```bash
python --version
```

Expected:

```bash
Python 3.12.3
```

---

# 7. Create Virtual Environment

Create isolated environment:

```bash
python -m venv .venv
```

This creates:

```text
.venv/
```

Why use virtual environments?

- Prevents dependency conflicts
- Keeps project isolated
- Prevents global package pollution
- Makes projects reproducible

---

# 8. Activate Virtual Environment

## macOS/Linux

```bash
source .venv/bin/activate
```

Your terminal changes:

```bash
(.venv) user@machine my-python-app %
```

Meaning:

✅ Virtual environment is active.

---

# 9. Upgrade pip

Always upgrade pip in new environments.

```bash
pip install --upgrade pip
```

Verify:

```bash
pip --version
```

---

# 10. Create Source Structure

```bash
mkdir src
mkdir tests
touch src/main.py
```

Example:

## src/main.py

```python
print("Hello Python Project")
```

Run:

```bash
python src/main.py
```

Output:

```text
Hello Python Project
```

---

# 11. Install Dependencies

Example packages:

```bash
pip install requests pandas
```

Check installed packages:

```bash
pip list
```

---

# 12. Pin Dependencies

Generate `requirements.txt`:

```bash
pip freeze > requirements.txt
```

Example:

```text
numpy==2.2.1
pandas==2.2.2
python-dateutil==2.9.0
pytz==2025.2
requests==2.32.3
urllib3==2.4.0
```

Why this matters:

- Reproducible environments
- Consistent deployments
- Prevents version mismatch bugs

---

# 13. Create README.md

Create file:

```bash
touch README.md
```

Example README:

```markdown
# My Python App

Simple Python project using pyenv and virtual environments.

## Setup

```bash
pyenv local 3.12.3
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python src/main.py
```
```

---

# 14. Create .gitignore

Create:

```bash
touch .gitignore
```

Add:

```gitignore
# Virtual environment
.venv/

# Python cache
__pycache__/
*.pyc

# macOS
.DS_Store

# IDEs
.vscode/
.idea/

# Environment files
.env
```

Why important?

Prevents unnecessary or sensitive files from being pushed to GitHub.

---

# 15. Initialize Git Repository

```bash
git init
```

Verify:

```bash
git status
```

---

# 16. First Git Commit

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial project setup"
```

---

# 17. Create GitHub Repository

Go to:

https://github.com

Create new repository.

Example:

```text
my-python-app
```

DO NOT initialize with:

- README
- .gitignore
- License

Because they already exist locally.

---

# 18. Connect Local Project to GitHub

Copy repository URL.

Example:

```bash
https://github.com/username/my-python-app.git
```

Add remote:

```bash
git remote add origin https://github.com/username/my-python-app.git
```

Verify:

```bash
git remote -v
```

---

# 19. Push to GitHub

Rename branch:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

Now project is live on GitHub.

---

# 20. Clone Project Later

Another machine or developer can run:

```bash
git clone https://github.com/username/my-python-app.git
cd my-python-app
```

---

# 21. Recreate Environment From requirements.txt

Set Python:

```bash
pyenv local 3.12.3
```

Create venv:

```bash
python -m venv .venv
```

Activate:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Daily Workflow

## Activate environment

```bash
source .venv/bin/activate
```

## Install package

```bash
pip install fastapi
```

## Update dependency lock

```bash
pip freeze > requirements.txt
```

## Commit changes

```bash
git add .
git commit -m "Added FastAPI"
git push
```

---

# Common Useful Commands

## Show current Python

```bash
python --version
```

## Show installed packages

```bash
pip list
```

## Show package details

```bash
pip show requests
```

## Deactivate virtual environment

```bash
deactivate
```

## Delete virtual environment

```bash
rm -rf .venv
```

## Recreate environment

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

# Best Practices

## Use pyenv per project

Avoids Python version conflicts.

---

## Always use virtual environments

Never install packages globally.

---

## Always pin dependencies

```bash
pip freeze > requirements.txt
```

---

## Never commit .venv

Huge and machine-specific.

---

## Keep source code inside src/

Cleaner architecture.

---

## Use meaningful commit messages

Good:

```bash
git commit -m "Added authentication API"
```

Bad:

```bash
git commit -m "changes"
```

---

# Recommended Future Improvements

As project grows, consider adding:

- `pytest` for testing
- `black` for formatting
- `ruff` for linting
- `pre-commit` hooks
- GitHub Actions CI/CD
- Docker support
- `.env` management
- `pyproject.toml`

---

# Complete Setup Commands (Quick Reference)

```bash
# install pyenv
brew install pyenv

# install python
pyenv install 3.12.3

# create project
mkdir my-python-app
cd my-python-app

# set local python
pyenv local 3.12.3

# create virtual environment
python -m venv .venv

# activate virtual environment
source .venv/bin/activate

# upgrade pip
pip install --upgrade pip

# create folders
mkdir src tests
touch src/main.py

# install packages
pip install requests pandas

# freeze dependencies
pip freeze > requirements.txt

# create gitignore
touch .gitignore

# initialize git
git init

# first commit
git add .
git commit -m "Initial project setup"

# connect github
git remote add origin https://github.com/username/my-python-app.git

# push
git branch -M main
git push -u origin main
```

---

# Final Notes

This workflow is:

- Professional
- Reproducible
- GitHub ready
- Production friendly
- Easy for teams
- Standard across many Python projects

It provides a strong foundation for:

- APIs
- Automation scripts
- AI projects
- Data engineering
- Backend systems
- CLI tools
- Web applications

