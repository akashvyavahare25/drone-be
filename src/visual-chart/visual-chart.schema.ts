import * as mongoose from 'mongoose';

import { VisualChart } from './visual-chart.interface';

export const VisualChartSchema = new mongoose.Schema<VisualChart>(
  {
    name: { type: String, required: true, unique: true },
    x: { type: String, required: false },
    y: { type: String, required: false },
    type: { type: String, required: true },
    color: { type: String, required: false },
    subtype:{ type: String, required: false },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    report: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);
