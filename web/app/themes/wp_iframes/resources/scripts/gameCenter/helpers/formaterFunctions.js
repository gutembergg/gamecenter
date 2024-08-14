export const getDateOneYearAgo = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    console.log("`${year}-${month}-${day}`", `${year}-${month}-${day}`);

    return `${year}-${month}-${day}`;
  }

  export const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const convertObjectToStringArray = (data) => {
  return data ? data.map(obj => obj.caption) : [];
}


export function getByCaption(arr, caption) {
  return arr.find(obj => obj.caption === caption);
}