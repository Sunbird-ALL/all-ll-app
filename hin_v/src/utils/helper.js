import React from 'react';
let forbiddenChars = ['!', '?', '.'];
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

export function getParameter(key, location) {
  if (key) {
    const query = new URLSearchParams(location);
    return location.split('=')[1];
  }
  // if (key) {
  //   const query = new URLSearchParams(window.location.search);
  //   console.log(query.get(key));
  //   return query.get(key);
  // }
}

export function getLayout(url) {
  if (url) {
    let value = url.split('&')[1] ? url.split('&')[1].split('=')[1] : '';
    return value;
  }
}

export function removeForbiddenCharacters(input) {

  for (let char of forbiddenChars) {
    if (localStorage.getItem('contentText').includes(char)) {
      input = input.concat(char);
    }
  }
  return input;
}

export function splitArray(studentArray) {
  
  for (let char of forbiddenChars) {
    studentArray = studentArray.map(item => item.replace(char, ''));
  }
  return studentArray;
}
export function findRegex(str){
  var rawString = str
  var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  var cleanString = rawString.replace(regex, '');
 return cleanString
}