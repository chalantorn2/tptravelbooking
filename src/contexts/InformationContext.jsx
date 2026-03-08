import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchInformationByCategory, addInformation } from '../services/informationService';
import { useAuth } from './AuthContext';

const InformationContext = createContext();

export const useInformation = () => useContext(InformationContext);

export const InformationProvider = ({ children }) => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [transferTypes, setTransferTypes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [tourRecipients, setTourRecipients] = useState([]);
  const [transferRecipients, setTransferRecipients] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const loadInformation = async () => {
    const [agentRes, tourTypeRes, transferTypeRes, placeRes, provinceRes, tourRecRes, transferRecRes, driverRes, vehicleRes] = await Promise.all([
      fetchInformationByCategory('agent'),
      fetchInformationByCategory('tour_type'),
      fetchInformationByCategory('transfer_type'),
      fetchInformationByCategory('place'),
      fetchInformationByCategory('province'),
      fetchInformationByCategory('tour_recipient'),
      fetchInformationByCategory('transfer_recipient'),
      fetchInformationByCategory('driver'),
      fetchInformationByCategory('vehicle'),
    ]);

    setAgents(agentRes.data || []);
    setTourTypes(tourTypeRes.data || []);
    setTransferTypes(transferTypeRes.data || []);
    setPlaces(placeRes.data || []);
    setProvinces(provinceRes.data || []);
    setTourRecipients(tourRecRes.data || []);
    setTransferRecipients(transferRecRes.data || []);
    setDrivers(driverRes.data || []);
    setVehicles(vehicleRes.data || []);
  };

  useEffect(() => {
    if (user) {
      loadInformation();
    }
  }, [user]);

  const addNewInformation = async (data) => {
    const result = await addInformation(data);
    if (!result.error) {
      await loadInformation();
    }
    return result;
  };

  const refreshInformation = () => loadInformation();

  return (
    <InformationContext.Provider value={{
      agents, tourTypes, transferTypes, places, provinces, tourRecipients, transferRecipients, drivers, vehicles,
      addNewInformation, refreshInformation,
    }}>
      {children}
    </InformationContext.Provider>
  );
};
