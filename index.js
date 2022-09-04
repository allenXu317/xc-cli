#!/usr/bin/env node
console.log('Welcome to use xc-cli !\nYou can use it to init a Vue/React project with webpack! ');

// const { program } = require('commander');
// const  inquirer  = require('inquirer');

import { program } from "commander";
import inquirer from 'inquirer';
import download from 'download-git-repo';
import ora from "ora";
import path, { resolve } from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

// init project
program.command('init <name>')
    .description('init a project with Vue or React')
    .action((name) => {
        console.log('project name: ', name);
        inquirer.prompt(
            [
                {
                    name: 'description',
                    message: "请输入项目描述: "
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
                    choices: ['react', 'vue']
                },
                {
                    name: 'source',
                    message: '是否采用国内源（gitee）: ',
                    type: 'confirm'
                }
            ]).then((res) => {
                console.log(res);
                const { source, framework } = res;
                const url = source ? 'direct:https://gitee.com/xuchen0317/xc-cli-cn-template' : 'direct:https://github.com/allenXu317/xc-cli/blob/main/template/package.json';
                // 生成模版
                generateCategory(name);
                generateTemplateFiles(url, framework, name, res);
            })
    });

// 创建 package.json
function generateTemplateFiles(url, type, name, res) {
    const downloadPath = `./tmp`;
    const spinner = ora('正在下载模板, 请稍后...');
    const dest = `./${name}`;
    spinner.start();
    download(url, downloadPath, { clone: true }, (error) => {
        if (!error) {
            spinner.succeed();
            const packagePath = path.join(downloadPath, `${type}/package.json`);
            // 判断是否有package.json, 要把输入的数据回填到模板中
            if (fs.existsSync(packagePath)) {
                const content = fs.readFileSync(packagePath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/package.json`, result);
            }
            const configPath = path.join(downloadPath, `${type}/webpack/webpack.config.js`);
            // 加载webpack配置文件
            if (fs.existsSync(configPath)) {
                const content = fs.readFileSync(configPath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/webpack/webpack.config.js`, result);
            }
            const configDevPath = path.join(downloadPath, `${type}/webpack/webpack.config.dev.js`);
            if (fs.existsSync(configDevPath)) {
                const content = fs.readFileSync(configDevPath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/webpack/webpack.config.dev.js`, result);
            }
            // 加载源代码
            const jsPath = path.join(downloadPath, `${type}/src/js/index.js`);
            if (fs.existsSync(configDevPath)) {
                const content = fs.readFileSync(jsPath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/src/js/index.js`, result);
            }
            const htmlPath = path.join(downloadPath, `${type}/src/public/index.html`);
            if (fs.existsSync(configDevPath)) {
                const content = fs.readFileSync(htmlPath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/src/public/index.html`, result);
            }
            const pagesVuePath = path.join(downloadPath, `${type}/src/pages/index.vue`);
            if (fs.existsSync(configDevPath)) {
                const content = fs.readFileSync(pagesVuePath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/src/pages/index.vue`, result);
            }
            const pagesJsPath = path.join(downloadPath, `${type}/src/pages/app.js`);
            if (fs.existsSync(configDevPath)) {
                const content = fs.readFileSync(pagesJsPath).toString();
                // handlebars 模板处理引擎
                const template = handlebars.compile(content);
                const result = template({ ...res, name });
                fs.writeFileSync(`${dest}/src/pages/app.js`, result);
            }
            // fs.rmdirSync('./tmp');
            removeDir('./tmp');
        } else {
            spinner.fail();
            console.log('failed! no package.json', error);
        }
    })
}
function removeDir(dir) {
    let files = fs.readdirSync(dir)
    for (var i = 0; i < files.length; i++) {
        let newPath = path.join(dir, files[i]);
        let stat = fs.statSync(newPath)
        if (stat.isDirectory()) {
            //如果是文件夹就递归下去
            removeDir(newPath);
        } else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}


// 创建 webpack 配置文件
function generateCategory(name) {
    fs.mkdirSync(`${name}`, (err) => {
        if (err) {
            console.log('创建文件夹name失败');
        } else {
            console.log('创建文件夹name成功');
        }
    })
    fs.mkdirSync(`${name}/dist`, (err) => {
        if (err) {
            console.log('创建文件夹/dist失败');
        } else {
            console.log('创建文件夹/dist成功');
        }
    });
    fs.mkdirSync(`${name}/webpack`, (err) => {
        if (err) {
            console.log('创建文件夹/config失败');
        } else {
            console.log('创建文件夹/config成功');
        }
    });
    fs.mkdirSync(`${name}/src`, (err) => {
        if (err) {
            console.log('创建文件夹/src');
        } else {
            console.log('创建文件夹/src');
        }
    });
    fs.mkdirSync(`${name}/src/public`, (err) => {
        if (err) {
            console.log('创建文件夹/src/public失败');
        } else {
            console.log('创建文件夹/src/public成功');
        }
    });
    fs.mkdir(`${name}/src/css`, (err) => {
        if (err) {
            console.log('创建文件夹/src/css失败');
        } else {
            console.log('创建文件夹/src/css成功');
        }
    });
    fs.mkdirSync(`${name}/src/js`, (err) => {
        if (err) {
            console.log('创建文件夹/src/js失败');
        } else {
            console.log('创建文件夹/src/js成功');
        }
    });
    fs.mkdirSync(`${name}/src/pages`, (err) => {
        if (err) {
            console.log('创建文件夹/src/pages失败');
        } else {
            console.log('创建文件夹/src/pages成功');
        }
    });
}


program.parse(process.argv);