const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
};

const truncate = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
};

module.exports = {
  slugify,
  capitalize,
  truncate,
};



