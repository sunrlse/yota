#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.version('1.0.1', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'description',
                    message: 'input some description'
                },
                {
                    name: 'author',
                    message: 'who is the author'
                },
                {
                    name: 'type',
                    message: 'spa input 1 or multi-page input 2 ? '
                }
            ]).then((answers) => {
                const spinner = ora('downloading templates...');
                spinner.start();
//                 let url = answers.type == 1
//                     ? 'direct:http://gitlab.liebaopay.com:9090/CM_Launcher_FE_Work/scaffold.git#pc-spa'
//                     : 'direct:http://gitlab.liebaopay.com:9090/CM_Launcher_FE_Work/scaffold.git#pc-mpa';
                let url = '';
                download(url, name, {clone: true}, (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('project init finish'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('existed project'));
        }
    })
program.parse(process.argv);

