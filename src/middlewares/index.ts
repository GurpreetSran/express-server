import express from "express";
import { getUserBySessionToken } from "../db/users";
import { IUser } from "../db/users";

export interface RequestWithIdentity extends express.Request {
  identity: IUser;
}

export const isAuthenticated = async (
  req: RequestWithIdentity,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies[process.env.SESSION_COOKIE_NAME];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    req.identity = existingUser;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const isOwner = (
  req: RequestWithIdentity,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId = req.identity?._id.toString();

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (id !== currentUserId.toString()) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
