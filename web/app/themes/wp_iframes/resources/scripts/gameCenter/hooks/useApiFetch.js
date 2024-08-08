import api from '../helpers/api.js';
import { ref } from 'vue';

export function useApiFetch() {
  const loading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetchData = async (url, urlParams = null, requestParams = {}) => {
    loading.value = true;
    response.value = null;
    error.value = null;

    const urlWithParams = urlParams ? `${url}/${urlParams}` : url;

    try {
      const res = await api.get(urlWithParams, { 
        params: requestParams, 
        headers: { 
            Authorization: "" 
        }, 
    });
      response.value = res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    response,
    error,
    fetchData,
  };
}




