# Git 速查（够用到实习结束）

## 一句话理解

Git 是给代码拍快照的工具。每提交一次，就存一张"此刻的完整存档"，以后随时能翻回去看、能对比、能退回。

## 三个区域

```
工作区              暂存区              仓库
你正在改的文件  →  准备提交的清单  →  已存档的历史
            add             commit
```

- **工作区**：你现在打开编辑的文件
- **暂存区**：用 `add` 挑出来"这次要存哪些改动"
- **仓库**：`commit` 之后真正存下来的快照

为什么要有暂存区？因为一次改动可能碰到五个文件，但只有三个属于同一件事。`add` 让你挑，提交才干净。

---

## 日常六条命令

```bash
git status              # 看现在什么状态（最常用，多敲没坏处）
git add .               # 把当前目录所有改动放进暂存区
git add pages/search/   # 只加某个目录（更精确）
git commit -m "说明"    # 存档，附一句说明
git log --oneline       # 看历史，一行一条
git diff                # 看还没 add 的改动内容
```

## 提交信息怎么写

格式：`类型: 做了什么`

```bash
git commit -m "feat: 搜索页支持关键词与分类筛选"
git commit -m "fix: 修复卡片宽度没撑满的问题"
git commit -m "style: 调整列表间距"
git commit -m "docs: 补充 JS 学习笔记"
git commit -m "chore: 初始化项目"
```

类型就五个够用：`feat` 新功能 / `fix` 修 bug / `style` 样式 / `docs` 文档 / `chore` 杂事。

**为什么认真写**：面试官会看你的 commit 记录。一页 `update`、`fix bug`、`1`，和一条条清晰的记录，是两种印象。

## 提交粒度

一次提交 = 一件完整的事。

- 好：加了搜索页（页面 + 样式 + 逻辑）
- 差：改了 8 个文件，说明写"更新"

---

## 分支

```bash
git branch                    # 看所有分支，当前分支前面有 *
git checkout -b dev           # 新建并切换到 dev
git checkout master           # 切回主分支（有的仓库叫 main）
git merge dev                 # 把 dev 的改动合并进当前分支
git branch -d dev             # 删掉已合并的分支
```

分支的意义：主分支永远是可用的，新功能在分支上折腾，坏了也不影响主分支。

## 解决冲突

合并时如果两个分支改了**同一行**，Git 不知道听谁的，就在文件里标记：

```
<<<<<<< HEAD
color: #d97706;      ← 当前分支的版本
=======
color: #2563eb;      ← 要合并进来的版本
>>>>>>> dev
```

处理办法：**手动改成你想要的样子，把三行标记删掉**，然后：

```bash
git add .
git commit -m "fix: 解决颜色冲突"
```

## 回滚

```bash
git log --oneline             # 先找到要回退到哪
git reset --hard HEAD~1       # 撤销最近一次提交，改动也一起丢掉
git reset --soft HEAD~1       # 撤销提交，改动留在暂存区（更安全）
```

`--hard` 会**丢代码**，用之前先确认。刚学的时候优先用 `--soft`。

---

## 第一次使用要配置

```bash
git config --global user.name "吴城"
git config --global user.email "你的邮箱"
git config --global core.autocrlf true     # Windows 换行符处理，避免满屏警告
```

`--global` 表示对这台机器所有仓库生效，配一次就够。

## 常见提示怎么处理

| 提示 | 意思 | 怎么办 |
|---|---|---|
| `LF will be replaced by CRLF` | Windows 换行符警告 | 正常，配了 `autocrlf` 就少了 |
| `nothing to commit, working tree clean` | 没有新改动 | 正常，不用管 |
| `Please tell me who you are` | 没配用户名邮箱 | 跑上面三条 config |
| `fatal: not a git repository` | 当前目录不是仓库 | 先 `cd` 到项目目录，或 `git init` |
| 中文文件名显示成 `\344\270\255` | 编码设置问题 | `git config --global core.quotepath false` |

## 不要提交的东西

`.gitignore` 里已经写了这些，别删：

```
node_modules/
miniprogram_npm/
project.private.config.json    # 个人编辑器设置，每个人的都不一样
*.log
```

判断标准：**别人拉下来不需要、而且各人不同的东西，都不提交。**

---

## 每天收工的固定动作

```bash
git status
git add .
git commit -m "feat: 今天做了什么"
git log --oneline -3
```

四条命令，一分钟。三个月后你会有 100 多条记录，那就是你做过什么的证据。
