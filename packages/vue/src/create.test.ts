import { describe, expect, it, vi } from 'vitest'

import { getWagmi } from './create'

describe('getWagmi', () => {
  describe('mounts', () => {
    it('throws when not inside Provider', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      vi.spyOn(console, 'error').mockImplementation(() => {})

      try {
        getWagmi()
      } catch (error) {
        expect(error).toMatchInlineSnapshot(
          `
          [Error: \`getWagmi\` must be used within \`createWagmi\`.

          Read more: https://github.com/unicape/use-wagmi]
        `,
        )
      }
    })
  })
})
