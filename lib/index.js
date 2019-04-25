#!/usr/bin/env node
'use strict';

var fs = require('fs');
var program = require('commander');
var download = require('download-git-repo');
var handlebars = require('handlebars');
var inquirer = require('inquirer');
var ora = require('ora');
var chalk = require('chalk');
var symbols = require('log-symbols');

program.version('1.0.0', '-v, --version').command('init <name>').action(function (name) {
    if (!fs.existsSync(name)) {
        inquirer.prompt([{
            name: 'description',
            message: 'input some description'
        }, {
            name: 'author',
            message: 'who is the author'
        }]).then(function (answers) {
            var spinner = ora('downloading templates...');
            spinner.start();
            download('direct:https://github.com/sunrlse/tpl-rdx.git#master', name, { clone: true }, function (err) {
                if (err) {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                } else {
                    spinner.succeed();
                    var fileName = name + '/package.json';
                    var meta = {
                        name: name,
                        description: answers.description,
                        author: answers.author
                    };
                    if (fs.existsSync(fileName)) {
                        var content = fs.readFileSync(fileName).toString();
                        var result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result);
                    }
                    console.log(symbols.success, chalk.green('project init finish'));
                }
            });
        });
    } else {
        console.log(symbols.error, chalk.red('existed project'));
    }
});
program.parse(process.argv);