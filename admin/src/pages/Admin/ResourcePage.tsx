import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, extractList } from "../../lib/api";
import { resourceMap } from "../../lib/resource-config";
import type { OptionItem, ResourceConfig, ResourceField } from "../../types/admin";

type FormState = Record<string, unknown>;
type ResourceItem = Record<string, unknown>;

function getPathValue(target: unknown, path: string): unknown {
  if (!path) {
    return target;
  }

  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, target);
}

function formatValue(value: unknown, format?: "boolean" | "currency" | "date" | "datetime"): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return String(item);
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return String(record.title || record.name || record.label || record.id || "item");
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (format === "boolean") {
    return value === true || value === 1 || value === "1" ? "Ya" : "Tidak";
  }

  if (format === "currency") {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return String(value);
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  if (format === "date" || format === "datetime") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      ...(format === "datetime" ? { timeStyle: "short" } : {}),
    }).format(date);
  }

  return String(value);
}

function isEmptyValue(value: unknown): boolean {
  return value === "" || value === undefined || value === null;
}

function formatInputValue(item: ResourceItem | null, field: ResourceField): unknown {
  if (!item) {
    if (field.type === "checkbox") {
      return false;
    }

    if (field.type === "multiselect") {
      return [];
    }

    return "";
  }

  const rawValue = item[field.key];

  if (field.type === "checkbox") {
    return Boolean(rawValue);
  }

  if (field.type === "multiselect") {
    if (!Array.isArray(rawValue)) {
      return [];
    }

    return rawValue
      .map((entry) => {
        if (entry && typeof entry === "object") {
          const record = entry as Record<string, unknown>;
          return String(record.id || record.value || "");
        }

        return String(entry);
      })
      .filter(Boolean);
  }

  if (field.type === "file") {
    return null;
  }

  return rawValue ?? "";
}

function getIdentifier(resource: ResourceConfig, item: ResourceItem): string {
  const identifierField = resource.identifierField || "id";
  const value = item[identifierField];

  if (value === undefined || value === null || value === "") {
    throw new Error(`Identifier ${identifierField} tidak ditemukan untuk resource ${resource.key}.`);
  }

  return encodeURIComponent(String(value));
}

function buildPayload(resource: ResourceConfig, formState: FormState): Record<string, unknown> {
  if (resource.mode === "json") {
    const rawPayload = String(formState.__raw || "{}").trim();
    return JSON.parse(rawPayload) as Record<string, unknown>;
  }

  const payload: Record<string, unknown> = {};

  resource.fields?.forEach((field) => {
    const currentValue = formState[field.key];

    if (field.type === "file") {
      if (currentValue instanceof File) {
        payload[field.key] = currentValue;
      }
      return;
    }

    if (field.type === "checkbox") {
      payload[field.key] = Boolean(currentValue);
      return;
    }

    if (field.type === "multiselect") {
      const values = Array.isArray(currentValue) ? currentValue : [];
      payload[field.key] = values
        .map((entry) => Number(entry))
        .filter((entry) => !Number.isNaN(entry));
      return;
    }

    if (field.type === "number") {
      if (isEmptyValue(currentValue)) {
        payload[field.key] = null;
      } else {
        const numericValue = Number(currentValue);
        payload[field.key] = Number.isNaN(numericValue) ? currentValue : numericValue;
      }
      return;
    }

    if (field.type === "select") {
      payload[field.key] = isEmptyValue(currentValue) ? null : currentValue;
      return;
    }

    payload[field.key] = isEmptyValue(currentValue) ? null : currentValue;
  });

  return payload;
}

function buildRawPayload(item: ResourceItem | null): string {
  if (!item) {
    return "{\n  \n}";
  }

  return JSON.stringify(item, null, 2);
}

function getReferenceKeys(resource: ResourceConfig): string[] {
  const keys = new Set<string>();

  resource.fields?.forEach((field) => {
    if (field.optionSource?.resourceKey) {
      keys.add(field.optionSource.resourceKey);
    }
  });

  return Array.from(keys);
}

function getFieldOptions(
  field: ResourceField,
  optionMap: Record<string, OptionItem[]>,
): OptionItem[] {
  if (field.options) {
    return field.options;
  }

  if (!field.optionSource) {
    return [];
  }

  return optionMap[field.optionSource.resourceKey] || [];
}

export default function ResourcePage() {
  const params = useParams<{ resourceKey: string }>();
  const { token } = useAuth();
  const resource = params.resourceKey ? resourceMap[params.resourceKey] : undefined;
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formState, setFormState] = useState<FormState>({});
  const [optionMap, setOptionMap] = useState<Record<string, OptionItem[]>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!resource || !token) {
      return;
    }

    let mounted = true;

    const loadPage = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const [resourceResponse, ...referenceResponses] = await Promise.all([
          apiRequest<ResourceItem[]>(`/${resource.endpoint}`, {
            method: "GET",
            token,
          }),
          ...getReferenceKeys(resource).map((referenceKey) => {
            const referenceResource = resourceMap[referenceKey];
            return apiRequest<ResourceItem[]>(`/${referenceResource.endpoint}`, {
              method: "GET",
              token,
            });
          }),
        ]);

        if (!mounted) {
          return;
        }

        setItems(extractList(resourceResponse));

        const nextOptionMap: Record<string, OptionItem[]> = {};
        getReferenceKeys(resource).forEach((referenceKey, index) => {
          const referenceResource = resourceMap[referenceKey];
          const optionSource = resource.fields?.find(
            (field) => field.optionSource?.resourceKey === referenceKey,
          )?.optionSource;
          const labelField = optionSource?.labelField || "name";
          const valueField = optionSource?.valueField || "id";
          nextOptionMap[referenceKey] = extractList(referenceResponses[index]).map((item) => ({
            label: String(
              getPathValue(item, labelField) ||
                getPathValue(item, "name") ||
                getPathValue(item, "title") ||
                item.id ||
                "item",
            ),
            value: String(getPathValue(item, valueField) || ""),
          }));

          if (!referenceResource) {
            nextOptionMap[referenceKey] = [];
          }
        });
        setOptionMap(nextOptionMap);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat resource.");
      } finally {
        setLoading(false);
      }
    };

    void loadPage();

    return () => {
      mounted = false;
    };
  }, [resource, token]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [items, searchTerm]);

  if (!resource) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        Resource tidak ditemukan.
      </div>
    );
  }

  const openCreateForm = () => {
    setIsCreating(true);
    setSelectedItem(null);
    setFeedback(null);
    setErrorMessage(null);

    if (resource.mode === "json") {
      setFormState({ __raw: buildRawPayload(null) });
      return;
    }

    const nextFormState: FormState = {};
    resource.fields?.forEach((field) => {
      nextFormState[field.key] = formatInputValue(null, field);
    });
    setFormState(nextFormState);
  };

  const openEditForm = (item: ResourceItem) => {
    setIsCreating(false);
    setSelectedItem(item);
    setFeedback(null);
    setErrorMessage(null);

    if (resource.mode === "json") {
      setFormState({ __raw: buildRawPayload(item) });
      return;
    }

    const nextFormState: FormState = {};
    resource.fields?.forEach((field) => {
      nextFormState[field.key] = formatInputValue(item, field);
    });
    setFormState(nextFormState);
  };

  const submitForm = async () => {
    if (!token) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    setErrorMessage(null);

    try {
      const payload = buildPayload(resource, formState);
      const isEditing = !isCreating && selectedItem;
      const endpoint = isEditing
        ? `/${resource.endpoint}/${getIdentifier(resource, selectedItem)}`
        : `/${resource.endpoint}`;

      await apiRequest(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        payload,
        token,
      });

      const refreshed = await apiRequest<ResourceItem[]>(`/${resource.endpoint}`, {
        method: "GET",
        token,
      });
      setItems(extractList(refreshed));
      setFeedback(isEditing ? "Data berhasil diperbarui." : "Data berhasil dibuat.");
      setSelectedItem(null);
      setIsCreating(false);
      setFormState({});
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (item: ResourceItem) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(`Hapus data dari ${resource.title}?`);
    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setFeedback(null);

    try {
      await apiRequest(`/${resource.endpoint}/${getIdentifier(resource, item)}`, {
        method: "DELETE",
        token,
      });
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem !== item));
      if (selectedItem === item) {
        setSelectedItem(null);
        setFormState({});
      }
      setFeedback("Data berhasil dihapus.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus data.");
    }
  };

  const activeTitle = isCreating
    ? `Tambah ${resource.title}`
    : selectedItem
      ? `Edit ${resource.title}`
      : `Kelola ${resource.title}`;

  return (
    <>
      <PageMeta title={`${resource.title} | Tarkam Admin`} description={resource.description} />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-500">Resource</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{resource.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari data..."
                className="h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              {!resource.readOnly ? (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                >
                  Tambah data
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {feedback ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            {feedback}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {loading ? "Memuat data..." : `${filteredItems.length} item tersedia`}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-950/60">
                  <tr>
                    {resource.columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredItems.map((item, index) => (
                    <tr key={`${resource.key}-${index}`}>
                      {resource.columns.map((column) => (
                        <td key={column.key} className="max-w-[240px] px-6 py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                          <div className="line-clamp-3">{formatValue(getPathValue(item, column.key), column.format)}</div>
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        {resource.readOnly ? (
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Read only
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(item)}
                              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:text-gray-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteItem(item)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-300"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={resource.columns.length + 1} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        Belum ada data yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-brand-500">Editor</p>
                <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{activeTitle}</h2>
              </div>
              {(selectedItem || isCreating) ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setIsCreating(false);
                    setFormState({});
                  }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                >
                  Tutup
                </button>
              ) : null}
            </div>

            {!selectedItem && !isCreating ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {resource.readOnly
                  ? "Resource ini hanya bisa dibaca dari panel karena endpoint backend-nya tidak menyediakan aksi tulis standar."
                  : "Pilih baris dari tabel atau klik tombol tambah data untuk mulai mengedit."}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {resource.mode === "json" ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">JSON payload</label>
                    <textarea
                      rows={18}
                      value={String(formState.__raw || "")}
                      onChange={(event) => setFormState({ __raw: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mode ini dipakai untuk resource teknis. Pastikan field payload sesuai validasi Laravel.
                    </p>
                  </div>
                ) : (
                  resource.fields?.map((field) => {
                    const value = formState[field.key];
                    const options = getFieldOptions(field, optionMap);

                    return (
                      <div key={field.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          {field.label}
                          {field.required ? <span className="ml-1 text-red-500">*</span> : null}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={field.rows || 4}
                            value={String(value || "")}
                            onChange={(event) =>
                              setFormState((currentState) => ({
                                ...currentState,
                                [field.key]: event.target.value,
                              }))
                            }
                            placeholder={field.placeholder}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                          />
                        ) : null}

                        {field.type === "select" ? (
                          <select
                            value={String(value || "")}
                            onChange={(event) =>
                              setFormState((currentState) => ({
                                ...currentState,
                                [field.key]: event.target.value,
                              }))
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                          >
                            <option value="">Pilih opsi</option>
                            {options.map((option) => (
                              <option key={`${field.key}-${option.value}`} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : null}

                        {field.type === "multiselect" ? (
                          <select
                            multiple
                            value={Array.isArray(value) ? value.map(String) : []}
                            onChange={(event) =>
                              setFormState((currentState) => ({
                                ...currentState,
                                [field.key]: Array.from(event.target.selectedOptions).map((option) => option.value),
                              }))
                            }
                            className="min-h-32 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                          >
                            {options.map((option) => (
                              <option key={`${field.key}-${option.value}`} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : null}

                        {field.type === "checkbox" ? (
                          <label className="inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                            <input
                              type="checkbox"
                              checked={Boolean(value)}
                              onChange={(event) =>
                                setFormState((currentState) => ({
                                  ...currentState,
                                  [field.key]: event.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                            />
                            Aktifkan nilai ini
                          </label>
                        ) : null}

                        {field.type === "file" ? (
                          <input
                            type="file"
                            accept={field.accept}
                            onChange={(event) =>
                              setFormState((currentState) => ({
                                ...currentState,
                                [field.key]: event.target.files?.[0] || null,
                              }))
                            }
                            className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                          />
                        ) : null}

                        {!["textarea", "select", "multiselect", "checkbox", "file"].includes(field.type) ? (
                          <input
                            type={field.type}
                            value={String(value || "")}
                            onChange={(event) =>
                              setFormState((currentState) => ({
                                ...currentState,
                                [field.key]: event.target.value,
                              }))
                            }
                            placeholder={field.placeholder}
                            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-brand-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                          />
                        ) : null}

                        {field.helperText ? (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{field.helperText}</p>
                        ) : null}
                      </div>
                    );
                  })
                )}

                {!resource.readOnly ? (
                  <button
                    type="button"
                    onClick={() => void submitForm()}
                    disabled={submitting}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900"
                  >
                    {submitting ? "Menyimpan..." : "Simpan perubahan"}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
