import { stripHtml } from "string-strip-html";

export const removeAccents = (obj) => {
  for (let key in obj) {
    let str = obj[key];
    str = stripHtml(str).result;
    obj[key] = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return obj;
};
