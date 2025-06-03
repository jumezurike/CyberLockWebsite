// Comprehensive Logging System for CyberLockX UWA Platform
// Tracks user actions, UWA generation events, and system operations

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug' | 'audit';
  category: 'uwa' | 'auth' | 'assessment' | 'system' | 'user_action';
  event: string;
  details: Record<string, any>;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
}

export interface UWALogEntry extends LogEntry {
  category: 'uwa';
  uwaId?: string;
  entityType?: string;
  components?: Record<string, any>;
  generationTime?: number;
}

class Logger {
  private logs: LogEntry[] = [];
  private sessionId: string;
  private maxLogs: number = 10000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.info('system', 'Logger initialized', { sessionId: this.sessionId });
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private createLogEntry(
    level: LogEntry['level'],
    category: LogEntry['category'],
    event: string,
    details: Record<string, any> = {},
    userId?: string
  ): LogEntry {
    return {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      category,
      event,
      details,
      userId,
      sessionId: this.sessionId,
      ipAddress: 'client'
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    const logMessage = `[${entry.level.toUpperCase()}] ${entry.category}:${entry.event}`;
    const logDetails = { ...entry.details, id: entry.id, timestamp: entry.timestamp };
    
    switch (entry.level) {
      case 'error':
        console.error(logMessage, logDetails);
        break;
      case 'warning':
        console.warn(logMessage, logDetails);
        break;
      case 'debug':
        console.debug(logMessage, logDetails);
        break;
      default:
        console.log(logMessage, logDetails);
    }
  }

  // Generic logging methods
  info(category: LogEntry['category'], event: string, details?: Record<string, any>, userId?: string): void {
    this.addLog(this.createLogEntry('info', category, event, details, userId));
  }

  warning(category: LogEntry['category'], event: string, details?: Record<string, any>, userId?: string): void {
    this.addLog(this.createLogEntry('warning', category, event, details, userId));
  }

  error(category: LogEntry['category'], event: string, details?: Record<string, any>, userId?: string): void {
    this.addLog(this.createLogEntry('error', category, event, details, userId));
  }

  debug(category: LogEntry['category'], event: string, details?: Record<string, any>, userId?: string): void {
    this.addLog(this.createLogEntry('debug', category, event, details, userId));
  }

  audit(category: LogEntry['category'], event: string, details?: Record<string, any>, userId?: string): void {
    this.addLog(this.createLogEntry('audit', category, event, details, userId));
  }

  // Specialized UWA logging methods
  uwaGenerated(uwaId: string, entityType: string, components: Record<string, any>, generationTime: number, userId?: string): void {
    this.audit('uwa', 'uwa_generated', {
      uwaId,
      entityType,
      components,
      generationTime,
      algorithm: this.getAlgorithmForEntityType(entityType)
    }, userId);
  }

  uwaUpdated(uwaId: string, entityType: string, oldComponents: Record<string, any>, newComponents: Record<string, any>, userId?: string): void {
    this.audit('uwa', 'uwa_updated', {
      uwaId,
      entityType,
      oldComponents,
      newComponents,
      changes: this.calculateChanges(oldComponents, newComponents)
    }, userId);
  }

  uwaDeleted(uwaId: string, entityType: string, userId?: string): void {
    this.audit('uwa', 'uwa_deleted', { uwaId, entityType }, userId);
  }

  uwaFilterApplied(filterType: string, filterValue: string, resultCount: number, userId?: string): void {
    this.info('uwa', 'filter_applied', {
      filterType,
      filterValue,
      resultCount
    }, userId);
  }

  uwaGenerationFailed(entityType: string, components: Record<string, any>, error: string, userId?: string): void {
    this.error('uwa', 'generation_failed', {
      entityType,
      components,
      error,
      timestamp: Date.now()
    }, userId);
  }

  // User action logging
  userAction(action: string, details?: Record<string, any>, userId?: string): void {
    this.info('user_action', action, details, userId);
  }

  // Assessment logging
  assessmentStarted(assessmentId: string, assessmentType: string, userId?: string): void {
    this.audit('assessment', 'assessment_started', {
      assessmentId,
      assessmentType
    }, userId);
  }

  assessmentCompleted(assessmentId: string, assessmentType: string, score: number, duration: number, userId?: string): void {
    this.audit('assessment', 'assessment_completed', {
      assessmentId,
      assessmentType,
      score,
      duration
    }, userId);
  }

  // Query methods
  getLogs(
    category?: LogEntry['category'],
    level?: LogEntry['level'],
    startDate?: Date,
    endDate?: Date,
    limit?: number
  ): LogEntry[] {
    let filtered = this.logs;

    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (startDate) {
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(log => log.timestamp <= endDate);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  getUWALogs(): UWALogEntry[] {
    return this.getLogs('uwa') as UWALogEntry[];
  }

  getAuditTrail(userId?: string): LogEntry[] {
    let auditLogs = this.getLogs(undefined, 'audit');
    
    if (userId) {
      auditLogs = auditLogs.filter(log => log.userId === userId);
    }

    return auditLogs;
  }

  // Statistics
  getLogStats(): {
    total: number;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
    sessionId: string;
  } {
    const byCategory: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    this.logs.forEach(log => {
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byCategory,
      byLevel,
      sessionId: this.sessionId
    };
  }

  // Clear logs (with audit trail)
  clearLogs(userId?: string): void {
    const logCount = this.logs.length;
    this.audit('system', 'logs_cleared', { 
      clearedCount: logCount,
      clearedBy: userId || 'system'
    }, userId);
    
    this.logs = [];
  }

  // Export logs
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'level', 'category', 'event', 'details', 'userId', 'sessionId'];
      const csvRows = [headers.join(',')];
      
      this.logs.forEach(log => {
        const row = [
          log.id,
          log.timestamp.toISOString(),
          log.level,
          log.category,
          log.event,
          JSON.stringify(log.details),
          log.userId || '',
          log.sessionId
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    } else {
      return JSON.stringify(this.logs, null, 2);
    }
  }

  // Helper methods
  private getAlgorithmForEntityType(entityType: string): string {
    switch (entityType) {
      case 'physical-machine':
      case 'virtual-machine':
        return 'Last26InstanceUUID + First2Env + Last7Address + First7OSname';
      case 'business-owner':
        return '8DOB + Last5EIN + InitialsFLName + Last13NumbersIMEI + Last7BirthPlace + Last7Address';
      case 'human-individual':
        return '8DOB + Last5EIN + InitialsFLName + Last13NumbersIMEI + Last7BirthPlace + Last7DriverLic';
      case 'user-account':
      case 'service-account':
        return 'Person algorithm variant for account types';
      default:
        return 'Unknown algorithm';
    }
  }

  private calculateChanges(oldData: Record<string, any>, newData: Record<string, any>): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {};
    
    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
    
    allKeys.forEach(key => {
      if (oldData[key] !== newData[key]) {
        changes[key] = {
          old: oldData[key],
          new: newData[key]
        };
      }
    });

    return changes;
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for React components
export default logger;