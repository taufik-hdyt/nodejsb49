const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFIles");
// const dataProject = require("./fake-data");

// html to hbs
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/pages"));

// setup FLASH
app.use(flash());
// setup session
app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

//static server image
app.use(express.static("src/assets"));
app.use(express.static("src/uploads"));
app.use(express.urlencoded({ extended: false }));

// sequelize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
//router
app.get("/", home);
app.get("/project", project);
app.post("/add-project", upload.single("gambar"), addProject);
app.get("/contact", contact);
app.post("/contact", contactPost);
app.get("/project-detail/:id", projectDetail);
app.get("/delete-project/:id", deleteProject);
app.get("/update-project/:id", updateProject);
app.post("/update-project/:id", upload.single("gambar"), updateNewProject);

// server port
app.listen(PORT, () => console.log(`Server running on port${PORT}`));

// LOGIN AND REGISTER ROUTER
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email='${email}'`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const salt = 10;

    if (obj.find((e) => e.email === email)) {
      req.flash("danger", "Email already exists");
      return res.redirect("/register");
    } else {
      await bcrypt.hash(password, salt, (err, hashPassword) => {
        sequelize.query(
          `INSERT INTO "Users" (name,email,password, "createdAt","updatedAt") VALUES
          ('${name}', '${email}','${hashPassword}',NOW(),NOW()) `
        );
        res.redirect("/login");
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM "Users" WHERE email='${email}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    if (!obj.length) {
      req.flash("danger", "User not registered");
      return res.redirect("/login");
    }
    await bcrypt.compare(password, obj[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "Wrong password!");
        return res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.user = obj[0].name;
        req.session.idUser = obj[0].id;
        req.flash("success", "login success");
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
});

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
    const query = `SELECT
    "Projects".id,
    "Projects".name,"Users".name AS author,description,image,duration,technologies FROM
    "Projects" LEFT JOIN "Users" ON "Projects".author = "Users".id ORDER BY "Projects".id DESC`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const data = obj.map((res) => ({
      ...res,
      isLogin: req.session.isLogin,
    }));
    const dataFilter = data.filter((e) => e.author === req.session.user);
    if (!req.session.isLogin) {
      res.render("index", {
        dataProject: data,
        user: req.session.user,
        isLogin: req.session.isLogin,
      });
    } else {
      res.render("index", {
        dataProject: dataFilter,
        user: req.session.user,
        isLogin: req.session.isLogin,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function project(req, res) {
  const methodPost = "post";
  if (req.session.user) {
    res.render("project", {
      method: methodPost,
      user: req.session.user,
      isLogin: req.session.isLogin,
    });
  } else {
    res.redirect("/login");
  }
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
    } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    const durasi = duration(startDate, endDate);
    const tech = {
      node_js: nodeJs === "on" ? true : false,
      react_js: reactJs === "on" ? true : false,
      php: php === "on" ? true : false,
      javascript: javascript === "on" ? true : false,
    };
    await sequelize.query(`INSERT INTO "Projects" (author,name,description,start_date,end_date,duration,image,technologies) VALUES
    ('${author}','${name}','${description}','${startDate}','${endDate}','${durasi}','${image}','{"node_js": ${tech.node_js},"react_js":${tech.react_js},"php": ${tech.php},"javascript": ${tech.javascript}}')`);
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
  res.render("contact", {
    user: req.session.user,
    isLogin: req.session.isLogin,
  });
}

async function projectDetail(req, res) {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM "Projects" WHERE id =${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    const data = obj.map((e) => ({ ...e }));
    res.render("project-detail", {
      data: data[0],
      user: req.session.user,
      isLogin: req.session.isLogin,
    });
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

    if (req.session.user) {
      res.render("project", {
        methodPut,
        data: dataUpdate[0],
        user: req.session.user,
        isLogin: req.session.isLogin,
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateNewProject(req, res) {
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
      updateIMG,
    } = req.body;
    console.log(updateIMG);
    const author = req.session.idUser;
    const { id } = req.params;

    const durasi = duration(startDate, endDate);
    const tech = {
      node_js: nodeJs === "on" ? true : false,
      react_js: reactJs === "on" ? true : false,
      php: php === "on" ? true : false,
      javascript: javascript === "on" ? true : false,
    };
    const query = `UPDATE "Projects" SET
    author= ${author},
    name='${name}',
    description='${description}',
    start_date='${startDate}',
    end_date ='${endDate}',
    duration='${durasi}',
    image='${updateIMG}',
    technologies='{
    "php":${tech.php},
    "javascript": ${tech.javascript},
    "node_js": ${tech.node_js},
    "react_js": ${tech.react_js}
    }'
    WHERE id= ${id}`;
    await sequelize.query(query);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}
