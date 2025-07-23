#!/bin/bash
# CyberLockX File Protection System - Critical Files Backup
# Automatically backs up and protects SOS2A tool components

BACKUP_DIR="file_protection_system/protected_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory structure
mkdir -p "$BACKUP_DIR/$TIMESTAMP"

# Critical SOS2A Files to Protect
CRITICAL_FILES=(
    "client/src/components/sos2a/report-display.tsx"
    "client/src/components/sos2a/questionnaire-form.tsx" 
    "client/src/components/sos2a/assessment-workflow.tsx"
    "client/src/pages/sos2a-tool.tsx"
    "client/src/lib/sos2a-types.ts"
    "client/src/lib/sos2a-utils.ts"
    "client/src/lib/gap-analysis.ts"
    "shared/schema.ts"
    "server/routes.ts"
    "replit.md"
)

# Backup each critical file
echo "=== CyberLockX File Protection System ==="
echo "Creating protected backup: $TIMESTAMP"
echo ""

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Create directory structure in backup
        backup_path="$BACKUP_DIR/$TIMESTAMP/$(dirname "$file")"
        mkdir -p "$backup_path"
        
        # Copy file with verification
        cp "$file" "$backup_path/"
        if [ $? -eq 0 ]; then
            echo "✅ PROTECTED: $file"
        else
            echo "❌ FAILED: $file"
        fi
    else
        echo "⚠️  MISSING: $file"
    fi
done

# Create manifest file
echo ""
echo "Creating backup manifest..."
cat > "$BACKUP_DIR/$TIMESTAMP/BACKUP_MANIFEST.txt" << EOF
CyberLockX File Protection System
Backup Created: $(date)
Backup ID: $TIMESTAMP

Protected Files:
EOF

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        file_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        file_hash=$(sha256sum "$file" 2>/dev/null | cut -d' ' -f1 || shasum -a 256 "$file" 2>/dev/null | cut -d' ' -f1)
        echo "$file | Size: $file_size bytes | SHA256: $file_hash" >> "$BACKUP_DIR/$TIMESTAMP/BACKUP_MANIFEST.txt"
    fi
done

echo ""
echo "🔒 BACKUP COMPLETE: $BACKUP_DIR/$TIMESTAMP"
echo "📋 Manifest: $BACKUP_DIR/$TIMESTAMP/BACKUP_MANIFEST.txt"