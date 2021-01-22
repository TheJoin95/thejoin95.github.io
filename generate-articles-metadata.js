const fs = require('fs');

const ARTICLES_PATH = './public/articles/';

fs.readdir(ARTICLES_PATH, (err, files) => {
  const outputJSON = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = fs.readFileSync(ARTICLES_PATH + files[i]).toString();

    const rawHeaders = file.substr(4, file.substr(4).search('---') - 1);
    const article = `{${rawHeaders.split('\n').map((v) => {
      const splittedValue = v.split(':');
      splittedValue[0] = `"${splittedValue[0].trim()}"`;
      if (splittedValue[1] !== undefined) {
        if (splittedValue[0] === '"tags"') {
          splittedValue[1] = splittedValue[1].substr(2, splittedValue[1].length - 3).split(',');
          splittedValue[1] = `[${splittedValue[1].map((tag) => `"${tag.trim()}"`).join(',')}]`;
        } else {
          splittedValue[1] = `"${splittedValue[1].trim()}",`;
        }
      }
      return splittedValue.join(':');
    }).join('\n').replace('\n', '')}}`;
    article.sefurl = article.permalink;
    outputJSON.push(article);
  }
  fs.writeFileSync('./src/assets/articles.json', `[${outputJSON}]`);
});
