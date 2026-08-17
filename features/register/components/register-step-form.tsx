import type { FormEvent, ReactNode } from "react";

interface RegisterStepFormProps {
  children: ReactNode;
  className?: string;
  onSubmit: () => void;
}

export default function RegisterStepForm({
  children,
  className,
  onSubmit,
}: RegisterStepFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className={className} noValidate onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
