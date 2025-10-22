'use client';

import { useState, useEffect } from 'react';

interface City {
  id: number;
  name_az: string;
  name_en: string;
  name_ru: string;
  has_neighborhoods: boolean;
  sort_order: number;
}

interface Neighborhood {
  id: number;
  city_id: number;
  name_az: string;
  name_en: string;
  name_ru: string;
  sort_order: number;
}

interface LocationSelectorProps {
  isRemote: boolean;
  onRemoteChange: (isRemote: boolean) => void;
  cityId: number | null;
  onCityChange: (cityId: number | null) => void;
  neighborhoodId: number | null;
  onNeighborhoodChange: (neighborhoodId: number | null) => void;
  locale?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8000/api';

export default function LocationSelector({
  isRemote,
  onRemoteChange,
  cityId,
  onCityChange,
  neighborhoodId,
  onNeighborhoodChange,
  locale = 'az'
}: LocationSelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch neighborhoods when city changes
  useEffect(() => {
    if (cityId) {
      const selectedCity = cities.find(c => c.id === cityId);
      if (selectedCity?.has_neighborhoods) {
        fetchNeighborhoods(cityId);
      } else {
        setNeighborhoods([]);
        onNeighborhoodChange(null);
      }
    } else {
      setNeighborhoods([]);
      onNeighborhoodChange(null);
    }
  }, [cityId, cities]);

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const response = await fetch(`${API_URL}/cities`);
      const data = await response.json();

      if (data.status === 'success') {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchNeighborhoods = async (cityId: number) => {
    try {
      setLoadingNeighborhoods(true);
      const response = await fetch(`${API_URL}/cities/${cityId}/neighborhoods`);
      const data = await response.json();

      if (data.status === 'success') {
        setNeighborhoods(data.data);
      }
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    } finally {
      setLoadingNeighborhoods(false);
    }
  };

  const handleRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onRemoteChange(checked);

    // Clear location selections when remote is checked
    if (checked) {
      onCityChange(null);
      onNeighborhoodChange(null);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCityChange(value ? parseInt(value) : null);
  };

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onNeighborhoodChange(value ? parseInt(value) : null);
  };

  const getCityName = (city: City) => {
    return city[`name_${locale}` as keyof City] || city.name_az;
  };

  const getNeighborhoodName = (neighborhood: Neighborhood) => {
    return neighborhood[`name_${locale}` as keyof Neighborhood] || neighborhood.name_az;
  };

  const labels = {
    az: {
      remote: 'Uzaqdan',
      city: 'Şəhər/Rayon',
      neighborhood: 'Məhəllə',
      selectCity: 'Şəhər seçin',
      selectNeighborhood: 'Məhəllə seçin'
    },
    en: {
      remote: 'Remote',
      city: 'City/Region',
      neighborhood: 'Neighborhood',
      selectCity: 'Select city',
      selectNeighborhood: 'Select neighborhood'
    },
    ru: {
      remote: 'Удаленно',
      city: 'Город/Регион',
      neighborhood: 'Район',
      selectCity: 'Выберите город',
      selectNeighborhood: 'Выберите район'
    }
  };

  const t = labels[locale as keyof typeof labels] || labels.az;

  const selectedCity = cityId ? cities.find(c => c.id === cityId) : null;

  return (
    <div className="space-y-4">
      {/* Remote Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_remote"
          checked={isRemote}
          onChange={handleRemoteChange}
          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="is_remote"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {t.remote}
        </label>
      </div>

      {/* City Selector */}
      {!isRemote && (
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.city}
          </label>
          <select
            id="city"
            value={cityId || ''}
            onChange={handleCityChange}
            disabled={loadingCities}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.selectCity}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {getCityName(city)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Neighborhood Selector (only for cities with neighborhoods) */}
      {!isRemote && selectedCity?.has_neighborhoods && (
        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.neighborhood}
          </label>
          <select
            id="neighborhood"
            value={neighborhoodId || ''}
            onChange={handleNeighborhoodChange}
            disabled={loadingNeighborhoods}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.selectNeighborhood}</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {getNeighborhoodName(neighborhood)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
