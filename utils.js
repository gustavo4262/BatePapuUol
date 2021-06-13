export const validateMessage = (message, participants) => {
  const { to, text, type, from } = message;
  if (!to || !text) return false;
  if (type !== "message" && type !== "private_message") return false;
  console.log(
    participants,
    from,
    !participants.filter((p) => p.name === from).length
  );
  if (!participants.filter((p) => p.name === from).length) {
    return false;
  }
  return true;
};

export const removeAccents = (obj) => {
  for (let key in obj) {
    let str = obj[key];
    obj[key] = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return obj;
};
