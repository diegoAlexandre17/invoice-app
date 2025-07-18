import Swal from "sweetalert2";

const types = ["error", "warning", "info", "success", "question"] as const;
type SweetAlertType = typeof types[number];

type Options = {
  customClass?: Record<string, string>;
  [key: string]: any;
};

const SweetModal = (
  type: SweetAlertType,
  title: string,
  message: string,
  buttonText: string,
  actionAfter = () => {},
  options: Options = {},
  closeButton: boolean = false
) => {
  if (!types.includes(type))
    return console.warn(`SweetModal: type must be one of ${types.join(", ")}`);

  const defaultCustomClass = {
    container: "px-5",
    confirmButton: "px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors duration-200",
    cancelButton: "px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 mx-3",
  };

  return Swal.fire({
    title,
    text: message,
    icon: type,
    confirmButtonText: buttonText,
    showCloseButton: closeButton,
    customClass: options.customClass ?? defaultCustomClass,
    buttonsStyling: false,
    reverseButtons: true,
    ...options,
  }).then(actionAfter);
};

export default SweetModal;
