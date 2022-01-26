var ghpages = require('gh-pages');

ghpages.publish(
  'demo/public',
  {
    branch: 'gh-pages',
    repo: 'https://github.com/sebhoe/school-lunch-impact-web-component.git',
    user: {
      name: 'sebhoe',
      email: 'sebhoe37@gmail.com'
    }
  },
  () => {
    console.log('Deploy Complete!')
  }
)