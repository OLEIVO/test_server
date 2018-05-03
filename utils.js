
export const getValuesByUpdate = (data = []) => Object.entries(data).map(param => [`${param[0]} = "${param[1]}"`]).join(', ');

export const getValuesByInsert = (data = {}) => `(${Object.keys(data).join(', ')}) values (${Object.values(data).map(elem => `"${elem}"`).join(', ')})`;