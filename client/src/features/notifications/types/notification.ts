export type NotificationType =
  | "APPLICATION_STATUS"
  | "INTERVIEW_INVITE"
  | "INTERVIEW_CANCELLED"
  | "NEW_APPLICANT"
  | "COMPANY_VERIFIED"
  | "SYSTEM";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
}
