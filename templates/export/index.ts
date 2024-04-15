import express from "express";

const app = express();
const port = 5000;

app.use(express.json());

app.post("/", (req, res) => {
  res.send("Hello World!");
  console.log(JSON.stringify(req.body, null, 2));
});


app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
