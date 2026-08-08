// 로딩 스피너 공용 컴포넌트 (데이터를 불러오는 동안 화면에 표시됨)
export default function SectionLoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20 text-slate-500">
      데이터를 불러오는 중입니다...
    </div>
  );
}