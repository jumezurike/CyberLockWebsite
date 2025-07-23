#!/bin/bash
# CyberLockX File Protection System - Emergency Restoration
# Restores SOS2A components from protected backups

BACKUP_DIR="file_protection_system/protected_backups"

# List available backups
echo "=== CyberLockX Emergency Restoration System ==="
echo ""
echo "Available Protected Backups:"
echo ""

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ No backup directory found!"
    exit 1
fi

backups=($(ls -1 "$BACKUP_DIR" | sort -r))

if [ ${#backups[@]} -eq 0 ]; then
    echo "❌ No backups available!"
    exit 1
fi

# Show latest backup by default
latest_backup="${backups[0]}"

echo "📋 Latest Backup: $latest_backup"
echo ""

if [ -f "$BACKUP_DIR/$latest_backup/BACKUP_MANIFEST.txt" ]; then
    echo "Backup Contents:"
    cat "$BACKUP_DIR/$latest_backup/BACKUP_MANIFEST.txt"
    echo ""
fi

# Restore function
restore_backup() {
    local backup_id="$1"
    local backup_path="$BACKUP_DIR/$backup_id"
    
    if [ ! -d "$backup_path" ]; then
        echo "❌ Backup $backup_id not found!"
        return 1
    fi
    
    echo "🔄 Restoring from backup: $backup_id"
    echo ""
    
    # Find all files in backup and restore them
    find "$backup_path" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.md" | while read backup_file; do
        # Calculate relative path from backup root
        relative_path=${backup_file#$backup_path/}
        
        # Skip manifest file
        if [[ "$relative_path" == "BACKUP_MANIFEST.txt" ]]; then
            continue
        fi
        
        # Ensure target directory exists
        target_dir=$(dirname "$relative_path")
        mkdir -p "$target_dir"
        
        # Restore file
        if cp "$backup_file" "$relative_path"; then
            echo "✅ RESTORED: $relative_path"
        else
            echo "❌ FAILED: $relative_path"
        fi
    done
    
    echo ""
    echo "🔒 RESTORATION COMPLETE"
}

# If backup ID provided as argument, restore it
if [ $# -eq 1 ]; then
    restore_backup "$1"
else
    # Otherwise restore latest
    restore_backup "$latest_backup"
fi