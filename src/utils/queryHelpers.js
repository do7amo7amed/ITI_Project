const parseSort = (sortQuery, allowedFields = [], defaultSort = { createdAt: -1 }) => {
  const sortObj = {};

  if (!sortQuery) {
    return defaultSort;
  }

  sortQuery.split(",").forEach((field) => {
    const trimmed = field.trim();
    const direction = trimmed.startsWith("-") ? -1 : 1;
    const key = trimmed.replace(/^-/, "");
    if (allowedFields.includes(key)) {
      sortObj[key] = direction;
    }
  });

  return Object.keys(sortObj).length ? sortObj : defaultSort;
};

// Normalizes page/limit query params into safe numbers + a Mongo skip value.
const parsePagination = (page, limit, maxLimit = 50, defaultLimit = 10) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || defaultLimit, 1), maxLimit);
  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

module.exports = {
  parseSort,
  parsePagination,
};
