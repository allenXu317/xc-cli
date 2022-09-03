#!/usr/bin/env node
console.log('Welcome to use xc-cli !\nYou can use it to init a Vue/React project with webpack! ');

// const { program } = require('commander');
// const  inquirer  = require('inquirer');

import { program } from "commander";
import inquirer from 'inquirer';

// init project
program.command('init <name>')
    .description('init a project with Vue or React')
    .action((name) => {
        console.log('project name: ', name);
        inquirer.prompt(
            [
                {
                    name: 'description',
                    message:"请输入项目描述: "
                },
                {
                    name: 'author',
                    message: "请输入项目作者: ",
                    default: "author"
                },
                {
                    name: 'framework',
                    message: '请选择框架: ',
                    type: 'list',
                    choices: ['react','vue3']
                }
        ]).then((res) => {
            console.log(res);
        })
    });

// init select


program.parse(process.argv);