export const removeAccents = (obj) => {
  for (let key in obj) {
    let str = obj[key];
    obj[key] = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return obj;
};
