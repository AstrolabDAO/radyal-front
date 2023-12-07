
export const getDeadline = (minutes = 30) => {
  const now = new Date();
  return now.setMinutes(now.getMinutes() + minutes);
}