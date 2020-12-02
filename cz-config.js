'use strict';

module.exports = {

    types: [
        {
            value: 'feat',
            name: '✨  feat:     新功能（feature）'
        },
        {
            value: 'fix',
            name: '🐞  fix:      修补bug'
        },
        {
            value: 'refactor',
            name: '🛠  refactor:     重构（即不是新增功能，也不是修改bug的代码变动）'
        },
        {
            value: 'docs',
            name: '📚  docs:     文档（documentation）'
        },
        {
            value: 'test',
            name: '🏁  test:     增加测试'
        },
        {
            value: 'chore',
            name: '🗯  chore:    构建过程或辅助工具的变动'
        },
        {
            value: 'style',
            name: '💅  style:    格式（不影响代码运行的变动）'
        },
        {
            value: 'revert',
            name: '⏪  revert:   撤消到上一次提交'
        }
    ],

    scopes: [],

    allowCustomScopes: true,
    allowBreakingChanges: ["feat", "fix"]
};