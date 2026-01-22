// Prices are stored in PKR, no conversion needed
export const formatPrice = (priceInPKR) => {
  return `₨${priceInPKR.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatPriceWithDecimals = (priceInPKR) => {
  return `₨${priceInPKR.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const convertToPKR = (priceInPKR) => {
  // No conversion needed, prices are already in PKR
  return priceInPKR;
};
