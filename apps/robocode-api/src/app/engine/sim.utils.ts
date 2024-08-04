import { ROBOT_SHOOTING_MIN_ENERGY } from "@robo-code/shared";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = function () {};

export const isActive = (obj: { isActive: boolean }) => obj.isActive;

export const isInactive = (obj: { isActive: boolean }) => !obj.isActive;

export const hasEnergyToShoot = (energy: number) => energy > ROBOT_SHOOTING_MIN_ENERGY;
