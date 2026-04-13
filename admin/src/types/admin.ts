export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type OptionItem = {
  label: string;
  value: string;
};

export type OptionSource = {
  resourceKey: string;
  labelField?: string;
  valueField?: string;
};

export type ResourceFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "url"
  | "date"
  | "datetime-local"
  | "checkbox"
  | "select"
  | "multiselect"
  | "file"
  | "json";

export type ResourceField = {
  key: string;
  label: string;
  type: ResourceFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  accept?: string;
  rows?: number;
  options?: OptionItem[];
  optionSource?: OptionSource;
};

export type ResourceColumn = {
  key: string;
  label: string;
  format?: "boolean" | "currency" | "date" | "datetime";
};

export type ResourceConfig = {
  key: string;
  title: string;
  description: string;
  group: "content" | "competition" | "commerce" | "system";
  endpoint: string;
  identifierField?: string;
  readOnly?: boolean;
  columns: ResourceColumn[];
  fields?: ResourceField[];
  mode?: "form" | "json";
};
