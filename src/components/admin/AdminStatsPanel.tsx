import type { SiteStats } from "@/lib/queries/stats";

const MONTHS_AZ = [
  "Yan", "Fev", "Mar", "Apr", "May", "İyn",
  "İyl", "Avq", "Sen", "Okt", "Noy", "Dek",
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat("az-AZ").format(value);
}

function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS_AZ[month - 1]}`;
}

function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return 10 * magnitude;
}

interface StatTileProps {
  label: string;
  value: number;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="admin-stat-tile">
      <span className="admin-stat-tile__label">{label}</span>
      <span className="admin-stat-tile__value">{formatNumber(value)}</span>
    </div>
  );
}

interface BarRowProps {
  label: string;
  sublabel?: string;
  value: number;
  maxValue: number;
}

function BarRow({ label, sublabel, value, maxValue }: BarRowProps) {
  const width = maxValue > 0 ? Math.max((value / maxValue) * 100, 2) : 0;

  return (
    <div className="admin-bar-row">
      <span className="admin-bar-row__label" title={sublabel ? `${label} — ${sublabel}` : label}>
        {label}
        {sublabel && <span className="admin-bar-row__sublabel"> {sublabel}</span>}
      </span>
      <div className="admin-bar-row__track">
        <div className="admin-bar-row__bar" style={{ width: `${width}%` }} />
      </div>
      <span className="admin-bar-row__value">{formatNumber(value)}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="admin-stats__empty">{message}</p>;
}

interface DailyVisitsChartProps {
  series: SiteStats["dailySeries"];
}

function DailyVisitsChart({ series }: DailyVisitsChartProps) {
  const maxVisits = Math.max(...series.map((point) => point.visits), 0);
  const axisMax = niceCeil(maxVisits);
  const lastIndex = series.length - 1;
  const peakIndex = series.reduce(
    (best, point, index) => (point.visits > series[best].visits ? index : best),
    0
  );

  return (
    <div className="admin-visits-chart">
      <div className="admin-visits-chart__grid">
        <span>{formatNumber(axisMax)}</span>
        <span>{formatNumber(Math.round(axisMax / 2))}</span>
        <span>0</span>
      </div>
      <div className="admin-visits-chart__bars">
        {series.map((point, index) => {
          const height = axisMax > 0 ? (point.visits / axisMax) * 100 : 0;
          const showValue = index === lastIndex || index === peakIndex;

          return (
            <div key={point.date} className="admin-visits-chart__col">
              <div className="admin-visits-chart__bar-track">
                {showValue && (
                  <span className="admin-visits-chart__value">
                    {formatNumber(point.visits)}
                  </span>
                )}
                <div
                  className="admin-visits-chart__bar"
                  style={{ height: `${height}%` }}
                  title={`${formatShortDate(point.date)}: ${formatNumber(
                    point.visits
                  )} baxış, ${formatNumber(point.uniqueVisitors)} unikal ziyarətçi`}
                />
              </div>
              <span className="admin-visits-chart__label">
                {formatShortDate(point.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AdminStatsPanelProps {
  stats: SiteStats;
}

export function AdminStatsPanel({ stats }: AdminStatsPanelProps) {
  const hasVisits = stats.dailySeries.some((point) => point.visits > 0);
  const maxListingViews = Math.max(
    ...stats.topListings.map((listing) => listing.viewCount),
    0
  );
  const maxRegionVisits = Math.max(
    ...stats.topRegions.map((region) => region.visits),
    0
  );

  return (
    <div className="admin-stats-panel">
      <div className="admin-stats__tiles">
        <StatTile label="Bu gün ziyarət" value={stats.todayVisits} />
        <StatTile label="Son 7 gün baxış" value={stats.last7DaysVisits} />
        <StatTile
          label="Son 7 gün unikal ziyarətçi"
          value={stats.last7DaysUniqueVisitors}
        />
      </div>

      <div className="admin-stats__card">
        <h2 className="admin-stats__card-title">Gündəlik ziyarətlər (son 14 gün)</h2>
        {hasVisits ? (
          <DailyVisitsChart series={stats.dailySeries} />
        ) : (
          <EmptyState message="Hələ ziyarət statistikası yoxdur." />
        )}
      </div>

      <div className="admin-stats__grid">
        <div className="admin-stats__card">
          <h2 className="admin-stats__card-title">Ən çox baxılan elanlar</h2>
          {stats.topListings.length > 0 ? (
            <div className="admin-bar-list">
              {stats.topListings.map((listing) => (
                <BarRow
                  key={listing.id}
                  label={listing.title}
                  sublabel={listing.city}
                  value={listing.viewCount}
                  maxValue={maxListingViews}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="Hələ baxılan elan yoxdur." />
          )}
        </div>

        <div className="admin-stats__card">
          <h2 className="admin-stats__card-title">Bölgə üzrə ziyarətlər</h2>
          {stats.topRegions.length > 0 ? (
            <div className="admin-bar-list">
              {stats.topRegions.map((region) => (
                <BarRow
                  key={region.label}
                  label={region.label}
                  value={region.visits}
                  maxValue={maxRegionVisits}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="Bölgə məlumatı yoxdur." />
          )}
        </div>
      </div>
    </div>
  );
}
