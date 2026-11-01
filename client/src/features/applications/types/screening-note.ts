export interface ScreeningNoteItem {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1 to 5
  note: string;
  createdAt: string;
}

export interface ApplicationScorecard {
  applicationId: string;
  averageRating: number | null;
  totalReviews: number;
  notes: ScreeningNoteItem[];
}

export interface CreateScreeningNotePayload {
  rating: number;
  note: string;
}
