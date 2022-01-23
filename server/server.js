const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const cors = require("cors");
const path = require("path");
const app = express();
const yFinanceSchema = require("./models/yFinanceModel");
const investorApiRouter = require("./routes/investorApi");
const runPy = require("./schedules/runPy");

const PORT = process.env.PORT || 3000;

/**
 * Middlewares
 */
// Handle cross origin
app.use(cors());
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Run scheduled jobs
 */
// Run Python Scripts on Schedule
runPy();

/**
 * GraphQL Router
 */
app.use(
  "/graphql",
  graphqlHTTP({
    schema: yFinanceSchema,
    graphiql: true,
  })
);

/**
 * REST API Router
 */
app.use("/api/investors", investorApiRouter);

/**
 * Production Build Mode
 */
if (process.env.NODE_ENV === "production") {
  // Statically serve everything in the build folder on the route '/build'
  app.use("/build", express.static(path.join(__dirname, "../build")));

  // Serve index.html on the route '/'
  app.use("/", (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, "../index.html"));
  });
}

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server is running on the server ${PORT}`);
});
