require("dotenv").config({ path: __dirname + "/../.env" });
const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on htpp://localhost:${PORT}`);
});
