export const ARENA_SIZE = 1000;

/**
 * ROBOT CONSTANTS
 */
export const ROBOT_HEALTH_DECAY = 0.01;
export const ROBOT_WIDTH = 35;
export const ROBOT_HEIGHT = 55;
export const ROBOT_HITBOX_WIDTH = ROBOT_WIDTH;
export const ROBOT_HITBOX_HEIGHT = ROBOT_HEIGHT;
export const ROBOT_ENERGY_GAIN = 0.5;
export const ROBOT_SHOOTING_ENERGY_COST = 10;
export const ROBOT_MAX_SPEED = 4; // 5 units per second
export const ROBOT_MAX_TURNING_SPEED = 0.055; // 0.075 was before

/**
 * GAME CONSTANTS
 */
const FPS = 40;
export const TICKS_PER_SECOND = (1 / FPS) * 1000; // 20 fps -- 50ms

/**
 * BULLET CONSTANTS
 */
export const BULLET_DAMAGE = 13;
export const BULLET_SPEED = 15;
export const BULLET_ROTATION = 0;
export const BULLET_SIZE = 3;
export const BULLET_OFFSET_Y = ROBOT_HITBOX_HEIGHT / 2 + BULLET_SIZE / 2;
export const BULLET_OFFSET_X = -BULLET_SIZE / 2;
