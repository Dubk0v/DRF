import React from 'react';
//import logo from './logo.svg';
import './App.css';
import UserList from './components/User.js'
import axios from 'axios'
import Menu from './components/Menu.js'
import Footer from './components/Footer.js'
import ProjectList from './components/ProjectList.js'
import TodoList from "./components/TodoList"
import ProjectPage from "./components/ProjectPage"
import ProjectForm from './components/ProjectForm.js';
import ProjectUpdate from './components/ProjectUpdate.js';
import Footer from './components/Footer.js'
import TodoForm from './components/TodoForm.js';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import LoginForm from './components/Auth.js'
import Cookies from 'universal-cookie';

const NotFound404 = ({location}) => {
    return (
        <div>
            Not found: {location.pathname}
        </div>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'users': [],
            'projects': [],
            'todos': [],
            'token': ''
        }
    }
    set_token(token) {
        const cookies = new Cookies()
        cookies.set('token', token)
        this.setState({'token': token}, ()=>this.load_data())
    }

    is_authenticated() {
        return this.state.token != ''
    }

    logout() {
        this.set_token('')
    }

    get_token_from_storage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        this.setState({'token': token}, ()=>this.load_data())
    }

    get_token(username, password) {
        axios.post('http://127.0.0.1:8000/api-token-auth/', {username: username,
            password: password})
            .then(response => {
                this.set_token(response.data['token'])
            }).catch(error => alert('Неверный логин или пароль'))
    }

    get_headers() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.is_authenticated())
        {
            headers['Authorization'] = 'Token ' + this.state.token
        }
        return headers
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/users')
            .then(response => {
                const users = response.data
                    this.setState(
                    {
                        'users': users
                    }
                )
            })
            .catch(error => console.log(error))


        axios
            .get('http://127.0.0.1:8000/api/projects')
            .then(response => {
                const projects = response.data.results
                this.setState(
                    {
                        'projects': projects
                    }
                )
            })
            .catch(error => console.log(error))


        axios
            .get('http://127.0.0.1:8000/api/todos')
            .then(response => {
                const todos = response.data.results
                this.setState(
                    {
                        'todos': todos
                    }
                )
            })
            .catch(error => console.log(error))
    }
    createProject (name, repository_url, users) {
        const headers = this.get_headers()
        const data = {name: name, repository_url: repository_url, users: users}
        console.log(data)
        axios.post('http://127.0.0.1:8000/api/projects/', data, {headers})
            .then(response => {
//                let new_project = response.data
//                const user = this.state.users.filter((item) => item.id === new_project.users)[0]
//                new_book.author = author
//                this.setState({books: [...this.state.books, new_book]})
                this.load_data()    // лучше перезапрашивать данные, на случай если кто-то еще правит БД
            }).catch(error => {console.log(error)})
    }

    updateProject (id, name, repository_url, users) {
        const headers = this.get_headers()
        const data = {id: id, name: name, repository_url: repository_url, users: users}
        console.log('data before update',data)
        axios.put(`http://127.0.0.1:8000/api/projects/${id}/`, data, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    deleteProject (id) {
        const headers = this.get_headers()
        console.log('Id deleted project =', id)
        axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {headers})
            .then(response => {
//                this.setState(
//                            {
//                                projects: this.state.projects.filter((item)=>item.id !== id)
//                            }
//                    )
                this.load_data()    // лучше перезапрашивать данные, на случай если кто-то еще правит БД
            }).catch(error => {console.log(error)})
    }

    createTodo (project, user, title, text) {
        const headers = this.get_headers()
        const data = {project: project, user: user, title: title, text: text}
        console.log('data = ', data)
        axios.post('http://127.0.0.1:8000/api/todo/', data, {headers})
            .then(response => {
                this.load_data()    // лучше перезапрашивать данные, на случай если кто-то еще правит БД
            }).catch(error => {console.log(error)})
    }

    deleteTodo (id) {
        const headers = this.get_headers()
        console.log('Id deleted todo =', id)
        axios.delete(`http://127.0.0.1:8000/api/todo/${id}`, {headers})
            .then(response => {
                this.load_data()    // лучше перезапрашивать данные, на случай если кто-то еще правит БД
            }).catch(error => {console.log(error)})
    }
    render () {
        return (

            <div className='wrapper'>

                <BrowserRouter>

                    <Menu/>
                      <div className='content'>
                            <Switch>
                                <Route exact path='/' component={() => <ProjectList projects={this.state.projects}/>}/>
                                <Route exact path='/todos' component={() => <TodoList todos={this.state.todos}/>}/>
                                <Route exact path='/users' component={() => <UserList users={this.state.users}/>}/>
                                <Route path="/project/:id">
                                    <ProjectPage projects={this.state.projects}/>
                                </Route>
                                <Redirect from='/projects' to='/'/>
                                <Route component={NotFound404}/>
                            </Switch>
                        </div>


                        {/*<div className='content'>*/}
                        {/*    <UserList users={this.state.users}/>*/}
                        {/*</div>*/}


                        {/*<div className='content'>*/}
                        {/*    <ProjectList projects={this.state.projects}/>*/}
                        {/*</div>*/}


                    <Footer/>

                </BrowserRouter>

            </div>
        )
    }
}
export default App;
