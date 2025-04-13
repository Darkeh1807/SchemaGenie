import { isAxiosError } from "axios";
import { NotifierService } from "../services/notifier_service";
import { ServerError } from "../Components/usersPopup";

export const handleNetworkErrors = (error: unknown) => {
  if (isAxiosError(error)) {
    const serverError = error.response?.data as ServerError;
    NotifierService.error(
      serverError?.error || error.message || "Network request failed"
    );
  } else if (error instanceof Error) {
    NotifierService.error(error.message);
  } else {
    NotifierService.error("An unexpected error occurred");
  }
};
