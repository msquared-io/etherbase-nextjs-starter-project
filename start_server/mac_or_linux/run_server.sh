# fill me in
#!/bin/bash

# Function to log messages with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    log_message "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    
    # Source nvm
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    # shellcheck disable=SC1091
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    if ! command -v nvm &> /dev/null; then
        log_message "Error: Failed to install nvm"
        exit 1
    fi
    log_message "nvm installed successfully"
fi

# Install and use Node.js
NODE_VERSION="22.14.0"
log_message "Installing Node.js $NODE_VERSION..."
nvm install $NODE_VERSION
nvm use $NODE_VERSION

# Verify Node.js installation
if ! command -v node &> /dev/null; then
    log_message "Error: Node.js installation failed"
    exit 1
fi
log_message "Node.js $(node -v) installed successfully"

# Install project dependencies
log_message "Installing project dependencies..."
cd "$(dirname "$(dirname "$(dirname "$0")")")" || exit 1

# Install Next.js if not already installed
if ! npm list next &> /dev/null; then
    log_message "Installing Next.js..."
    npm install next
fi

if ! npm install; then
    log_message "Error: Failed to install project dependencies"
    exit 1
fi
log_message "Project dependencies installed successfully"

# Start the development server
log_message "Starting development server..."
npm run dev
