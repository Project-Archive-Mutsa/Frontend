"use client";

import { unstable_catchError as catchError } from "next/error";

interface SectionErrorFallbackProps {
  message: string;
}

function SectionErrorFallback({ message }: SectionErrorFallbackProps) {
  return <p role="alert">{message}</p>;
}

export default catchError(SectionErrorFallback);
