import type {
  RegisterRequest,
  RegisterScalarField,
} from "../../../../model/types";
import RegisterActions from "../../../register-actions";
import RegisterStepForm from "../../../register-step-form";
import RegisterTextField from "../../../register-text-field";
import useRegisterProfileStep from "../hooks/use-register-profile-step";

interface RegisterProfileStepProps {
  values: RegisterRequest;
  onValueChange: (field: RegisterScalarField, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function RegisterProfileStep({
  values,
  onValueChange,
  onNext,
  onPrevious,
}: RegisterProfileStepProps) {
  const { validationErrors, changeValue, submitStep } =
    useRegisterProfileStep({ values, onValueChange, onNext });

  return (
    <RegisterStepForm
      className="flex min-h-[28rem] flex-col px-8 pb-6 pt-5 2xl:px-10"
      onSubmit={submitStep}
    >
      <fieldset className="mx-auto w-full max-w-md space-y-3">
        <legend className="sr-only">기본 정보</legend>
        <RegisterTextField
          field="name"
          label="이름"
          value={values.name}
          validationError={validationErrors.name}
          autoComplete="name"
          placeholder="이름을 입력해 주세요"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="phoneNumber"
          label="전화번호"
          type="tel"
          value={values.phoneNumber}
          validationError={validationErrors.phoneNumber}
          autoComplete="tel"
          placeholder="010-0000-0000"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="school"
          label="학교"
          value={values.school}
          validationError={validationErrors.school}
          autoComplete="organization"
          placeholder="학교를 입력해 주세요"
          onValueChange={changeValue}
        />
        <RegisterTextField
          field="department"
          label="학과"
          value={values.department}
          validationError={validationErrors.department}
          autoComplete="organization-title"
          placeholder="학과를 입력해 주세요"
          onValueChange={changeValue}
        />
      </fieldset>
      <div className="mt-auto">
        <RegisterActions
          step={2}
          isSubmitting={false}
          onPrevious={onPrevious}
        />
      </div>
    </RegisterStepForm>
  );
}
