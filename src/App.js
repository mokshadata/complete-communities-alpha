import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'bulma-steps/dist/css/bulma-steps.min.css'

import { Section, Container, Columns } from 'react-bulma-components'

import Projects from './Projects'
import Filters from './Filters'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Section>
          <Container fluid>
            <Columns>
              <Columns.Column size={7}>
                <Projects/>
              </Columns.Column>
              <Columns.Column>
                <Filters/>
              </Columns.Column>
            </Columns>
          </Container>
        </Section>
      </div>
    );
  }
}

export default App;
