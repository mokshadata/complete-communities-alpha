import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';

import { Section, Container, Columns } from 'react-bulma-components'

import Projects from './Projects'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Section>
          <Container>
            <Columns>
              <Columns.Column>
                <Projects/>
              </Columns.Column>
            </Columns>
          </Container>
        </Section>
      </div>
    );
  }
}

export default App;
