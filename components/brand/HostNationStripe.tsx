type HostNationStripeProps = {
  className?: string;
  height?: number;
};

/** Canada · Mexico · USA tricolor stripe from the WC26 host-nation palette. */
export function HostNationStripe({
  className = "",
  height = 4,
}: HostNationStripeProps) {
  return (
    <div
      className={`flex w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <span className="flex-1 bg-canada-red" />
      <span className="flex-1 bg-mexico-green" />
      <span className="flex-1 bg-usa-blue" />
    </div>
  );
}
