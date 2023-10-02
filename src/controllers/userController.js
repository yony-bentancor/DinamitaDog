const User = require("../models/User");
const Producto = require("../models/Producto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkJWT = require("express-jwt");
const { CLAVE_SECRETA } = require("../config");
const Posteo = require("../models/Posteo");
const Slide = require("../models/Slide");
const Pedido = require("../models/Pedido");
const _ = require("lodash");
const moment = require("moment");
const saltRounds = 10;

module.exports = {
  btnDelivey: async (req, res) => {
    const username = req.params.body;
    console.log(username);
    const user = req.body;
    const newUser = await User.findOne({ username: user.username });
    if (userRes.username || username === "delivery") {
      try {
        const pedidos = await Pedido.find({
          Estado: { $in: "Realizado" },
        }).sort({
          Numero_pedido: 1,
        });
        const opciones = {
          month: "long",
          day: "numeric",
        };
        const pedidosFormateados = pedidos.map((pedido) => {
          const fechaFormateada = pedido.createdAt.toLocaleString(
            "es-ES",
            opciones
          );
          return { ...pedido.toObject(), fechaFormateada };
        });

        let contador = 0;
        for (let i = 0; i < pedidos.length; i++) {
          contador++;
        }

        const pedidosRealizados = await Pedido.find({
          Estado: { $nin: ["Pendiente", "Entregado", "Cobrado"] },
        }).sort({ Numero_pedido: 1 });
        const sumaProductos = {}; // Objeto para almacenar la suma de cada producto

        for (let i = 0; i < pedidosRealizados.length; i++) {
          const productos = pedidosRealizados[i].productos;

          for (const [key, value] of Object.entries(productos)) {
            if (sumaProductos.hasOwnProperty(key)) {
              sumaProductos[key] += value;
            } else {
              sumaProductos[key] = value;
            }
          }
        }
        const users = await User.find().sort({
          username: 1,
        });

        const productos = await Producto.find().sort({ Numero_pedido: 1 });

        res.render("delivery", {
          userRes,
          pedidos,
          pedidos: pedidosFormateados,
          contador,
          pedidosRealizados,
          sumaProductos,
          productos,
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } else {
      try {
        const users = await User.find();
        res.render("carritoCompra", { userRes });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  },

  index: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  record: async (req, res) => {
    try {
      res.render("record");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const userInfo = req.body;
      password = userInfo.username;
      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({
        username: userInfo.username,
        telefono: userInfo.telefono,
        direccion: userInfo.direccion,
        email: userInfo.email,
        hash: hash,
      });

      const userRes = {
        username: newUser.username,
        telefono: newUser.telefono,
        direccion: newUser.direccion,
        email: newUser.email,
        id: newUser.id,
      };
      const token = jwt.sign(userRes, CLAVE_SECRETA);
      const productos = await Producto.find();
      const users = await User.find();
      res.render("clientes", { users });

      /*res.status(201).json({ useer: userRes, token: token });*/
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /*  loginSession: async (req, res) => {
    const user = req.body;
    const newUser = await User.findOne({ username: user.username });
    if (!newUser) {
      return res.status(400).json({ error: "El usuario no existe" });
    }
    const match = await bcrypt.compare(user.password, newUser.hash);
    if (!match) {
      return res.status(401).json({ error: "La constraseña no coincide!" });
    }
    const userRes = {
      username: newUser.username,
      telefono: newUser.telefono,
      direccion: newUser.direccion,
      email: newUser.email,
      id: newUser.id,
    };

    if (userRes.username == "Natalia") {
      const token = jwt.sign(userRes, CLAVE_SECRETA);
      const pedidos = await Pedido.find();
      for (let i = 0; i < pedidos.length; i++) {
        if (pedidos[i].Estado == "Pendiente") {
          console.log("hola");
        } else {
          console.log("chau");
        }
      }

      const detoxTotal = await Pedido.aggregate([
        {
          $group: {
            _id: null,
            totalSaleAmount: { $sum: "$Detox" },
          },
        },
      ]);

      sumarDetox = 0;
      const pedidosDetox = await Pedido.find();

      for (let i = 0; i < pedidosDetox.length; i++) {
        sumarDetox += pedidosDetox[i].Detox;
      }

      sumarLicuados = 0;
      const pedidosLicuado = await Pedido.find();
      for (let i = 0; i < pedidosLicuado.length; i++) {
        sumarLicuados += pedidosLicuado[i].Licuados;
      }

      sumarLimonadas = 0;
      const pedidosLimonada = await Pedido.find();
      for (let i = 0; i < pedidosLimonada.length; i++) {
        sumarLimonadas += pedidosLimonada[i].Limonada;
      }

      sumarKefir = 0;
      const pedidosKefir = await Pedido.find();
      for (let i = 0; i < pedidosKefir.length; i++) {
        sumarKefir += pedidosKefir[i].Kefir;
      }

      sumarSmoothie = 0;
      const pedidosSmoothie = await Pedido.find();
      for (let i = 0; i < pedidosSmoothie.length; i++) {
        sumarSmoothie += pedidosSmoothie[i].Smoothie;
      }

      res.render("indexAdministrador", {
        pedidos,
        detoxTotal,
        sumarDetox,
        sumarLicuados,
        sumarLimonadas,
        sumarSmoothie,
        sumarKefir,
      });
    } else {
      try {
        const users = await User.find();

        res.render("carrito", { userRes });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }, */

  loginSessionAdmin: async (req, res) => {
    const user = req.body;
    const newUser = await User.findOne({ username: user.username });
    if (!newUser) {
      return res.status(400).json({ error: "El usuario no existe" });
    }
    const match = await bcrypt.compare(user.password, newUser.hash);
    if (!match) {
      return res.status(401).json({ error: "La constraseña no coincide!" });
    }
    const userRes = {
      username: newUser.username,
      telefono: newUser.telefono,
      direccion: newUser.direccion,
      email: newUser.email,
      id: newUser.id,
    };
    if (userRes.username == "Natalia") {
      const token = jwt.sign(userRes, CLAVE_SECRETA);
      const users = await User.find().sort({ username: 1 });
      res.render("clientes", { users });
    } else if (userRes.username || username === "delivery") {
      try {
        const pedidos = await Pedido.find({
          Estado: { $in: "Realizado" },
        }).sort({
          Numero_pedido: 1,
        });
        const opciones = {
          month: "long",
          day: "numeric",
        };
        const pedidosFormateados = pedidos.map((pedido) => {
          const fechaFormateada = pedido.createdAt.toLocaleString(
            "es-ES",
            opciones
          );
          return { ...pedido.toObject(), fechaFormateada };
        });

        let contador = 0;
        for (let i = 0; i < pedidos.length; i++) {
          contador++;
        }

        const pedidosRealizados = await Pedido.find({
          Estado: { $nin: ["Pendiente", "Entregado", "Cobrado"] },
        }).sort({ Numero_pedido: 1 });
        const sumaProductos = {}; // Objeto para almacenar la suma de cada producto

        for (let i = 0; i < pedidosRealizados.length; i++) {
          const productos = pedidosRealizados[i].productos;

          for (const [key, value] of Object.entries(productos)) {
            if (sumaProductos.hasOwnProperty(key)) {
              sumaProductos[key] += value;
            } else {
              sumaProductos[key] = value;
            }
          }
        }
        const users = await User.find().sort({
          username: 1,
        });

        const productos = await Producto.find().sort({ Numero_pedido: 1 });

        res.render("delivery", {
          userRes,
          pedidos,
          pedidos: pedidosFormateados,
          contador,
          pedidosRealizados,
          sumaProductos,
          productos,
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } else {
      try {
        const users = await User.find();
        res.render("carritoCompra", { userRes });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  },

  store: async (req, res) => {
    const [user, created] = await User.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: await User.hashPassword(req.body.password),
      },
    });

    if (created) {
      req.login(user, function (err) {
        if (err) return next(err);
        res.redirect("/private");
      });
    } else {
      req.flash("error", "Lo sentimos, el usuario ya existe en el sistema.");
      res.redirect("back");
    }
  },

  show: (req, res) => {},

  edit: (req, res) => {},

  updateUser: async (req, res) => {
    try {
      const username = req.body.username;

      const user = await User.findOne({ username: username });
      console.log(user.username);
      const userid = user._id;
      const usernameSalida = user.username;
      const telefonoSalida = user.telefono;
      const direccionSalida = user.direccion;
      const emailSalida = user.email;

      if (!user) {
        return res.status(404).json({
          error: "El usuario que se quiere editar no existe.",
        });
      }

      const users = await User.find().sort({ username: 1 });
      res.render("updateuser", {
        usernameSalida,
        telefonoSalida,
        direccionSalida,
        emailSalida,
        userid,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  actualizaUsuario: async (req, res) => {
    const {
      userid,
      usernameSalida,
      telefonoSalida,
      direccionSalida,
      emailSalida,
    } = req.body; // Desestructura los datos recibidos del formulario

    try {
      const user = await User.findById(userid); // Busca el usuario por su _id en la base de datos

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualiza los campos solo si hay cambios
      if (user.username !== usernameSalida) {
        user.username = usernameSalida;
      }
      if (user.telefono !== telefonoSalida) {
        user.telefono = telefonoSalida;
      }
      if (user.direccion !== direccionSalida) {
        user.direccion = direccionSalida;
      }
      if (user.email !== emailSalida) {
        user.email = emailSalida;
      }

      await user.save(); // Guarda los cambios en la base de datos
      const users = await User.find().sort({ username: 1 });
      res.render("clientes", { users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  },

  up: async (req, res) => {
    try {
      const id = req.params.id;
      const users = await User.findOne({ id: id });

      if (!users) {
        return res.status(404).json({
          error: "El usuario que se quiere editar no existe.",
        });
      }

      res.render("up", { users });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  update: async (req, res) => {},

  deleteUser: async (req, res) => {
    try {
      const username = req.params.username;
      console.log(username);

      const deletuser = await Pedido.findOne({ username: username });

      if (!deletuser) {
        const newUser = await User.findOneAndDelete({ username });
      } else {
        console.log(`El usuario  existe en la base de datos`);
      }

      res.redirect("/session/clientes");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  clientesAdmin: async (req, res) => {
    try {
      const users = await User.find().sort({ username: 1 });
      res.render("clientes", { users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  realizadosBusquedaCliente: async (req, res) => {
    const infobusqueda = req.body;

    try {
      const usuariosBusqueda = await User.findOne({
        username: { $eq: infobusqueda.browser },
      });

      const users = await User.find().sort({ username: 1 });
      let contador = 0;
      for (let i = 0; i < usuariosBusqueda.length; i++) {
        contador++;
      }

      res.render("clientes", {
        usuariosBusqueda,
        contador,
        users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  pendientesAdmin: async (req, res) => {
    try {
      const pedidos = await Pedido.find({
        Estado: { $nin: ["Realizado", "Entregado", "Cobrado"] },
      }).sort({
        createdAt: 1,
      });
      let contador = 0;
      for (let i = 0; i < pedidos.length; i++) {
        contador++;
      }

      const opciones = {
        month: "long",
        day: "numeric",
      };

      const pedidosFormateados = pedidos.map((pedido) => {
        const fechaFormateada = pedido.createdAt.toLocaleString(
          "es-ES",
          opciones
        );
        return { ...pedido.toObject(), fechaFormateada };
      });

      const pedidosPendientes = await Pedido.find({
        Estado: { $nin: ["Realizado", "Entregado", "Cobrado"] },
      });

      // Objeto para almacenar los productos y sus cantidades
      const productosCantidad = {};

      for (let i = 0; i < pedidosPendientes.length; i++) {
        const productos = pedidosPendientes[i].productos;

        for (const [key, value] of Object.entries(productos)) {
          const nombreProducto = value.nombre; // Suponemos que el nombre del producto está en la propiedad "nombre"
          const cantidad = value.cantidad;

          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = cantidad;
          } else {
            productosCantidad[nombreProducto] += cantidad;
          }
        }
      }

      // Crear un array para almacenar los mensajes a mostrar en la plantilla
      const mensajesNombre = [];
      const mensajes = [];

      // Agregar mensajes al array
      for (const nombreProducto in productosCantidad) {
        const cantidadProducto = productosCantidad[nombreProducto];
        mensajes.push({ nombre: nombreProducto, cantidad: cantidadProducto });
      }

      /*   const pedidosPendientes = await Pedido.find({
        Estado: { $nin: ["Realizado", "Entregado", "Cobrado"] },
      }); */

      // Objeto para almacenar los productos y sus cantidades
      /*    const productosCantidad = {}; */

      for (let i = 0; i < pedidosPendientes.length; i++) {
        const productos = pedidosPendientes[i].productos;

        for (const producto of productos) {
          const nombreProducto = producto.nombre;
          const cantidad = producto.cantidad;
          const precioUnitario = producto.precioVenta;

          // Calcula el precio total por producto considerando la cantidad
          const precioTotalProducto = cantidad * precioUnitario;

          // Agrega el precio total al objeto, si no existe, inicializa en 0
          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = 0;
          }

          productosCantidad[nombreProducto] += precioTotalProducto;
        }
      }

      // Crear un objeto para almacenar el precio total por pedido
      const precioTotalPorPedido = {};

      // Calcular el precio total por pedido y agregarlo al objeto
      for (const pedido of pedidosPendientes) {
        const productosPedido = pedido.productos;

        let precioTotalPedido = 0;

        for (const producto of productosPedido) {
          const cantidad = producto.cantidad;
          const precioUnitario = producto.precioVenta;

          // Calcula el precio total por producto considerando la cantidad
          const precioTotalProducto = cantidad * precioUnitario;

          precioTotalPedido += precioTotalProducto;
        }

        precioTotalPorPedido[pedido.Numero_pedido] = precioTotalPedido;
      }
      console.log(precioTotalPorPedido);

      // Recorre todos los pedidos
      for (const pedido of pedidos) {
        // Obtén el precio total del pedido desde precioTotalPorPedido
        const precioTotalPedido = precioTotalPorPedido[pedido.Numero_pedido];

        // Calcula el descuento en términos de porcentaje desde pedido.Descuento
        const descuento = pedido.Descuento;

        // Calcula el monto total con descuento
        const montoTotalConDescuento =
          precioTotalPedido - precioTotalPedido * (descuento / 100);

        // Actualiza el valor de Monto_final en el objeto del pedido
        pedido.Monto_total = montoTotalConDescuento;

        // Guarda el pedido actualizado en la base de datos
        await pedido.save();
      }

      const users = await User.find().sort({
        username: 1,
      });

      const productos = await Producto.find().sort({ Numero_pedido: 1 });

      res.render("pendientes", {
        pedidos,
        pedidos: pedidosFormateados,
        contador,
        users,
        productos,
        productosCantidad: productosCantidad,
        precioTotalPorPedido: precioTotalPorPedido,
        precioUnitario,
        mensajes,
        Monto_total,
        pedidosPendientes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  realizadosAdmin: async (req, res) => {
    try {
      const pedidos = await Pedido.find({
        Estado: { $in: "Realizado" },
      }).sort({
        Numero_pedido: 1,
      });
      const opciones = {
        month: "long",
        day: "numeric",
      };

      const pedidosFormateados = pedidos.map((pedido) => {
        const fechaFormateada = pedido.createdAt.toLocaleString(
          "es-ES",
          opciones
        );
        return { ...pedido.toObject(), fechaFormateada };
      });

      let contador = 0;
      for (let i = 0; i < pedidos.length; i++) {
        contador++;
      }

      const pedidosRealizados = await Pedido.find({
        Estado: { $nin: ["Pendiente", "Entregado", "Cobrado"] },
      });

      const productosCantidad = {};

      for (let i = 0; i < pedidosRealizados.length; i++) {
        const productos = pedidosRealizados[i].productos;

        for (const [key, value] of Object.entries(productos)) {
          const nombreProducto = value.nombre; // Suponemos que el nombre del producto está en la propiedad "nombre"
          const cantidad = value.cantidad;

          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = cantidad;
          } else {
            productosCantidad[nombreProducto] += cantidad;
          }
        }
      }

      // Crear un array para almacenar los mensajes a mostrar en la plantilla
      const mensajesNombre = [];
      const mensajes = [];

      // Agregar mensajes al array
      for (const nombreProducto in productosCantidad) {
        const cantidadProducto = productosCantidad[nombreProducto];
        mensajes.push({ nombre: nombreProducto, cantidad: cantidadProducto });
      }

      for (let i = 0; i < pedidosRealizados.length; i++) {
        const productos = pedidosRealizados[i].productos;

        for (const producto of productos) {
          const nombreProducto = producto.nombre;
          const cantidad = producto.cantidad;
          const precioUnitario = producto.precio;

          // Calcula el precio total por producto considerando la cantidad
          const precioTotalProducto = cantidad * precioUnitario;

          // Agrega el precio total al objeto, si no existe, inicializa en 0
          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = 0;
          }

          productosCantidad[nombreProducto] += precioTotalProducto;
        }
      }

      // Crear un objeto para almacenar el precio total por pedido
      const precioTotalPorPedido = {};

      // Calcular el precio total por pedido y agregarlo al objeto
      for (const pedido of pedidosRealizados) {
        const productosPedido = pedido.productos;

        let precioTotalPedido = 0;

        for (const producto of productosPedido) {
          const cantidad = producto.cantidad;
          const precioUnitario = producto.precio;

          // Calcula el precio total por producto considerando la cantidad
          const precioTotalProducto = cantidad * precioUnitario;

          precioTotalPedido += precioTotalProducto;
        }

        precioTotalPorPedido[pedido.Numero_pedido] = precioTotalPedido;
      }
      console.log(precioTotalPorPedido);

      /* // Objeto para almacenar los productos y sus cantidades
      const productosCantidad = {};

      for (let i = 0; i < pedidosRealizados.length; i++) {
        const productos = pedidosRealizados[i].productos;

        for (const [key, value] of Object.entries(productos)) {
          const nombreProducto = value.nombre; // Suponemos que el nombre del producto está en la propiedad "nombre"
          const cantidad = value.cantidad;

          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = cantidad;
          } else {
            productosCantidad[nombreProducto] += cantidad;
          }
        }
      }

      // Crear un array para almacenar los mensajes a mostrar en la plantilla
      const mensajesNombre = [];
      const mensajes = [];

      // Agregar mensajes al array
      for (const nombreProducto in productosCantidad) {
        const cantidadProducto = productosCantidad[nombreProducto];
        mensajes.push({ nombre: nombreProducto, cantidad: cantidadProducto });
      } */

      const users = await User.find().sort({
        username: 1,
      });

      const productos = await Producto.find().sort({ Numero_pedido: 1 });

      res.render("realizados", {
        pedidos,
        pedidos: pedidosFormateados,
        contador,
        pedidosRealizados,
        productosCantidad: productosCantidad,
        precioTotalPorPedido: precioTotalPorPedido,
        mensajes,
        productos,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  realizadosBusqueda: async (req, res) => {
    const infobusqueda = req.body;
    const { browser, button } = infobusqueda;

    try {
      const pedidos = await Pedido.find({
        username: { $eq: browser },
        /* Estado: { $ne: "Pendiente" }, */
      });
      let contador = 0;
      for (let i = 0; i < pedidos.length; i++) {
        contador++;
      }

      const productosCantidad = {};

      for (let i = 0; i < pedidos.length; i++) {
        const productos = pedidos[i].productos;

        for (const [key, value] of Object.entries(productos)) {
          const nombreProducto = value.nombre; // Suponemos que el nombre del producto está en la propiedad "nombre"
          const cantidad = value.cantidad;

          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = cantidad;
          } else {
            productosCantidad[nombreProducto] += cantidad;
          }
        }
      }

      // Crear un array para almacenar los mensajes a mostrar en la plantilla
      const mensajesNombre = [];
      const mensajes = [];

      // Agregar mensajes al array
      for (const nombreProducto in productosCantidad) {
        const cantidadProducto = productosCantidad[nombreProducto];
        mensajes.push({ nombre: nombreProducto, cantidad: cantidadProducto });
      }

      res.render("realizadosBusqueda", {
        pedidos,
        infobusqueda,
        contador,
        mensajes,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cambioEstado: async (req, res) => {
    const Numero_pedido = req.params.Numero_pedido;

    const pedidos = await Pedido.find({
      username: { $eq: Numero_pedido },
      Estado: { $ne: "Pendiente" },
    });

    try {
      const pedidoActualizado = await Pedido.findOneAndUpdate(
        { Numero_pedido: Numero_pedido },
        { Estado: "Entregado" },
        { new: true }
      );

      if (!pedidoActualizado) {
        // No se encontró el pedido con el número proporcionado
        return res.status(404).json({ mensaje: "Pedido no encontrado" });
      }

      res.redirect("/session/realizados");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cambioEstadoRealizado: async (req, res) => {
    const Numero_pedido = req.params.Numero_pedido;

    const pedidos = await Pedido.find({
      username: { $eq: Numero_pedido },
      Estado: { $ne: "Pendiente" },
    });

    try {
      const pedidoActualizado = await Pedido.findOneAndUpdate(
        { Numero_pedido: Numero_pedido },
        { Estado: "Realizado" },
        { new: true }
      );

      if (!pedidoActualizado) {
        // No se encontró el pedido con el número proporcionado
        return res.status(404).json({ mensaje: "Pedido no encontrado" });
      }

      res.redirect("/session/realizados");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  cambioEstadoEntregado: async (req, res) => {
    const Numero_pedido = req.params.Numero_pedido;

    const pedidos = await Pedido.find({
      username: { $eq: Numero_pedido },
      Estado: { $ne: "Realizado" },
    });

    try {
      const pedidoActualizado = await Pedido.findOneAndUpdate(
        { Numero_pedido: Numero_pedido },
        { Estado: "Entregado" },
        { new: true }
      );

      if (!pedidoActualizado) {
        // No se encontró el pedido con el número proporcionado
        return res.status(404).json({ mensaje: "Pedido no encontrado" });
      }

      res.redirect("/session/entregados");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cambioEstadoCobrado: async (req, res) => {
    const Numero_pedido = req.params.Numero_pedido;

    const pedidos = await Pedido.find({
      username: { $eq: Numero_pedido },
      Estado: { $ne: "Entregado" },
    });

    try {
      const pedidoActualizado = await Pedido.findOneAndUpdate(
        { Numero_pedido: Numero_pedido },
        { Estado: "Cobrado" },
        { new: true }
      );

      if (!pedidoActualizado) {
        // No se encontró el pedido con el número proporcionado
        return res.status(404).json({ mensaje: "Pedido no encontrado" });
      }

      res.redirect("/session/entregados");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  entregadosAdminDelivery: async (req, res) => {
    const username = req.params.username;
    console.log(username);
    if (username === "delivery") {
      try {
        const pedidos = await Pedido.find({
          Estado: { $in: "Entregado" },
        }).sort({
          Numero_pedido: 1,
        });
        const opciones = {
          month: "long",
          day: "numeric",
        };
        const pedidosFormateados = pedidos.map((pedido) => {
          const fechaFormateada = pedido.createdAt.toLocaleString(
            "es-ES",
            opciones
          );
          return { ...pedido.toObject(), fechaFormateada };
        });

        let contador = 0;
        for (let i = 0; i < pedidos.length; i++) {
          contador++;
        }

        const pedidosEntregado = await Pedido.find({
          Estado: { $nin: ["Pendiente", "Realizado", "Cobrado"] },
        }).sort({ Numero_pedido: 1 });
        const sumaProductos = {}; // Objeto para almacenar la suma de cada producto

        for (let i = 0; i < pedidosEntregado.length; i++) {
          const productos = pedidosEntregado[i].productos;

          for (const [key, value] of Object.entries(productos)) {
            if (sumaProductos.hasOwnProperty(key)) {
              sumaProductos[key] += value;
            } else {
              sumaProductos[key] = value;
            }
          }
        }
        const users = await User.find().sort({
          username: 1,
        });

        const productos = await Producto.find().sort({ Numero_pedido: 1 });

        res.render("deliveryentregado", {
          username,
          pedidos,
          pedidos: pedidosFormateados,
          contador,
          pedidosEntregado,
          sumaProductos,
          productos,
        });
      } catch {
        const pedidos = await Pedido.find({
          Estado: { $in: "Entregado" },
        }).sort({
          Numero_pedido: 1,
        });
        const opciones = {
          month: "long",
          day: "numeric",
        };

        const pedidosFormateados = pedidos.map((pedido) => {
          const fechaFormateada = pedido.createdAt.toLocaleString(
            "es-ES",
            opciones
          );
          return { ...pedido.toObject(), fechaFormateada };
        });

        let contador = 0;
        for (let i = 0; i < pedidos.length; i++) {
          contador++;
        }

        const pedidosEntregados = await Pedido.find({
          Estado: { $nin: ["Realizado", "Cobrado", "Pendiente"] },
        }).sort({
          createdAt: 1,
        });
        let contadorEntregados = 0;
        for (let i = 0; i < pedidosEntregados.length; i++) {
          contadorEntregados++;
        }
        const pedidosCobrados = await Pedido.find({
          Estado: { $nin: ["Realizado", "Cobrado", "Pendiente"] },
        });
        let contadorEfectivo = 0;
        for (let i = 0; i < pedidosCobrados.length; i++) {
          if (pedidosCobrados[i].Pago === "Efectivo") {
            contadorEfectivo++;
          }
          console.log(contadorEfectivo);
        }

        const users = await User.find().sort({
          username: 1,
        });

        const productos = await Producto.find().sort({ Numero_pedido: 1 });

        const productosConDiferencia = productos.map((producto) => {
          const precioVenta = producto.precioVenta;
          const costoProduccion = producto.costoProduccion;

          return {
            name: producto.name,

            precioVenta: producto.precioVenta,
            costoProduccion: producto.costoProduccion,
          };
        });

        res.render("entregados", {
          /*    productos: productosConDiferencia, */
          pedidos,
          pedidos: pedidosFormateados,
          contadorEntregados,
          contadorEfectivo,
          productos,
        });
      }
    }
  },

  entregadosAdmin: async (req, res) => {
    try {
      const opciones = {
        month: "long",
        day: "numeric",
      };

      // Consulta para obtener todos los pedidos entregados que no estén en los estados especificados
      const pedidosEntregados = await Pedido.find({
        Estado: "Entregado",
        Estado: { $nin: ["Realizado", "Cobrado", "Pendiente"] },
      }).sort({
        Numero_pedido: 1,
      });

      const pedidosFormateados = pedidosEntregados.map((pedido) => ({
        ...pedido.toObject(),
        fechaFormateada: pedido.createdAt.toLocaleString("es-ES", opciones),
      }));

      // Consulta para obtener usuarios y productos
      const [users, productos] = await Promise.all([
        User.find().sort({ username: 1 }),
        Producto.find().sort({ Numero_pedido: 1 }),
      ]);

      const pedidosEntregado = await Pedido.find({
        Estado: { $nin: ["Pendiente", "Realizado", "Cobrado"] },
      });

      // Variable para almacenar la suma total de pedidos en efectivo
      let sumaTotalEfectivo = 0;

      // Recorre todos los pedidos entregados
      for (const pedido of pedidosEntregado) {
        // Verifica si el estado del pedido es "Efectivo"
        if (pedido.Pago === "Efectivo") {
          // Suma el valor de Monto_total al total de efectivo
          sumaTotalEfectivo += pedido.Monto_total ? pedido.Monto_total : 0; // O utiliza "pedido.Monto_total" si es el monto sin descuento
        }
      }

      // El valor de sumaTotalEfectivo contiene la suma total de los pedidos en efectivo
      console.log("Suma total de pedidos en efectivo:", sumaTotalEfectivo);
      // Objeto para almacenar los productos y sus cantidades
      const productosCantidad = {};

      for (let i = 0; i < pedidosEntregado.length; i++) {
        const productos = pedidosEntregado[i].productos;

        for (const [key, value] of Object.entries(productos)) {
          const nombreProducto = value.nombre; // Suponemos que el nombre del producto está en la propiedad "nombre"
          const cantidad = value.cantidad;

          if (!productosCantidad[nombreProducto]) {
            productosCantidad[nombreProducto] = cantidad;
          } else {
            productosCantidad[nombreProducto] += cantidad;
          }
        }
      }

      // Crear un array para almacenar los mensajes a mostrar en la plantilla
      const mensajesNombre = [];
      const mensajes = [];

      // Agregar mensajes al array
      for (const nombreProducto in productosCantidad) {
        const cantidadProducto = productosCantidad[nombreProducto];
        mensajes.push({ nombre: nombreProducto, cantidad: cantidadProducto });
      }

      // Renderizar la vista "entregados" con los datos
      res.render("entregados", {
        pedidos: pedidosFormateados,
        mensajes,
        sumaTotalEfectivo,
        contadorEntregados: pedidosEntregados.length, // Agregar el contador de pedidos entregados
        contadorEfectivo: pedidosFormateados.filter(
          (pedido) => pedido.Pago === "Efectivo"
        ).length,
        productos,
      });
    } catch (error) {
      // Manejo de errores
      console.error("Error al cargar datos:", error);
      res.status(500).send("Error interno del servidor");
    }
  },
  estadisticasAdmin: async (req, res) => {
    try {
      // Obtener todos los usuarios y pedidos
      const usuariosTotal = await User.find(
        {},
        { _id: 0, username: 1, createdAt: 1 }
      );

      const pedididosTotal = await Pedido.find(
        {},
        {
          _id: 0,
          username: 1,
          createdAt: 1,
          Detox: 1,
          Kefir: 1,
          Licuados: 1,
          Limonada: 1,
          Smoothie: 1,
        }
      );

      const resultados = await Pedido.aggregate([
        {
          $group: {
            _id: "$Estado",
            cantidadTotal: { $sum: 1 },
          },
        },
      ]);
      const order = ["pendiente", "realizado", "entregado", "cobrado"];

      // Crear un nuevo arreglo ordenado
      const resultadosOrdenados = order.map((estado) => {
        const resultado = resultados.find((r) => r._id === estado);
        return resultado || { _id: estado, cantidadTotal: 0 };
      });

      const resultados1 = await Pedido.aggregate([
        {
          $group: {
            _id: "$Estado",
            cantidadTotal: { $sum: 1 },
          },
        },
      ]);
      const orderValor = ["pendiente", "realizado", "entregado", "cobrado"];

      // Crear un nuevo arreglo ordenado
      const resultadosOrdenadosValor = orderValor.map((estado) => {
        const resultado1 = resultados.find((r) => r._id === estado);
        return resultado1 || { _id: estado, cantidadTotal: 0 };
      });

      // Obtener los clientes sin pedidos en el rango de fechas especificado
      const clientesSinPedidos = usuariosTotal
        .filter(
          (usuario) =>
            !pedididosTotal.some(
              (pedido) => pedido.username === usuario.username
            )
        )
        .map((usuario) => usuario.username);

      // Obtener la cantidad de usuarios y pedidos totales
      const contadorUser = usuariosTotal.length;
      const contadorPedido = pedididosTotal.length;

      // Obtener la cantidad total de litros vendidos de cada producto
      const sumarDetox = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Detox,
        0
      );
      const sumarSmoothie = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Smoothie,
        0
      );
      const sumarLimonadas = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Limonada,
        0
      );
      const sumarLicuados = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Licuados,
        0
      );
      const sumarKefir = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Kefir,
        0
      );

      // Obtener la cantidad total de litros vendidos de todos los productos
      const sumarLitros =
        sumarDetox +
        sumarSmoothie +
        sumarLimonadas +
        sumarLicuados +
        sumarKefir;

      // Obtener el promedio de pedidos por cliente
      const promedioPedidoCliente = contadorPedido / contadorUser;
      const promedioPedidoClientetotal = promedioPedidoCliente.toFixed(2);

      // Obtener el producto más vendido
      const productosArray = [
        ["Detox", sumarDetox],
        ["Smoothie", sumarSmoothie],
        ["Limonadas", sumarLimonadas],
        ["Licuados", sumarLicuados],
        ["Kefir", sumarKefir],
      ];
      productosArray.sort((a, b) => b[1] - a[1]);
      const productoMasVendido = productosArray[0][0];

      // Crear una cadena de texto con la salida formateada de los productos y las ventas
      const output = productosArray.map(
        ([producto, cantidad]) => `${producto} ${cantidad}`
      );
      const output2 = productosArray.map(([producto]) => `${producto}`);

      // Renderizar la vista estadisticas con los datos obtenidos
      res.render("estadisticas", {
        contadorUser,
        contadorPedido,
        promedioPedidoClientetotal,
        sumarLitros,
        clientesSinPedidos,
        productoMasVendido,
        output,
        output2,
        resultados: resultadosOrdenados,
        resultados1: resultadosOrdenadosValor,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  estadisticasAdminMes: async (req, res) => {
    try {
      // Obtener todos los usuarios y pedidos
      const usuariosTotal = await User.find(
        {},
        { _id: 0, username: 1, createdAt: 1, telefono: 1 }
      );
      const pedididosTotal = await Pedido.find(
        {},
        {
          _id: 0,
          username: 1,
          createdAt: 1,
          Detox: 1,
          Kefir: 1,
          Licuados: 1,
          Limonada: 1,
          Smoothie: 1,
        }
      );

      userObjUser = usuariosTotal;
      nombreObjPedido = pedididosTotal;

      fechaInicio = new Date(req.body.fechaInicio);
      fechaActual = new Date(req.body.fechaFin);

      const opciones = {
        month: "long",
        day: "numeric",
      };

      const mesEntrada = fechaInicio.toLocaleString("es-ES", opciones);
      const mesSalida = fechaActual.toLocaleString("es-ES", opciones);
      /*  const fechaInicio = new Date("2023-01-1"); // Fecha de inicio del rango

      const fechaActual = new Date("2023-04-14"); */

      let clientesRegistrados = 0;

      for (let i = 0; i < usuariosTotal.length; i++) {
        let fechaRegistro = new Date(usuariosTotal[i].createdAt);

        if (fechaRegistro >= fechaInicio && fechaRegistro <= fechaActual) {
          clientesRegistrados++;
        }
      }

      const nombresNoEnArray2 = userObjUser
        .filter((item) => {
          // Verificar si el usuario no tiene pedidos en el rango de fechas especificado
          return !nombreObjPedido.some(
            (item2) =>
              item2.username === item.username &&
              new Date(item2.createdAt) >= fechaInicio &&
              new Date(item2.createdAt) <= fechaActual
          );
        })
        .map((item) => {
          // Modificar el objeto para incluir nombre de usuario y número de teléfono
          return {
            username: item.username,
            telefono: item.telefono,
          };
        });
      const cantidadUsuariosSinPedido = nombresNoEnArray2.length;

      console.log(nombresNoEnArray2);

      const clientesSinPedidos = userObjUser
        .filter((item) => {
          // Verificar si el usuario no tiene pedidos en el rango de fechas especificado
          return !nombreObjPedido.some(
            (item2) => item2.username === item.username
          );
        })
        .map((item) => {
          // Devolver solo el nombre de usuario
          return item.username;
        });

      // Obtener la cantidad de usuarios y pedidos totales
      const contadorUser = usuariosTotal.length;
      const contadorPedido = pedididosTotal.length;

      // Obtener la cantidad total de litros vendidos de cada producto
      const sumarDetox = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Detox,
        0
      );
      const sumarSmoothie = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Smoothie,
        0
      );
      const sumarLimonadas = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Limonada,
        0
      );
      const sumarLicuados = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Licuados,
        0
      );
      const sumarKefir = pedididosTotal.reduce(
        (total, pedido) => total + pedido.Kefir,
        0
      );

      // Obtener la cantidad total de litros vendidos de todos los productos
      const sumarLitros =
        sumarDetox +
        sumarSmoothie +
        sumarLimonadas +
        sumarLicuados +
        sumarKefir;

      // Obtener el promedio de pedidos por cliente
      const promedioPedidoCliente = contadorPedido / contadorUser;
      const promedioPedidoClientetotal = promedioPedidoCliente.toFixed(2);

      // Obtener el producto más vendido
      const productosArray = [
        ["Detox", sumarDetox],
        ["Smoothie", sumarSmoothie],
        ["Limonadas", sumarLimonadas],
        ["Licuados", sumarLicuados],
        ["Kefir", sumarKefir],
      ];
      productosArray.sort((a, b) => b[1] - a[1]);
      const productoMasVendido = productosArray[0][0];

      // Crear una cadena de texto con la salida formateada de los productos y las ventas
      /*    const output = productosArray.map(
        ([producto, cantidad]) => `${producto} ${cantidad}`
        
      ); */

      // Obtener el promedio de pedidos por cliente

      const output = productosArray.map(([producto, cantidad]) => {
        return `${producto} ${cantidad}`;
      });
      const output2 = productosArray.map(([producto]) => `${producto}`);

      const pedidosFiltrados = pedididosTotal.filter((pedido) => {
        const fechaPedido = new Date(pedido.createdAt);
        return fechaPedido >= fechaInicio && fechaPedido <= fechaActual;
      });
      const contadorPedidoXFecha = pedidosFiltrados.length;

      let restaUser = contadorUser - cantidadUsuariosSinPedido;
      promedioPedidoClientexFecha = contadorPedidoXFecha / restaUser;
      promedioPedidoClientexFechaT = promedioPedidoClientexFecha.toFixed(2);
      // Crear una cadena de texto con la salida formateada de los productos y las ventas
      /*    const output = productosArray.map(
        ([producto, cantidad]) => `${producto} ${cantidad}`
        
      ); */

      // Obtener el promedio de pedidos por cliente

      const sumarDetoxxFecha = pedididosTotal.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.createdAt); // Ajusta "pedido.fecha" a la propiedad correcta en tu objeto pedido

        if (fechaPedido >= fechaInicio && fechaPedido <= fechaActual) {
          return total + pedido.Detox;
        }
        return total;
      }, 0);
      const sumarSmoothiexFecha = pedididosTotal.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.createdAt); // Ajusta "pedido.fecha" a la propiedad correcta en tu objeto pedido

        if (fechaPedido >= fechaInicio && fechaPedido <= fechaActual) {
          return total + pedido.Smoothie;
        }
        return total;
      }, 0);
      const sumarLimonadaxFecha = pedididosTotal.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.createdAt); // Ajusta "pedido.fecha" a la propiedad correcta en tu objeto pedido

        if (fechaPedido >= fechaInicio && fechaPedido <= fechaActual) {
          return total + pedido.Limonada;
        }
        return total;
      }, 0);
      const sumarLicuadosxFecha = pedididosTotal.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.createdAt); // Ajusta "pedido.fecha" a la propiedad correcta en tu objeto pedido

        if (fechaPedido >= fechaInicio && fechaPedido <= fechaActual) {
          return total + pedido.Licuados;
        }
        return total;
      }, 0);
      const sumarKefirxFecha = pedididosTotal.reduce((total, pedido) => {
        const fechaPedido = new Date(pedido.createdAt); // Ajusta "pedido.fecha" a la propiedad correcta en tu objeto pedido

        if (fechaPedido >= fechaInicio && fechaPedido <= fechaActual) {
          return total + pedido.Kefir;
        }
        return total;
      }, 0);

      const sumarLitrosxFecha =
        sumarDetoxxFecha +
        sumarSmoothiexFecha +
        sumarLimonadaxFecha +
        sumarLicuadosxFecha +
        sumarKefirxFecha;

      const productosArrayxFecha = [
        ["Detox", sumarDetoxxFecha],
        ["Smoothie", sumarSmoothiexFecha],
        ["Limonadas", sumarLimonadaxFecha],
        ["Licuados", sumarLicuadosxFecha],
        ["Kefir", sumarKefirxFecha],
      ];
      productosArrayxFecha.sort((a, b) => b[1] - a[1]);
      const productoMasVendidoxFecha = productosArrayxFecha[0][0];

      const outputxFecha = productosArrayxFecha.map(([producto, cantidad]) => {
        return `${producto} ${cantidad}`;
      });

      const output2xFecha = productosArrayxFecha.map(
        ([producto]) => `${producto}`
      );

      res.render("estadisticas", {
        contadorUser,
        contadorPedido,
        promedioPedidoClientetotal,
        nombresNoEnArray2,
        sumarLitros,
        clientesSinPedidos,
        productoMasVendido,
        output,
        output2,
        clientesRegistrados,
        mesEntrada,
        mesSalida,
        contadorPedidoXFecha,
        promedioPedidoClientexFechaT,
        restaUser,
        sumarLitrosxFecha,
        productoMasVendidoxFecha,
        outputxFecha,
        output2xFecha,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  showProductosAdmin: async (req, res) => {
    try {
      const productos = await Producto.find();
      const pedidos = await Pedido.find();

      res.render("productosAdmin", { productos, pedidos });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
