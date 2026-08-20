"use client";

import { useEffect, useRef } from "react";
import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

interface PurchaseConfirmationDialogProps {
  open: boolean;
  title: string;
  target: string;
  price: number;
  balance: number;
  scope: string;
  confirmLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function PurchaseConfirmationDialog({
  open,
  title,
  target,
  price,
  balance,
  scope,
  confirmLabel,
  isPending,
  onCancel,
  onConfirm,
}: PurchaseConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);
  const isPendingRef = useRef(isPending);

  useEffect(() => {
    onCancelRef.current = onCancel;
    isPendingRef.current = isPending;
  }, [isPending, onCancel]);

  useEffect(() => {
    if (!open) return;
    const previousActiveElement = document.activeElement;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPendingRef.current) {
        onCancelRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [cancelButtonRef.current, confirmButtonRef.current].filter(
        (element): element is HTMLButtonElement => Boolean(element && !element.disabled),
      );
      if (focusable.length === 0) return;
      const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex + 1) % focusable.length;
      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-5 py-10">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-confirmation-title"
        className="w-full max-w-lg border border-slate-300 bg-white p-6 shadow-lg sm:p-8"
      >
        <h2
          id="purchase-confirmation-title"
          className="font-display text-2xl font-bold tracking-[-0.025em] text-slate-950"
        >
          {title}
        </h2>
        <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-300 text-sm">
          <div className="flex items-start justify-between gap-6 py-4">
            <dt className="text-slate-500">대상</dt>
            <dd className="max-w-xs text-right font-bold text-slate-900">{target}</dd>
          </div>
          <div className="flex items-start justify-between gap-6 py-4">
            <dt className="text-slate-500">가격</dt>
            <dd className="font-bold tabular-nums text-slate-900">
              {price.toLocaleString("ko-KR")} P
            </dd>
          </div>
          <div className="flex items-start justify-between gap-6 py-4">
            <dt className="text-slate-500">보유 포인트</dt>
            <dd className="font-bold tabular-nums text-slate-900">
              {balance.toLocaleString("ko-KR")} P
            </dd>
          </div>
          <div className="py-4">
            <dt className="text-slate-500">구매 범위</dt>
            <dd className="mt-2 leading-6 text-slate-800">{scope}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-slate-600">
          결제 후 잔액 {Math.max(0, balance - price).toLocaleString("ko-KR")} P
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="min-h-11 border border-slate-300 px-5 text-sm font-bold text-slate-700 hover:border-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <LoadingSpinner size={18} /> : null}
            {isPending ? "결제 중" : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
