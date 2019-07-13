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
            "SELECT * FROM `encargado` ORDER BY id_encargado ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("encargado/list", {
                        title: "Lista de Encargados",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("encargado/list", {
                        title: "Lista de Encargados",
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
    res.render("encargado/add", {
        title: "Añadir nuevo encargado",
        nombre: "",
        ci: "",
        fecha_nac: "",
        telefono: "",
        correo: ""
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
        var encargado = {
            nombre: req.body.nombre,
            ci: req.body.ci,
            fecha_nac: req.body.fecha_nac,
            telefono: req.body.telefono,
            correo: req.body.correo        
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `encargado` SET ?", encargado, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("encargado/add", {
                        title: "Añadir nuevo encargado",
                        nombre: encargado.nombre,
                        ci: encargado.ci,
                        fecha_nac: encargado.fecha_nac,
                        telefono: encargado.telefono,
                        correo: encargado.correo
                    });
                } else {
                    req.flash("success", "Encargado añadida exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/encargado");
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
        res.render("encargado/add", {
            title: "Añadir nuevo encargado",
            nombre: req.body.encargado,
            ci: req.body.ci,
            fecha_nac: req.body.fecha_nac,
            telefono: req.body.telefono,
            correo: req.body.correo
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_encargado)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `encargado` WHERE id_encargado = " +
                req.params.id_encargado,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "Encargado not found with id = " +
                            req.params.id_encargado
                    );
                    res.redirect("/encargado");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("encargado/edit", {
                        title: "Editar encargado",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_encargado: row[0].id_encargado,
                        nombre: rows[0].nombre,
                        ci: rows[0].ci,
                        fecha_nac: rows[0].fecha_nac,
                        telefono: rows[0].telefono,
                        correo: rows[0].correo
                    });
                }
            }
        );
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_encargado)", function(req, res, next) {
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
        var encargado = {
            nombre: req.body.nombre,
            ci: req.body.ci,
            fecha_nac: req.body.fecha_nac,
            telefono: req.body.telefono,
            correo: req.body.correo
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `encargado` SET ? WHERE id_encargado = " +
                req.params.id_encargado,
                encargado,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("encargado/edit", {
                            title: "Editar encargado",
                            id_encargado: req.params.id_encargado,
                            nombre: req.body.nombre,
                            ci: req.body.ci,
                            fecha_nac: req.body.fecha_nac,
                            telefono: req.body.telefono,
                            correo: req.body.correo
                        });
                    } else {
                        req.flash(
                            "success",
                            "Encargado actualizado exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/encargado");
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
        res.render("encargado/edit", {
            title: "Editar encargado",
            id_encargado: req.body.id_encargado,
            nombre: req.body.nombre,
            ci: req.body.ci,
            telefono: req.body.telefono,
            correo: req.body.correo
        });
    }
});

// DELETE nombredetabla
app.delete("/(:id_encargado)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `encargado` WHERE id_encargado = " +
                req.params.id_encargado,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/encargado");
                } else {
                    req.flash(
                        "success",
                        "Encargado eliminado exitosamente! id = " +
                            req.params.id_encargado
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/encargado");
                }
            }
        );
    });
});

module.exports = app;