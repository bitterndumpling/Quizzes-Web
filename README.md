# Basic Information
- Name: Chaochao Ding
- Student ID: 20086445


# Function:
Total: 12 routes, 4 get, 3 post, 3 put, 2 delete for 2 models
- Users model: 
    - Get: getUsers 
        - find all exist users
        - /users
    - Get: findUserByName
        - use unique username to find a user
        - /users/:user
    - Post: login
        - post username and password to confirm
        - if user not found, send error message
        - if password are wrong, send error message
        - /users/login
    - Post: register
        - post register information to confirm
        - if username or email has been registered, send error 
        - /users/register
    - Delete: deleteUser
        - delete a special user by unique username
        - /users/:user
    - Put: changePassword
        - find user by unique username and change password
        - /users/pwd
- Quizzes model:
    - Get: getQuizzes
        - find all existed quizzes
        - /quizzes
    - Get: getOneQuiz
        - find a special quiz by id
        - /quizzes/:id
    - Delete: deleteQuiz
        - find a quiz by id and remove
        - /quizzes/:id
    - Post: addQuiz
        - post quiz information and add to database
        - /quizzes
    - Put: editQuiz
        - find quiz by id and edit
        - can only edit title, date and questions
        - /quizzes
    - Put: doTest
        - when a user post a quiz test, increase times 1 for this quiz
        - /test
- QuizData Model:
    - under coding
    

# Model
1. Users model: 
    - save users data
    - including email, user(name), password
2. Quizzes model: 
    - save basic quiz data
    - once create a quiz, add one record
    - including title, creator(author), date, times, questions
    - a question include id, type, questionTest, answer(choice), qtext(answerText) 
3. QuizData model:
    - save test data for a quiz
    - once a user finish a test, add one record
    - including quizId, respondent, date, answers


# Persistence approach 
Total 3 models with mongooDB schema

# Git approach
https://github.com/bitterndumpling/Quizzes-Web

# DX approach
- Repo Usage:
    - Each functions added with a Git commit

# yutuber
https://www.youtube.com/channel/UCOrsBPyw9S3GYdUPudutcfA?view_as=subscriber