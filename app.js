const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializedbandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializedbandserver();
//API1
app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;
  if (status !== undefined && priority !== undefined) {
    const getplayersquery = `
    select * from todo where priority like '%${priority}%' and status='${status}';`;
    const playersarray = await db.all(getplayersquery);
    response.send(playersarray);
  } else if (status !== undefined) {
    const getplayersquery = `
    select * from todo where status like '%${status}%';`;
    const playersarray = await db.all(getplayersquery);
    response.send(playersarray);
  } else if (priority !== undefined) {
    const getplayersquery = `
    select * from todo where priority= '${priority}';`;
    const playersarray = await db.all(getplayersquery);
    response.send(playersarray);
  } else if (search_q !== undefined) {
    const getplayersquery = `
    select * from todo where todo like '%${search_q}%';`;
    const playersarray = await db.all(getplayersquery);
    response.send(playersarray);
  }
});

//API2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `select * from todo where id=${todoId};`;
  const res = await db.get(query);
  response.send(res);
});
//API3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `insert into todo(id,todo,priority,status)
    values(${id},'${todo}','${priority}','${status}');`;
  const res = await db.run(query);
  response.send("Todo Successfully Added");
});
//API4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { priority, status, todo } = request.body;
  if (priority !== undefined) {
    const query = `update todo set priority='${priority}' 
  where id=${todoId};`;
    const res = await db.run(query);
    response.send("Priority Updated");
  } else if (status !== undefined) {
    const query = `update todo set status='${status}' 
  where id=${todoId};`;
    const res = await db.run(query);
    response.send("Status Updated");
  } else if (todo !== undefined) {
    const query = `update todo set todo='${todo}' 
  where id=${todoId};`;
    const res = await db.run(query);
    response.send("Todo Updated");
  }
});

//API5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `delete from todo where id=${todoId};`;
  await db.run(query);
  response.send("Todo Deleted");
});
module.exports = app;
