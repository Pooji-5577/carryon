import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  placeId: string;
  address: string;
  latitude: number;
  longitude: number;
  name: string;
}

export interface DirectionsResult {
  distance: number; // meters
  duration: number; // seconds
  polyline: string;
  steps: {
    instruction: string;
    distance: number;
    duration: number;
    startLocation: { lat: number; lng: number };
    endLocation: { lat: number; lng: number };
  }[];
}

class MapsService {
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  // Autocomplete places search
  async searchPlaces(query: string, location?: { lat: number; lng: number }): Promise<PlacePrediction[]> {
    try {
      let url = `${this.baseUrl}/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in`;
      
      if (location) {
        url += `&location=${location.lat},${location.lng}&radius=50000`;
      }

      const response = await axios.get(url);
      
      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(response.data.error_message || 'Places search failed');
      }

      return response.data.predictions.map((prediction: any) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
      }));
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  // Get place details
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const url = `${this.baseUrl}/place/details/json?place_id=${placeId}&fields=place_id,formatted_address,geometry,name&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Place details fetch failed');
      }

      const result = response.data.result;
      return {
        placeId: result.place_id,
        address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        name: result.name,
      };
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Reverse geocode failed');
      }

      return response.data.results[0]?.formatted_address || null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  }

  // Get directions between two points
  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ): Promise<DirectionsResult | null> {
    try {
      let url = `${this.baseUrl}/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`;
      
      if (waypoints && waypoints.length > 0) {
        const waypointsStr = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
        url += `&waypoints=${waypointsStr}`;
      }

      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Directions fetch failed');
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      // Calculate total distance and duration if there are multiple legs
      let totalDistance = 0;
      let totalDuration = 0;
      const steps: DirectionsResult['steps'] = [];

      route.legs.forEach((leg: any) => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
        
        leg.steps.forEach((step: any) => {
          steps.push({
            instruction: step.html_instructions,
            distance: step.distance.value,
            duration: step.duration.value,
            startLocation: step.start_location,
            endLocation: step.end_location,
          });
        });
      });

      return {
        distance: totalDistance,
        duration: totalDuration,
        polyline: route.overview_polyline.points,
        steps,
      };
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  }

  // Get distance matrix for multiple origins/destinations
  async getDistanceMatrix(
    origins: { lat: number; lng: number }[],
    destinations: { lat: number; lng: number }[]
  ): Promise<{ distance: number; duration: number }[][] | null> {
    try {
      const originsStr = origins.map(o => `${o.lat},${o.lng}`).join('|');
      const destinationsStr = destinations.map(d => `${d.lat},${d.lng}`).join('|');
      
      const url = `${this.baseUrl}/distancematrix/json?origins=${originsStr}&destinations=${destinationsStr}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Distance matrix fetch failed');
      }

      return response.data.rows.map((row: any) =>
        row.elements.map((element: any) => ({
          distance: element.distance?.value || 0,
          duration: element.duration?.value || 0,
        }))
      );
    } catch (error) {
      console.error('Distance matrix error:', error);
      return null;
    }
  }

  // Decode polyline string to coordinates
  decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  }
}

export const mapsService = new MapsService();
export default mapsService;
