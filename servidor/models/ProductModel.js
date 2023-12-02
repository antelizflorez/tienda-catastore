import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProductModel = db.define('productos', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img1: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img2: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img3: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    stockMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stockMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default ProductModel;
