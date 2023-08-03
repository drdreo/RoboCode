export const ARENA_SIZE = 1000;


/**
 * ROBOT CONSTANTS
 */
export const ROBOT_HEALTH_DECAY = 0.01;
export const ROBOT_HITBOX_WIDTH = 50;
export const ROBOT_HITBOX_HEIGHT = 70;
export const ROBOT_ENERGY_GAIN = 0.5;
export const ROBOT_SHOOTING_ENERGY_COST = 10;
export const ROBOT_MAX_SPEED = 5 // 5 units per second


/**
 * GAME CONSTANTS
 */
const FPS = 50;
export const TICKS_PER_SECOND = 1 / FPS * 1000; // 20 fps -- 50ms

/**
 * BULLET CONSTANTS
 */
export const BULLET_DAMAGE = 13;
export const BULLET_SPEED =  20;
export const BULLET_SIZE = 0.2;
export const BULLET_OFFSET = ROBOT_HITBOX_HEIGHT;