export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          convertColors: {
            currentColor: true
          }
        }
      }
    },
    'removeXMLNS',
    {
      name: 'removeAttrs',
      params: { attrs: ['class', 'data-name', 'data-*'] }
    },
    'convertStyleToAttrs',
    'mergePaths',
    'removeEmptyContainers',
    'sortAttrs'
  ]
}
