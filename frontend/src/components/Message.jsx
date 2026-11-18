// Small reusable box for showing an error or a success message
function Message({ text, type }) {
  if (!text) return null;
  return <p className={"message " + (type || "error")}>{text}</p>;
}

export default Message;
