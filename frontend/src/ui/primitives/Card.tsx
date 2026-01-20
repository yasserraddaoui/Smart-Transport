import { ReactNode } from "react";

export default function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <div className="cardTitle">{title}</div>
          {subtitle ? <div className="cardSubtitle">{subtitle}</div> : null}
        </div>
        {right ?? null}
      </div>
      {children}
    </section>
  );
}

