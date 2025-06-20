export type TripStatus = 'solicitado' | 'aprovado' | 'cancelado';

export interface Trip {
  id: string;
  requester_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTripRequest {
  destination: string;
  start_date: string;
  end_date: string;
}

export interface UpdateTripStatusRequest {
  status: TripStatus;
}

export interface TripFilters {
  status?: TripStatus;
  destination?: string;
  start_date?: string;
  end_date?: string;
}