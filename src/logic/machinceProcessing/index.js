import { pointToCell, pointEqual } from '~/service/point'
import type { Universe } from '~/type'

const removeInPlace = arr => item => arr.splice(arr.indexOf(item), 1)

// start a recipe as soon as the recipe inputs are fullfits
const startProcess = (machine, droppedTokens) => {
  // extract blueprint
  const { recipe, inputs, outputs } = machine.blueprint

  // list available tokens on the input cells
  const availableTokens = {}
  inputs.forEach(({ cell, token }) => {
    droppedTokens.forEach(d => {
      if (token === d.token && pointEqual(cell, pointToCell(d.position))) {
        ;(availableTokens[d.token] = availableTokens[d.token] || []).push(d)
      }
    })
  })

  // does the inputs contains the required tokens ?
  if (
    recipe.inputs.every(({ token, n }) => availableTokens[token].length >= n)
  ) {
    // remove tokens from ground
    recipe.inputs.forEach(({ token, n }) =>
      availableTokens[token].slice(0, n).forEach(removeInPlace(droppedTokens))
    )

    machine.processing = { k: 0, activated: false }
  }
}

const execProcess = (machine, droppedTokens) => {
  const { recipe, outputs, activationThreshold } = machine.blueprint

  // if the machine is activated at this frame, incr k
  machine.processing.k += machine.processing.activated

  machine.processing.activated = false

  // if the processing if done
  if (machine.processing.k > activationThreshold) {
    machine.processing = null

    recipe.outputs.forEach(({ token, n }) => {
      const { cell } = outputs.find(x => x.token === token)

      while (n--)
        droppedTokens.push({
          token,
          position: {
            x: cell.x + 0.5 + (Math.random() - 0.5) * 0.3,
            y: cell.y + 0.5 + (Math.random() - 0.5) * 0.3,
          },
        })
    })
  }
}

export const machinceProcessing = ({ machines, droppedTokens }: Universe) =>
  machines.forEach(machine => {
    // try to start processing
    if (!machine.processing) startProcess(machine, droppedTokens)

    // process
    if (machine.processing) execProcess(machine, droppedTokens)
  })
