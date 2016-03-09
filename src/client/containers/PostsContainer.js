import React from 'react';
import Relay from 'react-relay';
import { connect } from 'react-redux';

import { Link } from 'react-router';

class PostsContainer extends React.Component {
  render() {
    console.log('PostsContainer: ', this.props);
    return (
      <div>
        <Link to='/people'>People</Link>
        <section className="postapp">
          <header className="header">
            <h1>
              posts
            </h1>
          </header>

          {this.props.children}

        </section>
        <footer className="info">

        </footer>
      </div>
    );
  }
}
function select(state) {
    return state;
}
export default connect(select)(PostsContainer)
