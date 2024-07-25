module.exports = {
    format_date: (date) => {
      // Format date as MM/DD/YYYY
      return date.toLocaleDateString();
    },
    eq: (a, b) => {
      return a === b 
  },
  format_mess_date: (date) => {
  // Fotmat the date as MM/DD/YYYY, HH:MM:SS AM/PM
  return date.toLocaleString('en-US');
  }
};