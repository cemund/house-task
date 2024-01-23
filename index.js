import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  password: "postgresql",
  database: "permalist",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

async function getTodos() {
  const result = await db.query("SELECT * FROM todos");
  items = result.rows;
}

app.get("/", async (req, res) => {
  await getTodos();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  await db.query("INSERT INTO todos (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await db.query("UPDATE todos SET title = $1 WHERE id = $2", [
    req.body.updatedItemTitle,
    req.body.updatedItemId,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM todos WHERE id = $1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
