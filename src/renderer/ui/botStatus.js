import type { Universe, UIstate } from '~/type'

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText =
    'height:60px;position:fixed;padding:10px;background-color:#ddd;bottom:0;left:0;width:45%;font-size:16px;z-index:2;display:flex;flex-direction:row;transition:transform 180ms;transform:translate3d(0,60px,0);border-radius:0 20px 0 0'
  container.ontouchstart = container.onmousedown = e => e.stopPropagation()
  domParent.appendChild(container)

  const name = document.createElement('div')
  name.style.cssText = ''
  container.appendChild(name)

  const button = document.createElement('button')
  button.style.cssText =
    'padding:10px;border-radius:50%;width:40px;height:40px;border:none;background-color:blue;margin-left:auto'
  container.appendChild(button)

  let selectedBotId = -1

  const update = (universe: Universe, uistate: UIstate) => {
    //
    if (!button.onclick)
      button.onclick = e => (uistate.command = uistate.command ? null : {})

    //
    if (selectedBotId !== uistate.selectedBotId) {
      selectedBotId = uistate.selectedBotId

      const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

      if (bot) {
        name.innerHTML = bot.command.type
      }

      container.style.transform = bot ? null : 'translate3d(0,60px,0)'
    }
  }

  return update
}
