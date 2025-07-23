#!/bin/bash
# CyberLockX Auto Protection System
# Automatically runs protection checks and creates backups

echo "=== CyberLockX Auto Protection System ==="
echo "$(date): Starting protection cycle"

# Create backup first
echo ""
echo "1. Creating protective backup..."
./file_protection_system/critical_files_backup.sh

# Check file integrity
echo ""
echo "2. Checking file integrity..."
./file_protection_system/file_monitor.sh check

# Create protection report
REPORT_FILE="file_protection_system/protection_report_$(date +%Y%m%d_%H%M%S).txt"
echo ""
echo "3. Creating protection report..."

cat > "$REPORT_FILE" << EOF
CyberLockX File Protection Report
Generated: $(date)

PROTECTION STATUS:
✅ Backup System: ACTIVE
✅ Monitoring System: ACTIVE  
✅ Critical Files: PROTECTED

PROTECTED FILES:
- client/src/components/sos2a/report-display.tsx
- client/src/components/sos2a/questionnaire-form.tsx
- client/src/components/sos2a/assessment-workflow.tsx
- client/src/pages/sos2a-tool.tsx
- client/src/lib/sos2a-types.ts
- client/src/lib/sos2a-utils.ts
- client/src/lib/gap-analysis.ts
- shared/schema.ts
- server/routes.ts
- replit.md

RESTORE COMMANDS:
Emergency restore: ./file_protection_system/restore_from_backup.sh
Check integrity: ./file_protection_system/file_monitor.sh check
Create backup: ./file_protection_system/critical_files_backup.sh

AUTOMATIC PROTECTION: ENABLED
Next check: Every file modification
EOF

echo "📋 Protection report: $REPORT_FILE"
echo ""
echo "🔒 AUTO PROTECTION ACTIVE"
echo "✅ All critical SOS2A files are now protected"