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

// sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
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
async function home(req, res) {
  try {
    const query = `SELECT id, name, description, start_date, end_date, duration,image,technologies
    FROM "Projects";`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const data = obj.map((res) => ({
      ...res,
    }));

    res.render("index", { dataProject: data });
  } catch (err) {
    console.log(err);
  }
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
async function addProject(req, res) {
  try {
    const {
      name,
      startDate,
      endDate,
      description,
      nodeJs,
      reactJs,
      php,
      javascript,
      gambar,
    } = req.body;

    const durasi = duration(startDate, endDate);
    const tech = {
      node_js: nodeJs === "on" ? true : false,
      react_js: reactJs === "on" ? true : false,
      php: php === "on" ? true : false,
      javascript: javascript === "on" ? true : false,
    };
    await sequelize.query(`INSERT INTO "Projects" (name,description,start_date,end_date,duration,image,technologies) VALUES
    ('${name}','${description}','${startDate}','${endDate}','${durasi}','${gambar}','{"node_js": ${tech.node_js},"react_js":${tech.react_js},"php": ${tech.php},"javascript": ${tech.javascript}}')`);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

  // const data = {
  //   name,
  //   description,
  //   duration: durasi,
  //   start_date: startDate,
  //   end_date: endDate,
  //   tech: {
  //     nodeJs: req.body.nodeJs !== undefined,
  //     reactJs: req.body.reactJs !== undefined,
  //     php: req.body.php !== undefined,
  //     javascript: req.body.javascript !== undefined,
  //   },
  // };

  // dataProject.push(data);
  // res.redirect("/");
}

function contact(req, res) {
  res.render("contact");
}

async function projectDetail(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Projects" WHERE id =${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const data = obj.map((e) => ({ ...e }));
    res.render("project-detail", { data: data[0] });
  } catch (err) {
    console.log(err);
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await sequelize.query(`DELETE FROM "Projects" WHERE id=${id}`);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT name, description, start_date, end_date, duration,image,technologies
    FROM "Projects" WHERE id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const dataUpdate = obj.map((res) => ({
      ...res,
    }));
    const methodPut = "put";
    res.render("project", { methodPut, data: dataUpdate[0] });
  } catch (err) {
    console.log(err);
  }
}
async function updateNewProject(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    const {
      name,
      startDate,
      endDate,
      description,
      nodeJs,
      reactJs,
      php,
      javascript,
      gambar,
    } = req.body;
    const durasi = duration(startDate, endDate);
    const tech = {
      node_js: nodeJs === "on" ? true : false,
      react_js: reactJs === "on" ? true : false,
      php: php === "on" ? true : false,
      javascript: javascript === "on" ? true : false,
    };
    const query = `UPDATE "Projects" SET name=${name},description=${description},start_date=${startDate}, end_date=${endDate},duration=${durasi},image=${gambar},'technologies={"node_js":${tech.node_js},"react_js":${tech.react_js},
    "php":${tech.php},"javascript":${tech.javascript}}' WHERE id=${id}
  }`;
    await sequelize.query(query, {
      type: QueryTypes.UPDATE,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

  // const durasi = duration(startDate, endDate);
  // const newData = {
  //   name,
  //   description,
  //   duration: durasi,
  //   start_date: startDate,
  //   end_date: endDate,
  //   tech: {
  //     nodeJs: req.body.nodeJs !== undefined,
  //     reactJs: req.body.reactJs !== undefined,
  //     php: req.body.php !== undefined,
  //     javascript: req.body.javascript !== undefined,
  //   },
  // };
  // // hapus array
  // delete dataProject[id];
  // //push array baru
  // dataProject.push(newData);
  // res.redirect("/");
}
