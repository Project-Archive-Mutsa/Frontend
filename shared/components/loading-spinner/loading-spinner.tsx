"use client";

import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
}

export default function LoadingSpinner({
  size = 32,
}: LoadingSpinnerProps) {
  return <ClipLoader size={size} aria-hidden />;
}
