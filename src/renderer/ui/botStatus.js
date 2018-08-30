import type { Universe, UIstate } from '~/type'

export const create = (domParent: Element) => {
  const container = document.createElement('div')

  container.style.position = 'fixed'
  container.style.bottom = '0px'
  container.style.left = '0px'
  container.style.width = '45%'
  container.style.backgroundColor = '#ddd'
  container.style.padding = '10px'
  container.style.fontSize = '16px'
  container.style.minHeight = '40px'
  container.style.zIndex = '2'

  domParent.appendChild(container)

  const update = (universe: Universe, uistate: UIstate) => {
    const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

    const p = ({ x, y }) => `${x}:${y}`

    let text = ''
    if (bot) {
      text = [
        bot.id,
        bot.command.type,
        bot.command.type === 'carry' &&
          `from ${p(bot.command.pickUpCell)} to ${p(bot.command.dropCell)}`,
      ]
        .filter(Boolean)
        .join('<br>')
    }

    container.innerHTML = text
  }

  return update
}
