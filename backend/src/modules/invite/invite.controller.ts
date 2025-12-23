import { Request, Response, NextFunction } from "express";
import { createInviteSchema } from "./invite.schema";
import {
  createInvite,
  listInvitesForUser,
  acceptInvite,
  rejectInvite
} from "./invite.service";

export const createInviteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const data = createInviteSchema.parse(req.body);

    const invite = await createInvite(
      orgId,
      req.user!.userId,
      data
    );

    res.status(201).json(invite);
  } catch (err) {
    next(err);
  }
};

export const listMyInvitesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invites = await listInvitesForUser(req.user!.email);
    res.json(invites);
  } catch (err) {
    next(err);
  }
};

export const acceptInviteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invite = await acceptInvite(
      req.params.inviteId,
      req.user!.userId,
      req.user!.email
    );
    res.json(invite);
  } catch (err) {
    next(err);
  }
};

export const rejectInviteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invite = await rejectInvite(
      req.params.inviteId,
      req.user!.email
    );
    res.json(invite);
  } catch (err) {
    next(err);
  }
};
