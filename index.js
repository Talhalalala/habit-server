const app = require("./server");

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`\n Express departing now from http://localhost:${port} \n`)
);
