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

    const default_params = {
      region: "SVRG",
  }
    const mergedParams = Object.assign({}, default_params, requestParams);

    try {
      const res = await api.get(urlWithParams, { 
        params: requestParams, 
        headers: { 
            Authorization: AppData.gc_apikey 
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




