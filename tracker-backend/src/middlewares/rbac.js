function permit(...allowedRoles) {
  return (req, res, next) => {
    const name = req.user?.role?.name;
    if (!name) return res.status(403).json({ error: 'Forbidden' });
    if (allowedRoles.includes(name) || allowedRoles.includes('admin') && name === 'admin') return next();
    return res.status(403).json({ error: 'Insufficient role' });
  };
}
export { permit };
