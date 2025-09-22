  // Función para obtener el símbolo de la moneda
  export const getCurrencySymbol = (currency?: string) => {
    switch (currency?.toUpperCase()) {
      case 'USD':
        return '$';
      case 'EURO':
        return '€';
      default:
        return '$'; // Símbolo por defecto
    }
  };