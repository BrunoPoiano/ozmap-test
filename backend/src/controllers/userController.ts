/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { User, UserModel } from '../models';
import { expressjwt } from 'express-jwt';
import lib from '../lib';
import { body, validationResult } from 'express-validator';
import { databaseInit } from '../database';
import { hashPassword } from '../auth';

export const updateUser = async (req: Request, resp: Response) => {
  try {
    const { name, email, password, address, coordinates } = req.body;
    const user = req?.user;

    if (!coordinates && !address) {
      return resp.status(400).json({ error: 'Send a coordinates or address' });
    }

    if (coordinates && address) {
      return resp
        .status(400)
        .json({ error: 'Send only coordinates or address' });
    }

    const userData: Partial<User> = { name, email };

    if (password) {
      userData.password = await hashPassword(password);
    }

    if (address) {
      userData.address = address;
      const { lat, lng } = await lib.getCoordinatesFromAddress(address);
      userData.coordinates = [lat, lng];
    }

    if (coordinates) {
      userData.coordinates = coordinates;
      userData.address = await lib.getAddressFromCoordinates(coordinates);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user?._id },
      userData,
      { new: true, runValidators: true }
    );

    return resp
      .status(200)
      .json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    return resp
      .status(500)
      .json({ error: 'error updating user' });
  }
};

export const deleteUser = async (req: Request, resp: Response) => {
  try {
    const user = req.user;
    await UserModel.deleteOne({ _id: user?._id });

    return resp.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return resp.status(500).json({ error: 'error deleting user' });
  }
};

export const loggedUser = async (req: Request, resp: Response) => {
  try {
    return resp.status(200).json(req.user);
  } catch (err) {
    console.error('Error getting logged user:', err);
    return resp.status(500).json({ error: 'error logging user' });
  }
};
