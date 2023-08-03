// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = function () {
};

export const isActive = (obj: { isActive: boolean }) => obj.isActive;

export const isInactive = (obj: { isActive: boolean }) => !obj.isActive;


export const hasEnergyToShoot = (energy: number) => energy > 20;