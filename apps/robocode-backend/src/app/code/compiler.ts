import * as typescript from 'typescript';

const webpack = require('webpack');


export class Compiler {


   getCode(source: string) {
    // const base = await fs.promises.readFile('apps/robocode-backend/src/app/robot/Robot.ts', 'utf-8');
    const code = typescript.transpile(source);
    return eval(code); // evil
   }

  compile(fileName: string) {
    console.log('compile');
    return new Promise((resolve, reject) => {
      webpack(
        {
          entry: fileName,
          mode: 'production',
          output: { filename: fileName + '_compiled' },
          module: {
            rules: [
              {
                test: /\.(ts|tsx)?$/,
                loader: 'ts-loader',
              }
            ]
          },
          resolve: {
            extensions: ['.ts', '.js']
          }
        }
        ,
        (err, stats) => {
          if (err) {
            console.error(err);
            reject();
          }

          console.log(stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
          }));
          resolve(0);
        });
    });
  }
}
