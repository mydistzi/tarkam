import type { SweetAlertOptions } from "sweetalert2";

type SweetAlertModule = typeof import("sweetalert2");
type SweetAlertInstance = SweetAlertModule["default"];

let sweetAlertLoader: Promise<SweetAlertInstance> | null = null;

const getSweetAlert = async () => {
  if (!sweetAlertLoader) {
    sweetAlertLoader = import("sweetalert2").then((module) => module.default);
  }

  return sweetAlertLoader;
};

export const showAlert = async (options: SweetAlertOptions) => {
  const sweetAlert = await getSweetAlert();
  return sweetAlert.fire(options);
};
