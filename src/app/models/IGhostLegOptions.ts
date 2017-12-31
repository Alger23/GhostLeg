export interface IGhostLegOptions {
  horizontal?: IHorizontalOptions;
  leg?: ILegOptions;
  speed?: number;
}

interface IHorizontalOptions {
  min?: number;
  max?: number;
}

interface ILegOptions {
  offsetX?: number;
  offsetY?: number;
}
