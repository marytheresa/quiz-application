#!/usr/bin/env node

//console application to create notes

var readline       = require('readline'),
    fs             = require('fs'),
    program        = require('commander'),
    files          = [],
    quizname       = "",
    dir            = "./quizzes";

program
  .version('0.0.1')
  .option('-l, --listquizzes', 'View a list of all the available quizzes in your library')
  .option('-i, --importquiz <path_to_quiz_JSON>', 'Import a new quiz from a JSON file')
  .option('-t, --takequiz <quiz_name>', 'Start taking a new quiz')
  .parse(process.argv);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//conditional statements to set actions for the different commands

if (program.listquizzes) {
    listQuizzes();
};

if (program.importquiz) {
    var path = program.importquiz;
    importQuiz();
};

if (program.takequiz) {
    var quiz_name = program.takequiz;
    takeQuiz();
}

function listQuizzes() {
    if (!fs.existsSync(dir)) {
        console.log('Your folder is going to be created')
        fs.mkdirSync(dir);
    }
    fs.readdir('quizzes', (err, files) => {
        if (err) throw err;
        //conditional to check if a limit was provided in the command
        else {
            console.log('-------------------------------------');
            var start = 0;
            console.log(start);
            var limit = files.length
            var stop = start + (limit - 1);
            console.log(stop);
            for (i = start; i <= stop; i++) {
                console.log(i + 1 + ". " + files[i])
            }
        }
    })
};

function importQuiz() {
    //function that reads the content of the quiz

    function readQuiz() {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            rl.question('Enter a name for your quiz here ==>  ', (quizname) => {
                console.log(quizname);
                saveQuiz(quizname);
            })


            //function that saves the quiz to the local folder created 

            function saveQuiz(quizname) {
                console.log(quizname);
                path = dir + '/' + quizname;
                console.log(path);
                fs.open(path, 'wx', (err, fd) => {
                    if (err) {
                        if (err.code === "EEXIST") {
                            console.error('quiz already exists');
                            return;
                        }
                        else {
                            throw err;
                        }
                    }
                    fs.writeFile(fd, data, (err) => {
                        if (err) throw err;
                        console.log('Your quiz is saved!');
                    })
                })
            }
        })
    }
    readQuiz();
};

function takeQuiz() {
    path = dir + '/' + quiz_name;
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        console.log(typeof data);
        console.log('`````````````````````````````````````````````````````````````````````````````````');//stops executing here, not sure why
        var file = JSON.parse(data);                                        
        console.log('`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````');
        console.log(file);
        console.log(typeof file);
        console.log(file.guideline);
        for (i = 0; i < file.quiz.length; i++) {
            console.log(file.quiz[i].question);
            rl.question('Answer:', (answer) => {
                var correct = 0;
                if (answer == file.quiz[i].answer) {
                    correct += 1;
                }
            })
        }
        console.log('You scored ' + correct + 'out of ' + data.quiz.length);
    })
}