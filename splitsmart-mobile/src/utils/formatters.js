export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  return `${date.toLocaleDateString(
    "en-US",
    dateOptions
  )} at ${date.toLocaleTimeString("en-US", timeOptions)}`;
};

export const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export const formatBalance = (balance) => {
  const amount = parseFloat(balance);
  if (amount > 0) {
    return `+${formatCurrency(amount)}`;
  } else if (amount < 0) {
    return formatCurrency(amount);
  }
  return formatCurrency(0);
};
