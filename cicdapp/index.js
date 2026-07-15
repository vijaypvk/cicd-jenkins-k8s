const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("CI/CD Pipeline with Git, Jenkins, Docker, AWS ECR & Kubernetes 🚀");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
