---
'@use-wagmi/nuxt': patch
---

Changes the build system and the exports fields of `the package.json` to use `@nuxt/module-builder` instead of `tsup`. This will allow the module to be listed in the module list at nuxt.com/modules.
