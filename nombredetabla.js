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
            "SELECT * FROM `institucion` ORDER BY id_institucion ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("institucion/list", {
                        title: "Lista de Instituciones",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("institucion/list", {
                        title: "Lista de Instituciones",
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
    res.render("institucion/add", {
        title: "Añadir nueva institucion",
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
        var institucion = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `institucion` SET ?", institucion, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("institucion/add", {
                        title: "Añadir nueva institucion",
                        nombre: institucion.nombre,
                        descripcion: institucion.descripcion,
                        telefono: institucion.telefono,
                        correo: institucion.correo,
                        direccion: institucion.direccion
                    });
                } else {
                    req.flash("success", "Institucion añadido exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/institucion");
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
        res.render("institucion/add", {
            title: "Añadir nueva institucion",
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_institucion)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `institucion` WHERE id_institucion = " +
                req.params.id_institucion,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "institucion not found with id = " +
                            req.params.id_institucion
                    );
                    res.redirect("/institucion");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("institucion/edit", {
                        title: "Editar institucion",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id: rows[0].id_institucion,
                        nombre: rows[0].nombre,
                        descripcion: rows[0].descripcion,
                        telefono: rows[0].telefono,
                        correo: rows[0].correo,
                        direccion: rows[0].direccion
                    });
                }
            }
        );
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_institucion)", function(req, res, next) {
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
        var institucion = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `institucion` SET ? WHERE id_institucion = " +
                    req.params.id_institucion,
                institucion,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("institucion/edit", {
                            title: "Editar Institucion",
                            id: req.params.id_institucion,
                            nombre: req.body.nombre,
                            descripcion: req.body.descripcion,
                            telefono: req.body.telefono,
                            correo: req.body.correo,
                            direccion: req.body.direccion
                        });
                    } else {
                        req.flash(
                            "success",
                            "Institucion Actualizada Exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/institucion");
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
        res.render("institucion/edit", {
            title: "Editar Institucion",
            id: req.body.id_institucion,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion
        });
    }
});

// DELETE nombredetabla
app.delete("/(:id_institucion)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `institucion` WHERE id_institucion = " +
                req.params.id_institucion,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/institucion");
                } else {
                    req.flash(
                        "success",
                        "Institucion Eliminado Exitosamente! id = " +
                            req.params.id_institucion
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/institucion");
                }
            }
        );
    });
});

module.exports = app;
