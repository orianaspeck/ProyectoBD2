var express = require("express");
var app = express();
const { check, validationResult, sanitizeBody } = require("express-validator");
// SHOW LIST OF nombredetabla
//Cambien donde sea que vean institucion por el nombre de la tabla de la cual sera la ruta, respetando donde dice id_institucion
//Solo cambien lo que va despues del guion, id_nombredetabla
//Tambien cambien las palabras en plural por la correspondiente, EJ: Lista de Instituciones -> Lista de Carreras

app.get("/(:id_prestador)", function(req, res, next) {
    console.log("XDDDDDD");
    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `reportes_horas` ORDER BY fecha ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                } else {
                    // render to views/nombredetabla/list.ejs template file
                    conn.query(
                        "SELECT * FROM `proyecto` ORDER BY id_proyecto",
                        function(err, rows2, fields) {
                            //if(err) throw err
                            if (err) {
                                req.flash("error", err);
                            } else {
                                for (var i in rows2) {
                                    console.log(rows2[i]);
                                }
                                // render to views/nombredetabla/list.ejs template file
                                var id_prestador = req.params.id_prestador;
                                conn.query(
                                    "SELECT * FROM `prestador` WHERE id_prestador = " +
                                        id_prestador,
                                    function(err, rows3, fields) {
                                        //if(err) throw err
                                        if (err) {
                                            req.flash("error", err);
                                        } else {
                                            for (var i in rows3) {
                                                console.log(rows3[i]);
                                            }
                                            // render to views/nombredetabla/list.ejs template file
                                            res.render("horariodisp/list", {
                                                title: "Reporte",
                                                id_prestador:
                                                    req.params.id_prestador,
                                                data: rows,
                                                data2: rows2,
                                                data3: rows3
                                            });
                                            // console.log(rows2);
                                        }
                                    }
                                );
                                // console.log(rows2);
                            }
                        }
                    );
                }
            }
        );
    });
});
app.post("/(:id_prestador)", function(req, res, next) {
    var result = validationResult(req).array();
    console.log("un beta");
    console.log(req.body);
    console.log(req.params);
    var nombre = JSON.stringify(req.body.proyecto);
    
    if (result) {
        req.getConnection(function(error, conn) {
            conn.query(
                "SELECT * FROM `proyecto` WHERE nombre = " + nombre,
                function(err, rows, fields) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);
                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                    } else {
                        conn.query(
                            "SELECT * FROM `prestador` WHERE id_prestador = " +
                                req.params.id_prestador,
                            function(err, rows2, fields) {
                                //if(err) throw err
                                if (err) {
                                    req.flash("error", err);
                                } else {
                                    var timeStart = new Date(
                                        "01/01/2007 " + req.body.horaentrada
                                    ).getHours();
                                    var timeEnd = new Date(
                                        "01/01/2007 " + req.body.horasalida
                                    ).getHours();
                                    var hourDiff = timeEnd - timeStart;
                                    var reportes_horas = {
                                        id_prestador: req.params.id_prestador,
                                        hora_entrada: req.body.horaentrada,
                                        hora_salida: req.body.horasalida,
                                        horas_servicio: hourDiff,
                                        id_proyecto: rows[0].id_proyecto,
                                        observacion: req.body.observacion,
                                        id_reporte: req.params.id_reporte,
                                        aprobado: 0
                                    };
                                    console.log(reportes_horas);
                                    conn.query(
                                        "UPDATE `reportes_horas` SET ? WHERE id_reporte = " +
                                            req.params.id_reporte,
                                        reportes_horas,
                                        function(err, result) {
                                            //if(err) throw err
                                            if (err) {
                                                console.log(
                                                    "RIPERINO EL RETONR2O"
                                                );
                                                req.flash("error", err);
                                                // render to views/nombredetabla/edit.ejs
                                                //AQUI SI SE COLOCA EL ID
                                            } else {
                                                req.flash(
                                                    "success",
                                                    "Reporte actualizado exitosamente!"
                                                );
                                                // render to views/list.ejs
                                                res.redirect(
                                                    "/horariodisp/" +
                                                        req.params.id_prestador
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
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
            id_reporte: req.body.id_reporte
        });
    }
});

// SHOW ADD nombredetabla FORM
app.get("/add/(:id_prestador)", function(req, res, next) {
    // render to views/nombredetabla/add.ejs

    req.getConnection(function(error, conn) {
        conn.query(
            "SELECT * FROM `proyecto` ORDER BY id_proyecto ASC",
            function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    res.render("reportes_horas/add", {
                        title: "Añadir nuevo reporte",
                        nombre: "",
                        descripcion: "",
                        data: "",
                        data2: ""
                    });
                } else {
                    conn.query(
                        "SELECT * FROM `proy_pres` ORDER BY id_proy_pres ASC",
                        function(err, rows2, fields) {
                            //if(err) throw err
                            if (err) {
                                req.flash("error", err);
                                res.render("reportes_horas/add", {
                                    title: "Añadir nuevo reporte",
                                    nombre: "",
                                    descripcion: "",
                                    data: "",
                                    data2: ""
                                });
                            } else {
                                // render to views/nombredetabla/list.ejs template file
                                //PASAR CONSTANTE ID PRESTADOR LOGEADO
                                res.render("reportes_horas/add", {
                                    title: "Añadir nuevo reporte",
                                    nombre: "",
                                    descripcion: "",
                                    data: rows,
                                    data2: rows2,
                                    id_prestador: req.params.id_prestador
                                });
                                console.log("PASó");
                            }
                        }
                    );
                    // render to views/nombredetabla/list.ejs template file
                    console.log("PASó");
                }
            }
        );
    });
});
// ADD NEW nombredetabla POST ACTION
app.post("/add/(:id_prestador)", function(req, res, next) {
    console.log(req.body);
    var nombre = JSON.stringify(req.body.proyecto);
    var id_prestador = JSON.stringify(req.body.id_prestador);
    var result = validationResult(req).array();
    if (result) {
        //No errors were found.  Passed Validation!
        //Añadir los atributos necesarios y quitar los que no, colocarlos en el mismo orden en el que estan en la BD
        //NO AGREGAR EL ID EN ESTA PARTE
        //Una vez cambien esto con los atributos correctos pueden copiarlo a la parte de edit post

        req.getConnection(function(error, conn) {
            conn.query(
                "SELECT * FROM `proyecto` WHERE nombre = " + nombre,
                function(err, rows, fields) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);
                        console.log("RIPERINO");
                        res.redirect("/horariodisp");
                    } else {
                        // render to views/nombredetabla/list.ejs template file
                        var timeStart = new Date(
                            "01/01/2007 " + req.body.horaentrada
                        ).getHours();
                        var timeEnd = new Date(
                            "01/01/2007 " + req.body.horasalida
                        ).getHours();
                        var hourDiff = timeEnd - timeStart;
                        var reportes_horas = {
                            //CONSTANTE PRESTADOR LOGEADO
                            id_prestador: req.params.id_prestador,
                            fecha: req.body.fecha,
                            hora_entrada: req.body.horaentrada,
                            hora_salida: req.body.horasalida,
                            horas_servicio: hourDiff,
                            id_proyecto: rows[0].id_proyecto,
                            observacion: req.body.observacion,
                            aprobado: 0
                        };
                        console.log(reportes_horas);
                        conn.query(
                            "INSERT INTO `reportes_horas` SET ?",
                            reportes_horas,
                            function(err, result) {
                                //if(err) throw err
                                if (err) {
                                    req.flash("error", err);

                                    // render to views/nombredetabla/add.ejs
                                    res.render("reportes_horas/add", {
                                        title: "Añadir nuevo Reporte",
                                        id_prestador:
                                            reportes_horas.id_prestador,
                                        fecha: reportes_horas.fecha,
                                        hora_entrada:
                                            reportes_horas.hora_entrada,
                                        hora_salida: reportes_horas.hora_salida,
                                        horas_servicio:
                                            reportes_horas.horas_servicio,
                                        id_proyecto: reportes_horas.id_proyecto,
                                        observacion: reportes_horas.observacion,
                                        aprobado: 0
                                    });
                                } else {
                                    req.flash(
                                        "success",
                                        "Reporte añadido exitosamente!"
                                    );

                                    // render to views/nombredetabla/add.ejs
                                    res.redirect(
                                        "/horariodisp/" +
                                            reportes_horas.id_prestador
                                    );
                                }
                            }
                        );
                    }
                }
            );
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
            horas_servicio: req.body.horasalida - req.body.horaentrada,
            id_proyecto: req.body.id_proyecto,
            observacion: req.body.observacion,
            aprobado: 0
        });
    }
});

// SHOW EDIT nombredetabla FORM
app.get("/edit/(:id_reporte)/(:id_prestador)", function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query("SELECT * FROM `proyecto` ORDER BY id_proyecto ", function(
            err,
            rows,
            fields
        ) {
            if (err) throw err;

            // if programa not found
            if (rows.length <= 0) {
                req.flash(
                    "error",
                    "reportes_horas not found with fecha = " +
                        req.params.id_reporte
                );
                res.redirect("/horariodisp");
            } else {
                // if nombredetabla found
                // render to views/nombredetable/edit.ejs template file
                conn.query(
                    "SELECT * FROM `proy_pres` ORDER BY id_proy_pres ASC",
                    function(err, rows2, fields) {
                        //if(err) throw err
                        if (err) {
                            req.flash("error", err);
                            res.render("reportes_horas/add", {
                                title: "Añadir nuevo reporte",
                                nombre: "",
                                descripcion: "",
                                data: "",
                                data2: "",
                                data3: ""
                            });
                        } else {
                            // render to views/nombredetabla/list.ejs template file
                            //PASAR CONSTANTE ID PRESTADOR LOGEADO
                            conn.query(
                                "SELECT * FROM `reportes_horas` WHERE id_reporte = " +
                                    req.params.id_reporte,
                                function(err, rows3, fields) {
                                    //if(err) throw err
                                    if (err) {
                                        req.flash("error", err);
                                        res.render("reportes_horas/add", {
                                            title: "Añadir nuevo reporte",
                                            nombre: "",
                                            descripcion: "",
                                            data: "",
                                            data2: "",
                                            data3: ""
                                        });
                                    } else {
                                        // render to views/nombredetabla/list.ejs template file
                                        //PASAR CONSTANTE ID PRESTADOR LOGEADO
                                        var id_prestador =
                                            req.params.id_prestador;
                                        console.log(rows3);
                                        res.render("reportes_horas/edit", {
                                            title: "Editar reporte",
                                            id_prestador: id_prestador,
                                            hora_entrada: rows3[0].hora_entrada,
                                            hora_salida: rows3[0].hora_salida,
                                            horas_servicio:
                                                rows3[0].horas_servicio,
                                            id_proyecto: rows3[0].id_proyecto,
                                            observacion: rows3[0].observacion,
                                            id_reporte: rows3[0].id_reporte,
                                            aprobado: rows3[0].aprobado,
                                            data: rows,
                                            data2: rows2,
                                            data3: rows3
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    });
});

// EDIT nombredetabla POST ACTION
app.post("/edit/(:id_reporte)/(:id_prestador)", function(req, res, next) {
    var result = validationResult(req).array();
    var nombre = JSON.stringify(req.body.proyecto);
    console.log(req.body);
    if (result) {
        req.getConnection(function(error, conn) {
            conn.query(
                "SELECT * FROM `proyecto` WHERE nombre = " + nombre,
                function(err, rows, fields) {
                    //if(err) throw err
                    if (err) {
                        req.flash("error", err);
                        // render to views/nombredetabla/edit.ejs
                        //AQUI SI SE COLOCA EL ID
                    } else {
                        conn.query(
                            "SELECT * FROM `prestador` WHERE id_prestador = " +
                                req.params.id_prestador,
                            function(err, rows2, fields) {
                                //if(err) throw err
                                if (err) {
                                    req.flash("error", err);
                                } else {
                                    var timeStart = new Date(
                                        "01/01/2007 " + req.body.horaentrada
                                    ).getHours();
                                    var timeEnd = new Date(
                                        "01/01/2007 " + req.body.horasalida
                                    ).getHours();
                                    var hourDiff = timeEnd - timeStart;
                                    var reportes_horas = {
                                        id_prestador: req.params.id_prestador,
                                        hora_entrada: req.body.horaentrada,
                                        hora_salida: req.body.horasalida,
                                        horas_servicio: hourDiff,
                                        id_proyecto: rows[0].id_proyecto,
                                        observacion: req.body.observacion,
                                        id_reporte: req.params.id_reporte,
                                        aprobado: 0
                                    };
                                    console.log(reportes_horas);
                                    conn.query(
                                        "UPDATE `reportes_horas` SET ? WHERE id_reporte = " +
                                            req.params.id_reporte,
                                        reportes_horas,
                                        function(err, result) {
                                            //if(err) throw err
                                            if (err) {
                                                console.log(
                                                    "RIPERINO EL RETONR2O"
                                                );
                                                req.flash("error", err);
                                                // render to views/nombredetabla/edit.ejs
                                                //AQUI SI SE COLOCA EL ID
                                            } else {
                                                req.flash(
                                                    "success",
                                                    "Reporte actualizado exitosamente!"
                                                );
                                                // render to views/list.ejs
                                                res.redirect(
                                                    "/horariodisp/" +
                                                        req.params.id_prestador
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
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
            id_reporte: req.body.id_reporte
        });
    }
});

// DELETE nombredetabla
app.delete("/(:id_prestador)/(:id_reporte)", function(req, res, next) {
    // var proyecto = { id: req.params.id_proyecto };
    var id_prestador = JSON.stringify(req.params.id_prestador);
    req.getConnection(function(error, conn) {
        conn.query(
            "DELETE FROM `reportes_horas` WHERE id_reporte = " +
                req.params.id_reporte,
            function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash("error", err);
                    // redirect to nombredetabla list page
                    res.redirect("/horariodisp");
                } else {
                    req.flash(
                        "success",
                        "REPORTE eliminado exitosamente! id = " +
                            req.params.id_reporte
                    );
                    // redirect to nombredetabla list page
                    res.redirect("/horariodisp/" + id_prestador);
                }
            }
        );
    });
});

module.exports = app;
