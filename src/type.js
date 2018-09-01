export type ID = string

export type Point = {
  x: number,
  y: number,
}

export type Rotation = 0 | 1 | 2 | 3

export type Cell = Point

export type Token = string

export type CommandIdle = {
  type: 'idle',
}

export type CommandActivate = {
  type: 'activate',
  targetId: ID,
}

export type CommandCarry = {
  type: 'carry',
  pickUpCell: Cell,
  dropCell: Cell,
}

export type Command = CommandIdle | CommandActivate | CommandCarry

export type Navigation = {
  target: Point,
  pathToTarget?: Point[] | null,
}

export type BotIdle = {
  id: ID,
  position: Point,
  velocity: Point,
  navigation: Navigation | null,

  command: CommandIdle,
  activity: null,
}

export type BotActivate = {
  id: ID,
  position: Point,
  velocity: Point,
  navigation: Navigation | null,

  command: CommandActivate,
  activity: {
    activationCooldown: number,
  },
}

export type BotCarry = {
  id: ID,
  position: Point,
  velocity: Point,
  navigation: Navigation | null,

  command: CommandCarry,
  activity: {
    carrying: Token | null,
  },
}

export type Bot = BotIdle | BotActivate | BotCarry

// 0 empty
// 1 wall
// 2 trigger
export type CellType = 0 | 1 | 2
export type Map = CellType[][]

export type Blueprint = {
  id: ID,

  ground: Map,

  buildingCost: number,

  activationThreshold: number,

  inputs: { cell: Cell, token: Token }[],
  outputs: { cell: Cell, token: Token }[],

  recipe: {
    inputs: { token: Token, n: number }[],
    outputs: { token: Token, n: number }[],
  },
}

export type Machine = {
  id: ID,

  blueprint: Blueprint,

  rotation: Rotation,
  positionOrigin: Cell,

  processing: { k: number, activated: boolean } | null,
}

export type Universe = {
  bots: Bot[],

  blueprints: Blueprint[],

  machines: Machine[],

  map: Map,

  droppedTokens: { position: Point, token: Token, availableCoolDown: number }[],

  bank: number,
}

export type Camera = {
  a: number,
  t: Point,
}

export type UIstate = {
  selectedBotId: ID | null,
  pickUpCell: Cell | null,
  shopOpened: boolean,
  selectedBlueprintId: string | null,
  selectedBlueprintRotation: Rotation,
  dragMachine: Machine | null,
  dragMachineDroppable: boolean,
}
