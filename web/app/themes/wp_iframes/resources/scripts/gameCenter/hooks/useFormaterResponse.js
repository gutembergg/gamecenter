export function useFormaterResonse() {
    const formater = (data, idKey, labelKey) => {
        return data.map(item => {
            const value = item[idKey];
            const label = item[labelKey];
    
            return { value, label };
        });
    };

    return {formater}
};