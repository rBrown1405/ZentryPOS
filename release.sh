#!/bin/bash

# Release script for Zentry POS
# This script packages the system for deployment

# Set variables
VERSION="1.0.0"
RELEASE_DATE=$(date +"%Y-%m-%d")
RELEASE_DIR="dist"
RELEASE_NAME="ZentryPOS_v${VERSION}_${RELEASE_DATE}"

# Create release directory structure
echo "Creating release package: $RELEASE_NAME"
mkdir -p $RELEASE_DIR

# Create version info
cat > version.json << EOF
{
  "name": "Zentry POS System",
  "version": "$VERSION",
  "buildDate": "$RELEASE_DATE",
  "releaseNotes": [
    "Initial release of Zentry POS System"
  ]
}
EOF

# Package the files
echo "Packaging files..."
zip -r "$RELEASE_DIR/$RELEASE_NAME.zip" \
  app/ \
  admin/ \
  auth/ \
  js/ \
  styles/ \
  assets/ \
  docs/ \
  api/ \
  index.html \
  README.md \
  version.json \
  -x "**/.DS_Store" \
  -x "**/node_modules/**" \
  -x "**/.git/**" \
  -x "**/.env*" \
  -x "test/**"

echo "Release package created: $RELEASE_DIR/$RELEASE_NAME.zip"
echo "Package size: $(du -h $RELEASE_DIR/$RELEASE_NAME.zip | cut -f1)"

# Create installation script
cat > $RELEASE_DIR/install.sh << 'EOF'
#!/bin/bash

echo "Zentry POS Installation Script"
echo "==============================="

# Check if user is root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root or with sudo"
  exit 1
fi

# Prompt for installation directory
read -p "Enter installation directory [/var/www/html]: " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/var/www/html}

# Check if directory exists, create if needed
if [ ! -d "$INSTALL_DIR" ]; then
  echo "Creating directory: $INSTALL_DIR"
  mkdir -p "$INSTALL_DIR"
fi

# Extract files
echo "Installing files to $INSTALL_DIR..."
unzip -o ZentryPOS_*.zip -d "$INSTALL_DIR"

# Set correct ownership
read -p "Enter web server user [www-data]: " WEB_USER
WEB_USER=${WEB_USER:-www-data}
chown -R "$WEB_USER:$WEB_USER" "$INSTALL_DIR"

echo "Installation completed"
echo "Access your POS system at http://your-server/"
EOF

chmod +x $RELEASE_DIR/install.sh

echo "Installation script created: $RELEASE_DIR/install.sh"
echo "Release packaging complete!"
