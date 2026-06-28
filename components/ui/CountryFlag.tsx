type CountryFlagProps = {
  countryCode: string;
  className?: string;
};

export function CountryFlag({ countryCode, className = "" }: CountryFlagProps) {
  return (
    <span
      className={`fi fi-${countryCode} inline-block rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}
