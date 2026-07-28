export type GeocodeResult = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export type GeocodeSearchResponse = {
  results: GeocodeResult[];
  error?: string;
};
