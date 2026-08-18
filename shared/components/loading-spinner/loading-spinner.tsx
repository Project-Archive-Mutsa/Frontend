interface LoadingSpinnerProps {
  size?: number;
}

export default function LoadingSpinner({
  size = 32,
}: LoadingSpinnerProps) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="loading-spinner inline-block shrink-0 rounded-full"
    />
  );
}
