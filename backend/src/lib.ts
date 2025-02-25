import axios from 'axios';
const dotenv = require('dotenv');
dotenv.config();

class GeoLib {
  private apiKey: string;
  private geocodingApiUrl: string;

  constructor() {
    this.apiKey = process.env.GEOCODING_API_KEY || '';
    this.geocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  async getAddressFromCoordinates(
    coordinates: [number, number]
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('Geocoding API key not configured');
      }

      const [lat, lng] = coordinates;
      const response = await axios.get(this.geocodingApiUrl, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding API error: ${response.data.status}`);
      }

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No address found for these coordinates');
      }

      return response.data.results[0].formatted_address;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get address: ${error.message}`);
      }
      throw new Error('Failed to get address from coordinates');
    }
  }

  async getCoordinatesFromAddress(
    address: string
  ): Promise<{ lat: number; lng: number }> {
    try {
      if (!this.apiKey) {
        throw new Error('Geocoding API key not configured');
      }

      const response = await axios.get(this.geocodingApiUrl, {
        params: {
          address: address,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Geocoding API error: ${response.data.status}`);
      }

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No coordinates found for this address');
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get coordinates: ${error.message}`);
      }
      throw new Error('Failed to get coordinates from address');
    }
  }
}

export default new GeoLib();
