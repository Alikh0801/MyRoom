interface ListingFormSectionProps {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ListingFormSection({
  step,
  title,
  description,
  children,
  className,
}: ListingFormSectionProps) {
  return (
    <section
      className={`listing-form__section${className ? ` ${className}` : ""}`}
    >
      <header className="listing-form__section-header">
        <span className="listing-form__step" aria-hidden="true">
          {step}
        </span>
        <div className="listing-form__section-heading">
          <h2 className="listing-form__section-title">{title}</h2>
          {description && (
            <p className="listing-form__section-desc">{description}</p>
          )}
        </div>
      </header>
      <div className="listing-form__section-body">{children}</div>
    </section>
  );
}
