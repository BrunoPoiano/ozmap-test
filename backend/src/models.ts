import 'reflect-metadata';
import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
  Index,
} from '@typegoose/typegoose';
import lib from './lib';

import ObjectId = mongoose.Types.ObjectId;

class Base extends TimeStamps {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<User>('save', async function (next) {
  try {
    if (this.isModified('coordinates')) {
      this.address = await lib.getAddressFromCoordinates(this.coordinates);
    } else if (this.isModified('address')) {
      const { lat, lng } = await lib.getCoordinatesFromAddress(this.address);
      this.coordinates = [lng, lat];
    }
    next();
  } catch (error: unknown) {
    next(error as mongoose.CallbackError);
  }
})
export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}

@pre<Region>('save', async function (next) {
  try {
    if (!this._id) {
      this._id = new ObjectId().toString();
    }

    if (this.isNew) {
      const user = await UserModel.findOne({ _id: this.user });
      if (!user) throw new Error('User not found');

      user.regions.push(this._id);
      await user.save({ session: this.$session() });
    }

    await this.validate();
    next();
  } catch (error: unknown) {
    next(error as mongoose.CallbackError);
  }
})
@modelOptions({
  schemaOptions: { validateBeforeSave: false },
  options: { allowMixed: 0 }, // Suppress Mixed warning
})
@Index({ geojson: '2dsphere' })
export class Region extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    coordinates: [[[Number]]],
    required: true,
  })
  geojson!: { type: 'Polygon'; coordinates: number[][][] };
}

export const UserModel = getModelForClass(User);
export const RegionModel = getModelForClass(Region);
