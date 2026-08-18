interface BackendContractNoticeProps {
  children: string;
}

export default function BackendContractNotice({
  children,
}: BackendContractNoticeProps) {
  return (
    <div className="border-y border-slate-300 py-4 text-sm leading-6 text-slate-600">
      <strong className="mr-3 text-xs font-bold text-slate-800">
        백엔드 미구현
      </strong>
      <span>{children}</span>
    </div>
  );
}
