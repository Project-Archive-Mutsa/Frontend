import type {
  RegisterRequest,
  RegisterScalarField,
} from "../../../../model/types";
import RegisterActions from "../../../register-actions";
import RegisterStepForm from "../../../register-step-form";
import RegisterTextField from "../../../register-text-field";
import useRegisterAccountStep from "../hooks/use-register-account-step";

interface RegisterAccountStepProps {
  values: RegisterRequest;
  onValueChange: (field: RegisterScalarField, value: string) => void;
  onNext: () => void;
}

export default function RegisterAccountStep({
  values,
  onValueChange,
  onNext,
}: RegisterAccountStepProps) {
  const { validationErrors, changeValue, submitStep } =
    useRegisterAccountStep({ values, onValueChange, onNext });

  return (
    <RegisterStepForm
      className="flex min-h-[28rem] flex-col px-8 pb-6 pt-5 2xl:px-10"
      onSubmit={submitStep}
    >
      <fieldset className="mx-auto w-full max-w-md space-y-3">
        <legend className="sr-only">계정 정보</legend>
        <RegisterTextField
          field="loginId"
          label="아이디"
          value={values.loginId}
          validationError={validationErrors.loginId}
          autoComplete="username"
          placeholder="사용할 아이디를 입력해 주세요"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="email"
          label="이메일"
          type="email"
          value={values.email}
          validationError={validationErrors.email}
          autoComplete="email"
          placeholder="name@example.com"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="password"
          label="비밀번호"
          type="password"
          value={values.password}
          validationError={validationErrors.password}
          autoComplete="new-password"
          placeholder="비밀번호를 입력해 주세요"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          value={values.passwordConfirm}
          validationError={validationErrors.passwordConfirm}
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해 주세요"
          onValueChange={changeValue}
        />
      </fieldset>
      <div className="mt-auto">
        <RegisterActions step={1} isSubmitting={false} />
      </div>
    </RegisterStepForm>
  );
}
