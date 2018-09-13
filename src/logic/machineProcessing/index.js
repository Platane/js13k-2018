import { pointToCell, pointEqual } from '~/service/point'
import { proj } from '~/service/machine'
import { DROPPED_DELAY } from '~/config'
import type { Universe } from '~/type'

const removeInPlace = arr => item => arr.splice(arr.indexOf(item), 1)

// start a recipe as soon as the recipe inputs are fullfits
const startProcess = (machine, droppedTokens) => {
  // extract blueprint
  const { recipe, inputs, outputs } = machine.blueprint

  const p = proj(machine)

  // list available tokens on the input cells
  const availableTokens = {}
  inputs.forEach(({ cell, token }) => {
    const c = p(cell)

    droppedTokens.forEach(d => {
      if (
        d.availableCoolDown <= 0 &&
        token === d.token &&
        pointEqual(c, pointToCell(d.position))
      ) {
        ;(availableTokens[d.token] = availableTokens[d.token] || []).push(d)
      }
    })
  })

  // does the inputs contains the required tokens ?
  if (
    recipe.inputs.every(
      ({ token, n }) =>
        availableTokens[token] && availableTokens[token].length >= n
    )
  ) {
    // remove tokens from ground
    recipe.inputs.forEach(({ token, n }) =>
      availableTokens[token].slice(0, n).forEach(removeInPlace(droppedTokens))
    )

    machine.processing = { k: 0, activationCoolDown: 0 }
  }
}

const execProcess = (machine, droppedTokens) => {
  const { recipe, outputs, activationThreshold } = machine.blueprint

  if (machine.processing.activationCoolDown > 0)
    machine.processing.activationCoolDown--

  // if the processing if done
  if (machine.processing.k > activationThreshold) {
    machine.processing = null

    const p = proj(machine)

    recipe.outputs.forEach(({ token, n }) => {
      const { cell } = outputs.find(x => x.token === token)

      const c = p(cell)

      while (n--)
        droppedTokens.push({
          token,
          position: {
            x: c.x + 0.5 + (Math.random() - 0.5) * 0.3,
            y: c.y + 0.5 + (Math.random() - 0.5) * 0.3,
          },
          availableCoolDown: DROPPED_DELAY,
        })
    })
  }
}

export const machineProcessing = ({ machines, droppedTokens }: Universe) =>
  machines.forEach(machine => {
    // try to start processing
    if (!machine.processing) startProcess(machine, droppedTokens)

    // process
    if (machine.processing) execProcess(machine, droppedTokens)
  })
