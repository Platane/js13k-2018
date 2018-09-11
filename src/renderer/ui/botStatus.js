import type { Universe, UIstate } from '~/type'

export const containerCss =
  'position:fixed;padding:10px;background-color:#ddd;bottom:0;right:0;width:40%;font-size:16px;z-index:2;border-radius:20px 0 0 0;display:flex;flex-direction:row;transition:transform 180ms'

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText = containerCss + ';width:20%'
  container.ontouchstart = container.onmousedown = e => e.stopPropagation()
  domParent.appendChild(container)

  // const name = document.createElement('div')
  // name.style.cssText = ''
  // container.appendChild(name)

  const button = document.createElement('button')
  button.style.cssText = 'padding:10px;margin-left:auto'
  button.innerText = '× cancel'
  container.appendChild(button)

  let selectedBotId = -1

  const update = (universe: Universe, uistate: UIstate) => {
    //
    if (!button.onclick)
      button.onclick = e => {
        uistate.selectedBotId = null
        uistate.command = null
      }

    //
    if (selectedBotId !== uistate.selectedBotId) {
      selectedBotId = uistate.selectedBotId

      const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

      container.style.transform = bot ? null : 'translate3d(0,100px,0)'
    }
  }

  return update
}
