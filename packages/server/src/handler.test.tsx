import { bootstrap } from './app'

it('app boots up without crashing', async () => {
  const nest = await bootstrap()
  await nest.listen(3001, '0.0.0.0')
  await nest.close()
  expect(true).toBe(true)
})
