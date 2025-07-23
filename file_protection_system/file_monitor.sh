#!/bin/bash
# CyberLockX File Protection System - Real-time Monitoring
# Monitors critical files for unauthorized changes

CRITICAL_FILES=(
    "client/src/components/sos2a/report-display.tsx"
    "client/src/components/sos2a/questionnaire-form.tsx" 
    "client/src/components/sos2a/assessment-workflow.tsx"
    "client/src/pages/sos2a-tool.tsx"
    "client/src/lib/sos2a-types.ts"
    "client/src/lib/gap-analysis.ts"
    "replit.md"
)

MONITOR_DIR="file_protection_system/monitoring"
mkdir -p "$MONITOR_DIR"

# Create baseline checksums
create_baseline() {
    echo "=== Creating File Protection Baseline ==="
    echo ""
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            file_hash=$(sha256sum "$file" 2>/dev/null | cut -d' ' -f1 || shasum -a 256 "$file" 2>/dev/null | cut -d' ' -f1)
            echo "$file:$file_hash" >> "$MONITOR_DIR/baseline_checksums.txt"
            echo "✅ BASELINE: $file"
        else
            echo "⚠️  MISSING: $file"
        fi
    done
    
    echo ""
    echo "🔒 BASELINE CREATED: $(date)" >> "$MONITOR_DIR/baseline_checksums.txt"
}

# Check for changes
check_integrity() {
    echo "=== File Integrity Check ==="
    echo ""
    
    if [ ! -f "$MONITOR_DIR/baseline_checksums.txt" ]; then
        echo "❌ No baseline found! Creating one..."
        create_baseline
        return
    fi
    
    changes_detected=false
    
    while IFS=':' read -r file baseline_hash; do
        # Skip timestamp line
        if [[ "$file" == "🔒 BASELINE CREATED"* ]]; then
            continue
        fi
        
        if [ -f "$file" ]; then
            current_hash=$(sha256sum "$file" 2>/dev/null | cut -d' ' -f1 || shasum -a 256 "$file" 2>/dev/null | cut -d' ' -f1)
            
            if [ "$current_hash" != "$baseline_hash" ]; then
                echo "🚨 CHANGE DETECTED: $file"
                echo "   Baseline: $baseline_hash"
                echo "   Current:  $current_hash"
                echo "   Time: $(date)" >> "$MONITOR_DIR/change_log.txt"
                echo "   File: $file" >> "$MONITOR_DIR/change_log.txt"
                echo "   Change: $baseline_hash -> $current_hash" >> "$MONITOR_DIR/change_log.txt"
                echo "" >> "$MONITOR_DIR/change_log.txt"
                changes_detected=true
            else
                echo "✅ INTACT: $file"
            fi
        else
            echo "❌ DELETED: $file"
            changes_detected=true
        fi
    done < "$MONITOR_DIR/baseline_checksums.txt"
    
    if [ "$changes_detected" = true ]; then
        echo ""
        echo "🚨 UNAUTHORIZED CHANGES DETECTED!"
        echo "📋 Check log: $MONITOR_DIR/change_log.txt"
        echo "🔄 Run restore script if needed"
    else
        echo ""
        echo "🔒 ALL FILES SECURE"
    fi
}

# Command handling
case "$1" in
    "baseline")
        create_baseline
        ;;
    "check")
        check_integrity
        ;;
    *)
        echo "Usage: $0 {baseline|check}"
        echo ""
        echo "  baseline - Create new baseline checksums"
        echo "  check    - Check for file changes"
        ;;
esac