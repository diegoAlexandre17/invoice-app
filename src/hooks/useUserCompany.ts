import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { checkUserHasCompany, getUserCompany } from '../utils/checkUserCompany';
import type { Customers } from '../views/customers/types';

export const useUserCompany = () => {
  const { user, isAuthenticated } = useAuth();
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [company, setCompany] = useState<Customers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCompany = async () => {
      if (!isAuthenticated || !user) {
        setHasCompany(false);
        setCompany(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Verificar si tiene empresa
        const userHasCompany = await checkUserHasCompany(user.id);
        setHasCompany(userHasCompany);

        // Si tiene empresa, obtener los datos
        if (userHasCompany) {
          const companyData = await getUserCompany(user.id);
          setCompany(companyData);
        } else {
          setCompany(null);
        }
      } catch (err) {
        console.error('Error in useUserCompany:', err);
        setError('Error al verificar la empresa del usuario');
        setHasCompany(false);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [user, isAuthenticated]);

  /**
   * Función para refrescar manualmente los datos de la empresa
   */
  const refetch = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      setError(null);

      const userHasCompany = await checkUserHasCompany(user.id);
      setHasCompany(userHasCompany);

      if (userHasCompany) {
        const companyData = await getUserCompany(user.id);
        setCompany(companyData);
      } else {
        setCompany(null);
      }
    } catch (err) {
      console.error('Error refetching company data:', err);
      setError('Error al actualizar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  return {
    hasCompany,
    company,
    loading,
    error,
    refetch,
  };
};