import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({
            success: false,
            message: "All fields required"
        })
    }

    try {
        const existingUser = await db.user.findUnique({
            where: {email}
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }
        })

        const token = jwt.sign(
            {id:newUser.id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}  
        )

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 7
        })

        res.status(201).json({
            success: true,
            message: "User register successfully",
            User: {
                id: newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }
        })
    } catch (error) {
        console.error("Error registering User ", error)
        res.status(400).json({
            success: false,
            message: "Error registering user"
        })
    }
}

export const login = async (req, res) => {

}

export const logout = async (req, res) => {

}

export const check = async (req, res) => {

}