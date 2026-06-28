type CountryFlagProps = {
  countryCode: string;
  className?: string;
  /** Adds a light frame so dark flag stripes stay visible on dark backgrounds. */
  framed?: boolean;
};

export function CountryFlag({
  countryCode,
  className = "",
  framed = true,
}: CountryFlagProps) {
  const flagClass = `fi fi-${countryCode}`;

  if (!framed) {
    return (
      <span
        className={`${flagClass} inline-block rounded-sm ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`country-flag-frame shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span className={flagClass} />
    </span>
  );
}
