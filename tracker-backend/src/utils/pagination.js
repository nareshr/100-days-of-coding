export function getPagination(req) {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
  
    const skip = (page - 1) * limit;
  
    return { page, limit, skip };
}
  