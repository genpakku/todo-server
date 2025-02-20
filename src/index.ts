import express from "express";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import jwt from "jsonwebtoken";

const app: Express = express();
app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

const PORT = 8080;

const users = [
  { id: 1, username: "genta", password: "password" }, // 仮のユーザー
];

const SECRET_KEY = "your_secret_key";

// 🔹 ログイン API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user)
    return res
      .status(401)
      .json({ message: "ユーザ名もしくはパスワードが異なります。" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// 🔹 認証チェック API
app.get("/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "認証成功" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ message: "不正なトークンです。" });
  }
});

// エンドポイント作成
app.get("/allTodos", async (req: Request, res: Response) => {
  const allTodos = await prisma.todo.findMany();
  return res.json(allTodos);
});

app.post("/createTodo", async (req: Request, res: Response) => {
  try {
    const { title, isCompleted } = req.body;
    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    });
    return res.json(createTodo);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, isCompleted } = req.body;
    const editTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        isCompleted,
      },
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
