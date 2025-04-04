/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { RegionModel, UserModel } from '../models';

export const getRegion = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const search = req.query.search || '';
    const regions = await RegionModel.find({
      user: user?._id,
      name: { $regex: search, $options: 'i' },
    });

    resp.status(200).json(regions);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error getting regions' });
  }
};

export const createRegion = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const { name, coordinates } = req.body;

    const newRegion = new RegionModel({
      user: user?._id,
      name: name.toLowerCase(),
      geojson: { type: 'Polygon', coordinates: coordinates },
    });
    await newRegion.save();

    resp.status(201).json({ region: newRegion });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error creating region'});
  }
};

export const updateRegion = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const regionId = req.params.id;
    const regionData = req.body;

    const region = await RegionModel.findOneAndUpdate(
      { _id: regionId, user: user?._id },
      {
        name: regionData.name.toLowerCase(),
        geojson: { type: 'Polygon', coordinates: regionData.coordinates },
      },
      {}
    );

    resp
      .status(200)
      .json({ message: 'Region updated successfully', region: region });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error updating region' });
  }
};
export const deleteRegion = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const regionId = req.params.id;

    await RegionModel.deleteOne({ _id: regionId, user: user?._id });

    resp.status(200).json({ message: 'Region deleted successfully' });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error deleting region' });
  }
};

export const findRegion = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const latitude = Number.parseFloat(req.query.latitude as string);
    const longitude = Number.parseFloat(req.query.longitude as string);

    if (!latitude || !longitude) {
      return resp.status(400).json({ message: 'missing latitude or longitude' });
    }

    const regions = await RegionModel.find({
      geojson: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [latitude, longitude],
          },
        },
      },
      user: user?._id,
    }).lean();

    resp.status(200).json(regions);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error finding region' });
  }
};

export const findRegionNear = async (req: Request, resp: Response) => {
  try {
    const user = req?.user;

    const latitude = Number.parseFloat(req.query.latitude as string);
    const longitude = Number.parseFloat(req.query.longitude as string);
    const distanceQuery = req.query.distance;
    const distance =
      typeof distanceQuery === 'string'
        ? Number.parseInt(distanceQuery, 10)
        : 1000;
    const searchAll = req.query.searchAll || 'false';

    if (!latitude || !longitude) {
      return resp.status(400).json({ message: 'missing latitude or longitude' });
    }

    let query = {};
    if (searchAll === 'false') query = { user: user?._id };

    const regions = await RegionModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [latitude, longitude],
          },
          maxDistance: distance,
          spherical: true,
          distanceField: 'distance',
          includeLocs: 'locations',
          query: query,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
    ]);

    resp.status(200).json(regions);
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: 'Error finding region' });
  }
};
