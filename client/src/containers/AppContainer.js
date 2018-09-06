import React, { Component } from 'react';
import App from '../components/App';

class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
        }
    }

    componentDidMount() {
        fetch('/api/hellothere')
        .then(res => res.json())
        .then(json => {
            this.setState({
                message: json.message,
            })
        })
    }

    render() {
        return <App message={this.state.message} />
    }
}

export default AppContainer;