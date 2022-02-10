export const hasPassedTwoHours = (date: Date) => {
  const now = Date.now();
  const time = date.getTime();
  const twoHours = 1000 * 60 * 60 * 2;
  
  return now - time > twoHours;
}
