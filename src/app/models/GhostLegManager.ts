import { IGhostLegSettings } from './IGhostLegSettings';
import * as createjs from 'createjs-module';
export class GhostLegManager {
  stage: createjs.Stage;
  settings: IGhostLegSettings;

  constructor(stage: createjs.Stage) {
    this.stage = stage;
  }

  load(settings: IGhostLegSettings) {
    this.settings = settings;
  }
}
