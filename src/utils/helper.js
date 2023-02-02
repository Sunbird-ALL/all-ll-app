import React from 'react';

export const blobToBase64 = (blob, callback) => {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    var dataUrl = this.result;
    callback(dataUrl);
  });
  reader.readAsDataURL(blob);
  return reader;
};

export const maxWidth = 1080;
export function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.innerWidth > maxWidth ? maxWidth : '100%',
        window.innerHeight,
      ]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}
