const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

// html to hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/pages"));

//static server image
// app.use(express.static("src/assets"));
// parsing data from client
app.use(express.urlencoded({ extended: false }));

//router
app.get("/", home);
app.get("/project", project);
app.post("/project", addProject);
app.get("/contact", contact);
app.get("/project-detail/:id", projectDetail);

// server port
app.listen(PORT, () => console.log(`Server running on port${PORT}`));

// callback function router
function home(req, res) {
  res.render("index");
}
function project(req, res) {
  res.render("project");
}
function addProject(req, res) {
  const {
    name,
    startDate,
    endDate,
    description,
    // nodeJs,
    // php,
    // reactJs,
    // javascript,
  } = req.body;
  console.log(
    name,
    startDate,
    endDate,
    description
    // nodeJs,
    // php,
    // reactJs,
    // javascript
  );
  res.redirect("/");
}
function contact(req, res) {
  res.render("contact");
}
function projectDetail(req, res) {
  const id = req.params;
  const data = {
    id,
    title: "Dumbways Project",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquaaccusamus sintDolor modi repudiandae",
    image: "/images/img.jpg",
  };
  res.render("project-detail", { data });
}
