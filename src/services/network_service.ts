import axios from "axios";
import { AppConstants } from "../utils/constants";

export class UseNetworkService {
  static baseUrl = AppConstants.baseUrl;

  static async get(path: string) {
    try {
      const response = await axios.get(`${this.baseUrl}${path.trim()}`, {
        headers: {
          "Content-Type": "applicsation/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  }

  static async post(path: string, body: Record<string, string>) {
    try {
      const response = await axios.post(`${this.baseUrl}${path.trim()}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  }
}
