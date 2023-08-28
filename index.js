const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const dataProject = require("./fake-data");

// html to hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/pages"));

//static server image
app.use(express.static("src/assets"));
// parsing data from client
app.use(express.urlencoded({ extended: false }));

//router
app.get("/", home);
app.get("/project", project);
app.post("/project", addProject);
app.get("/contact", contact);
app.post("/contact", contactPost);
app.get("/project-detail/:id", projectDetail);
app.get("/delete-project/:id", deleteProject);
app.get("/update-project/:id", updateProject);
app.post("/update-project/:id", updateNewProject);

// server port
app.listen(PORT, () => console.log(`Server running on port${PORT}`));

// callback function router
function contactPost(req, res) {
  const { name, email, phone, subject, message } = req.body;
  if (
    (name !== "", email !== "", phone !== "", subject !== "", message !== "")
  ) {
    res.redirect(
      `mailto: taufikhdyt@gmail.com?subject=${subject}&body= Halo Nama saya ${name}, ${message} Silahkan Hubungi ${phone}`
    );
  } else {
    console.log("Data is empty");
  }
}

function home(req, res) {
  res.render("index", { dataProject });
}

function project(req, res) {
  const methodPost = "post";
  res.render("project", { method: methodPost });
}

function duration(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let miliDetik = end - start;
  const hari = miliDetik / (1000 * 60 * 60 * 24);

  if (hari < 30) {
    return `${hari} Hari`;
  } else if (hari <= 360) {
    return `${Math.floor(hari / 30)} Bulan`;
  } else if (hari >= 360) {
    return `${Math.floor(hari / 30 / 12)} Tahun`;
  }
}
function addProject(req, res) {
  const { name, startDate, endDate, description } = req.body;
  const durasi = duration(startDate, endDate);
  const data = {
    name,
    description,
    duration: durasi,
    start_date: startDate,
    end_date: endDate,
    tech: {
      nodeJs: req.body.nodeJs !== undefined,
      reactJs: req.body.reactJs !== undefined,
      php: req.body.php !== undefined,
      javascript: req.body.javascript !== undefined,
    },
  };

  dataProject.push(data);
  res.redirect("/");
}
function contact(req, res) {
  res.render("contact");
}

function projectDetail(req, res) {
  const { id } = req.params;
  res.render("project-detail", { data: dataProject[id] });
}

function deleteProject(req, res) {
  const { id } = req.params;
  dataProject.splice(id, 1);
  res.redirect("/");
}

function updateProject(req, res) {
  const { id } = req.params;
  const methodPut = "put";
  res.render("project", { methodPut, data: dataProject[id] });
}
function updateNewProject(req, res) {
  const { id } = req.params;
  const { name, description, startDate, endDate } = req.body;
  const durasi = duration(startDate, endDate);
  const newData = {
    name,
    description,
    duration: durasi,
    start_date: startDate,
    end_date: endDate,
    tech: {
      nodeJs: req.body.nodeJs !== undefined,
      reactJs: req.body.reactJs !== undefined,
      php: req.body.php !== undefined,
      javascript: req.body.javascript !== undefined,
    },
  };

  // hapus array
  delete dataProject[id];

  //push array baru
  dataProject.push(newData);
  res.redirect("/");
}
