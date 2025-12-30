#!/bin/bash

# GameCP Packages Version Update Script
# Updates versions without publishing
# Usage: ./update-versions.sh [patch|minor|major] [package1 package2 ...]

set -e

VERSION_TYPE=${1:-patch}
PACKAGES=("${@:2}")

# If no packages specified, use all
if [ ${#PACKAGES[@]} -eq 0 ]; then
    PACKAGES=("types" "manifest" "cli")
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 Updating package versions${NC}"
echo -e "${BLUE}Version bump: ${VERSION_TYPE}${NC}"
echo -e "${BLUE}Packages: ${PACKAGES[@]}${NC}\n"

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}❌ Invalid version type: $VERSION_TYPE${NC}"
    echo "Usage: ./update-versions.sh [patch|minor|major] [package1 package2 ...]"
    exit 1
fi

declare -A VERSIONS

for package in "${PACKAGES[@]}"; do
    if [ ! -d "$package" ]; then
        echo -e "${RED}❌ Package directory not found: $package${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Updating $package...${NC}"
    cd "$package"
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
    VERSIONS[$package]=$NEW_VERSION
    echo -e "${GREEN}✓ $package → $NEW_VERSION${NC}"
    cd ..
done

echo -e "\n${BLUE}Building packages...${NC}\n"
for package in "${PACKAGES[@]}"; do
    echo -e "${YELLOW}Building $package...${NC}"
    cd "$package"
    npm run build
    echo -e "${GREEN}✓ Built${NC}"
    cd ..
done

echo -e "\n${GREEN}✓ Version update complete!${NC}\n"
echo -e "${BLUE}Updated packages:${NC}"
for package in "${PACKAGES[@]}"; do
    echo -e "  ${GREEN}✓${NC} @gamecp/$package@${VERSIONS[$package]}"
done

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Review changes: ${BLUE}git diff${NC}"
echo -e "  2. Commit: ${BLUE}git add -A && git commit -m 'chore: bump versions'${NC}"
echo -e "  3. Publish: ${BLUE}./release.sh${NC} (or manually publish each package)"
echo ""
