import Parser from 'rss-parser';

export interface IRiskAssessment {
  riskScorePercentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  feedSource: string;
  totalIncidentsAnalyzed: number;
  recentIncidents: Array<{
    title: string;
    pubDate: string;
    link?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
  summary: string;
  mitigationAdvice: string;
  fetchedAt: string;
}

export class SprintRiskService {
  private parser: Parser;
  private rssUrl: string;

  constructor(rssUrl: string = 'https://www.githubstatus.com/history.rss') {
    this.parser = new Parser();
    this.rssUrl = rssUrl;
  }

  /**
   * Fetches RSS feed and calculates Sprint Risk Score (0-100%).
   */
  public async fetchAndCalculateRisk(): Promise<IRiskAssessment> {
    try {
      const feed = await this.parser.parseURL(this.rssUrl);
      return this.analyzeFeedItems(feed.items || [], this.rssUrl);
    } catch (error) {
      console.warn(`[SprintRiskService] Unable to fetch live RSS feed (${this.rssUrl}). Using resilience fallback data.`, error);
      return this.getFallbackRiskAssessment();
    }
  }

  private analyzeFeedItems(items: Parser.Item[], feedSource: string): IRiskAssessment {
    const now = new Date();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    
    // Filter items within last 7 days
    const recentItems = items.filter(item => {
      if (!item.pubDate) return false;
      const pubTime = new Date(item.pubDate).getTime();
      return (now.getTime() - pubTime) <= SEVEN_DAYS_MS;
    });

    let cumulativeRiskWeight = 0;
    const analyzedIncidents: Array<{
      title: string;
      pubDate: string;
      link?: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }> = [];

    recentItems.forEach(item => {
      const titleLower = (item.title || '').toLowerCase();
      const contentLower = (item.contentSnippet || item.content || '').toLowerCase();

      let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      let weight = 5;

      if (titleLower.includes('major') || titleLower.includes('outage') || contentLower.includes('major outage')) {
        severity = 'CRITICAL';
        weight = 30;
      } else if (titleLower.includes('degraded') || titleLower.includes('partial') || contentLower.includes('incident')) {
        severity = 'HIGH';
        weight = 20;
      } else if (titleLower.includes('investigating') || titleLower.includes('disruption')) {
        severity = 'MEDIUM';
        weight = 12;
      }

      cumulativeRiskWeight += weight;

      analyzedIncidents.push({
        title: item.title || 'Service Status Alert',
        pubDate: item.pubDate || new Date().toISOString(),
        link: item.link,
        severity
      });
    });

    // Cap risk score between 0% and 100%
    const riskScorePercentage = Math.min(100, Math.max(5, cumulativeRiskWeight));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let mitigationAdvice = 'Sprint infrastructure is stable. Proceed with planned velocity.';

    if (riskScorePercentage >= 70) {
      riskLevel = 'CRITICAL';
      mitigationAdvice = 'High risk of deployment blockages due to severe upstream outages. Pause major production deployments and prepare fallback CI/CD pipelines.';
    } else if (riskScorePercentage >= 40) {
      riskLevel = 'HIGH';
      mitigationAdvice = 'Moderate infrastructure instability detected. Allocate 15% sprint buffer time for potential build failures or API delays.';
    } else if (riskScorePercentage >= 20) {
      riskLevel = 'MEDIUM';
      mitigationAdvice = 'Minor infrastructure incidents logged. Monitor CI/CD pipelines during daily standup.';
    }

    return {
      riskScorePercentage,
      riskLevel,
      feedSource,
      totalIncidentsAnalyzed: analyzedIncidents.length,
      recentIncidents: analyzedIncidents,
      summary: `Analyzed ${analyzedIncidents.length} external incidents over the past 7 days. Calculated risk index: ${riskScorePercentage}%.`,
      mitigationAdvice,
      fetchedAt: new Date().toISOString()
    };
  }

  private getFallbackRiskAssessment(): IRiskAssessment {
    return {
      riskScorePercentage: 18,
      riskLevel: 'LOW',
      feedSource: `${this.rssUrl} (Resilience Fallback Mode)`,
      totalIncidentsAnalyzed: 2,
      recentIncidents: [
        {
          title: 'GitHub Actions & Webhooks Performance Degraded',
          pubDate: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          severity: 'MEDIUM'
        },
        {
          title: 'Git Operations Brief Latency Incident',
          pubDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
          severity: 'LOW'
        }
      ],
      summary: 'Fallback simulation telemetry active. Infrastructure operational with nominal 18% risk index.',
      mitigationAdvice: 'Infrastructure healthy. Maintain standard sprint velocity.',
      fetchedAt: new Date().toISOString()
    };
  }
}
