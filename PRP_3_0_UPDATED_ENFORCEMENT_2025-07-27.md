# PRP 3.0 Updated Enforcement Protocol
## Date: July 27, 2025 - 21:52 PM

## MANDATORY PRE-WORK BACKUP ENFORCEMENT - UPDATED PROTOCOL

### ABSOLUTE BLOCKING REQUIREMENTS
**AGENT CANNOT PROCEED WITHOUT PRE-WORK BACKUP**

#### 1. MANDATORY PRE-WORK BACKUP CREATION
```bash
# REQUIRED: Create timestamped backup before ANY work
cp [target_file] PRE_WORK_BACKUP_$(date +%Y-%m-%d_%H-%M)_[filename]
```
- **VIOLATION CONSEQUENCE**: Immediate work stoppage if no backup exists
- **VERIFICATION REQUIRED**: Backup file existence must be confirmed
- **NO EXCEPTIONS**: Even minor edits require backup creation

#### 2. GIT VERIFICATION CHECKPOINT
```bash
# REQUIRED: Verify git status and recent commits
git log --oneline -5
git status --porcelain
```
- **PURPOSE**: Identify last known good state for emergency restoration
- **DOCUMENTATION**: Record current commit hash and file states
- **FAILURE PROTOCOL**: If git unavailable, create manual backup copies

#### 3. FILE INTEGRITY BASELINE
```bash
# REQUIRED: Document current file size and LSP status
wc -l [target_file]
# Check for existing errors before starting
```
- **BASELINE METRICS**: Line count, LSP diagnostic count, compilation status
- **VERIFICATION**: Zero LSP errors required before proceeding
- **CORRUPTION DETECTION**: Establish known-good state for comparison

### ENFORCEMENT MECHANISM
**AGENT CANNOT WORK WITHOUT BACKUP CONFIRMATION**
- **BLOCKING REQUIREMENT**: Backup file path must be explicitly documented
- **VERIFICATION STEP**: Backup integrity must be confirmed before ANY str_replace operations
- **VIOLATION RESPONSE**: If backup missing, agent MUST create backup before proceeding
- **NO OVERRIDE**: User cannot waive backup requirement - it's mandatory for system integrity

### AGENT ENFORCEMENT PROTOCOL
**BEFORE ANY str_replace_based_edit_tool USAGE:**
```
STEP 1: Create backup file with timestamp
STEP 2: Verify backup file exists and is readable  
STEP 3: Document backup path in session logs
STEP 4: Only then proceed with file modifications
```

**VIOLATION DETECTION:**
- If backup file missing, agent MUST create it before ANY edits
- If backup verification fails, agent MUST resolve before proceeding
- No emergency overrides permitted - backup is absolute requirement

### MANDATORY BACKUP ENFORCEMENT RULES
#### For Agent Compliance:
1. **CANNOT START WORK** without creating PRE_WORK_BACKUP_[timestamp]_[filename]
2. **MUST VERIFY** backup file exists and is readable before ANY str_replace operations
3. **REQUIRED DOCUMENTATION** of backup file path in work session logs
4. **BLOCKING CHECKPOINT** - No exceptions, no overrides, no emergency bypasses

#### For User Protection:
- **DATA LOSS PREVENTION**: Backup requirement protects against file corruption incidents
- **RECOVERY CAPABILITY**: Always maintain ability to restore to pre-work state
- **AUDIT TRAIL**: Timestamped backups provide clear rollback points
- **SYSTEM INTEGRITY**: Prevents catastrophic work loss like EPA system incident

### UPDATED BACKUP VERIFICATION CHECKLIST
1. ✅ **MANDATORY PRE-WORK BACKUP** created and verified (BLOCKING REQUIREMENT)
2. ✅ Backup file path documented and confirmed readable
3. ✅ Git status and commit hash recorded for emergency restoration
4. ✅ File integrity baseline established (line count, LSP status)
5. ✅ Working directory confirmed
6. ✅ User approval for changes obtained
7. ✅ Milestone backups at 25%, 50%, 75% completion
8. ✅ Individual str_replace operation success verification
9. ✅ LSP diagnostic checking after each major edit
10. ✅ End-of-day comprehensive backup
11. ✅ Restoration documentation updated

### VIOLATION CONSEQUENCES
- Any work without proper backup is considered CRITICAL PRP VIOLATION
- **ABSOLUTE ENFORCEMENT**: Agent cannot proceed with ANY file modifications without backup
- Immediate work stoppage and backup creation required
- System restoration from last known good backup
- Re-documentation of all progress lost

## IMPLEMENTATION STATUS
✅ **PRP 3.0 Updated** - Mandatory backup enforcement now active
✅ **Protocol Documentation** - Complete enforcement mechanisms documented
✅ **Agent Compliance Required** - No work permitted without backup verification
✅ **User Protection Enhanced** - Data loss prevention protocols strengthened

**NEXT STEP**: Apply updated PRP 3.0 protocol to all future work sessions
**ENFORCEMENT**: Agent must follow backup protocol before ANY file modifications
**COMPLIANCE**: No exceptions, no overrides, no emergency bypasses permitted