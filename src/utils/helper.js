import React from 'react';
import { useLocation } from 'react-router-dom';
import wordLists from '../Badwords/badWords.json'
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


export const checkBadWord = userInput => {
  const lang_code = localStorage.getItem('apphomelang');
  const words = wordLists[lang_code];

  if (!words || !Array.isArray(words)) {
    return false;
  }

  const cleanedInput = userInput.trim().toLowerCase();
  return words.includes(cleanedInput);
};

export const filterBadWords = input => {
  let texttemp = input.replace(/[.',|!|?']/g, '');
  const wordsToFilter = texttemp.toLowerCase().split(/\s+/); // Split the input into an array of words
  const filteredWords = wordsToFilter.map(word => {
    if (checkBadWord(word)) {
      return `${word[0]}*****${word[word.length-1]}`; // Replace bad words with ****
    }
    return word;
  });

  return filteredWords.join(' '); // Join the array back into a string
};

export const isProfanityWord=()=>{
  let isProfanity = localStorage.getItem('voiceText');
  return isProfanity.includes("*****")
}
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
export function findRegex(str) {
  var rawString = str;
  var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  var cleanString = rawString.replace(regex, '');
  return cleanString;
}

export function useGetUrl() {
  const location = useLocation();
  return location.pathname + location.search;
}

export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

export function compareArrays(arr1, arr2) {
  let words_result = [];

  // Iterate over each element and compare
  for (var k in arr1){
    if (arr2[k] == "" || arr2[k] == undefined)
    {
      // Element not available on the same key
      words_result.push('-1');
    }
    else if (arr1[k] === arr2[k]) {
      // Elements match on the same key
      words_result.push('1');
    }
    else {
      // Element does not match on the same key
      words_result.push('0');
    }
  }
  if (arr1.length < arr2.length)
  {
    for (let i = arr1.length; i < arr2.length; i++){
      words_result.push('-1');
    }
  }
  return words_result;
}
