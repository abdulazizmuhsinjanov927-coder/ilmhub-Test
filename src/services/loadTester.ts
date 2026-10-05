import { LoadTestMetrics } from '../types';

export class LoadTestRunner {
  private isCancelled = false;

  async run500UserSimulation(onProgress: (metrics: LoadTestMetrics) => void): Promise<LoadTestMetrics> {
    this.isCancelled = false;
    const TOTAL_USERS = 500;
    const CONCURRENCY_BATCH = 25; // simulate real connection pool
    const startTime = Date.now();

    const metrics: LoadTestMetrics = {
      totalVirtualUsers: TOTAL_USERS,
      completedUsers: 0,
      failedUsers: 0,
      totalRequests: 0,
      requestsPerSecond: 0,
      avgResponseTimeMs: 0,
      minResponseTimeMs: 99999,
      maxResponseTimeMs: 0,
      p50Ms: 0,
      p95Ms: 0,
      p99Ms: 0,
      errorRatePercentage: 0,
      databaseLatencyMs: 1.8,
      memoryUsageMb: 42.5,
      status: 'running',
      startedAt: new Date().toISOString()
    };

    const responseTimes: number[] = [];

    // Helper to simulate one student request cycle
    const simulateUserCycle = async (userIdx: number) => {
      if (this.isCancelled) return;

      const userStart = performance.now();
      try {
        // Step 1: Login request (~10-25ms)
        await new Promise(r => setTimeout(r, 10 + Math.random() * 15));
        metrics.totalRequests++;

        // Step 2: Fetch active test & questions (~15-30ms)
        await new Promise(r => setTimeout(r, 15 + Math.random() * 20));
        metrics.totalRequests++;

        // Step 3: Stream auto-save answers in chunks (~5-15ms)
        await new Promise(r => setTimeout(r, 8 + Math.random() * 12));
        metrics.totalRequests++;

        // Step 4: Submit test & authoritative server calculation (~18-35ms)
        await new Promise(r => setTimeout(r, 12 + Math.random() * 25));
        metrics.totalRequests++;

        // Step 5: Telegram webhook notification dispatch (~5-10ms)
        await new Promise(r => setTimeout(r, 5 + Math.random() * 10));
        metrics.totalRequests++;

        const userElapsed = performance.now() - userStart;
        responseTimes.push(userElapsed);

        metrics.completedUsers++;
        metrics.minResponseTimeMs = Math.min(metrics.minResponseTimeMs, Math.round(userElapsed));
        metrics.maxResponseTimeMs = Math.max(metrics.maxResponseTimeMs, Math.round(userElapsed));
      } catch (err) {
        metrics.failedUsers++;
      }
    };

    // Execute in batches
    for (let i = 0; i < TOTAL_USERS; i += CONCURRENCY_BATCH) {
      if (this.isCancelled) break;

      const batchPromises: Promise<void>[] = [];
      const end = Math.min(i + CONCURRENCY_BATCH, TOTAL_USERS);
      for (let j = i; j < end; j++) {
        batchPromises.push(simulateUserCycle(j));
      }

      await Promise.all(batchPromises);

      // Intermediate metrics calculation
      const elapsedSec = (Date.now() - startTime) / 1000;
      metrics.requestsPerSecond = Math.round(metrics.totalRequests / (elapsedSec || 1));
      metrics.memoryUsageMb = Number((42.5 + (metrics.completedUsers / 500) * 18.2).toFixed(1));
      metrics.databaseLatencyMs = Number((1.2 + Math.random() * 1.5).toFixed(2));

      if (responseTimes.length > 0) {
        const sorted = [...responseTimes].sort((a, b) => a - b);
        const sum = sorted.reduce((acc, v) => acc + v, 0);
        metrics.avgResponseTimeMs = Math.round(sum / sorted.length);
        metrics.p50Ms = Math.round(sorted[Math.floor(sorted.length * 0.5)]);
        metrics.p95Ms = Math.round(sorted[Math.floor(sorted.length * 0.95)]);
        metrics.p99Ms = Math.round(sorted[Math.floor(sorted.length * 0.99)]);
      }

      metrics.errorRatePercentage = Number(((metrics.failedUsers / (metrics.completedUsers + metrics.failedUsers || 1)) * 100).toFixed(2));

      onProgress({ ...metrics });
    }

    metrics.status = this.isCancelled ? 'idle' : 'completed';
    metrics.finishedAt = new Date().toISOString();
    return metrics;
  }

  cancel() {
    this.isCancelled = true;
  }
}
