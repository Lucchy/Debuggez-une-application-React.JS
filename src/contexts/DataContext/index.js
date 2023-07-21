import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

// ajout d'une fonction pour calculer l'événement le plus récent 
  const calculateLastEvent = () => {
    if (data && data?.events?.length > 0) {
      const sortedEvents = data?.events.sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedEvents[0];
    }
    return null;
  };

  const getData = useCallback(async () => {
    try {

      setData(await api.loadData());

    } catch (err) {
      setError(err);
    }
  }, [])

  useEffect(() => {
    if (data) return;
    getData();
  });

  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last : calculateLastEvent(),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
