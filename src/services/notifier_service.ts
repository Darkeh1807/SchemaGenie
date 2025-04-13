import toast from "react-hot-toast";

export class NotifierService {
  static error = (message: string = "Something went wrong!") => {
    toast.error(message, { position: "top-right" });
  };

  static success = (message: string) => {
    toast.success(message, { position: "top-right" });
  };
}
