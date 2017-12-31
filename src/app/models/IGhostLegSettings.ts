export interface IGhostLegSettings {
  start: IStart[];
  end: IEnd[];
  random: string;
}

export interface IStart {
  name: string;
}

export interface IEnd {
  id: string;
  name: string;
}
