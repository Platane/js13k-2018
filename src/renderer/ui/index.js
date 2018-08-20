import type { Universe, UIstate } from '~/type'

export const createUI = (domParent: Element) => {
  const container = document.createElement('div')

  container.style.position = 'fixed'
  container.style.bottom = '0px'
  container.style.right = '0px'
  container.style.left = '0px'
  container.style.backgroundColor = '#ddd'
  container.style.padding = '10px'
  container.style.fontSize = '16px'
  container.style.minHeight = '40px'

  domParent.appendChild(container)

  const update = (universe: Universe, uistate: UIstate) => {
    const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

    container.innerHTML = bot ? [bot.id, bot.command.type].join('<br>') : ''
  }

  return { update }
}
