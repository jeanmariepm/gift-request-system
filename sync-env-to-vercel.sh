#!/bin/bash

# Sync environment variables from env files to Vercel
# Usage: ./sync-env-to-vercel.sh [preview|production]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to read env file and push to Vercel
sync_env_file() {
    local env_file=$1
    local vercel_env=$2
    
    if [ ! -f "$env_file" ]; then
        print_error "Environment file $env_file not found!"
        exit 1
    fi
    
    print_info "Reading environment variables from: $env_file"
    print_info "Target Vercel environment: $vercel_env"
    echo ""
    
    # Read the env file line by line
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
            continue
        fi
        
        # Parse KEY=VALUE
        if [[ $line =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            
            # Remove quotes if present
            value="${value%\"}"
            value="${value#\"}"
            
            print_info "Setting $key for $vercel_env environment..."
            
            # Add to Vercel (suppress verbose output)
            # Use echo -n to prevent trailing newline
            if printf "%s" "$value" | vercel env add "$key" "$vercel_env" > /dev/null 2>&1; then
                print_success "$key added successfully"
            else
                # If it fails (likely because it already exists), try to remove and re-add
                print_warning "$key already exists, updating..."
                vercel env rm "$key" "$vercel_env" --yes > /dev/null 2>&1 || true
                if printf "%s" "$value" | vercel env add "$key" "$vercel_env" > /dev/null 2>&1; then
                    print_success "$key updated successfully"
                else
                    print_error "Failed to set $key"
                fi
            fi
        fi
    done < "$env_file"
    
    echo ""
    print_success "All environment variables synced to Vercel $vercel_env environment!"
}

# Main script
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Vercel Environment Variable Sync Tool"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed!"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Run this script from the project root directory"
    exit 1
fi

# Determine which environment to sync
case "$1" in
    preview)
        sync_env_file "env.preview" "preview"
        ;;
    production)
        print_warning "You are about to sync environment variables to PRODUCTION!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Aborted."
            exit 0
        fi
        sync_env_file "env.production" "production"
        ;;
    development)
        sync_env_file "env.preview" "development"
        ;;
    all)
        print_info "Syncing all environments..."
        echo ""
        sync_env_file "env.preview" "preview"
        echo ""
        echo "─────────────────────────────────────────────────────"
        echo ""
        sync_env_file "env.preview" "development"
        echo ""
        echo "─────────────────────────────────────────────────────"
        echo ""
        print_warning "You are about to sync environment variables to PRODUCTION!"
        read -p "Continue with production? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            sync_env_file "env.production" "production"
        else
            print_info "Skipped production."
        fi
        ;;
    *)
        echo "Usage: $0 [preview|production|development|all]"
        echo ""
        echo "Examples:"
        echo "  $0 preview      # Sync env.preview to Vercel Preview environment"
        echo "  $0 production   # Sync env.production to Vercel Production environment"
        echo "  $0 development  # Sync env.preview to Vercel Development environment"
        echo "  $0 all          # Sync all environments"
        echo ""
        echo "Environment files:"
        echo "  - env.preview     → Used for Preview and Development"
        echo "  - env.production  → Used for Production"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════"
print_success "Sync complete!"
echo "═══════════════════════════════════════════════════════"
echo ""

# Show next steps
print_info "Next steps:"
echo "  1. Verify variables: vercel env ls"
echo "  2. Trigger deployment: vercel --prod=false (for preview)"
echo "  3. Or push to git to trigger automatic deployment"
echo ""

