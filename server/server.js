const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./gqlschema");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const mongoDBUrl = `${process.env.MONGODB_URL}`;
mongoose.connect(mongoDBUrl).then(() => {
  console.log("connected to DB");
});

const app = express();

//allow CORS
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server running on 4000"));
