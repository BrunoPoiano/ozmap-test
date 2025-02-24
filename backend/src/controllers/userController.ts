/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { User, UserModel } from '../models';
import { expressjwt } from 'express-jwt';
import lib from '../lib';
import { body, validationResult } from 'express-validator';
import { databaseInit } from '../database';
import { hashPassword } from '../auth';

export const createTesteUser = async (req: Request, resp: Response) => {
  try {
    await databaseInit();

    const newUser = await UserModel.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      password: hashPassword('acb123!'),
      coordinates: [-122.084, 37.422],
    });

    return resp.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error('error creating user:', err);
    return resp
      .status(400)
      .json({ error: 'Failed to create user', details: err });
  }
};

export const updateUser = async (req: Request, resp: Response) => {
  try {
    const { name, email, password, address, coordinates } = req.body;
    const user = req?.user;
    if (!user) {
      return resp.status(401).json({ error: 'User not found' });
    }

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
      { _id: user._id },
      userData,
      { new: true, upsert: true, runValidators: true }
    );

    return resp
      .status(201)
      .json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    return resp
      .status(500)
      .json({ error: 'error updating user', details: err });
  }
};

export const deleteUser = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return resp.status(401).json({ error: 'User not found' });
    }

    await UserModel.deleteOne({ _id: user._id });

    return resp.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return resp.status(500).json(err);
  }
};

export const loggedUser = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;
    if (!user) {
      return resp.status(401).json({ error: 'User not found' });
    }
    return resp.status(200).json(user);
  } catch (err) {
    console.error('Error getting logged user:', err);
    return resp.status(500).json(err);
  }
};
