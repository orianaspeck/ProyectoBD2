var express = require("express");
var app = express();
const { check, validationResult, sanitizeBody } = require("express-validator");
// SHOW LIST OF nombredetabla
//Cambien donde sea que vean institucion por el nombre de la tabla de la cual sera la ruta, respetando donde dice id_institucion
//Solo cambien lo que va despues del guion, id_nombredetabla
//Tambien cambien las palabras en plural por la correspondiente, EJ: Lista de Instituciones -> Lista de Carreras

app.get("/", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `carrera` ORDER BY id_carrera ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("carrera/list", {
                        title: "Lista de Carreras",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("carrera/list", {
                        title: "Lista de Carreras",
                        data: rows
                    });
                    console.log("PASO");
                }
            }
        );
    });
});

// SHOW ADD nombredetabla FORM
app.get("/add", function(req, res, next) {
    // render to views/nombredetabla/add.ejs
    res.render("carrera/add", {
        title: "Añadir nueva carrera",
        nombre: "",
        descripcion: ""
    });
});
// ADD NEW nombredetabla POST ACTION
app.post("/add", function(req, res, next) {
    console.log(req.body);
    var result = validationResult(req).array();
    if (result) {
        //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.programanombre = '   a programa    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a programa'
        ********************************************/
        //Añadir los atributos necesarios y quitar los que no, colocarlos en el mismo orden en el que estan en la BD
        //NO AGREGAR EL ID EN ESTA PARTE
        //Una vez cambien esto con los atributos correctos pueden copiarlo a la parte de edit post
        var carrera = {
            descripcion: req.body.descripcion,
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `carrera` SET ?", carrera, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("carrera/add", {
                        title: "Añadir nueva carrera",
                        descripcion: carrera.descripcion
                    });
                } else {
                    req.flash("success", "Carrera añadida exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/carrera");
                }
            });
        });
    } else {
        //Display errors to programa
        var error_msg = "";
        errors.forEach(function(error) {
            error_msg += error.msg + "<br>";
        });
        req.flash("error", error_msg);

        /**
         * Using req.body.nombre
         * because req.param('nombre') is deprecated
         */
        res.render("carrera/add", {
            title: "Añadir nueva carrera",
            descripcion: req.body.descripcion
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_carrera)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `carrera` WHERE id_carrera = " +
                req.params.id_carrera,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "Carrera not found with id = " +
                            req.params.id_carrera
                    );
                    res.redirect("/carrera");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("carrera/edit", {
                        title: "Editar carrera",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_carrera: rows[0].id_carrera,
                        descripcion: rows[0].descripcion
                    });
                }
            }
        );
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_carrera)", function(req, res, next) {
    var result = validationResult(req).array();

    if (result) {
        //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.programanombre = '   a programa    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a programa'
        ********************************************/
        var carrera = {
            descripcion: req.body.descripcion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `carrera` SET ? WHERE id_carrera = " +
                    req.params.id_carrera,
                carrera,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("carrera/edit", {
                            title: "Editar carrera",
                            id_carrera: req.params.id_carrera,
                            descripcion: req.body.descripcion
                        });
                    } else {
                        req.flash(
                            "success",
                            "Carrera actualizada exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/carrera");
                    }
                }
            );
        });
    } else {
        //Display errors to nombredetabla
        var error_msg = "";
        errors.forEach(function(error) {
            error_msg += error.msg + "<br>";
        });
        req.flash("error", error_msg);

        /**
         * Using req.body.nombre
         * because req.param('nombre') is deprecated
         */
        //
        //AQUI SI SE COLOCA EL ID
        res.render("carrera/edit", {
            title: "Editar carrera",
            id_carrera: req.body.id_carrera,
            descripcion: req.body.descripcion
        });
    }
});

// DELETE nombredetabla
app.delete("/(:id_carrera)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `carrera` WHERE id_carrera = " +
                req.params.id_carrera,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/carrera");
                } else {
                    req.flash(
                        "success",
                        "Carrera eliminada exitosamente! id = " +
                            req.params.id_carrera
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/carrera");
                }
            }
        );
    });
});

module.exports = app;
