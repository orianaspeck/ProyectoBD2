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
            "SELECT * FROM `programa` ORDER BY id_programa ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("programa/list", {
                        title: "Lista de Programas",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("programa/list", {
                        title: "Lista de Programas",
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
    res.render("Programa/add", {
        title: "Añadir nuevo programa",
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
        var programa = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `programa` SET ?",programa, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("programa/add", {
                        title: "Añadir nuevo programa",
                        nombre: programa.nombre,
                        descripcion:programa.descripcion
                    });
                } else {
                    req.flash("success", "Programa añadido exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/programa");
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
        res.render("programa/add", {
            title: "Añadir nuevo programa",
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});
____________________________________________________________________________________
// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_programa)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `programa` WHERE id_programa = " +
                req.params.id_programa,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "programa not found with id = " +
                            req.params.id_programa
                    );
                    res.redirect("/programa");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("programa/edit", {
                        title: "Editar programa",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_programa: rows[0].id_programa,
                        nombre: rows[0].nombre,
                        descripcion: rows[0].descripcion
                    });
                }
            }
        );
    });
});
____________________________________________________________________________________
// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_programa)", function(req, res, next) {
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
        var programa = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `programa` SET ? WHERE id_programa = " +
                    req.params.id_programa,
                programa,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("programa/edit", {
                            title: "Editar programa",
                            id_programa: req.params.id_programa,
                            nombre: req.body.nombre,
                            descripcion: req.body.descripcion
                        });
                    } else {
                        req.flash(
                            "success",
                            "Programa actualizado exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/programa");
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
        res.render("programa/edit", {
            title: "Editar programa",
            id_programa: req.body.id_programa,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});
____________________________________________________________________________________
// DELETE nombredetabla
app.delete("/(:id_programa)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `programa` WHERE id_programa = " +
                req.params.id_programa,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/programa");
                } else {
                    req.flash(
                        "success",
                        "Programa eliminado exitosamente! id = " +
                            req.params.id_programa
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/programa");
                }
            }
        );
    });
});

module.exports = app;