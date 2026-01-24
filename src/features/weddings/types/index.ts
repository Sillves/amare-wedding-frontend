export interface Wedding {
  id: string;
  title: string;
  slug?: string;
  date: string;
  location: string;
  guestCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWeddingRequest {
  title: string;
  date: string;
  location: string;
}

export interface UpdateWeddingRequest {
  title?: string;
  slug?: string;
  date?: string;
  location?: string;
}
