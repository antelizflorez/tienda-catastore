import db from "../database/db.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await db.query("SELECT * FROM users", { type: db.QueryTypes.SELECT });
        res.json(users);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { user_name, password, address, telephone, email } = req.body;
        await db.query(
            "INSERT INTO users (user_name, password, address, telephone, email) VALUES (?, ?, ?, ?, ?)",
            {
                replacements: [user_name, password, address, telephone, email],
                type: db.QueryTypes.INSERT,
            }
        );
        res.json({
            'message': 'registro creado'
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { user_name, password, address, telephone, email } = req.body;
        await db.query(
            "UPDATE users SET user_name = ?, password = ?, address = ?, telephone = ?, email = ? WHERE id = ?",
            {
                replacements: [user_name, password, address, telephone, email, req.params.id],
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

export const getUser = async (req, res) => {
    try {
        const user = await db.query("SELECT * FROM users WHERE id = ?", {
            replacements: [req.params.id],
            type: db.QueryTypes.SELECT,
        });
        res.json(user[0]);
    } catch (error) {
        res.json({ message: error.message });
    }
};
