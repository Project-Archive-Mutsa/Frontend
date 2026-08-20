import Form from "next/form";
import type { ReactNode } from "react";
import ProjectFilterSubmitButton from "./project-filter-submit-button";

export interface ProjectExplorerFilterOption {
  value: string;
  label: string;
}

export interface ProjectExplorerFilterField {
  name: string;
  label: string;
  allLabel: string;
  options: readonly ProjectExplorerFilterOption[];
}

interface ProjectExplorerFilterPanelProps {
  action: string;
  description: string;
  fields: readonly ProjectExplorerFilterField[];
  values: Readonly<Record<string, string>>;
  hiddenFields?: Readonly<Record<string, string>>;
  footer?: ReactNode;
}

const selectClassName =
  "mt-2 h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-soft";

export default function ProjectExplorerFilterPanel({
  action,
  description,
  fields,
  values,
  hiddenFields = {},
  footer,
}: ProjectExplorerFilterPanelProps) {
  return (
    <aside
      className="border-y border-slate-300 py-6 lg:border-r lg:border-b-0 lg:pr-7"
      aria-labelledby="project-filter-heading"
    >
      <h2
        id="project-filter-heading"
        className="text-lg font-bold text-slate-950"
      >
        프로젝트 필터
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <Form action={action} scroll={false} className="mt-6 space-y-5">
        {Object.entries(hiddenFields).map(([name, value]) =>
          value ? <input key={name} type="hidden" name={name} value={value} /> : null,
        )}
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="text-sm font-bold text-slate-800">
              {field.label}
            </span>
            <select
              name={field.name}
              defaultValue={values[field.name] ?? ""}
              className={selectClassName}
            >
              <option value="">{field.allLabel}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <ProjectFilterSubmitButton />
      </Form>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </aside>
  );
}
