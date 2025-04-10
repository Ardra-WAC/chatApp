export const findMessageDateLabel = (timestamp) => {
  let messageDate;

  if (timestamp && typeof timestamp.toDate === "function") {
    messageDate = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    messageDate = timestamp;
  } else if (typeof timestamp === "number") {
    messageDate = new Date(timestamp);
  } else {
    return "Unknown Date";
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  const isYesterday =
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
