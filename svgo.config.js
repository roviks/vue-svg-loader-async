export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,        // Keep IDs for multicolor icons with masks/gradients

          convertColors: {
            currentColor: true      // Preserve currentColor for theming
          }
        }
      }
    },
    'removeXMLNS',
    {
      name: 'removeAttrs',
      params: { attrs: ['class', 'data-name', 'data-*'] }
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { 'aria-hidden': 'true' },
          { focusable: 'false' }
        ]
      }
    },
    'convertStyleToAttrs',
    'mergePaths',
    'removeEmptyContainers',
    'sortAttrs'
  ]
}
