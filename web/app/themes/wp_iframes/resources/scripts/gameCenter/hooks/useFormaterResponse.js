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

    const formatObject = (data) => {
        return data.map(obj => obj.caption);
    }
    return { formater, formatObject }

};