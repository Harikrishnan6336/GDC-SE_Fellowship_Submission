var fs = require('fs');

const usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

var arguments = process.argv;

if (arguments.length == 2) {
    console.log(usage);
}
else if (arguments.length > 2) {
    if (arguments[2] == "help") {
        console.log(usage);
    }
    else if (arguments[2] == "add" && arguments.length == 3) {
        console.log("Error: Missing tasks string. Nothing added!");
    }
    else if (arguments[2] == "add") {
        let priority = arguments[3];
        let str_task = "";
        for (let w of arguments.slice(4)) {
            str_task = str_task ? str_task + " " + w : str_task + w;
        }
        let res = priority + " " + str_task;

        if (fs.existsSync("task.txt")) {
            let data = fs.readFileSync("task.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            data_lines.push(res);
            function modify(s, i) {
                data_lines[i] = s.replace('\r', "");
            }
            data_lines.forEach(modify);
            data_lines.sort((a, b) => Number(a.substring(0, 1)) > Number(b.substring(0, 1)));
            data_lines = data_lines.join("\n");

            fs.writeFile('task.txt', data_lines, function (err) {
                if (err) throw err;

                console.log("Added task: \"" + str_task + "\" with priority " + priority);
            });
        } else {
            fs.writeFile('task.txt', res, function (err) {
                if (err) throw err;

                console.log("Added task: \"" + str_task + "\" with priority " + priority);
            });
        }
    }
    else if (arguments[2] == "ls") {
        if (fs.existsSync("task.txt")) {
            let data = fs.readFileSync("task.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            data_lines.forEach((w, i) => {
                let priority = data_lines[i].substring(0, 1);
                let task = data_lines[i].substring(2);
                data_lines[i] = (i + 1) + ". " + task + " [" + priority + "]";
            });
            data_lines = data_lines.join("\n");
            console.log(data_lines);
            

        } else {
            console.log(`There are no pending tasks!`);
        }
    }
    else if (arguments[2] == "del" && arguments.length == 3) {
        console.log("Error: Missing NUMBER for deleting tasks.");
    }
    else if (arguments[2] == "del") {
        let ind = arguments[3];
        if (fs.existsSync("task.txt")) {
            let data = fs.readFileSync("task.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            let flag = false;
            data_lines.forEach((w, i) => {
                if ((i + 1) == Number(ind)) {
                    data_lines.splice(i, i + 1);
                    flag = true;
                }
            });
            if (!flag) {
                console.log("Error: task with index #" + ind + " does not exist. Nothing deleted.");
                return;
            }

            data_lines = data_lines.join("\n");
            fs.writeFile('task.txt', data_lines, function (err) {
                if (err) throw err;

                console.log("Deleted task #" + ind);
            });

        } else {
            
        }
    }
    else if (arguments[2] == "done" && arguments.length == 3) {
        console.log("Error: Missing NUMBER for marking tasks as done.");
    }
    else if (arguments[2] == "done") {
        let ind = arguments[3];
        let priority, task;

        if (fs.existsSync("task.txt")) {
            let data = fs.readFileSync("task.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            if (data_lines.length < ind || ind <= 0) {
                console.log("Error: no incomplete item with index #" + ind + " exists.");
                return;
            }
            
            data_lines.forEach((w, i) => {
                if ((i + 1) == ind) {
                    priority = data_lines[i].substring(0, 1);
                    task = data_lines[i].substring(2);
                    data_lines[i] = "";
                }
            });

            while (1) {
                var index = data_lines.indexOf("");
                if (index !== -1) {
                    data_lines.splice(index, 1);
                }else{
                    break;
                }
            }
            data_lines = data_lines.join("\n");
            fs.writeFile('task.txt', data_lines, function (err) {
                if (err) throw err;
            });

        } else {}

        if (fs.existsSync("completed.txt")) {
          
            fs.appendFile('completed.txt', '\n' + task, function (err) {
                if (err) throw err;
              });

        } else {
            fs.writeFile('completed.txt', task, function (err) {
                if (err) throw err;
              });
        }
        console.log("Marked item as done.");
    }
    else if (arguments[2] == "report"){
        let pending_num;
        let completed_num;
        let pending_tasks = "";
        let completed_tasks = "";

        if (fs.existsSync("task.txt")) {
            let data = fs.readFileSync("task.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            pending_num = data_lines.length;
            data_lines.forEach((w, i) => {
                pending_tasks = pending_tasks + (i+1) + ". " + data_lines[i].substring(2) + " [" + data_lines[i].substring(0, 1) + "]" + "\n";
            });

        } else {
            pending_num = 0;
        }
        if (fs.existsSync("completed.txt")) {
            let data = fs.readFileSync("completed.txt", "utf8", function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            data_lines = data.split("\n");
            completed_num = data_lines.length;
            data_lines.forEach((w, i) => {
                completed_tasks = completed_tasks + (i+1) + ". " + data_lines[i].substring(0) + "\n";
            });
            completed_tasks = completed_tasks.slice(0, -1);
        } else {
            completed_num = 0;
        }

        let pending = "Pending : " + pending_num + "\n";
        let completed = "\nCompleted : " + completed_num + "\n"; 

        let res = pending + pending_tasks + completed + completed_tasks;
        console.log(res);
    }
}


