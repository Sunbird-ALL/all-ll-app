
const baseURL = `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/lp-tracker/api/pointer`;

export const fetchPointerApi = () => {
    const url = `${baseURL}/getPointers/${localStorage.getItem('virtualID')}/${localStorage.getItem('virtualStorySessionID')}`;
  
    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };
  

//   api/pointer/addPointer
export const addPointerApi = async (data) => {
    const url = `${baseURL}/addPointer/`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error adding pointer:', error);
      throw error;
    }
  };
  