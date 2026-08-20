import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PurchaseConfirmationDialog from "./purchase-confirmation-dialog";

describe("구매 확인 대화상자", () => {
  it("포커스를 가두고 닫을 때 이전 포커스를 복원한다", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const onCancel = vi.fn();
    const { unmount } = render(
      <PurchaseConfirmationDialog
        open
        title="구매 확인"
        target="프로젝트"
        price={100}
        balance={500}
        scope="상세 리포트 열람"
        confirmLabel="구매"
        isPending={false}
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    );

    const cancel = screen.getByRole("button", { name: "취소" });
    const confirm = screen.getByRole("button", { name: "구매" });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(confirm);
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();

    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
