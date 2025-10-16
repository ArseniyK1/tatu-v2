import { Scenes } from 'telegraf';

export interface BookingSessionData {
  consentGiven?: boolean;
}

export interface Context extends Scenes.SceneContext {
  scene: Scenes.SceneContext['scene'] & {
    session: BookingSessionData;
  };
}
