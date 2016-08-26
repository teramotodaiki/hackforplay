// state { local: { [id]: { q card object has id }, ... }, origin: { same as local } }
export const qcards = ({ local, origin } = {
  local: {},
  origin: {},
}, { type, qcard }) => {
  const node = qcard ? { [qcard.id]: qcard } : null;
  switch (type) {
    case PUT_QCARD_LOCAL:

      local = Object.assign({}, local, node);
      return { local, origin };

    case PUT_QCARD_ORIGIN:

      origin = Object.assign({}, origin, node);
      return { local, origin };

    case PUT_QCARD_BOTH:

      local = Object.assign({}, local, node);
      origin = Object.assign({}, origin, node);
      return { local, origin };

    default:
      return { local, origin };
  }
};
