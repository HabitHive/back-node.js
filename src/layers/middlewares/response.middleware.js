export default async (req, res, next) => {
  const { response } = res.locals;
  return res
    .status(response.status)
    .json({ message: response.message, result: response.result });
};
