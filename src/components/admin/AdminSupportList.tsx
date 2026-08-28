import { markSupportMessageRead } from "@/lib/support/admin-actions";
import type { SupportMessageItem } from "@/lib/queries/support";

interface AdminSupportListProps {
  messages: SupportMessageItem[];
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminSupportList({ messages }: AdminSupportListProps) {
  if (messages.length === 0) {
    return (
      <div className="empty-state empty-state--compact">
        <p>Hələ müraciət yoxdur.</p>
      </div>
    );
  }

  return (
    <ul className="admin-support">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`admin-support-card${m.isRead ? "" : " admin-support-card--unread"}`}
        >
          <div className="admin-support-card__head">
            <h3 className="admin-support-card__subject">{m.subject}</h3>
            {!m.isRead && (
              <span className="admin-support-card__badge">Yeni</span>
            )}
            <time className="admin-support-card__date" dateTime={m.createdAt}>
              {formatDateTime(m.createdAt)}
            </time>
          </div>

          <dl className="admin-support-card__meta">
            <div>
              <dt>Ad</dt>
              <dd>{m.userName ?? "—"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                {m.userEmail ? (
                  <a href={`mailto:${m.userEmail}`}>{m.userEmail}</a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>
                {m.userPhone ? (
                  <a href={`tel:${m.userPhone}`}>{m.userPhone}</a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          <p className="admin-support-card__body">{m.body}</p>

          {!m.isRead && (
            <form action={markSupportMessageRead} className="admin-support-card__actions">
              <input type="hidden" name="id" value={m.id} />
              <button type="submit" className="btn btn--ghost">
                Oxundu kimi işarələ
              </button>
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}
