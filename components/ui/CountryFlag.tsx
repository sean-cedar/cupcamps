type CountryFlagProps = {
  countryCode: string;
  className?: string;
  /** Adds a light frame so dark flag stripes stay visible on dark backgrounds. */
  framed?: boolean;
  /** Country name for hover tooltip and accessible labeling when the flag stands alone. */
  label?: string;
};

export function CountryFlag({
  countryCode,
  className = "",
  framed = true,
  label,
}: CountryFlagProps) {
  const flagClass = `fi fi-${countryCode}`;
  const accessibleProps = label
    ? { title: label, "aria-label": label, role: "img" as const }
    : { "aria-hidden": true as const };

  if (!framed) {
    return (
      <span
        className={`${flagClass} inline-block rounded-sm ${className}`}
        {...accessibleProps}
      />
    );
  }

  return (
    <span
      className={`country-flag-frame shrink-0 ${className}`}
      {...accessibleProps}
    >
      <span className={flagClass} aria-hidden="true" />
    </span>
  );
}
