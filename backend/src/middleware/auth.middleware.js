import jwt from "jsonwebtoken"
import {db} from "../libs/db.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized token"
            })
        }

        let decoded;

        try {
            decoded = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error("Error in verifying token ", error );
            res.status(400).json({
                success: false,
                message: "Invalid token"
            })
        }

        const user = await db.user.findUnique({
            where:{
                id:decoded.id
            },
            select:{
                id:true,
                image:true,
                name:true,
                email:true,
                role:true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user

        next();
    } catch (error) {
        console.error("Error authenticating user ", error)
        res.status(500).json({
            success: false,
            message: "Error authenticating user"
        })
    }
}   

export const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        })

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "ADMIN ONLY - You do not have the access"
            })
        }

        next();
    } catch (error) {
        console.error("Error ", error)
        res.status(500).json({
            success: false,
            message: "Error checking admin role"
        })
    }
}