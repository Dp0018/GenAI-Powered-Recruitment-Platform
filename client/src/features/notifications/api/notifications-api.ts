import { apiClient } from "@/lib/api";
import { NotificationItem } from "../types/notification";

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await apiClient<NotificationItem[]>("/notifications");
    return response.data || [];
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient<number>("/notifications/unread-count");
    return response.data ?? 0;
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await apiClient<NotificationItem>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    return response.data!;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient<void>("/notifications/read-all", {
      method: "PATCH",
    });
  },
};
