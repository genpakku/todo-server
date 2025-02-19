import express from "express";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

const PORT = 8080;

// エンドポイント作成
app.get("/allTodos", async (req: Request, res: Response) => {
    const allTodos = await prisma.todo.findMany();
    return res.json(allTodos);
});

app.post("/createTodo", async (req: Request, res: Response) => {
    try {
        const {title, isCompleted} = req.body;
        const createTodo = await prisma.todo.create({
            data: {
                title,
                isCompleted,
            }
        });
        return res.json(createTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const {title, isCompleted} = req.body;
        const editTodo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                isCompleted,
            }
        });
        return res.json(editTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

app.delete("/deleteTodo/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const deleteTodo = await prisma.todo.delete({
            where: { id },
        });
        return res.json(deleteTodo);
    } catch (e) {
        return res.status(400).json(e);
    }
});

// httpサーバを起動
app.listen(PORT, () => console.log("server is running🚀"));