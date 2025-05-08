export const parseTTL = (ttl: string): number => {
  const num = parseInt(ttl, 10);
  const unit = ttl.replace(num.toString(), '').toLowerCase();

  switch (unit) {
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'm':
      return num * 60 * 1000;
    case 's':
      return num * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
};
