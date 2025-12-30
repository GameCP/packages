#!/bin/bash

# GameCP Packages Release Script
# Usage: ./release.sh [patch|minor|major] [package1 package2 ...]
# Examples:
#   ./release.sh patch              # Bump patch version for all packages
#   ./release.sh minor types cli    # Bump minor version for types and cli only
#   ./release.sh major              # Bump major version for all packages

set -e

VERSION_TYPE=${1:-patch}
shift
PACKAGES=("$@")

# If no packages specified, use all
if [ ${#PACKAGES[@]} -eq 0 ]; then
    PACKAGES=("types" "manifest" "cli")
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GameCP Package Release${NC}"
echo -e "${BLUE}Version bump: ${VERSION_TYPE}${NC}"
echo -e "${BLUE}Packages: ${PACKAGES[@]}${NC}\n"

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}❌ Invalid version type: $VERSION_TYPE${NC}"
    echo "Usage: ./release.sh [patch|minor|major] [package1 package2 ...]"
    exit 1
fi

# Temporary file to store versions
VERSIONS_FILE=$(mktemp)
trap "rm -f $VERSIONS_FILE" EXIT

# Function to bump version
bump_version() {
    local package=$1
    echo -e "${YELLOW}📦 Bumping $package...${NC}"
    
    cd "$package"
    
    # Bump version
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    echo -e "${GREEN}✓ $package bumped to $NEW_VERSION${NC}"
    
    # Store version in temp file
    echo "$package:$NEW_VERSION" >> "$VERSIONS_FILE"
    
    cd ..
}

# Function to build package
build_package() {
    local package=$1
    echo -e "${YELLOW}🔨 Building $package...${NC}"
    
    cd "$package"
    npm run build
    echo -e "${GREEN}✓ $package built${NC}"
    cd ..
}

# Function to publish package
publish_package() {
    local package=$1
    local version=$2
    echo -e "${YELLOW}📤 Publishing $package@$version...${NC}"
    
    cd "$package"
    npm publish
    echo -e "${GREEN}✓ $package@$version published${NC}"
    cd ..
}

# Function to get version for package
get_version() {
    local package=$1
    grep "^$package:" "$VERSIONS_FILE" | cut -d: -f2
}

# Step 1: Bump versions
echo -e "\n${BLUE}Step 1: Bumping versions${NC}\n"
for package in "${PACKAGES[@]}"; do
    if [ ! -d "$package" ]; then
        echo -e "${RED}❌ Package directory not found: $package${NC}"
        exit 1
    fi
    
    bump_version "$package"
done

# Step 2: Build packages
echo -e "\n${BLUE}Step 2: Building packages${NC}\n"
for package in "${PACKAGES[@]}"; do
    build_package "$package"
done

# Step 3: Commit version bumps
echo -e "\n${BLUE}Step 3: Committing version bumps${NC}\n"
git add -A
git commit -m "chore: release ${PACKAGES[@]} - $VERSION_TYPE version bump"
echo -e "${GREEN}✓ Changes committed${NC}"

# Step 4: Publish packages (in dependency order)
echo -e "\n${BLUE}Step 4: Publishing to npm${NC}\n"

# Define dependency order
PUBLISH_ORDER=()
for pkg in "types" "manifest" "cli"; do
    for selected in "${PACKAGES[@]}"; do
        if [ "$pkg" = "$selected" ]; then
            PUBLISH_ORDER+=("$pkg")
            break
        fi
    done
done

for package in "${PUBLISH_ORDER[@]}"; do
    VERSION=$(get_version "$package")
    publish_package "$package" "$VERSION"
done

# Step 5: Create git tags
echo -e "\n${BLUE}Step 5: Creating git tags${NC}\n"
for package in "${PACKAGES[@]}"; do
    VERSION=$(get_version "$package")
    TAG="${package}-${VERSION}"
    git tag -a "$TAG" -m "@gamecp/$package ${VERSION}"
    echo -e "${GREEN}✓ Created tag: $TAG${NC}"
done

# Step 6: Push to GitHub
echo -e "\n${BLUE}Step 6: Pushing to GitHub${NC}\n"
git push
git push --tags
echo -e "${GREEN}✓ Pushed to GitHub${NC}"

# Summary
echo -e "\n${GREEN}🎉 Release complete!${NC}\n"
echo -e "${BLUE}Published packages:${NC}"
for package in "${PACKAGES[@]}"; do
    VERSION=$(get_version "$package")
    echo -e "  ${GREEN}✓${NC} @gamecp/$package@${VERSION}"
done
echo ""
