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
            "SELECT * FROM `proyecto` ORDER BY id_proyecto ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("proyecto/list", {
                        title: "Lista de Programas",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("proyecto/list", {
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
    res.render("proyecto/add", {
        title: "Añadir nuevo proyecto",
        id_encargado: "",
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
        req.body.programanombre = '   a proyecto    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a proyecto'
        ********************************************/
        //Añadir los atributos necesarios y quitar los que no, colocarlos en el mismo orden en el que estan en la BD
        //NO AGREGAR EL ID EN ESTA PARTE
        //Una vez cambien esto con los atributos correctos pueden copiarlo a la parte de edit post
        var proyecto = {
            id_encargado: req.body.id_encargado,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `proyecto` SET ?",proyecto, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("proyecto/add", {
                        title: "Añadir nuevo proyecto",
                        id_encargado: proyecto.id_encargado,
                        nombre: proyecto.nombre,
                        descripcion:proyecto.descripcion
                    });
                } else {
                    req.flash("success", "proyecto añadido exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/proyecto");
                }
            });
        });
    } else {
        //Display errors to proyecto
        var error_msg = "";
        errors.forEach(function(error) {
            error_msg += error.msg + "<br>";
        });
        req.flash("error", error_msg);

        /**
         * Using req.body.nombre
         * because req.param('nombre') is deprecated
         */
        res.render("proyecto/add", {
            title: "Añadir nuevo proyecto",
            id_encargado: req.body.id_encargado,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});
____________________________________________________________________________________
// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_proyecto)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `proyecto` WHERE id_proyecto = " +
                req.params.id_proyecto,
            function(err, rows, fields) {
                if (err) throw err;

                // if proyecto not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "proyecto not found with id = " +
                            req.params.id_proyecto
                    );
                    res.redirect("/proyecto");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("proyecto/edit", {
                        title: "Editar proyecto",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_proyecto: rows[0].id_proyecto,
                        id_encargado: rows[0].id_encargado,
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
app.post("/edit/(:id_proyecto)", function(req, res, next) {
    var result = validationResult(req).array();

    if (result) {
        //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.programanombre = '   a proyecto    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('programanombre').trim(); // returns 'a proyecto'
        ********************************************/
        var proyecto = {
            id_encargado: req.body.id_encargado,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `proyecto` SET ? WHERE id_proyecto = " +
                    req.params.id_proyecto,
                proyecto,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("proyecto/edit", {
                            title: "Editar proyecto",
                            id_proyecto: req.params.id_proyecto,
                            id_encargado: req.body.id_encargado,
                            nombre: req.body.nombre,
                            descripcion: req.body.descripcion
                        });
                    } else {
                        req.flash(
                            "success",
                            "proyecto actualizado exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/proyecto");
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
        res.render("proyecto/edit", {
            title: "Editar proyecto",
            id_proyecto: req.body.id_proyecto,            
            id_encargado: req.body.id_encargado,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
    }
});
____________________________________________________________________________________
// DELETE nombredetabla
app.delete("/(:id_proyecto)", function(req, res, next) {
    // var proyecto = { id: req.params.id_proyecto };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `proyecto` WHERE id_proyecto = " +
                req.params.id_proyecto,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/proyecto");
                } else {
                    req.flash(
                        "success",
                        "Proyecto eliminado exitosamente! id = " +
                            req.params.id_proyecto
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/proyecto");
                }
            }
        );
    });
});

module.exports = app;