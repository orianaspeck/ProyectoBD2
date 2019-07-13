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
            "SELECT * FROM `reportes_horas` ORDER BY fecha ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("reportes_horas/list", {
                        title: "Reporte",
                        data: ""
                    });
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    res.render("reportes_horas/list", {
                        title: "Reporte",
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
    res.render("reportes_horas/add", {
        title: "Añadir nuevo reporte",
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
        var reportes_horas = {
            id_prestador: req.body.id_prestador,
            hora_entrada: req.body.hora_entrada,
            hora_salida: req.body.hora_salida,
            horas_servicio: req.body.horas_servicio,
            id_proyecto: req.body.id_proyecto,
            observacion: req.body.observacion,
            id_institucion: req.body.id_institucion
        };
        req.getConnection(function(error, conn) {
            conn.query("INSERT INTO ` reportes_horas` SET ?", reportes_horas, function(
                err,
                result
            ) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);

                    // render to views/nombredetabla/add.ejs
                    res.render("reportes_horas/add", {
                        title: "Añadir nuevo reporte",
                        id_prestador:reportes_horas.id_prestador,
                        fecha:reportes_horas.fecha,
                        hora_entrada:reportes_horas.hora_entrada,
                        hora_salida:reportes_horas.hora_salida,
                        horas_servicio:reportes_horas.horas_servicio,
                        id_proyecto:reportes_horas.id_proyecto,
                        observacion:reportes_horas.observacion,
                        id_institucion:reportes_horas.id_institucion
                    });
                } else {
                    req.flash("success", "Reporte añadido exitosamente!");

                    // render to views/nombredetabla/add.ejs
                    res.redirect("/reportes_horas");
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
        res.render("reportes_horas/add", {
            title: "Añadir nuevo reporte",
            id_prestador: req.body.id_prestador,
            hora_entrada: req.body.hora_entrada,
            hora_salida: req.body.hora_salida,
            horas_servicio: req.body.horas_servicio,
            id_proyecto: req.body.id_proyecto,
            observacion: req.body.observacion,
            id_institucion: req.body.id_institucion
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:fecha)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `reportes_horas` WHERE fecha = " +
                req.params.fecha,
            function(err, rows, fields) {
                if (err) throw err;

                // if programa not found
                if (rows.length <= 0) {
                    req.flash(
                        "error",
                        "reportes_horas not found with fecha = " +
                            req.params.fecha
                    );
                    res.redirect("/reportes_horas");
                } else {
                    // if nombredetabla found
                    // render to views/nombredetable/edit.ejs template file
                    res.render("reportes_horas/edit", {
                        title: "Editar reporte",
                        // data: rows[0],
                        //Aqui tambien agregar o quitar los atributos correspondientes
                        id_prestador: rows[0].id_prestador,
                        hora_entrada: rows[0].hora_entrada,
                        hora_salida: rows[0].hora_salida,
                        horas_servicio: rows[0].horas_servicio,
                        id_proyecto: rows[0].id_proyecto,
                        observacion: rows[0].observacion,
                        id_institucion: rows[0].id_institucion
                    });
                }
            }
        );
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:fecha)", function(req, res, next) {
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
        var reportes_horas = {
            id_prestador: req.body.id_prestador,
            hora_entrada: req.body.hora_entrada,
            hora_salida: req.body.hora_salida,
            horas_servicio: req.body.horas_servicio,
            id_proyecto: req.body.id_proyecto,
            observacion: req.body.observacion,
            id_institucion: req.body.id_institucion
        };

        req.getConnection(function(error, conn) {
            conn.query(
                "UPDATE `reportes_horas` SET ? WHERE fecha = " +
                    req.params.fecha,
                reportes_horas,
                function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);

                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                        res.render("reportes_horas/edit", {
                            title: "Editar reporte",
                            id_prestador: req.params.id_prestador,
                            fecha: req.body.fecha,
                            hora_entrada: req.params.hora_entrada,
                            hora_salida: req.params.hora_salida,
                            horas_servicio: req.params.horas_servicio,
                            id_proyecto: req.params.id_proyecto,
                            observacion: req.params.observacion,
                            id_institucion: req.params.id_institucion
                        });
                    } else {
                        req.flash(
                            "success",
                            "Rporte actualizado exitosamente!"
                        );

                        // render to views/list.ejs
                        res.redirect("/reportes_horas");
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
        res.render("reportes_horas/edit", {
            title: "Editar reporte",
            id_prestador: req.body.id_prestador,
            fecha: req.body.fecha,
            hora_entrada: req.body.hora_entrada,
            hora_salida: req.body.hora_salida,
            horas_servicio: req.body.horas_servicio,
            id_proyecto: req.body.id_proyecto,
            observacion: req.body.observacion,
            id_institucion: req.body.id_institucion
        });
    }
});

// DELETE nombredetabla
app.delete("/(:reportes_horas)", function(req, res, next) {
    // var programa = { id: req.params.id_programa };

    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `reportes_horas` WHERE fecha = " +
                req.params.fecha,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/fecha");
                } else {
                    req.flash(
                        "success",
                        "Reporte eliminado exitosamente! fecha = " +
                            req.params.fecha
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/reportes_horas");
                }
            }
        );
    });
});

module.exports = app;