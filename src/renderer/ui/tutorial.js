import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance } from '~/service/point'
import { getPointer } from '~/util/pointer'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

const tutorials = [
  ['Oh no, your sushi factory went offline !', "Let's restart over shall we?"],
  ['See this guy over here ?', 'Click on him and order him to move'],
]

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;background-color:#000c;transition:background-color 200ms;display:flex;justify-content:center;align-items:center;z-index:0'
  domParent.appendChild(container)

  const tutorial = document.createElement('div')
  tutorial.style.cssText = 'color:#fff'
  container.appendChild(tutorial)

  const nextStep = () => console.log('step')

  const update = (universe: Universe, uistate: UIstate) => {
    // bind action
    container.onclick = container.onclick || nextStep
  }

  return update
}
