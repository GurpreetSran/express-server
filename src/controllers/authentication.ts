import express from "express";

import { authentication, random } from "../helpers";

import { createUser, getUserByEmail } from "../db/users";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expectedhash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedhash) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie(
      process.env.SESSION_COOKIE_NAME,
      user.authentication.sessionToken,
      {
        domain: "localhost",
        path: "/",
      }
    );

    res.status(200).json(user).end();
  } catch (error) {}
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
