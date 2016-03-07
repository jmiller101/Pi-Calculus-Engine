# Pi-Calculus-Engine

###Limitations
This engine was written to parse and execute simple Pi Calculus statements. You'll notice that I've used the word
simple, so what does that entail?
  1. You cannot pass a channel through another channel
  2. Instead of processes running in parallel, they will run sequentially (but in random order)
    1. This is because there is no such thing as parallelism in JavaScript
    2. Without doing some funky voodoo and arbitrarily switching between concurrent tasks, there isn't a good way of
    implementing it. At that point the challenge doesn't lie with implementing Pi Calculus with with making a runtime
    environment, which felt outside the scope of the project
  3. You are free to do a recursive task (such as calling an agent from within itself), however due to the lack of
  parallelism, it will likely never change after the first couple iterations. It will also probably lead to a stack
  overflow and your browser freezing as it trying to process it infinitely
  4. There is no replication because it leads to a stock overflow and browser freezing
  5. Only single-quotes should be used when writing string literals

---
###Usage
  1. Enter a statement into the textbox
  2. Press 'enter' on your keyboard
  3. Repeat 1 and 2 until all of the statements you want are loaded
  4. Click 'execute'
  5. Clear the engine for new commands by clicking 'clear' or enter more commands and execute again

To run the tests click on the 'test engine' button.

---
###Syntax
New agent (note: in order to run an agent, just call it as like a process):
`<agent_name> = <processes_or_agents>`

New channel:
`new(<channel_name>)`

Read from channel:
`<channel_name>?<variable_name>` or `<channel_name>?(<variable_name>,<variable_name>)`

Write variable to channel:
`<channel_name>!<variable_name>` or `<channel_name>!(<variable_name>,<variable_name>)`

Write string literal to channel:
`<channel_name>!'<string_literal>'` or `<channel_name>!('<string_literal>','<string_literal>')`

Run processes in "parallel":
`<process> | <process>`
Run one process at random:
`<process> + <process>`
Run processes sequentially:
`<process> . <process>`

For testing purposes, print a value:
`print(<variable>)` or `print('<string_literal>')`
Print multiple values and string literals:
`print(<variable>, '<string_literal>')`

---
### An example
For this example I'm going to use the following command:
```
print('1') + print('2') | print('3') . print('4')
```

If this were passed to the parser it would create the following process tree:

```
indeterminates[0] ->
  parallel[0] ->
    sequential[0] -> print('1')
indeterminates[1] ->
  parallel[0] ->
    sequential[0] -> print('2')
  parallel[1] ->
    sequential[0] -> print('3')
    sequential[1] -> print('4')
```

The engine will start by randomly selecting one of the arrays of "parallel" trees from `indeterminates`. Each subtree in
the `parallel` tree that was selected from `indeterminates` is now run in random order. In each `parallel` tree there is
an array of `sequential` processes to be executed.

With this in mind, here are the possible outputs from the above example:

#####Output 1
```
'1'
```

#####Output 2
```
'2'
'3'
'4'
```

#####Output 3
```
'3'
'4'
'2'
```
