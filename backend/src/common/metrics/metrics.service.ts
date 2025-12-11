import { Injectable } from '@nestjs/common'
import * as promClient from 'prom-client'

@Injectable()
export class MetricsService {
  private readonly register: promClient.Registry
  private readonly httpRequestDuration: promClient.Histogram<string>
  private readonly httpRequestTotal: promClient.Counter<string>
  private readonly httpRequestErrors: promClient.Counter<string>
  private readonly activeConnections: promClient.Gauge<string>
  private readonly databaseQueryDuration: promClient.Histogram<string>
  private readonly aiProcessingDuration: promClient.Histogram<string>
  private readonly audioProcessingDuration: promClient.Histogram<string>

  constructor() {
    // Create a Registry to register the metrics
    this.register = new promClient.Registry()

    // Add default metrics (CPU, memory, etc.)
    promClient.collectDefaultMetrics({ register: this.register })

    // HTTP Request Duration Histogram
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [this.register],
    })

    // HTTP Request Total Counter
    this.httpRequestTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    })

    // HTTP Request Errors Counter
    this.httpRequestErrors = new promClient.Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    })

    // Active Connections Gauge
    this.activeConnections = new promClient.Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [this.register],
    })

    // Database Query Duration Histogram
    this.databaseQueryDuration = new promClient.Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.register],
    })

    // AI Processing Duration Histogram
    this.aiProcessingDuration = new promClient.Histogram({
      name: 'ai_processing_duration_seconds',
      help: 'Duration of AI processing in seconds',
      labelNames: ['type', 'model'],
      buckets: [1, 2, 5, 10, 15, 30, 60],
      registers: [this.register],
    })

    // Audio Processing Duration Histogram
    this.audioProcessingDuration = new promClient.Histogram({
      name: 'audio_processing_duration_seconds',
      help: 'Duration of audio processing in seconds',
      labelNames: ['operation'],
      buckets: [1, 2, 5, 10, 15, 30, 60],
      registers: [this.register],
    })
  }

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number
  ) {
    const labels = {
      method,
      route: this.normalizeRoute(route),
      status_code: statusCode.toString(),
    }

    this.httpRequestDuration.observe(labels, duration / 1000) // Convert to seconds
    this.httpRequestTotal.inc(labels)

    if (statusCode >= 400) {
      this.httpRequestErrors.inc(labels)
    }
  }

  /**
   * Record database query metrics
   */
  recordDatabaseQuery(operation: string, table: string, duration: number) {
    this.databaseQueryDuration.observe(
      { operation, table },
      duration / 1000 // Convert to seconds
    )
  }

  /**
   * Record AI processing metrics
   */
  recordAiProcessing(type: string, model: string, duration: number) {
    this.aiProcessingDuration.observe(
      { type, model },
      duration / 1000 // Convert to seconds
    )
  }

  /**
   * Record audio processing metrics
   */
  recordAudioProcessing(operation: string, duration: number) {
    this.audioProcessingDuration.observe(
      { operation },
      duration / 1000 // Convert to seconds
    )
  }

  /**
   * Increment active connections
   */
  incrementActiveConnections() {
    this.activeConnections.inc()
  }

  /**
   * Decrement active connections
   */
  decrementActiveConnections() {
    this.activeConnections.dec()
  }

  /**
   * Get metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return this.register.metrics()
  }

  /**
   * Normalize route for metrics (remove IDs, etc.)
   */
  private normalizeRoute(route: string): string {
    // Replace IDs with :id
    return route
      .replace(/\/[a-f0-9-]{20,}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .replace(/\/api/, '')
  }
}

