export default function exit() {
  const docs = {
    name: 'exit',
    short: 'Exit the terminal',
    description: 'Exits the terminal application and returns to the main page',
  }

  const app = () => {
    window.location.href = `${window.location.origin}/portfolio`
  }

  return { docs, app }
}
