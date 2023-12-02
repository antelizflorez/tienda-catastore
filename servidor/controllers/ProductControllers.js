import ProductModel from "../models/ProductModel.js";
import { productsStock, productMinStock } from "../main.js";
import { sendMail } from "../mail/mail.js";
import db from "../database/db.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await db.query("SELECT * FROM productos", { type: db.QueryTypes.SELECT });
        res.json(products);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await db.query("SELECT * FROM productos WHERE id = ?", {
            replacements: [productId],
            type: db.QueryTypes.SELECT,
        });
        res.json(product[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { nombre, precio, descripcion, img1, img2, img3, stockMax, stockMin, stock } = req.body;
        await db.query(
            "INSERT INTO productos (nombre, precio, descripcion, img1, img2, img3, stockMax, stockMin, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            {
                replacements: [nombre, precio, descripcion, img1, img2, img3, stockMax, stockMin, stock],
                type: db.QueryTypes.INSERT,
            }
        );
        res.json({ message: 'registro creado' });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { nombre, precio, descripcion, img1, img2, img3, stockMax, stockMin, stock } = req.body;
        const productId = req.params.id;

        await db.query(
            "UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, img1 = ?, img2 = ?, img3 = ?, stockMax = ?, stockMin = ?, stock = ? WHERE id = ?",
            {
                replacements: [nombre, precio, descripcion, img1, img2, img3, stockMax, stockMin, stock, productId],
                type: db.QueryTypes.UPDATE,
            }
        );

        res.json({
            'message': 'registro actualizado'
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await db.query("DELETE FROM productos WHERE id = ?", {
            replacements: [productId],
            type: db.QueryTypes.DELETE,
        });
        res.json({ message: 'registro borrado' });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const bookProduct = async (req, res) => {
    try {
        console.log(productsStock);
        if (req.query.f === 'unbook') {
            productsStock[req.params.id]++;
            return res.json('Unbooked');
        } else if (req.query.f === 'book') {
            if (productsStock[req.params.id] == 0) return res.json('Stockout');
            productsStock[req.params.id]--;
            return res.json('Booked');
        }
        res.status(400).json('Bad request');
    } catch (error) {
        res.json({ message: error.message });
    }
};

const updateContent = async (product, quantity) => {
    try {
        const stock = await db.query("SELECT id, stock FROM productos WHERE id = ?", {
            replacements: [product],
            type: db.QueryTypes.SELECT,
        });

        await db.query(
            "UPDATE productos SET stock = ? WHERE id = ?",
            {
                replacements: [stock[0].stock - quantity[product], product],
                type: db.QueryTypes.UPDATE,
            }
        );

        if (productMinStock[product].stockMin >= stock[0].stock - quantity[product]) {
            sendMail({ id: product });
        }
    } catch (error) {
        console.error(error.message);
    }
};

export const buyProducts = async (req, res) => {
    try {
        console.log(typeof req.body);
        Object.keys(req.body).forEach((product) => updateContent(product, req.body));
        res.json('Successful purchase');
    } catch (error) {
        res.json(error.message);
    }
};
