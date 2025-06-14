import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [{
    type: String,
    required: true,
    trim: true
  }],
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EmployeeSchema.index({ name: 1 });
EmployeeSchema.index({ class: 1 });
EmployeeSchema.index({ age: 1 });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema); 