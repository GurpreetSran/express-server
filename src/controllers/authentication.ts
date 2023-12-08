import express from "express";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, userName } = req.body;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
