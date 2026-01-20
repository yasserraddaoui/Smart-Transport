export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="pageHeader">
      <h1 className="pageTitle">{title}</h1>
      {description ? <div className="pageDescription">{description}</div> : null}
    </div>
  );
}

