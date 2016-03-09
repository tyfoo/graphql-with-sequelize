import React from 'react';
import Relay from 'react-relay';

import PersonListItem from './PersonListItem';

const initalLimit = 50;

class PersonListItemList extends React.Component {
  state = {
    isLoading: false,
  }

  onScroll = () => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if (!this.state.isLoading && isAtBottom) {
      this.setState({isLoading: true}, () => {
        this.props.relay.setVariables({
          limit: this.props.relay.variables.limit + initalLimit
        }, (readyState) => { 
          // this gets called twice https://goo.gl/ZsQ3Dy
          if (readyState.done) {
            this.setState({isLoading: false});
          }
        });
      });
    }
  }

  onSearchFirstNameKeyUp = (e) => {
    const {value} = e.target;
    const where = {};
    const limit = initalLimit;
    if (e.target.value) {
      where.firstName = {
        iLike: `%${value}%`
      };
    }

    this.setState({isLoading: true});
    this.props.relay.setVariables({
      limit,
      where,
    }, (readyState) => { 
      // this gets called twice https://goo.gl/ZsQ3Dy
      if (readyState.done) {
        this.setState({isLoading: false});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderPersonListItems() {
    return this.props.viewer.people.edges.map(edge =>
      <PersonListItem
        key={edge.node.id}
        person={edge.node}
      />
    );
  }
  render() {
    const count = this.props.viewer.people.count;
    return (
      <section className="main">
        <h1>PersonListItems</h1>
        <p>
          <label>Search through the firstNames: <input onKeyUp={this.onSearchFirstNameKeyUp} /></label>
        </p>
        {this.state.isLoading && <p>Loading..</p>}
        <p>Showing <strong>{this.props.relay.variables.limit}</strong> of the total <strong>{count}</strong> matches.</p>
        <ul className="person-list">
          {this.renderPersonListItems()}
        </ul>
        {this.state.isLoading && <p>Loading people..</p>}
      </section>
    );
  }
}

export default Relay.createContainer(PersonListItemList, {
  initialVariables: {
    limit: initalLimit,
    where: {},
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on viewer {
        people(first: $limit where: $where) {
          count
          edges {
            node {
              id,
              ${PersonListItem.getFragment('person')},
            },
          },
        }
      }
    `,
  },
});
