import {Schema, model} from "mongoose";

type Iuser = {
  name:string,
  email:string,
  password:string,
  refreshToken?:string | null,
  createdAt?:Date,
  updatedAt?:Date
}

export const UserProps = new Schema<Iuser>({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  refreshToken: {
    type: String,
    default: null
  },

},
  {
    timestamps: true
  }
)

