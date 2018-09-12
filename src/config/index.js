export * from './blueprints'
export * from './physic'
export * from './menu'

export const LOOP_DELAY = typeof document === 'undefined' ? 0 : 30

export const DROPPED_DELAY = 26
export const BOT_ACTIVATION_DELAY = 60
export const BOT_ACTIVATION_TOUCH = 10
export const BOT_COST = 200

export const SELECT_THRESHOLD = 0.6
