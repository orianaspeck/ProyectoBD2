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
            "SELECT * FROM `prestador` ORDER BY id_prestador ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("prestador/list", {
                        title: "Lista de Presatadores",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("prestador/list", {
                        title: "Lista de Prestadores",
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
    res.render("prestadores/add", {
        title: "Añadir nuevo prestador",
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
        var prestador = {
            ci: req.body.ci,
            nombre: req.body.nombre,
            fecha_nac: req.body.fecha_nac,
            horas_cumplidas: req.body.horas_cumplidas,
            id_carreras: req.body.id_carreras,
            preferencia: req.body.preferencia,
            correo: req.body.correo
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO `prestador` SET ?",prestador, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("prestador/add", {
                        title: "Añadir nuevo prestador",
                        ci: prestador.ci,
                        nombre: prestador.nombre,
                        fecha_nac:prestador.fecha_nac,
                        horas_cumplidas:prestador.horas_cumplidas,
                        id_carreras:prestador.id_carreras,
                        preferencia:prestador.preferencia,
                        correo:prestador.correo
                    });
                } else {
                    req.flash("success", "Prestador añadido exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/prestador");
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
        res.render("prestador/add", {
            title: "Añadir nuevo prestador",
            ci: req.body.ci,
            nombre: req.body.nombre,
            fecha_nac: req.body.fecha_nac,
            horas_cumplidas: req.body.horas_cumplidas,
            id_carreras: req.body.id_carreras,
            preferencia: req.body.preferencia,
            correo: req.body.correo
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_prestador)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `prestador` WHERE id_prestador = " +
                req.params.id_prestador,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "prestador not found with id = " +
                            req.params.id_prestador
                    );
                    res.redirect("/prestador");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("prestador/edit", {
                        title: "Editar prestador",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_prestador: rows[0].id_prestador,
                        ci: rows[0].ci,
                        nombre: rows[0].nombre,
                        fecha_nac: rows[0].fecha_nac,
                        horas_cumplidas: rows[0].horas_cumplidas,
                        id_carreras: rows[0].id_carreras,
                        preferencia: rows[0].preferencia,
                        correo: rows[0].correo
                    });
                }
            }
        );
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_prestador)", function(req, res, next) {
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
        var prestador = {
            ci: req.body.ci,
            nombre: req.body.nombre,
            fecha_nac: req.body.fecha_nac,
            horas_cumplidas: req.body.horas_cumplidas,
            id_carreras: req.body.id_carreras,
            preferencia: req.body.preferencia,
            correo: req.body.correo
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `prestador` SET ? WHERE id_prestador = " +
                    req.params.id_prestador,
                prestador,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("prestador/edit", {
                            title: "Editar prestador",
                            id_prestador: req.params.id_prestador,
                            ci: req.body.ci,
                            nombre: req.body.nombre,
                            fecha_nac: req.body.fecha_nac,
                            horas_cumplidas: req.body.horas_cumplidas,
                            id_carreras: req.body.id_carreras,
                            preferencia: req.body.preferencia,
                            correo: req.body.correo
                        });
                    } else {
                        req.flash(
                            "success",
                            "Prestador actualizado exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/prestador");
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
        res.render("prestador/edit", {
            title: "Editar prestador",
            id_prestador: req.body.id_prestador,
            ci: req.body.ci,
            nombre: req.body.nombre,
            fecha_nac: req.body.fecha_nac,
            horas_cumplidas: req.body.horas_cumplidas,
            id_carreras: req.body.id_carreras,
            preferencia: req.body.preferencia,
            correo: req.body.correo
        });
    }
});

// DELETE nombredetabla
app.delete("/(:id_prestador)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `prestador` WHERE id_presatador = " +
                req.params.id_prestador,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/prestador");
                } else {
                    req.flash(
                        "success",
                        "Prestador eliminado exitosamente! id = " +
                            req.params.id_prestador
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/prestador");
                }
            }
        );
    });
});

module.exports = app;