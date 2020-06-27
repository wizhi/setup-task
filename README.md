Setup task for GitHub Actions
=============================

This action will install the [go-task/task][task] task-runner inside of your GitHub Action workflow, making it available on the `$PATH` for use in your workflow steps.

## Usage

Using the action is very simple.

```yaml
name: Use task to run build script

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: wizhi/setup-task@v1
      - run: task build
```

[task]: https://github.com/go-task/task
