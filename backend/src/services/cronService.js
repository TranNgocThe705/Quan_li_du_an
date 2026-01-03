import cron from 'node-cron';
import AutoApprovalService from './autoApprovalService.js';

class CronService {
  constructor() {
    this.jobs = [];
  }

  /**
   * Start all scheduled cron jobs
   */
  start() {
    console.log('🕐 Starting cron jobs...');

    // Process auto-approvals every hour
    const autoApprovalJob = cron.schedule('0 * * * *', async () => {
      console.log('⏰ Running scheduled auto-approval processing...');
      try {
        const result = await AutoApprovalService.processScheduledAutoApprovals();
        console.log(`✅ Auto-approval job completed: ${result.processedCount} tasks processed, ${result.approvedCount} auto-approved`);
      } catch (error) {
        console.error('❌ Auto-approval job failed:', error);
      }
    });

    // Send escalation reminders daily at 9 AM
    const escalationJob = cron.schedule('0 9 * * *', async () => {
      console.log('⏰ Running escalation reminders...');
      try {
        const result = await AutoApprovalService.sendEscalationReminders();
        console.log(`✅ Escalation reminders sent: ${result.remindersCount} notifications sent`);
      } catch (error) {
        console.error('❌ Escalation reminders failed:', error);
      }
    });

    this.jobs.push(
      { name: 'auto-approval', job: autoApprovalJob },
      { name: 'escalation-reminders', job: escalationJob }
    );

    console.log('✅ Cron jobs started successfully:');
    console.log('   - Auto-approval: Every hour');
    console.log('   - Escalation reminders: Daily at 9 AM');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    console.log('🛑 Stopping cron jobs...');
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`   - Stopped: ${name}`);
    });
    this.jobs = [];
  }

  /**
   * Get status of all cron jobs
   */
  getStatus() {
    return this.jobs.map(({ name, job }) => ({
      name,
      running: job.getStatus() === 'scheduled'
    }));
  }
}

// Export singleton instance
export default new CronService();
