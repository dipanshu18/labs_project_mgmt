export async function logout(req, res) {
  res.clearCookie("session");
  return res.status(200).json({ msg: "Logging out!" });
}
