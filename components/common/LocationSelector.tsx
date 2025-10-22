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

interface District {
  id: number;
  city_id: number;
  name_az: string;
  name_en: string;
  name_ru: string;
  sort_order: number;
}

interface Settlement {
  id: number;
  district_id: number;
  name_az: string;
  name_en: string;
  name_ru: string;
  sort_order: number;
}

interface MetroStation {
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
  districtId?: number | null;
  onDistrictChange?: (districtId: number | null) => void;
  settlementId?: number | null;
  onSettlementChange?: (settlementId: number | null) => void;
  metroStationId?: number | null;
  onMetroStationChange?: (metroStationId: number | null) => void;
  locale?: string;
  // Legacy support for old API
  neighborhoodId?: number | null;
  onNeighborhoodChange?: (neighborhoodId: number | null) => void;
}

type LocationType = 'district' | 'metro';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://100.89.150.50:8000/api';
const BAKU_CITY_ID = 1;

export default function LocationSelector({
  isRemote,
  onRemoteChange,
  cityId,
  onCityChange,
  districtId,
  onDistrictChange,
  settlementId,
  onSettlementChange,
  metroStationId,
  onMetroStationChange,
  locale = 'az',
  // Legacy props
  neighborhoodId,
  onNeighborhoodChange
}: LocationSelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [metroStations, setMetroStations] = useState<MetroStation[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [loadingMetroStations, setLoadingMetroStations] = useState(false);
  const [locationType, setLocationType] = useState<LocationType>('district');

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch districts/metro stations when city changes
  useEffect(() => {
    if (cityId) {
      const selectedCity = cities.find(c => c.id === cityId);

      // For Baku (city_id === 1), fetch both districts and metro stations
      if (cityId === BAKU_CITY_ID) {
        fetchDistricts(cityId);
        fetchMetroStations(cityId);
      } else if (selectedCity?.has_neighborhoods) {
        // For other cities with has_neighborhoods flag
        fetchDistricts(cityId);
        setMetroStations([]);
      } else {
        // For cities without subdivisions
        setDistricts([]);
        setSettlements([]);
        setMetroStations([]);
        clearAllLocationSelections();
      }
    } else {
      setDistricts([]);
      setSettlements([]);
      setMetroStations([]);
      clearAllLocationSelections();
    }
  }, [cityId, cities]);

  // Fetch settlements when district changes
  useEffect(() => {
    if (districtId && locationType === 'district') {
      fetchSettlements(districtId);
    } else {
      setSettlements([]);
      if (onSettlementChange) onSettlementChange(null);
      if (onNeighborhoodChange) onNeighborhoodChange(null);
    }
  }, [districtId, locationType]);

  // Handle location type change (for Baku)
  useEffect(() => {
    if (cityId === BAKU_CITY_ID) {
      if (locationType === 'district') {
        // Clear metro selection
        if (onMetroStationChange) onMetroStationChange(null);
      } else {
        // Clear district/settlement selections
        if (onDistrictChange) onDistrictChange(null);
        if (onSettlementChange) onSettlementChange(null);
        if (onNeighborhoodChange) onNeighborhoodChange(null);
      }
    }
  }, [locationType]);

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

  const fetchDistricts = async (cityId: number) => {
    try {
      setLoadingDistricts(true);
      const response = await fetch(`${API_URL}/cities/${cityId}/districts`);
      const data = await response.json();

      if (data.status === 'success') {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchSettlements = async (districtId: number) => {
    try {
      setLoadingSettlements(true);
      const response = await fetch(`${API_URL}/districts/${districtId}/settlements`);
      const data = await response.json();

      if (data.status === 'success') {
        setSettlements(data.data);
      }
    } catch (error) {
      console.error('Error fetching settlements:', error);
    } finally {
      setLoadingSettlements(false);
    }
  };

  const fetchMetroStations = async (cityId: number) => {
    try {
      setLoadingMetroStations(true);
      const response = await fetch(`${API_URL}/cities/${cityId}/metro-stations`);
      const data = await response.json();

      if (data.status === 'success') {
        setMetroStations(data.data);
      }
    } catch (error) {
      console.error('Error fetching metro stations:', error);
    } finally {
      setLoadingMetroStations(false);
    }
  };

  const clearAllLocationSelections = () => {
    if (onDistrictChange) onDistrictChange(null);
    if (onSettlementChange) onSettlementChange(null);
    if (onMetroStationChange) onMetroStationChange(null);
    if (onNeighborhoodChange) onNeighborhoodChange(null);
  };

  const handleRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onRemoteChange(checked);

    // Clear location selections when remote is checked
    if (checked) {
      onCityChange(null);
      clearAllLocationSelections();
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCityChange(value ? parseInt(value) : null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const id = value ? parseInt(value) : null;
    if (onDistrictChange) onDistrictChange(id);
    if (onNeighborhoodChange) onNeighborhoodChange(id); // Legacy support
  };

  const handleSettlementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (onSettlementChange) onSettlementChange(value ? parseInt(value) : null);
  };

  const handleMetroStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (onMetroStationChange) onMetroStationChange(value ? parseInt(value) : null);
  };

  const handleLocationTypeChange = (type: LocationType) => {
    setLocationType(type);
  };

  const getCityName = (city: City) => {
    return city[`name_${locale}` as keyof City] || city.name_az;
  };

  const getDistrictName = (district: District) => {
    return district[`name_${locale}` as keyof District] || district.name_az;
  };

  const getSettlementName = (settlement: Settlement) => {
    return settlement[`name_${locale}` as keyof Settlement] || settlement.name_az;
  };

  const getMetroStationName = (station: MetroStation) => {
    return station[`name_${locale}` as keyof MetroStation] || station.name_az;
  };

  const labels = {
    az: {
      remote: 'Uzaqdan',
      city: 'Şəhər',
      district: 'Rayon',
      settlement: 'Qəsəbə/Mikrorayon',
      metroStation: 'Metro stansiyası',
      selectCity: 'Şəhər seçin',
      selectDistrict: 'Rayon seçin',
      selectSettlement: 'Qəsəbə/Mikrorayon seçin',
      selectMetroStation: 'Metro stansiyası seçin',
      locationType: 'Məkan növü',
      districtPath: 'Rayon/Qəsəbə',
      metroPath: 'Metro stansiyası'
    },
    en: {
      remote: 'Remote',
      city: 'City',
      district: 'District',
      settlement: 'Settlement/Microdistrict',
      metroStation: 'Metro Station',
      selectCity: 'Select city',
      selectDistrict: 'Select district',
      selectSettlement: 'Select settlement/microdistrict',
      selectMetroStation: 'Select metro station',
      locationType: 'Location Type',
      districtPath: 'District/Settlement',
      metroPath: 'Metro Station'
    },
    ru: {
      remote: 'Удаленно',
      city: 'Город',
      district: 'Район',
      settlement: 'Поселок/Микрорайон',
      metroStation: 'Станция метро',
      selectCity: 'Выберите город',
      selectDistrict: 'Выберите район',
      selectSettlement: 'Выберите поселок/микрорайон',
      selectMetroStation: 'Выберите станцию метро',
      locationType: 'Тип местоположения',
      districtPath: 'Район/Поселок',
      metroPath: 'Станция метро'
    }
  };

  const t = labels[locale as keyof typeof labels] || labels.az;

  const selectedCity = cityId ? cities.find(c => c.id === cityId) : null;
  const isBaku = cityId === BAKU_CITY_ID;

  return (
    <div className="space-y-4">
      {/* Remote Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_remote"
          checked={isRemote}
          onChange={handleRemoteChange}
          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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

      {/* For Baku: Location Type Radio Buttons */}
      {!isRemote && isBaku && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.locationType}
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="location_type_district"
                name="location_type"
                value="district"
                checked={locationType === 'district'}
                onChange={() => handleLocationTypeChange('district')}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="location_type_district"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t.districtPath}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="location_type_metro"
                name="location_type"
                value="metro"
                checked={locationType === 'metro'}
                onChange={() => handleLocationTypeChange('metro')}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="location_type_metro"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t.metroPath}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* District Selector (for Baku when district path is selected, or for other cities with subdivisions) */}
      {!isRemote && selectedCity && (isBaku ? locationType === 'district' : selectedCity.has_neighborhoods) && (
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.district}
          </label>
          <select
            id="district"
            value={districtId || neighborhoodId || ''}
            onChange={handleDistrictChange}
            disabled={loadingDistricts}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.selectDistrict}</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {getDistrictName(district)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Settlement Selector (only for Baku with district path when district is selected) */}
      {!isRemote && isBaku && locationType === 'district' && (districtId || neighborhoodId) && (
        <div>
          <label htmlFor="settlement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.settlement}
          </label>
          <select
            id="settlement"
            value={settlementId || ''}
            onChange={handleSettlementChange}
            disabled={loadingSettlements}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.selectSettlement}</option>
            {settlements.map((settlement) => (
              <option key={settlement.id} value={settlement.id}>
                {getSettlementName(settlement)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Metro Station Selector (only for Baku with metro path) */}
      {!isRemote && isBaku && locationType === 'metro' && (
        <div>
          <label htmlFor="metro_station" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.metroStation}
          </label>
          <select
            id="metro_station"
            value={metroStationId || ''}
            onChange={handleMetroStationChange}
            disabled={loadingMetroStations}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t.selectMetroStation}</option>
            {metroStations.map((station) => (
              <option key={station.id} value={station.id}>
                {getMetroStationName(station)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
