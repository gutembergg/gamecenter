export function useFormaterResonse() {
    const formater = (data, idKey, labelKey) => {
        if(Array.isArray(data)){
            return data.map(item => {
                const value = item[idKey];
                const label = item[labelKey];
        
                return { value, label };
            });
        }else {
            return {};
        }
    
    };

    return {formater}
};